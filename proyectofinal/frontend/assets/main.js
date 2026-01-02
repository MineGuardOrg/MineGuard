// API Base URL
const API_URL = 'http://localhost:8000/api';

// Utility function to show alerts
function showAlert(message, type = 'info', containerId = null) {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    if (containerId) {
        document.getElementById(containerId).innerHTML = alertHTML;
    } else {
        // Show at top of page if no container specified
        const container = document.createElement('div');
        container.innerHTML = alertHTML;
        document.body.insertBefore(container, document.body.firstChild);
    }
}

// Load dashboard statistics (usando endpoint de estadísticas)
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/estadisticas`);
        const data = await response.json();
        
        document.getElementById('total-students').textContent = data.total_estudiantes_unicos || 0;
        document.getElementById('students-at-risk').textContent = data.estudiantes_en_riesgo || 0;
        document.getElementById('avg-attendance').textContent = '---'; // No disponible en nuevo modelo
        document.getElementById('avg-grade').textContent = data.promedio_calificaciones || 0;
        
        console.log('Dashboard cargado:', data);
        
        // Actualizar gráficos
        loadCharts();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        // Intentar endpoint antiguo como fallback
        try {
            const response = await fetch(`${API_URL}/dashboard/variables`);
            const data = await response.json();
            document.getElementById('total-students').textContent = data.total_estudiantes;
            document.getElementById('students-at-risk').textContent = data.estudiantes_en_riesgo;
            document.getElementById('avg-attendance').textContent = data.promedio_asistencia + '%';
            document.getElementById('avg-grade').textContent = data.promedio_calificacion;
        } catch (err) {
            console.error('Error en fallback:', err);
        }
    }
}

// Upload dataset académico
document.getElementById('upload-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('dataset-file');
    const file = fileInput.files[0];
    
    if (!file) {
        showAlert('Por favor seleccione un archivo', 'warning', 'upload-result');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Mostrar indicador de carga
    document.getElementById('upload-result').innerHTML = `
        <div class="alert alert-info">
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            Cargando dataset académico... Esto puede tomar unos segundos.
        </div>
    `;
    
    try {
        const response = await fetch(`${API_URL}/upload-dataset-academico`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert(
                `${data.message}<br>
                <strong>Evaluaciones agregadas:</strong> ${data.evaluaciones_added}<br>
                <strong>Total de registros:</strong> ${data.total_rows}<br>
                <strong>Columnas detectadas:</strong> ${data.columnas_detectadas.length}`,
                'success',
                'upload-result'
            );
            loadDashboard();
            loadEvaluaciones();
        } else {
            showAlert(`Error: ${data.detail}`, 'danger', 'upload-result');
        }
    } catch (error) {
        console.error('Error uploading dataset:', error);
        showAlert('Error al subir el archivo: ' + error.message, 'danger', 'upload-result');
    }
});

// Train models (usando nuevo endpoint con dataset académico)
document.getElementById('train-models-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('train-models-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Entrenando modelos...';
    
    try {
        const response = await fetch(`${API_URL}/train-evaluacion`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok && data.message) {
            const resultHTML = `
                <div class="alert alert-success">
                    <strong>${data.message}</strong><br><br>
                    <strong>Random Forest:</strong> Accuracy = ${data.clasificacion_random_forest.accuracy}<br>
                    <strong>Logistic Regression:</strong> Accuracy = ${data.clasificacion_logistic_regression.accuracy}<br>
                    <strong>Regresión:</strong> R² = ${data.regresion.r2_score}, RMSE = ${data.regresion.rmse}<br>
                    <strong>Total registros:</strong> ${data.total_records}<br><br>
                    <strong>Variables más importantes:</strong><br>
                    ${data.feature_importance.slice(0, 5).map(f => 
                        `• ${f.feature}: ${(f.importance * 100).toFixed(2)}%`
                    ).join('<br>')}
                </div>
            `;
            document.getElementById('train-result').innerHTML = resultHTML;
        } else {
            showAlert(`${data.error || data.detail}`, 'danger', 'train-result');
        }
    } catch (error) {
        console.error('Error training models:', error);
        showAlert('Error al entrenar los modelos: ' + error.message, 'danger', 'train-result');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-gear-fill"></i> Entrenar Modelos';
    }
});

// Refresh evaluations button
document.getElementById('refresh-students-btn')?.addEventListener('click', () => {
    loadEvaluaciones();
    loadDashboard();
});

// Función para cargar evaluaciones (nuevo)
async function loadEvaluaciones() {
    try {
        const response = await fetch(`${API_URL}/evaluaciones?limit=100`);
        const evaluaciones = await response.json();
        
        console.log('Evaluaciones cargadas:', evaluaciones.length);
        
        const tbody = document.getElementById('students-tbody');
        const select = document.getElementById('pred-estudiante');
        
        if (tbody) tbody.innerHTML = '';
        if (select) select.innerHTML = '<option value="">-- Todos los estudiantes --</option>';
        
        // Usar Set para estudiantes únicos
        const estudiantesUnicos = new Map();
        
        evaluaciones.forEach(ev => {
            if (!estudiantesUnicos.has(ev.matricula)) {
                estudiantesUnicos.set(ev.matricula, {
                    id: ev.id,
                    matricula: ev.matricula,
                    alumno: ev.alumno,
                    campus: ev.campus,
                    programa: ev.programa,
                    calificacion: ev.calificacion,
                    riesgo: ev.riesgo_academico
                });
            }
            
            // Agregar fila a la tabla
            if (tbody) {
                const row = `
                    <tr>
                        <td>${ev.id}</td>
                        <td>${ev.alumno}</td>
                        <td>${ev.matricula}</td>
                        <td>${ev.campus || 'N/A'}</td>
                        <td>${ev.calificacion}</td>
                        <td>${ev.curso || 'N/A'}</td>
                        <td>
                            ${ev.riesgo_academico 
                                ? `<span class="badge bg-${ev.riesgo_academico === 'ALTO' ? 'danger' : ev.riesgo_academico === 'MEDIO' ? 'warning' : 'success'}">${ev.riesgo_academico}</span>` 
                                : '<span class="badge bg-secondary">Sin calcular</span>'}
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="predecirEvaluacion(${ev.id})">
                                <i class="bi bi-graph-up"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            }
        });
        
        // Llenar select con estudiantes únicos
        if (select) {
            estudiantesUnicos.forEach(est => {
                select.innerHTML += `<option value="${est.matricula}">${est.alumno} - ${est.matricula}</option>`;
            });
        }
        
    } catch (error) {
        console.error('Error loading evaluaciones:', error);
    }
}

// Función para predecir evaluación específica
async function predecirEvaluacion(evaluacionId) {
    try {
        // Asegurar que el ID sea un número entero
        const id = parseInt(evaluacionId);
        if (isNaN(id)) {
            showAlert('ID de evaluación inválido', 'danger');
            return;
        }
        
        console.log('Prediciendo evaluación ID:', id);
        
        const response = await fetch(`${API_URL}/predict-evaluacion`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ evaluacion_id: id })
        });
        
        const data = await response.json();
        
        console.log('Respuesta del servidor:', data);
        
        if (response.ok) {
            showAlert(
                `✅ Predicción realizada<br>
                <strong>Alumno:</strong> ${data.alumno}<br>
                <strong>Probabilidad reprobación:</strong> ${(data.prediccion_reprobacion * 100).toFixed(2)}%<br>
                <strong>Calificación estimada:</strong> ${data.calificacion_estimada}<br>
                <strong>Riesgo:</strong> <span class="badge bg-${data.riesgo_academico === 'ALTO' ? 'danger' : data.riesgo_academico === 'MEDIO' ? 'warning' : 'success'}">${data.riesgo_academico}</span>`,
                'success'
            );
            loadEvaluaciones();
        } else {
            // Mensaje específico si los modelos no están entrenados
            if (data.detail && data.detail.includes('no han sido entrenados')) {
                showAlert(`<strong>Modelos no entrenados</strong><br>Primero debes entrenar los modelos haciendo clic en el botón "Entrenar Modelos" en la sección de arriba.`, 'warning');
            } else {
                showAlert(`Error: ${data.detail || JSON.stringify(data)}`, 'danger');
            }
        }
    } catch (error) {
        console.error('Error completo:', error);
        showAlert('Error al realizar predicción: ' + error.message, 'danger');
    }
}

// Load initial data
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    loadEvaluaciones(); // Intentar cargar evaluaciones primero
    loadCharts(); // Cargar gráficos del dashboard
    setupFilters(); // Configurar filtros avanzados
});

// ============ GRÁFICOS DEL DASHBOARD ============
let riesgoChart, modalidadChart, campusChart, turnoChart;

async function loadCharts() {
    try {
        const response = await fetch(`${API_URL}/estadisticas`);
        const data = await response.json();
        
        console.log('Datos de estadísticas:', data);
        
        // Transformar datos de array a objeto para gráficos
        const distribucionRiesgo = {};
        const distribucionModalidad = {};
        const distribucionCampus = {};
        const distribucionTurno = {};
        
        // Obtener distribución de riesgo de las evaluaciones
        const respEval = await fetch(`${API_URL}/evaluaciones?limit=1000`);
        const evaluaciones = await respEval.json();
        
        // Contar riesgos
        evaluaciones.forEach(e => {
            const riesgo = e.riesgo_academico || 'N/A';
            distribucionRiesgo[riesgo] = (distribucionRiesgo[riesgo] || 0) + 1;
        });
        
        // Transformar distribuciones del backend
        if (data.distribucion_por_modalidad) {
            data.distribucion_por_modalidad.forEach(item => {
                distribucionModalidad[item.modalidad || 'N/A'] = item.cantidad;
            });
        }
        
        if (data.distribucion_por_campus) {
            data.distribucion_por_campus.forEach(item => {
                distribucionCampus[item.campus || 'N/A'] = item.cantidad;
            });
        }
        
        if (data.distribucion_por_turno) {
            data.distribucion_por_turno.forEach(item => {
                distribucionTurno[item.turno || 'N/A'] = item.cantidad;
            });
        }
        
        // Crear gráficos
        if (Object.keys(distribucionRiesgo).length > 0) {
            riesgoChart = createBarChart('riesgoChart', 'Riesgo Académico', distribucionRiesgo, riesgoChart);
        }
        
        if (Object.keys(distribucionModalidad).length > 0) {
            modalidadChart = createPieChart('modalidadChart', distribucionModalidad, modalidadChart);
        }
        
        if (Object.keys(distribucionCampus).length > 0) {
            campusChart = createBarChart('campusChart', 'Campus', distribucionCampus, campusChart);
        }
        
        if (Object.keys(distribucionTurno).length > 0) {
            turnoChart = createPieChart('turnoChart', distribucionTurno, turnoChart);
        }
        
        console.log('Gráficos cargados correctamente');
    } catch (error) {
        console.error('Error cargando gráficos:', error);
    }
}

function createBarChart(canvasId, label, data, existingChart) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    // Destruir gráfico existente
    if (existingChart) existingChart.destroy();
    
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function createPieChart(canvasId, data, existingChart) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    // Destruir gráfico existente
    if (existingChart) existingChart.destroy();
    
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(153, 162, 235, 0.8)'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: {
                        boxWidth: 15,
                        padding: 10,
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

// ============ FILTROS AVANZADOS ============
async function setupFilters() {
    try {
        // Cargar todas las evaluaciones para extraer valores únicos
        const response = await fetch(`${API_URL}/evaluaciones?limit=1000`);
        const evaluaciones = await response.json();
        
        // Extraer valores únicos para cada filtro
        const campus = [...new Set(evaluaciones.map(e => e.campus).filter(Boolean))];
        const programas = [...new Set(evaluaciones.map(e => e.programa).filter(Boolean))];
        const turnos = [...new Set(evaluaciones.map(e => e.turno).filter(Boolean))];
        const modalidades = [...new Set(evaluaciones.map(e => e.modalidad).filter(Boolean))];
        const docentes = [...new Set(evaluaciones.map(e => e.docente).filter(Boolean))];
        const cursos = [...new Set(evaluaciones.map(e => e.curso).filter(Boolean))];
        
        // Poblar dropdowns
        populateSelect('filter-campus', campus);
        populateSelect('filter-programa', programas);
        populateSelect('filter-turno', turnos);
        populateSelect('filter-modalidad', modalidades);
        populateSelect('filter-docente', docentes);
        populateSelect('filter-curso', cursos);
        
        console.log('Filtros configurados correctamente');
    } catch (error) {
        console.error('Error configurando filtros:', error);
    }
}

function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Mantener la primera opción ("Todos")
    const firstOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(firstOption);
    
    // Agregar opciones ordenadas alfabéticamente
    options.sort().forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

// Aplicar filtros
document.getElementById('apply-filters-btn')?.addEventListener('click', async () => {
    const campus = document.getElementById('filter-campus').value;
    const programa = document.getElementById('filter-programa').value;
    const turno = document.getElementById('filter-turno').value;
    const modalidad = document.getElementById('filter-modalidad').value;
    const riesgo = document.getElementById('filter-riesgo').value;
    
    // Construir query params
    const params = new URLSearchParams();
    if (campus) params.append('campus', campus);
    if (programa) params.append('programa', programa);
    if (turno) params.append('turno', turno);
    if (modalidad) params.append('modalidad', modalidad);
    
    try {
        const response = await fetch(`${API_URL}/evaluaciones?${params.toString()}&limit=100`);
        let evaluaciones = await response.json();
        
        // Filtrar por riesgo en frontend (si el backend no lo soporta)
        if (riesgo) {
            evaluaciones = evaluaciones.filter(e => e.riesgo_academico === riesgo);
        }
        
        // Filtrar por docente y curso en frontend
        const docente = document.getElementById('filter-docente').value;
        const curso = document.getElementById('filter-curso').value;
        
        if (docente) {
            evaluaciones = evaluaciones.filter(e => e.docente === docente);
        }
        if (curso) {
            evaluaciones = evaluaciones.filter(e => e.curso === curso);
        }
        
        // Actualizar tabla con resultados filtrados
        displayFilteredEvaluaciones(evaluaciones);
        
        // Mostrar mensaje discreto en lugar de alerta molesta
        console.log(`Filtros aplicados: ${evaluaciones.length} evaluaciones encontradas`);
    } catch (error) {
        console.error('Error aplicando filtros:', error);
        showAlert('Error al aplicar filtros', 'danger');
    }
});

function displayFilteredEvaluaciones(evaluaciones) {
    const tbody = document.getElementById('students-tbody');
    const select = document.getElementById('pred-estudiante');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Agregar fila con información de resultados filtrados
    if (evaluaciones.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    <i class="bi bi-search"></i> No se encontraron evaluaciones con los filtros aplicados
                </td>
            </tr>
        `;
        if (select) select.innerHTML = '<option value="">-- No hay estudiantes disponibles --</option>';
        return;
    }
    if (select) select.innerHTML = '<option value="">-- Todos los estudiantes --</option>';
    
    evaluaciones.forEach(ev => {
        const riesgoBadge = ev.riesgo_academico === 'ALTO' ? 'bg-danger' 
            : ev.riesgo_academico === 'MEDIO' ? 'bg-warning' : 'bg-success';
        
        const row = `
            <tr>
                <td>${ev.id}</td>
                <td>${ev.alumno || 'N/A'}</td>
                <td>${ev.matricula || 'N/A'}</td>
                <td>${ev.campus || 'N/A'}</td>
                <td><span class="badge ${ev.calificacion >= 7 ? 'bg-success' : 'bg-danger'}">${ev.calificacion}</span></td>
                <td>${ev.curso || 'N/A'}</td>
                <td><span class="badge ${riesgoBadge}">${ev.riesgo_academico || 'N/A'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="predecirEvaluacion(${ev.id})">
                        <i class="bi bi-graph-up"></i> Predecir
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    // Actualizar select con estudiantes únicos
    if (select) {
        const matriculas = [...new Set(evaluaciones.map(e => e.matricula))];
        matriculas.forEach(mat => {
            const alumno = evaluaciones.find(e => e.matricula === mat);
            select.innerHTML += `<option value="${mat}">${alumno.alumno} (${mat})</option>`;
        });
    }
}

// ============ MÓDULO DE PREDICCIÓN CON FILTROS ============
async function setupPredictionFilters() {
    try {
        const response = await fetch(`${API_URL}/evaluaciones?limit=1000`);
        const evaluaciones = await response.json();
        
        // Extraer valores únicos
        const estudiantes = [...new Set(evaluaciones.map(e => e.matricula).filter(Boolean))];
        const cursos = [...new Set(evaluaciones.map(e => e.curso).filter(Boolean))];
        const docentes = [...new Set(evaluaciones.map(e => e.docente).filter(Boolean))];
        const modalidades = [...new Set(evaluaciones.map(e => e.modalidad).filter(Boolean))];
        const turnos = [...new Set(evaluaciones.map(e => e.turno).filter(Boolean))];
        const programas = [...new Set(evaluaciones.map(e => e.programa).filter(Boolean))];
        const campuses = [...new Set(evaluaciones.map(e => e.campus).filter(Boolean))];
        
        // Poblar selects de predicción
        populateSelectWithAlumnos('pred-estudiante', estudiantes, evaluaciones);
        populateSelect('pred-curso', cursos);
        populateSelect('pred-docente', docentes);
        populateSelect('pred-modalidad', modalidades);
        populateSelect('pred-turno', turnos);
        populateSelect('pred-programa', programas);
        populateSelect('pred-campus', campuses);
        
        // Poblar selects de análisis
        populateSelect('analisis-docente-select', docentes);
        populateSelect('analisis-curso-select', cursos);
        populateSelectWithAlumnos('analisis-estudiante-select', estudiantes, evaluaciones);
        
    } catch (error) {
        console.error('Error configurando filtros de predicción:', error);
    }
}

function populateSelectWithAlumnos(selectId, matriculas, evaluaciones) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    const firstOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(firstOption);
    
    matriculas.sort().forEach(mat => {
        const alumno = evaluaciones.find(e => e.matricula === mat);
        const opt = document.createElement('option');
        opt.value = mat;
        opt.textContent = `${alumno?.alumno || 'N/A'} (${mat})`;
        select.appendChild(opt);
    });
}

// Botón de predicción con filtros
document.getElementById('btn-predecir-filtros')?.addEventListener('click', async () => {
    const matricula = document.getElementById('pred-estudiante').value;
    
    if (!matricula) {
        showAlert('Selecciona al menos un estudiante para predecir', 'warning', 'prediction-result');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/predict-evaluacion`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ matricula: matricula })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (Array.isArray(data)) {
                let html = `<h5>Resultados de Predicción para ${matricula}</h5><div class="table-responsive"><table class="table table-sm">
                    <thead><tr><th>Curso</th><th>Prob. Reprob.</th><th>Cal. Estimada</th><th>Riesgo</th></tr></thead><tbody>`;
                data.forEach(pred => {
                    const riesgoBadge = pred.riesgo_academico === 'ALTO' ? 'bg-danger' : pred.riesgo_academico === 'MEDIO' ? 'bg-warning' : 'bg-success';
                    html += `<tr>
                        <td>${pred.curso || 'N/A'}</td>
                        <td>${(pred.prediccion_reprobacion * 100).toFixed(1)}%</td>
                        <td>${pred.calificacion_estimada}</td>
                        <td><span class="badge ${riesgoBadge}">${pred.riesgo_academico}</span></td>
                    </tr>`;
                });
                html += '</tbody></table></div>';
                document.getElementById('prediction-result').innerHTML = `<div class="alert alert-success">${html}</div>`;
            } else {
                const riesgoBadge = data.riesgo_academico === 'ALTO' ? 'bg-danger' : data.riesgo_academico === 'MEDIO' ? 'bg-warning' : 'bg-success';
                document.getElementById('prediction-result').innerHTML = `
                    <div class="alert alert-success">
                        <h5>Predicción realizada</h5>
                        <p><strong>Alumno:</strong> ${data.alumno}</p>
                        <p><strong>Probabilidad de reprobación:</strong> ${(data.prediccion_reprobacion * 100).toFixed(1)}%</p>
                        <p><strong>Calificación estimada:</strong> ${data.calificacion_estimada}</p>
                        <p><strong>Riesgo:</strong> <span class="badge ${riesgoBadge}">${data.riesgo_academico}</span></p>
                    </div>
                `;
            }
        } else {
            showAlert(`Error: ${data.detail}`, 'danger', 'prediction-result');
        }
    } catch (error) {
        showAlert('Error al realizar predicción: ' + error.message, 'danger', 'prediction-result');
    }
});

// ============ ANÁLISIS COMPARATIVO ============
document.getElementById('btn-analisis-docente')?.addEventListener('click', async () => {
    const docente = document.getElementById('analisis-docente-select').value;
    if (!docente) {
        document.getElementById('resultado-docente').innerHTML = '<small class="text-muted">Selecciona un docente</small>';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/analisis/docente/${encodeURIComponent(docente)}`);
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('resultado-docente').innerHTML = `
                <div class="border-start border-primary border-3 ps-2">
                    <p class="mb-1"><strong>Evaluaciones:</strong> ${data.total_evaluaciones}</p>
                    <p class="mb-1"><strong>Promedio:</strong> ${data.promedio_calificaciones}</p>
                    <p class="mb-1"><strong>Tasa Aprobación:</strong> ${data.tasa_aprobacion}%</p>
                    <p class="mb-0"><strong>Cursos:</strong> ${data.cursos_impartidos?.length || 0}</p>
                </div>
            `;
            updateComparativaChart('docente', data);
        } else {
            document.getElementById('resultado-docente').innerHTML = `<small class="text-danger">${data.detail}</small>`;
        }
    } catch (error) {
        document.getElementById('resultado-docente').innerHTML = `<small class="text-danger">Error</small>`;
    }
});

document.getElementById('btn-analisis-curso')?.addEventListener('click', async () => {
    const curso = document.getElementById('analisis-curso-select').value;
    if (!curso) {
        document.getElementById('resultado-curso').innerHTML = '<small class="text-muted">Selecciona un curso</small>';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/analisis/curso/${encodeURIComponent(curso)}`);
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('resultado-curso').innerHTML = `
                <div class="border-start border-success border-3 ps-2">
                    <p class="mb-1"><strong>Evaluaciones:</strong> ${data.total_evaluaciones}</p>
                    <p class="mb-1"><strong>Promedio:</strong> ${data.promedio_calificaciones}</p>
                    <p class="mb-1"><strong>Tasa Aprobación:</strong> ${data.tasa_aprobacion}%</p>
                    <p class="mb-0"><strong>Docentes:</strong> ${data.docentes?.length || 0}</p>
                </div>
            `;
            updateComparativaChart('curso', data);
        } else {
            document.getElementById('resultado-curso').innerHTML = `<small class="text-danger">${data.detail}</small>`;
        }
    } catch (error) {
        document.getElementById('resultado-curso').innerHTML = `<small class="text-danger">Error</small>`;
    }
});

document.getElementById('btn-analisis-estudiante')?.addEventListener('click', async () => {
    const matricula = document.getElementById('analisis-estudiante-select').value;
    if (!matricula) {
        document.getElementById('resultado-estudiante').innerHTML = '<small class="text-muted">Selecciona un estudiante</small>';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/analisis/estudiante/${encodeURIComponent(matricula)}`);
        const data = await response.json();
        
        if (response.ok) {
            const riesgoBadge = data.riesgo_general === 'ALTO' ? 'bg-danger' : data.riesgo_general === 'MEDIO' ? 'bg-warning' : 'bg-success';
            document.getElementById('resultado-estudiante').innerHTML = `
                <div class="border-start border-info border-3 ps-2">
                    <p class="mb-1"><strong>Alumno:</strong> ${data.alumno}</p>
                    <p class="mb-1"><strong>Evaluaciones:</strong> ${data.total_evaluaciones}</p>
                    <p class="mb-1"><strong>Promedio:</strong> ${data.promedio_calificaciones}</p>
                    <p class="mb-1"><strong>Tasa Aprob.:</strong> ${data.tasa_aprobacion}%</p>
                    <p class="mb-0"><strong>Riesgo:</strong> <span class="badge ${riesgoBadge}">${data.riesgo_general}</span></p>
                </div>
            `;
            updateComparativaChart('estudiante', data);
        } else {
            document.getElementById('resultado-estudiante').innerHTML = `<small class="text-danger">${data.detail}</small>`;
        }
    } catch (error) {
        document.getElementById('resultado-estudiante').innerHTML = `<small class="text-danger">Error</small>`;
    }
});

// Gráfico comparativo
let comparativaChart;
let comparativaData = { docente: null, curso: null, estudiante: null };

function updateComparativaChart(tipo, data) {
    comparativaData[tipo] = data;
    
    const ctx = document.getElementById('comparativaChart');
    if (!ctx) return;
    
    if (comparativaChart) comparativaChart.destroy();
    
    const labels = [];
    const promedios = [];
    const tasas = [];
    const colors = [];
    
    if (comparativaData.docente) {
        labels.push(`Docente`);
        promedios.push(comparativaData.docente.promedio_calificaciones);
        tasas.push(comparativaData.docente.tasa_aprobacion);
        colors.push('rgba(13, 110, 253, 0.8)');
    }
    if (comparativaData.curso) {
        labels.push(`Curso`);
        promedios.push(comparativaData.curso.promedio_calificaciones);
        tasas.push(comparativaData.curso.tasa_aprobacion);
        colors.push('rgba(25, 135, 84, 0.8)');
    }
    if (comparativaData.estudiante) {
        labels.push(`Estudiante`);
        promedios.push(comparativaData.estudiante.promedio_calificaciones);
        tasas.push(comparativaData.estudiante.tasa_aprobacion);
        colors.push('rgba(13, 202, 240, 0.8)');
    }
    
    if (labels.length === 0) return;
    
    comparativaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Promedio Calificaciones',
                    data: promedios,
                    backgroundColor: colors,
                    borderWidth: 2
                },
                {
                    label: 'Tasa Aprobación (%)',
                    data: tasas,
                    backgroundColor: colors.map(c => c.replace('0.8', '0.4')),
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 3,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}

// ============ INGRESO MANUAL DE EVALUACIÓN ============
document.getElementById('form-ingreso-manual')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    params.append('matricula', document.getElementById('manual-matricula').value);
    params.append('alumno', document.getElementById('manual-alumno').value);
    params.append('calificacion', document.getElementById('manual-calificacion').value);
    
    const curso = document.getElementById('manual-curso').value;
    const docente = document.getElementById('manual-docente').value;
    const campus = document.getElementById('manual-campus').value;
    const programa = document.getElementById('manual-programa').value;
    const turno = document.getElementById('manual-turno').value;
    const modalidad = document.getElementById('manual-modalidad').value;
    const periodo = document.getElementById('manual-periodo').value;
    
    if (curso) params.append('curso', curso);
    if (docente) params.append('docente', docente);
    if (campus) params.append('campus', campus);
    if (programa) params.append('programa', programa);
    if (turno) params.append('turno', turno);
    if (modalidad) params.append('modalidad', modalidad);
    if (periodo) params.append('periodo', periodo);
    
    try {
        const response = await fetch(`${API_URL}/evaluacion-manual?${params.toString()}`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const riesgoBadge = data.riesgo_academico === 'ALTO' ? 'danger' : data.riesgo_academico === 'MEDIO' ? 'warning' : 'success';
            showAlert(
                `✅ Evaluación agregada exitosamente<br>
                <strong>ID:</strong> ${data.evaluacion_id}<br>
                <strong>Riesgo:</strong> <span class="badge bg-${riesgoBadge}">${data.riesgo_academico}</span>`,
                'success',
                'manual-result'
            );
            document.getElementById('form-ingreso-manual').reset();
            
            // Cerrar el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalIngresoManual'));
            if (modal) modal.hide();
            
            loadDashboard();
            loadEvaluaciones();
        } else {
            showAlert(`Error: ${data.detail}`, 'danger', 'manual-result');
        }
    } catch (error) {
        showAlert('Error al agregar evaluación: ' + error.message, 'danger', 'manual-result');
    }
});

function animateCounter(id, target, suffix = "") {
    let count = 0;
    const element = document.getElementById(id);
    const step = Math.ceil(target / 60);

    const interval = setInterval(() => {
        count += step;
        if (count >= target) {
            count = target;
            clearInterval(interval);
        }
        element.textContent = count + suffix;
    }, 20);
}

// Ejemplo de uso
animateCounter("total-students", 320);
animateCounter("students-at-risk", 48);
animateCounter("avg-attendance", 87, "%");
animateCounter("avg-grade", 8.4);


// Inicializar filtros de predicción al cargar
document.addEventListener('DOMContentLoaded', () => {
    setupPredictionFilters();
});