// ml.component.ts - OPTIMIZADO
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
  tipoSeleccionado: string = '';
  resultado: any = null;

  sensores: string[] = [];
  sensorSeleccionado: string = '';

  charts: any = {};

  // Métricas del modelo
  accuracy: string = '0';
  precision: string = '0';
  recall: string = '0';
  f1score: string = '0';

  // Cache para predicciones
  private predictionCache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('🚀 Iniciando componente ML optimizado...');
    this.cargarModelo();
    this.cargarDataset();
  }

  ngOnDestroy(): void {
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key]) {
        try { this.charts[key].destroy(); } catch (e) {}
      }
    });
    this.predictionCache.clear();
  }

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

  cargarDataset(): void {
    this.http.get('assets/dataset_ml_final.csv', { responseType: 'text' }).subscribe({
      next: (csv: string) => {
        csv = csv.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
        const lineas = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        if (lineas.length <= 1) {
          console.warn('⚠️ CSV vacío o sin datos (solo header).');
          return;
        }

        const header = lineas[0].toLowerCase();
        const hasHeader = header.indexOf('reading_id') >= 0 || header.indexOf('timestamp') >= 0;

        // Procesamiento optimizado con menos operaciones
        for (let i = (hasHeader ? 1 : 0); i < lineas.length; i++) {
          const valoresRaw = lineas[i].split(',').map(v => v.trim());

          if (valoresRaw.length < 6) continue;

          let value = parseFloat(valoresRaw[4].replace(',', '.'));
          if (isNaN(value)) value = 0;
          
          const labelRaw = (valoresRaw[5] || '').toLowerCase();
          let label = (labelRaw === '1' || labelRaw === 'riesgo' || labelRaw === 'true') ? 1 : 0;

          let type_cod = null;
          if (valoresRaw.length >= 7) {
            const tc = parseInt(valoresRaw[6]);
            if (!isNaN(tc)) type_cod = tc;
          }

          this.dataset.push({
            reading_id: valoresRaw[0],
            user_id: valoresRaw[1],
            timestamp: valoresRaw[2],
            type: valoresRaw[3],
            value,
            label,
            type_cod,
            prob_riesgo: 0,
            prediccion: 0
          });
        }

        this.sensores = Array.from(new Set(this.dataset.map(d => d.type).filter(Boolean)));
        if (this.sensores.length > 0) {
          this.sensorSeleccionado = this.sensores[0];
        }

        console.log('✅ Dataset cargado:', this.dataset.length, 'registros');
        this.verificarListo();
      },
      error: (err) => {
        console.error('❌ Error cargando dataset:', err);
        this.error = 'No se pudo cargar el dataset.';
      }
    });
  }

  verificarListo(): void {
    if (this.modelo && this.dataset.length > 0) {
      console.log('🎉 Todo listo, iniciando cálculos...');
      this.modelReady = true;
      this.calcularPredicciones();
      setTimeout(() => this.crearGraficas(), 100);
    }
  }

  calcularPredicciones(): void {
    console.log('🧠 Calculando predicciones...');
    
    // Procesamiento por lotes para mejor rendimiento
    const batchSize = 100;
    for (let i = 0; i < this.dataset.length; i += batchSize) {
      const batch = this.dataset.slice(i, i + batchSize);
      batch.forEach(row => {
        const code = row.type_cod ?? this.fallbackCodigoPorType(row.type);
        const pred = this.predecirInterno(row.value, code);
        if (pred) {
          row.prob_riesgo = pred.probability;
          row.prediccion = pred.prediction;
        }
      });
    }

    this.calcularMetricas();
  }

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

    console.log('📊 Accuracy:', this.accuracy + '% | Precision:', this.precision + '%');
  }

  predecirInterno(value: number, typeCod: number): any {
    // Cache para evitar recálculos
    const cacheKey = `${value}_${typeCod}`;
    if (this.predictionCache.has(cacheKey)) {
      return this.predictionCache.get(cacheKey);
    }

    if (!this.modelo?.trees?.length || isNaN(value)) return null;

    const features = [value, typeCod ?? 0];
    const predicciones: number[][] = [];

    try {
      for (const tree of this.modelo.trees) {
        if (!Array.isArray(tree) || tree.length === 0) continue;

        let nodeId = 0;
        let iter = 0;

        while (iter < 500) {
          const node = tree[nodeId];
          if (!node) break;

          const isLeaf = (node.left_child === -1 || node.left_child === null) && 
                        (node.right_child === -1 || node.right_child === null);

          if (isLeaf) {
            let valores: number[] = [];
            if (Array.isArray(node.value)) {
              valores = Array.isArray(node.value[0]) ? node.value[0] : node.value;
            }

            if (valores.length === 2) {
              const total = valores[0] + valores[1] || 1;
              predicciones.push([valores[0] / total, valores[1] / total]);
            } else {
              predicciones.push([0.5, 0.5]);
            }
            break;
          }

          const featureIdx = Number(node.feature) || 0;
          const threshold = Number(node.threshold);
          if (isNaN(threshold)) break;

          const featureValue = features[featureIdx] ?? 0;
          nodeId = featureValue <= threshold ? node.left_child : node.right_child;

          if (nodeId === -1 || nodeId === null) break;
          iter++;
        }
      }

      if (predicciones.length === 0) return null;

      const suma0 = predicciones.reduce((acc, p) => acc + (p[0] || 0), 0);
      const suma1 = predicciones.reduce((acc, p) => acc + (p[1] || 0), 0);
      const n = predicciones.length;
      const totalProb = suma0 + suma1 || 1;
      
      const probNormalNorm = suma0 / totalProb;
      const probRiesgoNorm = suma1 / totalProb;
      const prediction = probRiesgoNorm > 0.5 ? 1 : 0;

      const result = {
        prediction,
        probability: probRiesgoNorm,
        prob_normal: probNormalNorm,
        risk_label: prediction === 1 ? '⚠️ RIESGO DETECTADO' : '✅ NORMAL',
        num_trees_used: n
      };

      this.predictionCache.set(cacheKey, result);
      return result;

    } catch (error) {
      console.error('❌ Error en predicción:', error);
      return null;
    }
  }

  predecir(): void {
    if (!this.modelReady) {
      this.error = '⚠️ El modelo aún se está cargando...';
      return;
    }

    if (isNaN(this.valor) || !this.tipoSeleccionado) {
      this.error = '⚠️ Por favor completa todos los campos';
      return;
    }

    const ejemplo = this.dataset.find(d => d.type === this.tipoSeleccionado && d.type_cod !== null);
    const codigoSensor = ejemplo?.type_cod ?? this.fallbackCodigoPorType(this.tipoSeleccionado);

    this.error = '';
    this.resultado = this.predecirInterno(this.valor, codigoSensor);

    if (this.resultado) {
      this.resultado.tipo_sensor = this.obtenerNombreSensorPorType(this.tipoSeleccionado);
      this.resultado.valor_ingresado = this.valor;
      this.resultado.porcentaje = (this.resultado.probability * 100).toFixed(2);
      this.resultado.porcentaje_normal = (this.resultado.prob_normal * 100).toFixed(2);

      if (this.resultado.probability < 0.3) {
        this.resultado.nivel = 'BAJO';
        this.resultado.icono = '✅';
        this.resultado.color = 'success';
        this.resultado.mensaje = 'Valores dentro del rango normal.';
      } else if (this.resultado.probability < 0.7) {
        this.resultado.nivel = 'MODERADO';
        this.resultado.icono = '⚠️';
        this.resultado.color = 'warning';
        this.resultado.mensaje = 'Valores anormales detectados. Monitorear.';
      } else {
        this.resultado.nivel = 'ALTO';
        this.resultado.icono = '🚨';
        this.resultado.color = 'danger';
        this.resultado.mensaje = 'ALERTA: Riesgo significativo detectado.';
      }

      this.resultado.interpretacion = `Clasificado como ${this.resultado.prediction === 1 ? 'RIESGO' : 'NORMAL'} con ${this.resultado.porcentaje}% de confianza.`;
    } else {
      this.error = '❌ Error al calcular la predicción';
    }
  }

  fallbackCodigoPorType(type: string): number {
    const mapa: any = { 'mq7': 1, 'pulse': 2, 'body_temp': 3, 'ax': 4, 'ay': 5 };
    return mapa[type] ?? 0;
  }

  obtenerNombreSensorPorType(type: string): string {
    const sensoresMapa: any = {
      'mq7': 'MQ-7 (CO)',
      'pulse': 'Pulse',
      'body_temp': 'Temp. Corporal',
      'ax': 'Acelerómetro X',
      'ay': 'Acelerómetro Y'
    };
    return sensoresMapa[type] || type;
  }

  async crearGraficas(): Promise<void> {
    try {
      const Chart = (await import('chart.js/auto')).default;

      // Gráfica 1: Matriz de confusión
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
        if (this.charts['chart1']) this.charts['chart1'].destroy();
        this.charts['chart1'] = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: ['TP', 'TN', 'FP', 'FN'],
            datasets: [{
              label: 'Cantidad',
              data: [tp, tn, fp, fn],
              backgroundColor: ['#4caf50','#2196f3','#ff9800','#f44336'],
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: { display: true, text: `Matriz de Confusión | Acc: ${this.accuracy}%` },
              legend: { display: false }
            }
          }
        });
      }

      // Gráfica 2: Histograma
      const datosPorTipo: any = {};
      this.dataset.forEach(d => {
        if (!datosPorTipo[d.type]) datosPorTipo[d.type] = [];
        datosPorTipo[d.type].push(d.prob_riesgo);
      });

      const colores = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'];
      const datasets = Object.keys(datosPorTipo).map((tipo, index) => {
        const datos = datosPorTipo[tipo];
        const buckets = Array(10).fill(0);
        datos.forEach((v: number) => {
          let idx = Math.floor(v * 10);
          if (idx > 9) idx = 9;
          buckets[idx]++;
        });
        return {
          label: tipo,
          data: buckets.map(b => ((b / datos.length) * 100).toFixed(2)),
          backgroundColor: colores[index % colores.length],
          borderRadius: 6
        };
      });

      const ctx2 = document.getElementById('chart2') as HTMLCanvasElement;
      if (ctx2) {
        if (this.charts['chart2']) this.charts['chart2'].destroy();
        this.charts['chart2'] = new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90-100%'],
            datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: { display: true, text: 'Distribución de Probabilidades' }
            }
          }
        });
      }

      // Gráfica 3: Scatter
      const datosSensor = this.dataset.filter(d => d.type === this.sensorSeleccionado).slice(0, 300);
      const ctx3 = document.getElementById('chart3') as HTMLCanvasElement;
      if (ctx3) {
        if (this.charts['chart3']) this.charts['chart3'].destroy();
        this.charts['chart3'] = new Chart(ctx3, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: 'NORMAL',
                data: datosSensor.filter(d => d.prediccion === 0).map(d => ({ x: d.value + 0.0001, y: d.prob_riesgo })),
                backgroundColor: 'rgba(76, 175, 80, 0.6)'
              },
              {
                label: 'RIESGO',
                data: datosSensor.filter(d => d.prediccion === 1).map(d => ({ x: d.value + 0.0001, y: d.prob_riesgo })),
                backgroundColor: 'rgba(244, 67, 54, 0.6)'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: `Análisis: ${this.sensorSeleccionado}` } },
            scales: {
              x: { type: 'logarithmic', min: 0.1 },
              y: { min: 0, max: 1 }
            }
          }
        });
      }

    } catch (err) {
      console.error('❌ Error creando gráficas:', err);
    }
  }

  cambiarSensor(): void {
    this.crearGraficas();
  }
}