import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Configurar semilla para reproducibilidad
np.random.seed(42)
random.seed(42)

# Leer dataset original - leer primero en latin1 y convertir específicamente
with open('DataSet_Academico.txt', 'r', encoding='latin1') as f:
    contenido = f.read()

# Reemplazos específicos de palabras completas (más seguro que caracteres individuales)
reemplazos = {
    'INVESTIGACIÃ\x93N': 'INVESTIGACIÓN',
    'ADMINISTRACIÃ\x93N': 'ADMINISTRACIÓN',  
    'SIMULACIÃ\x93N': 'SIMULACIÓN',
    'INNOVACIÃ\x93N': 'INNOVACIÓN',
    'MATEMÃ\x81TICAS': 'MATEMÁTICAS',
    'INGENIERÃ\x8DA': 'INGENIERÍA',
    'MECÃ\x81NICA': 'MECÁNICA',
    'BÃ\x81SICA': 'BÁSICA'
}

for mal, bien in reemplazos.items():
    contenido = contenido.replace(mal, bien)

# Ahora parsear el contenido corregido
from io import StringIO
df_original = pd.read_csv(StringIO(contenido), sep='\t')

# Extraer valores únicos del dataset original corregido
cursos_unicos = df_original['Curso'].unique().tolist()
docentes_unicos = df_original['Docente'].unique().tolist()
campus_unicos = df_original['Campus'].unique().tolist()
programas_unicos = df_original['Programa'].unique().tolist()
turnos = ['Matutino', 'Vespertino']
modalidades = ['PRESENCIAL', 'VIRTUAL', 'SEMIPRESENCIAL']
etapas_formativas = ['BÁSICA', 'PROFESIONAL', 'TERMINAL']
tipos_asignatura = ['OBLIGATORIA', 'OPTATIVA']
estados_alumno = ['REGULAR', 'IRREGULAR', 'EGRESADO']
bloques = ['Bloque 1', 'Bloque 2', 'Bloque 1 y 2']

# Nombres para generar alumnos
nombres = ['JUAN', 'MARÍA', 'PEDRO', 'LUCÍA', 'CARLOS', 'ANA', 'LUIS', 'SOFÍA', 'MIGUEL', 'ELENA',
           'JORGE', 'CARMEN', 'ROBERTO', 'ISABEL', 'FRANCISCO', 'LAURA', 'ANTONIO', 'ROSA', 'JOSÉ', 'MARTHA',
           'FERNANDO', 'GABRIELA', 'RICARDO', 'PATRICIA', 'ALBERTO', 'DANIELA', 'MAURICIO', 'ANDREA', 'EDUARDO', 'VALERIA',
           'ARTURO', 'ALEJANDRA', 'SERGIO', 'CAROLINA', 'DAVID', 'MONICA', 'RAÚL', 'JULIA', 'OSCAR', 'BEATRIZ',
           'GERMÁN', 'MARISOL', 'ALVARO', 'NAYELI', 'ISAAC', 'ESTELA', 'MARIANO', 'ALONSO', 'ARMANDO', 'ISABELA']

apellidos = ['GARCÍA', 'RODRÍGUEZ', 'MARTÍNEZ', 'LÓPEZ', 'GONZÁLEZ', 'HERNÁNDEZ', 'PÉREZ', 'SÁNCHEZ', 'RAMÍREZ', 'TORRES',
             'FLORES', 'RIVERA', 'GÓMEZ', 'DÍAZ', 'CRUZ', 'MORALES', 'REYES', 'JIMÉNEZ', 'HERRERA', 'MEDINA',
             'CASTILLO', 'ORTIZ', 'NÚÑEZ', 'MENDOZA', 'GUZMÁN', 'RAMOS', 'ÁVILA', 'VARGAS', 'ROJAS', 'SALAZAR',
             'ESPINOZA', 'SANTOS', 'CORAZA', 'QUINTANILLA', 'VELÁSQUEZ', 'ROLÓN', 'IBARRA', 'BERRÍOS', 'VALVERDE',
             'OLIVÁREZ', 'TORO', 'SAMANIEGO', 'ARREOLA', 'ALFARO', 'ECHEVERRÍA', 'TOLEDO', 'JAIMES', 'MATA', 'ROQUE', 'SEGARRA']

# Función para generar nombre completo
def generar_nombre_completo():
    return f"{random.choice(nombres)} {random.choice(apellidos)} {random.choice(apellidos)}"

# Función para generar matrícula
def generar_matricula(year=None):
    if year is None:
        year = random.randint(19, 23)
    numero = random.randint(593, 9999)
    return f"MRIX{year}{numero:04d}"

# Función para generar calificación con distribución realista
def generar_calificacion():
    # 70% aprobados (>= 7), 30% reprobados (< 7)
    if random.random() < 0.7:
        # Aprobados: distribución normal centrada en 8.5
        calif = np.random.normal(8.5, 0.8)
        return round(min(10, max(7.0, calif)), 1)
    else:
        # Reprobados: distribución uniforme entre 5 y 6.9
        return round(random.uniform(5.0, 6.9), 1)

# Función para determinar estado basado en calificación
def determinar_estado_evaluacion(calificacion):
    return "ACREDITADA" if calificacion >= 7.0 else "NO ACREDITADA"

# Función para generar fechas
def generar_fecha_aleatoria(inicio='2023-01-01', fin='2025-12-31'):
    inicio_dt = datetime.strptime(inicio, '%Y-%m-%d')
    fin_dt = datetime.strptime(fin, '%Y-%m-%d')
    delta = (fin_dt - inicio_dt).days
    fecha_random = inicio_dt + timedelta(days=random.randint(0, delta))
    return fecha_random.strftime('%m/%d/%Y')

# Generar datos sintéticos
num_registros = 500
datos_sinteticos = []

for i in range(num_registros):
    # Generar calificación primero (determina otros campos)
    calificacion = generar_calificacion()
    estado_evaluacion = determinar_estado_evaluacion(calificacion)
    
    # Generar otros campos
    curso = random.choice(cursos_unicos)
    docente = random.choice(docentes_unicos)
    alumno = generar_nombre_completo()
    matricula = generar_matricula()
    campus = random.choice(campus_unicos)
    programa = random.choice(programas_unicos)
    turno = random.choice(turnos)
    modalidad = random.choice(modalidades)
    etapa_formativa = random.choice(etapas_formativas)
    tipo_asignatura = random.choice(tipos_asignatura)
    estado_alumno = random.choice(estados_alumno)
    bloque = random.choice(bloques)
    
    # Campos derivados
    edo_eval = 'A' if estado_evaluacion == 'ACREDITADA' else 'NA'
    edo_al = random.choice(['AC', 'RE', 'EG'])
    tipo_eval = random.choice(['ORD', 'EXT'])
    creditos = random.choice([5, 6, 7, 10])
    numero_periodo = random.randint(1, 10)
    orden = random.randint(0, 2)
    
    # Generar periodo (formato MM/DD/YYYY)
    periodo = generar_fecha_aleatoria('2023-01-01', '2025-12-31')
    fecha_registro = generar_fecha_aleatoria('2023-01-01', '2025-12-31')
    f_carga_aca = generar_fecha_aleatoria('2023-01-01', '2025-12-31')
    
    # Crear registro
    registro = {
        'NoCurso': 15000 + i,
        'Curso': curso,
        'Docente': docente,
        'Clave Oficial': f"INIM-{random.randint(200000, 210000)}",
        'Matricula': matricula,
        'Alumno': alumno,
        'Calificacion': calificacion,
        'Edo Eval': edo_eval,
        'Edo Al': edo_al,
        'Tipo Eval': tipo_eval,
        'Fecha Registro': fecha_registro,
        'Tipo Entrega': 'ORDINARIA',
        'Registró Acta': docente,
        'Grupo': f"{random.randint(1, 99):02d}IIS{random.randint(100, 999)}",
        'Turno': turno,
        'Modalidad': modalidad,
        'Periodo': periodo,
        'Programa': programa,
        'Creditos': creditos,
        'Nombre Ofical': curso,
        'Plan Estudio Periodo': f"CUATRIMESTRE {random.randint(1, 10)}",
        'Numero Periodo': numero_periodo,
        'Etapa Formativa': etapa_formativa,
        'Tipo Asignatura': tipo_asignatura,
        'Orden': orden,
        'Estado Evaluacion': estado_evaluacion,
        'Periodo Actual': f"CUATRIMESTRE {random.randint(1, 10)}",
        'Estado Alumno': estado_alumno,
        'Campus': campus,
        'Bloque': bloque,
        'Tipo Evaluacion': 'ORDINARIA',
        'F.Carga Aca': f_carga_aca
    }
    
    datos_sinteticos.append(registro)

# Crear DataFrame
df_sintetico = pd.DataFrame(datos_sinteticos)

# Guardar en archivo TXT con codificación UTF-8
output_file = 'DataSet_Academico_Sintetico.txt'
df_sintetico.to_csv(output_file, sep='\t', index=False, encoding='utf-8')

print(f"✅ Generados {num_registros} registros sintéticos en '{output_file}'")
print(f"\n Estadísticas del dataset sintético:")
print(f"- Total registros: {len(df_sintetico)}")
print(f"- Calificación promedio: {df_sintetico['Calificacion'].mean():.2f}")
print(f"- Calificación mínima: {df_sintetico['Calificacion'].min()}")
print(f"- Calificación máxima: {df_sintetico['Calificacion'].max()}")
print(f"- Evaluaciones acreditadas: {(df_sintetico['Estado Evaluacion'] == 'ACREDITADA').sum()} ({(df_sintetico['Estado Evaluacion'] == 'ACREDITADA').sum() / len(df_sintetico) * 100:.1f}%)")
print(f"- Evaluaciones no acreditadas: {(df_sintetico['Estado Evaluacion'] == 'NO ACREDITADA').sum()} ({(df_sintetico['Estado Evaluacion'] == 'NO ACREDITADA').sum() / len(df_sintetico) * 100:.1f}%)")
print(f"\n Campus incluidos: {', '.join(df_sintetico['Campus'].unique())}")
print(f" Programas incluidos: {', '.join(df_sintetico['Programa'].unique())}")
print(f" Docentes incluidos: {len(df_sintetico['Docente'].unique())} docentes")
print(f" Cursos incluidos: {len(df_sintetico['Curso'].unique())} cursos")
