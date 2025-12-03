import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ml',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ml.component.html',
  styleUrls: ['./ml.component.scss']
})
export class MlComponent implements OnInit, OnDestroy {
  modelo: any = null;
  dataset: any[] = [];
  modelReady = false;
  error: string = '';

  valor: number = 0;
  tipoSeleccionado: string = ''; // Nombre del sensor seleccionado (ej: 'mq7')
  resultado: any = null;

  sensores: string[] = [];
  sensorSeleccionado: string = '';

  charts: any = {};

  // Métricas del modelo
  accuracy: string = '0';
  precision: string = '0';
  recall: string = '0';
  f1score: string = '0';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('🚀 Iniciando componente ML...');
    this.cargarModelo();
    this.cargarDataset();
  }

  ngOnDestroy(): void {
    // Limpiar gráficas al destruir el componente
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key]) {
        try { this.charts[key].destroy(); } catch (e) {}
      }
    });
  }

  // ===============================
  // CARGAR MODELO (MEJORADO)
  // ===============================
  cargarModelo(): void {
    this.http.get('assets/modelo_riesgo.json').subscribe({
      next: (data: any) => {
        this.modelo = data;
        console.log('✅ Modelo cargado correctamente');
        this.verificarListo();
      },
      error: (err) => {
        console.error('❌ Error cargando modelo:', err);
        this.error = 'No se pudo cargar el modelo. Verifica que assets/modelo_riesgo.json existe.';
      }
    });
  }

  // ===============================
  // CARGAR DATASET (robusto)
  // ===============================
  cargarDataset(): void {
    this.http.get('assets/dataset_ml_final.csv', { responseType: 'text' }).subscribe({
      next: (csv: string) => {
        // Normalizar finales de línea, eliminar BOM si existe
        csv = csv.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
        const lineas = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        if (lineas.length <= 1) {
          console.warn('⚠️ CSV vacío o sin datos (solo header).');
        }

        // Suponemos que la primera línea es header
        const header = lineas[0].toLowerCase();
        const hasHeader = header.indexOf('reading_id') >= 0 || header.indexOf('timestamp') >= 0;

        for (let i = (hasHeader ? 1 : 0); i < lineas.length; i++) {
          const linea = lineas[i];
          // Split simple por coma; si tu CSV tiene comillas con comas internas, deberíamos usar un parser CSV más robusto.
          const valoresRaw = linea.split(',').map(v => v.trim());

          // Aceptar filas con al menos 6 columnas (reading_id,user_id,timestamp,type,value,label[,type_cod])
          if (valoresRaw.length < 6) {
            console.warn(`⚠️ Línea ${i + 1} ignorada (columnas insuficientes):`, linea);
            continue;
          }

          // Normalizar columnas con fallback si falta type_cod
          const reading_id = valoresRaw[0] || '';
          const user_id = valoresRaw[1] || '';
          const timestamp = valoresRaw[2] || '';
          const type = valoresRaw[3] || '';
          // Intentar parsear value como número, manejar comas decimales
          let value = parseFloat(valoresRaw[4].replace(',', '.'));
          if (isNaN(value)) value = 0;
          // label puede ser '0','1' u 'NORMAL','RIESGO'
          let label = 0;
          const labelRaw = (valoresRaw[5] || '').toLowerCase();
          if (labelRaw === '1' || labelRaw === 'riesgo' || labelRaw === 'true') label = 1;
          else if (labelRaw === '0' || labelRaw === 'normal' || labelRaw === 'false') label = 0;
          else {
            // intentar parsear como número
            const parsedLabel = parseInt(valoresRaw[5]);
            if (!isNaN(parsedLabel)) label = parsedLabel ? 1 : 0;
          }

          // type_cod si viene en CSV
          let type_cod = null;
          if (valoresRaw.length >= 7) {
            const tc = parseInt(valoresRaw[6]);
            if (!isNaN(tc)) type_cod = tc;
            else {
              // intentar limpiar y parsear
              const cleaned = valoresRaw[6].replace(/[^0-9\-]/g, '');
              const parsed = parseInt(cleaned);
              if (!isNaN(parsed)) type_cod = parsed;
            }
          }

          // Si no existe type_cod, lo dejamos null y usaremos map fallback al predecir
          this.dataset.push({
            reading_id,
            user_id,
            timestamp,
            type,
            value,
            label,
            type_cod,
            prob_riesgo: 0,
            prediccion: 0
          });
        }

        // Listar sensores únicos (type)
        this.sensores = Array.from(new Set(this.dataset.map(d => d.type).filter(Boolean)));
        if (this.sensores.length > 0) {
          this.sensorSeleccionado = this.sensores[0];
        }

        console.log('✅ Dataset cargado:', this.dataset.length, 'registros');
        console.log('   - Sensores encontrados:', this.sensores);
        console.log('   - Ejemplo registro:', this.dataset[0]);
        this.verificarListo();
      },
      error: (err) => {
        console.error('❌ Error cargando dataset:', err);
        this.error = 'No se pudo cargar el dataset. Verifica que assets/dataset_ml_final.csv existe.';
      }
    });
  }

  // ===============================
  // VERIFICAR SI TODO ESTÁ LISTO
  // ===============================
  verificarListo(): void {
    if (this.modelo && this.dataset.length > 0) {
      console.log('🎉 Todo listo, iniciando cálculos...');
      this.modelReady = true;
      this.calcularPredicciones();
      setTimeout(() => this.crearGraficas(), 100);
    }
  }

  // ===============================
  // CALCULAR PREDICCIONES
  // ===============================
  calcularPredicciones(): void {
    console.log('🧠 Calculando predicciones para', this.dataset.length, 'registros...');
    let calculadas = 0;
    let fallidas = 0;
    const primerasMuestras: any[] = [];

    this.dataset.forEach((row, idx) => {
      // Determinar type code: usar el type_cod del CSV si existe, si no usar fallback por nombre
      const code = (row.type_cod !== null && row.type_cod !== undefined) ? row.type_cod : this.fallbackCodigoPorType(row.type);
      const pred = this.predecirInterno(row.value, code);
      if (pred) {
        row.prob_riesgo = pred.probability;
        row.prediccion = pred.prediction;
        calculadas++;
        if (idx < 5) {
          primerasMuestras.push({
            idx,
            type: row.type,
            value: row.value,
            label_real: row.label,
            prediccion: pred.prediction,
            prob_riesgo: (pred.probability * 100).toFixed(2) + '%',
            prob_normal: (pred.prob_normal * 100).toFixed(2) + '%',
            arboles_usados: pred.num_trees_used
          });
        }
      } else {
        fallidas++;
        row.prob_riesgo = 0;
        row.prediccion = 0;
      }
    });

    console.log('✅ Predicciones completadas:', calculadas, 'de', this.dataset.length);
    if (fallidas > 0) {
      console.warn('⚠️ Predicciones fallidas:', fallidas);
    }
    console.log('📋 Primeras 5 predicciones:');
    console.table(primerasMuestras);

    // Estadísticas
    const prediccionesRiesgo = this.dataset.filter(d => d.prediccion === 1).length;
    const prediccionesNormal = this.dataset.filter(d => d.prediccion === 0).length;
    console.log('📊 Distribución de predicciones:');
    console.log(`   - RIESGO (1): ${prediccionesRiesgo} (${(prediccionesRiesgo/this.dataset.length*100).toFixed(1)}%)`);
    console.log(`   - NORMAL (0): ${prediccionesNormal} (${(prediccionesNormal/this.dataset.length*100).toFixed(1)}%)`);

    // Labels reales
    const labelsRiesgo = this.dataset.filter(d => d.label === 1).length;
    const labelsNormal = this.dataset.filter(d => d.label === 0).length;
    console.log('📊 Distribución de labels reales:');
    console.log(`   - RIESGO (1): ${labelsRiesgo} (${(labelsRiesgo/this.dataset.length*100).toFixed(1)}%)`);
    console.log(`   - NORMAL (0): ${labelsNormal} (${(labelsNormal/this.dataset.length*100).toFixed(1)}%)`);

    // Calcular métricas
    this.calcularMetricas();
  }

  // ===============================
  // CALCULAR MÉTRICAS
  // ===============================
  calcularMetricas(): void {
    let tp = 0, tn = 0, fp = 0, fn = 0;

    this.dataset.forEach(row => {
      const pred = row.prediccion;
      const real = row.label;
      if (pred === 1 && real === 1) tp++;
      else if (pred === 0 && real === 0) tn++;
      else if (pred === 1 && real === 0) fp++;
      else if (pred === 0 && real === 1) fn++;
    });

    const total = Math.max(1, this.dataset.length);
    this.accuracy = ((tp + tn) / total * 100).toFixed(2);
    this.precision = tp + fp > 0 ? (tp / (tp + fp) * 100).toFixed(2) : '0';
    this.recall = tp + fn > 0 ? (tp / (tp + fn) * 100).toFixed(2) : '0';

    const precisionNum = parseFloat(this.precision);
    const recallNum = parseFloat(this.recall);
    this.f1score = precisionNum + recallNum > 0
      ? (2 * (precisionNum * recallNum) / (precisionNum + recallNum)).toFixed(2)
      : '0';

    console.log('📊 Métricas del modelo:');
    console.log('   - Accuracy:', this.accuracy + '%');
    console.log('   - Precision:', this.precision + '%');
    console.log('   - Recall:', this.recall + '%');
    console.log('   - F1-Score:', this.f1score + '%');
  }

  // ===============================
  // PREDICIÓN INTERNA (robusta)
  // ===============================
  predecirInterno(value: number, typeCod: number): any {
    if (!this.modelo || !this.modelo.trees || !Array.isArray(this.modelo.trees) || this.modelo.trees.length === 0) {
      console.error('❌ Modelo no disponible o formato inesperado');
      return null;
    }

    if (value === null || value === undefined || isNaN(value)) {
      console.warn('⚠️ Valor inválido para predecir:', value);
      return null;
    }

    const features = [value, typeCod === null || typeCod === undefined ? 0 : typeCod];
    const predicciones: number[][] = [];

    try {
      for (let treeIdx = 0; treeIdx < this.modelo.trees.length; treeIdx++) {
        const tree = this.modelo.trees[treeIdx];
        if (!Array.isArray(tree) || tree.length === 0) {
          console.warn(`⚠️ Árbol ${treeIdx} con formato inesperado`);
          continue;
        }

        let nodeId = 0;
        let iter = 0;
        const maxIter = 500;

        while (iter < maxIter) {
          const node = tree[nodeId];
          if (!node) {
            console.warn(`⚠️ Árbol ${treeIdx}: nodo ${nodeId} no encontrado`);
            break;
          }

          const left = (node.left_child === -1 || node.left_child === null) ? -1 : node.left_child;
          const right = (node.right_child === -1 || node.right_child === null) ? -1 : node.right_child;
          const isLeaf = (left === -1 && right === -1);

          if (isLeaf) {
            // Extraer valores
            let valores: number[] = [];
            if (node.value !== undefined && node.value !== null) {
              if (Array.isArray(node.value)) {
                if (Array.isArray(node.value[0])) {
                  valores = node.value[0].map((v: any) => Number(v));
                } else {
                  valores = node.value.map((v: any) => Number(v));
                }
              } else if (typeof node.value === 'number') {
                // valor único extraño -> no podemos deducir probabilidades
                valores = [Number(node.value)];
              }
            }

            if (valores.length === 2) {
              const total = valores[0] + valores[1];
              if (total <= 0) {
                // si hay ceros, evitar dividir por cero, asignar 0.5/0.5
                predicciones.push([0.5, 0.5]);
              } else {
                predicciones.push([valores[0] / total, valores[1] / total]);
              }
            } else {
              // Si no tenemos un formato de dos clases, intentar inferir: si existe 'prob' en nodo
              if (node.probability && typeof node.probability === 'number') {
                const p1 = Number(node.probability);
                predicciones.push([1 - p1, p1]);
              } else {
                // fallback neutro
                predicciones.push([0.5, 0.5]);
                console.warn(`⚠️ Árbol ${treeIdx}: nodo hoja con formato inesperado (valores):`, valores);
              }
            }
            break;
          }

          // No es hoja: navegar según feature y threshold
          const featureIdx = Number(node.feature) || 0;
          const thresholdRaw = node.threshold;
          let threshold = Number(thresholdRaw);
          if (isNaN(threshold)) {
            // intentar limpiar si viene como string
            const cleaned = ('' + thresholdRaw).replace(/[^0-9\.\-]/g, '');
            threshold = Number(cleaned);
          }
          const featureValue = features[featureIdx] === undefined ? 0 : features[featureIdx];

          // Si threshold invalido, romper
          if (isNaN(threshold)) {
            console.warn(`⚠️ Árbol ${treeIdx}: threshold inválido en nodo ${nodeId}`, thresholdRaw);
            // romper para evitar bucle infinito
            break;
          }

          if (featureValue <= threshold) {
            nodeId = node.left_child;
          } else {
            nodeId = node.right_child;
          }

          if (nodeId === -1 || nodeId === null || nodeId === undefined) {
            console.warn(`⚠️ Árbol ${treeIdx}: próxima rama inválida desde nodo ${nodeId}`);
            break;
          }

          iter++;
        }
      }

      if (predicciones.length === 0) {
        console.error('⚠️ No se obtuvieron predicciones de ningún árbol');
        return null;
      }

      // Promediar (soft voting)
      let suma0 = 0, suma1 = 0;
      predicciones.forEach(p => {
        suma0 += (p[0] || 0);
        suma1 += (p[1] || 0);
      });

      const n = predicciones.length;
      const probNormal = (suma0 / n) || 0;
      const probRiesgo = (suma1 / n) || 0;
      const totalProb = probNormal + probRiesgo || 1;
      const probNormalNorm = probNormal / totalProb;
      const probRiesgoNorm = probRiesgo / totalProb;
      const prediction = probRiesgoNorm > 0.5 ? 1 : 0;

      return {
        prediction,
        probability: probRiesgoNorm,
        prob_normal: probNormalNorm,
        risk_label: prediction === 1 ? '⚠️ RIESGO DETECTADO' : '✅ NORMAL',
        num_trees_used: n
      };

    } catch (error) {
      console.error('❌ Error en predicción:', error);
      return null;
    }
  }

  // ===============================
  // PREDICCIÓN MANUAL (MEJORADA)
  // ===============================
  predecir(): void {
    if (!this.modelReady) {
      this.error = '⚠️ El modelo aún se está cargando. Por favor espera...';
      return;
    }

    if (this.valor === null || this.valor === undefined || isNaN(this.valor)) {
      this.error = '⚠️ Por favor ingresa un valor válido del sensor';
      return;
    }

    if (!this.tipoSeleccionado) {
      this.error = '⚠️ Por favor selecciona un tipo de sensor';
      return;
    }

    // Intentar obtener el type code desde el dataset (si existe)
    const ejemplo = this.dataset.find(d => d.type === this.tipoSeleccionado && d.type_cod !== null && d.type_cod !== undefined);
    const codigoSensor = ejemplo ? ejemplo.type_cod : this.fallbackCodigoPorType(this.tipoSeleccionado);

    if (codigoSensor === null || codigoSensor === undefined) {
      this.error = '⚠️ Tipo de sensor no válido y no se encontró código asociado en el dataset';
      return;
    }

    console.log('🔮 Prediciendo para valor:', this.valor, 'tipo:', this.tipoSeleccionado, 'código:', codigoSensor);
    this.error = '';
    this.resultado = this.predecirInterno(this.valor, codigoSensor);

    if (this.resultado) {
      // Añadir metadatos amigables
      this.resultado.tipo_sensor = this.obtenerNombreSensorPorType(this.tipoSeleccionado);
      this.resultado.valor_ingresado = this.valor;
      this.resultado.porcentaje = (this.resultado.probability * 100).toFixed(2);
      this.resultado.porcentaje_normal = (this.resultado.prob_normal * 100).toFixed(2);

      if (this.resultado.probability < 0.3) {
        this.resultado.nivel = 'BAJO';
        this.resultado.icono = '✅';
        this.resultado.mensaje = 'Los valores del sensor están dentro del rango normal.';
      } else if (this.resultado.probability < 0.7) {
        this.resultado.nivel = 'MODERADO';
        this.resultado.icono = '⚠️';
        this.resultado.mensaje = 'Se detectan valores anormales. Monitorear.';
      } else {
        this.resultado.nivel = 'ALTO';
        this.resultado.icono = '🚨';
        this.resultado.mensaje = 'ALERTA: riesgo significativo.';
      }

      if (this.resultado.prediction === 1) {
        this.resultado.interpretacion = `El modelo clasificó esta lectura como RIESGO con ${this.resultado.porcentaje}% de confianza (basado en ${this.resultado.num_trees_used} árboles).`;
      } else {
        this.resultado.interpretacion = `El modelo clasificó esta lectura como NORMAL con ${this.resultado.porcentaje_normal}% de confianza (basado en ${this.resultado.num_trees_used} árboles).`;
      }

      // Contexto: buscar valores similares en dataset
      const valoresSimilares = this.dataset
        .filter(d => d.type === this.tipoSeleccionado)
        .filter(d => {
          // comparar tolerancia relativa
          const denom = Math.max(Math.abs(d.value), Math.abs(this.valor), 1);
          return Math.abs(d.value - this.valor) / denom < 0.1;
        })
        .slice(0, 10);

      if (valoresSimilares.length > 0) {
        const riesgoEnSimilares = valoresSimilares.filter(d => d.prediccion === 1).length;
        const porcentajeRiesgo = (riesgoEnSimilares / valoresSimilares.length * 100).toFixed(0);
        this.resultado.contexto = `En el dataset, ${riesgoEnSimilares} de ${valoresSimilares.length} lecturas similares (${porcentajeRiesgo}%) fueron clasificadas como RIESGO.`;
      }

      console.log('✅ Resultado de predicción:', this.resultado);
    } else {
      console.error('❌ No se pudo obtener predicción');
      this.error = '❌ Error al calcular la predicción. Revisa la consola.';
    }
  }

  // ===============================
  // FALLBACK: MAPA DE CÓDIGOS POR TYPE (si dataset no tiene type_cod)
  // ===============================
  fallbackCodigoPorType(type: string): number | null {
    const mapa: any = {
      'mq7': 1,        // <-- ajusta según tu convención real si lo necesitas
      'pulse': 2,
      'body_temp': 3,
      'ax': 4,
      'ay': 5
    };
    return mapa[type] ?? null;
  }

  // ===============================
  // OBTENER NOMBRE POR type
  // ===============================
  obtenerNombreSensorPorType(type: string): string {
    const sensoresMapa: any = {
      'mq7': 'MQ-7 (Monóxido de Carbono)',
      'pulse': 'Pulse (Frecuencia Cardíaca)',
      'body_temp': 'Body Temp (Temperatura Corporal)',
      'ax': 'AX (Acelerómetro X)',
      'ay': 'AY (Acelerómetro Y)'
    };
    return sensoresMapa[type] || type || 'Sensor desconocido';
  }

  // ===============================
  // CREAR GRÁFICAS (igual, con defensas)
  // ===============================
  async crearGraficas(): Promise<void> {
    try {
      console.log('📊 Creando gráficas...');
      const Chart = (await import('chart.js/auto')).default;

      // -- Gráfica 1: matriz de confusión (defensas si no hay datos) --
      const predicciones = this.dataset.map(d => d.prediccion || 0);
      const etiquetas = this.dataset.map(d => d.label || 0);
      let tp = 0, tn = 0, fp = 0, fn = 0;
      for (let i = 0; i < Math.min(predicciones.length, etiquetas.length); i++) {
        if (predicciones[i] === 1 && etiquetas[i] === 1) tp++;
        else if (predicciones[i] === 0 && etiquetas[i] === 0) tn++;
        else if (predicciones[i] === 1 && etiquetas[i] === 0) fp++;
        else if (predicciones[i] === 0 && etiquetas[i] === 1) fn++;
      }

      const ctx1 = document.getElementById('chart1') as HTMLCanvasElement;
      if (ctx1) {
        if (this.charts['chart1']) { try { this.charts['chart1'].destroy(); } catch (e) {} }
        this.charts['chart1'] = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: ['TP (riesgo)', 'TN (normal)', 'FP', 'FN'],
            datasets: [{
              label: 'Cantidad',
              data: [tp, tn, fp, fn],
              backgroundColor: ['rgba(76,175,80,0.8)','rgba(33,150,243,0.8)','rgba(255,152,0,0.8)','rgba(244,67,54,0.8)'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: { display: true, text: `Matriz de Confusión | Acc: ${this.accuracy}%` },
              legend: { display: false }
            }
          }
        });
      }

     
      // ========================================
      // GRÁFICA 2: HISTOGRAMA DE PROBABILIDADES
      // ========================================
      const datosPorTipo: any = {};
      this.dataset.forEach(d => {
        if (!datosPorTipo[d.type]) {
          datosPorTipo[d.type] = [];
        }
        datosPorTipo[d.type].push(d.prob_riesgo);
      });

      const colores = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ];

      const datasets = Object.keys(datosPorTipo).map((tipo, index) => {
        const datos = datosPorTipo[tipo];
        const totalDatos = datos.length;
        const buckets = Array(10).fill(0);

        datos.forEach((valor: number) => {
          let idx = Math.floor(valor * 10);
          if (idx > 9) idx = 9;
          buckets[idx]++;
        });

        const porcentaje = buckets.map(b => Number(((b / totalDatos) * 100).toFixed(2)));
        const promedio = datos.reduce((a: number, b: number) => a + b, 0) / totalDatos;

        return {
          label: tipo,
          data: porcentaje,
          backgroundColor: colores[index % colores.length],
          borderColor: colores[index % colores.length].replace("0.7", "1"),
          borderWidth: 2,
          borderRadius: 6,
          promedio: promedio
        };
      });

      const ctx2 = document.getElementById('chart2') as HTMLCanvasElement;
      if (ctx2) {
        if (this.charts['chart2']) {
          this.charts['chart2'].destroy();
        }

        this.charts['chart2'] = new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
            datasets: datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1200, easing: 'easeOutQuart' },
            plugins: {
              title: {
                display: true,
                text: '📊 Distribución de Probabilidades de Riesgo por Sensor',
                font: { size: 16, weight: 'bold' }
              },
              legend: { position: 'top', labels: { padding: 15, boxWidth: 20 } },
              tooltip: {
                callbacks: {
                  afterLabel: (ctx) => {
                    const dataset = ctx.dataset as any;
                    return `Promedio: ${(dataset.promedio * 100).toFixed(1)}%`;
                  }
                }
              }
            },
            scales: {
              x: { title: { display: true, text: 'Rango de Probabilidad (%)' } },
              y: { beginAtZero: true, title: { display: true, text: 'Frecuencia (%)' } }
            }
          }
        });
        console.log("✅ Gráfica 2 (Histograma) creada");
      }

      // ========================================
      // GRÁFICA 3: SCATTER CON ESCALA LOGARÍTMICA
      // ========================================
      const datosSensor = this.dataset
        .filter(d => d.type === this.sensorSeleccionado)
        .slice(0, 300);

      const datosNormales = datosSensor.filter(d => d.prediccion === 0); // label predicho = 0 (NORMAL)
      const datosRiesgo = datosSensor.filter(d => d.prediccion === 1);   // label predicho = 1 (RIESGO)

      const ctx3 = document.getElementById('chart3') as HTMLCanvasElement;
      if (ctx3) {
        if (this.charts['chart3']) {
          this.charts['chart3'].destroy();
        }

        this.charts['chart3'] = new Chart(ctx3, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: '✅ NORMAL (pred=0)',
                data: datosNormales.map(d => ({ x: d.value + 0.0001, y: d.prob_riesgo })),
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: 'rgb(76, 175, 80)',
                borderWidth: 1,
                pointRadius: 5,
                pointHoverRadius: 7
              },
              {
                label: '⚠️ RIESGO (pred=1)',
                data: datosRiesgo.map(d => ({ x: d.value + 0.0001, y: d.prob_riesgo })),
                backgroundColor: 'rgba(244, 67, 54, 0.6)',
                borderColor: 'rgb(244, 67, 54)',
                borderWidth: 1,
                pointRadius: 7,
                pointHoverRadius: 9,
                pointStyle: "triangle"
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1800, easing: 'easeInOutQuart' },
            plugins: {
              title: {
                display: true,
                text: `🔬 Análisis de Sensor: ${this.sensorSeleccionado} (Escala Logarítmica)`,
                font: { size: 16, weight: 'bold' }
              },
              legend: { display: true, position: 'top' },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const x = Number(context.parsed.x).toFixed(2);
                    const y = Number(context.parsed.y).toFixed(3);
                    return `Valor: ${x} | P(riesgo): ${y}`;
                  }
                }
              }
            },
            scales: {
              x: {
                type: 'logarithmic',
                title: { display: true, text: 'Valor del Sensor (escala log)' },
                ticks: { callback: (value) => Number(value).toFixed(1) },
                min: 0.1
              },
              y: {
                min: 0,
                max: 1,
                title: { display: true, text: 'Probabilidad de Riesgo' }
              }
            }
          }
        });
        console.log('✅ Gráfica 3 (Scatter logarítmico) creada');
      }

    } catch (err) {
      console.error('❌ Error creando gráficas:', err);
      this.error = 'Error al crear las gráficas. Revisa la consola.';
    }
  }

  // ===============================
  // CAMBIAR SENSOR
  // ===============================
  cambiarSensor(): void {
    console.log('🔄 Cambiando sensor a:', this.sensorSeleccionado);
    this.crearGraficas();
  }
}
