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

// Load dashboard statistics
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard/variables`);
        const data = await response.json();
        
        document.getElementById('total-students').textContent = data.total_estudiantes;
        document.getElementById('students-at-risk').textContent = data.estudiantes_en_riesgo;
        document.getElementById('avg-attendance').textContent = data.promedio_asistencia + '%';
        document.getElementById('avg-grade').textContent = data.promedio_calificacion;
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showAlert('Error al cargar el dashboard', 'danger');
    }
}

// Upload dataset
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('dataset-file');
    const file = fileInput.files[0];
    
    if (!file) {
        showAlert('Por favor seleccione un archivo', 'warning', 'upload-result');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch(`${API_URL}/upload-dataset`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert(
                `✅ ${data.message}<br>Estudiantes agregados: ${data.students_added}`,
                'success',
                'upload-result'
            );
            loadDashboard();
            loadStudents();
        } else {
            showAlert(`❌ Error: ${data.detail}`, 'danger', 'upload-result');
        }
    } catch (error) {
        console.error('Error uploading dataset:', error);
        showAlert('Error al subir el archivo', 'danger', 'upload-result');
    }
});

// Train models
document.getElementById('train-models-btn').addEventListener('click', async () => {
    const btn = document.getElementById('train-models-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Entrenando...';
    
    try {
        const response = await fetch(`${API_URL}/train`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok && data.message) {
            const resultHTML = `
                <div class="alert alert-success">
                    <strong>✅ ${data.message}</strong><br>
                    <strong>Clasificación:</strong> Accuracy = ${data.clasificacion.accuracy}<br>
                    <strong>Regresión:</strong> R² = ${data.regresion.r2_score}<br>
                    Total registros: ${data.total_records}
                </div>
            `;
            document.getElementById('train-result').innerHTML = resultHTML;
        } else {
            showAlert(`❌ ${data.error || data.detail}`, 'danger', 'train-result');
        }
    } catch (error) {
        console.error('Error training models:', error);
        showAlert('Error al entrenar los modelos', 'danger', 'train-result');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-gear-fill"></i> Entrenar Modelos';
    }
});

// Load students
async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/students`);
        const students = await response.json();
        
        const tbody = document.getElementById('students-tbody');
        const select = document.getElementById('student-id-select');
        
        tbody.innerHTML = '';
        select.innerHTML = '<option value="">-- Seleccione un estudiante --</option>';
        
        students.forEach(student => {
            // Table row
            const row = `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.nombre}</td>
                    <td>${student.edad || 'N/A'}</td>
                    <td>${student.genero || 'N/A'}</td>
                    <td>${student.asistencia || 'N/A'}%</td>
                    <td>${student.promedio_anterior || 'N/A'}</td>
                    <td>
                        ${student.prediccion_reprobacion !== null 
                            ? (student.prediccion_reprobacion > 0.5 
                                ? '<span class="badge bg-danger">En riesgo</span>' 
                                : '<span class="badge bg-success">Sin riesgo</span>')
                            : '<span class="badge bg-secondary">Sin predecir</span>'}
                    </td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
            
            // Select option
            select.innerHTML += `<option value="${student.id}">${student.nombre} (ID: ${student.id})</option>`;
        });
    } catch (error) {
        console.error('Error loading students:', error);
        showAlert('Error al cargar estudiantes', 'danger');
    }
}

// Add student
document.getElementById('save-student-btn').addEventListener('click', async () => {
    const studentData = {
        nombre: document.getElementById('student-name').value,
        edad: parseInt(document.getElementById('student-age').value) || null,
        genero: document.getElementById('student-gender').value || null,
        promedio_anterior: parseFloat(document.getElementById('student-prev-avg').value) || null,
        asistencia: parseFloat(document.getElementById('student-attendance').value) || null,
        horas_estudio: parseFloat(document.getElementById('student-study-hours').value) || null,
        participacion: parseFloat(document.getElementById('student-participation').value) || null
    };
    
    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        
        if (response.ok) {
            showAlert('Estudiante agregado exitosamente', 'success');
            document.getElementById('add-student-form').reset();
            bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
            loadStudents();
            loadDashboard();
        } else {
            const error = await response.json();
            showAlert(`Error: ${error.detail}`, 'danger');
        }
    } catch (error) {
        console.error('Error adding student:', error);
        showAlert('Error al agregar estudiante', 'danger');
    }
});

// Delete student
async function deleteStudent(id) {
    if (!confirm('¿Está seguro de eliminar este estudiante?')) return;
    
    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Estudiante eliminado exitosamente', 'success');
            loadStudents();
            loadDashboard();
        } else {
            showAlert('Error al eliminar estudiante', 'danger');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showAlert('Error al eliminar estudiante', 'danger');
    }
}

// Make prediction
document.getElementById('prediction-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const studentId = document.getElementById('student-id-select').value;
    
    if (!studentId) {
        showAlert('Por favor seleccione un estudiante', 'warning', 'prediction-result');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ student_id: parseInt(studentId) })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const resultHTML = `
                <div class="alert alert-${data.estado === 'En riesgo' ? 'danger' : 'success'}">
                    <h4>Resultados de Predicción</h4>
                    <p><strong>Estudiante:</strong> ${data.nombre}</p>
                    <p><strong>Probabilidad de Reprobación:</strong> ${(data.prediccion_reprobacion * 100).toFixed(2)}%</p>
                    <p><strong>Calificación Estimada:</strong> ${data.calificacion_estimada}</p>
                    <p><strong>Estado:</strong> <span class="badge bg-${data.estado === 'En riesgo' ? 'danger' : 'success'}">${data.estado}</span></p>
                </div>
            `;
            document.getElementById('prediction-result').innerHTML = resultHTML;
            loadStudents(); // Refresh to show updated prediction
        } else {
            showAlert(`Error: ${data.detail}`, 'danger', 'prediction-result');
        }
    } catch (error) {
        console.error('Error making prediction:', error);
        showAlert('Error al realizar la predicción', 'danger', 'prediction-result');
    }
});

// Refresh students button
document.getElementById('refresh-students-btn').addEventListener('click', () => {
    loadStudents();
    loadDashboard();
});

// Load initial data
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    loadStudents();
});
