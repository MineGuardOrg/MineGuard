from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
import pandas as pd
from datetime import date
from app.database import get_db
from app.models.evaluacion import Evaluacion
from app.schemas.evaluacion import (
    EvaluacionResponse, 
    EstadisticasResponse,
    AnalisisDocenteResponse,
    AnalisisCursoResponse
)
from io import BytesIO, StringIO
from typing import List

router = APIRouter()

@router.post("/upload-dataset-academico")
async def upload_dataset_academico(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Cargar el dataset académico completo con todas las variables institucionales
    """
    if not file.filename.endswith(('.csv', '.xlsx', '.xls', '.txt')):
        raise HTTPException(
            status_code=400,
            detail="Formato no soportado. Use CSV, Excel o TXT (separado por tabulaciones)"
        )
    
    try:
        contents = await file.read()
        
        # Leer según el formato
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(contents))
        elif file.filename.endswith('.txt'):
            # Dataset separado por tabulaciones
            df = pd.read_csv(StringIO(contents.decode('utf-8')), sep='\t')
        else:
            df = pd.read_excel(BytesIO(contents))
        
        # Validar columnas esenciales
        required_columns = ['Matricula', 'Alumno', 'Calificacion']
        missing = [col for col in required_columns if col not in df.columns]
        if missing:
            raise HTTPException(
                status_code=400,
                detail=f"Columnas faltantes: {missing}"
            )
        
        fecha_hoy = date.today()
        
        # Obtener las matrículas del dataset a subir
        matriculas_dataset = df['Matricula'].astype(str).unique().tolist()
        
        # Eliminar solo registros que tengan la misma matrícula Y la misma fecha de carga
        # Esto permite que los datos ingresados manualmente persistan
        registros_eliminados = db.query(Evaluacion).filter(
            Evaluacion.matricula.in_(matriculas_dataset),
            Evaluacion.fecha_carga == fecha_hoy
        ).delete(synchronize_session='fetch')
        db.commit()
        
        evaluaciones_added = 0
        
        for _, row in df.iterrows():
            # Calcular reprobo (1 si calificación < 7, 0 si >= 7)
            calificacion = float(row.get('Calificacion', 0))
            reprobo = 1 if calificacion < 7 else 0
            
            # Calcular riesgo académico
            if calificacion >= 8:
                riesgo = "BAJO"
            elif calificacion >= 7:
                riesgo = "MEDIO"
            else:
                riesgo = "ALTO"
            
            evaluacion_data = {
                'no_curso': int(row['NoCurso']) if pd.notna(row.get('NoCurso')) else None,
                'curso': str(row['Curso']) if pd.notna(row.get('Curso')) else None,
                'nombre_oficial': str(row['Nombre Ofical']) if pd.notna(row.get('Nombre Ofical')) else None,
                'clave_oficial': str(row['Clave Oficial']) if pd.notna(row.get('Clave Oficial')) else None,
                'docente': str(row['Docente']) if pd.notna(row.get('Docente')) else None,
                'matricula': str(row['Matricula']),
                'alumno': str(row['Alumno']),
                'calificacion': calificacion,
                'edo_eval': str(row['Edo Eval']) if pd.notna(row.get('Edo Eval')) else None,
                'edo_al': str(row['Edo Al']) if pd.notna(row.get('Edo Al')) else None,
                'tipo_eval': str(row['Tipo Eval']) if pd.notna(row.get('Tipo Eval')) else None,
                'estado_evaluacion': str(row['Estado Evaluacion']) if pd.notna(row.get('Estado Evaluacion')) else None,
                'tipo_evaluacion': str(row['Tipo Evaluacion']) if pd.notna(row.get('Tipo Evaluacion')) else None,
                'fecha_registro': str(row['Fecha Registro']) if pd.notna(row.get('Fecha Registro')) else None,
                'f_carga_aca': str(row['F.Carga Aca']) if pd.notna(row.get('F.Carga Aca')) else None,
                'tipo_entrega': str(row['Tipo Entrega']) if pd.notna(row.get('Tipo Entrega')) else None,
                'registro_acta': str(row['Registró Acta']) if pd.notna(row.get('Registró Acta')) else None,
                'grupo': str(row['Grupo']) if pd.notna(row.get('Grupo')) else None,
                'turno': str(row['Turno']) if pd.notna(row.get('Turno')) else None,
                'modalidad': str(row['Modalidad']) if pd.notna(row.get('Modalidad')) else None,
                'periodo': str(row['Periodo']) if pd.notna(row.get('Periodo')) else None,
                'periodo_actual': str(row['Periodo Actual']) if pd.notna(row.get('Periodo Actual')) else None,
                'numero_periodo': int(row['Numero Periodo']) if pd.notna(row.get('Numero Periodo')) else None,
                'programa': str(row['Programa']) if pd.notna(row.get('Programa')) else None,
                'plan_estudio_periodo': str(row['Plan Estudio Periodo']) if pd.notna(row.get('Plan Estudio Periodo')) else None,
                'creditos': int(row['Creditos']) if pd.notna(row.get('Creditos')) else None,
                'etapa_formativa': str(row['Etapa Formativa']) if pd.notna(row.get('Etapa Formativa')) else None,
                'tipo_asignatura': str(row['Tipo Asignatura']) if pd.notna(row.get('Tipo Asignatura')) else None,
                'orden': int(row['Orden']) if pd.notna(row.get('Orden')) else None,
                'estado_alumno': str(row['Estado Alumno']) if pd.notna(row.get('Estado Alumno')) else None,
                'campus': str(row['Campus']) if pd.notna(row.get('Campus')) else None,
                'bloque': str(row['Bloque']) if pd.notna(row.get('Bloque')) else None,
                'reprobo': reprobo,
                'riesgo_academico': riesgo,
                'fecha_carga': fecha_hoy  # Agregar fecha de carga actual
            }
            
            db_evaluacion = Evaluacion(**evaluacion_data)
            db.add(db_evaluacion)
            evaluaciones_added += 1
        
        db.commit()
        
        return {
            "message": "Dataset académico cargado exitosamente",
            "evaluaciones_added": evaluaciones_added,
            "registros_eliminados": registros_eliminados,
            "fecha_carga": str(fecha_hoy),
            "total_rows": len(df),
            "columnas_detectadas": list(df.columns)
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error procesando el archivo: {str(e)}"
        )

@router.get("/evaluaciones", response_model=List[EvaluacionResponse])
async def get_evaluaciones(
    skip: int = 0,
    limit: int = 100,
    campus: str = Query(None),
    programa: str = Query(None),
    turno: str = Query(None),
    modalidad: str = Query(None),
    db: Session = Depends(get_db)
):
    """Obtener evaluaciones con filtros opcionales - solo datos del día actual"""
    fecha_hoy = date.today()
    query = db.query(Evaluacion).filter(Evaluacion.fecha_carga == fecha_hoy)
    
    if campus:
        query = query.filter(Evaluacion.campus == campus)
    if programa:
        query = query.filter(Evaluacion.programa == programa)
    if turno:
        query = query.filter(Evaluacion.turno == turno)
    if modalidad:
        query = query.filter(Evaluacion.modalidad == modalidad)
    
    evaluaciones = query.offset(skip).limit(limit).all()
    return evaluaciones

@router.get("/estadisticas", response_model=EstadisticasResponse)
async def get_estadisticas(db: Session = Depends(get_db)):
    """Obtener estadísticas generales del sistema - solo datos del día actual"""
    fecha_hoy = date.today()
    
    total_evaluaciones = db.query(func.count(Evaluacion.id)).filter(
        Evaluacion.fecha_carga == fecha_hoy
    ).scalar()
    total_estudiantes = db.query(func.count(distinct(Evaluacion.matricula))).filter(
        Evaluacion.fecha_carga == fecha_hoy
    ).scalar()
    estudiantes_riesgo = db.query(func.count(Evaluacion.id)).filter(
        Evaluacion.riesgo_academico == "ALTO",
        Evaluacion.fecha_carga == fecha_hoy
    ).scalar()
    promedio_calif = db.query(func.avg(Evaluacion.calificacion)).filter(
        Evaluacion.fecha_carga == fecha_hoy
    ).scalar()
    
    total_reprobados = db.query(func.count(Evaluacion.id)).filter(
        Evaluacion.reprobo == 1,
        Evaluacion.fecha_carga == fecha_hoy
    ).scalar()
    tasa_reprobacion = (total_reprobados / total_evaluaciones * 100) if total_evaluaciones > 0 else 0
    
    # Distribución por campus
    dist_campus = db.query(
        Evaluacion.campus,
        func.count(Evaluacion.id)
    ).filter(Evaluacion.fecha_carga == fecha_hoy).group_by(Evaluacion.campus).all()
    
    # Distribución por programa
    dist_programa = db.query(
        Evaluacion.programa,
        func.count(Evaluacion.id)
    ).filter(Evaluacion.fecha_carga == fecha_hoy).group_by(Evaluacion.programa).limit(10).all()
    
    # Distribución por turno
    dist_turno = db.query(
        Evaluacion.turno,
        func.count(Evaluacion.id)
    ).filter(Evaluacion.fecha_carga == fecha_hoy).group_by(Evaluacion.turno).all()
    
    # Distribución por modalidad
    dist_modalidad = db.query(
        Evaluacion.modalidad,
        func.count(Evaluacion.id)
    ).filter(Evaluacion.fecha_carga == fecha_hoy).group_by(Evaluacion.modalidad).all()
    
    # Top cursos con más reprobados
    top_reprobados = db.query(
        Evaluacion.curso,
        func.count(Evaluacion.id)
    ).filter(
        Evaluacion.reprobo == 1,
        Evaluacion.fecha_carga == fecha_hoy
    ).group_by(
        Evaluacion.curso
    ).order_by(func.count(Evaluacion.id).desc()).limit(10).all()
    
    return {
        "total_evaluaciones": total_evaluaciones or 0,
        "total_estudiantes_unicos": total_estudiantes or 0,
        "estudiantes_en_riesgo": estudiantes_riesgo or 0,
        "promedio_calificaciones": round(promedio_calif, 2) if promedio_calif else 0,
        "tasa_reprobacion": round(tasa_reprobacion, 2),
        "distribucion_por_campus": [{"campus": c, "cantidad": n} for c, n in dist_campus] if dist_campus else [],
        "distribucion_por_programa": [{"programa": p, "cantidad": n} for p, n in dist_programa] if dist_programa else [],
        "distribucion_por_turno": [{"turno": t, "cantidad": n} for t, n in dist_turno] if dist_turno else [],
        "distribucion_por_modalidad": [{"modalidad": m, "cantidad": n} for m, n in dist_modalidad] if dist_modalidad else [],
        "top_cursos_reprobados": [{"curso": c, "reprobados": n} for c, n in top_reprobados] if top_reprobados else []
    }

@router.get("/analisis/docente/{docente}")
async def analisis_docente(docente: str, db: Session = Depends(get_db)):
    """Análisis de rendimiento por docente - solo datos del día actual"""
    fecha_hoy = date.today()
    
    evaluaciones = db.query(Evaluacion).filter(
        Evaluacion.docente == docente,
        Evaluacion.fecha_carga == fecha_hoy
    ).all()
    
    if not evaluaciones:
        raise HTTPException(status_code=404, detail="Docente no encontrado")
    
    total = len(evaluaciones)
    promedio = sum(e.calificacion for e in evaluaciones) / total
    aprobados = sum(1 for e in evaluaciones if e.reprobo == 0)
    tasa_aprobacion = (aprobados / total * 100) if total > 0 else 0
    
    cursos = list(set(e.curso for e in evaluaciones if e.curso))
    
    return {
        "docente": docente,
        "total_evaluaciones": total,
        "promedio_calificaciones": round(promedio, 2),
        "tasa_aprobacion": round(tasa_aprobacion, 2),
        "cursos_impartidos": cursos
    }

@router.get("/analisis/curso/{curso}")
async def analisis_curso(curso: str, db: Session = Depends(get_db)):
    """Análisis de rendimiento por curso - solo datos del día actual"""
    fecha_hoy = date.today()
    
    evaluaciones = db.query(Evaluacion).filter(
        Evaluacion.curso == curso,
        Evaluacion.fecha_carga == fecha_hoy
    ).all()
    
    if not evaluaciones:
        raise HTTPException(status_code=404, detail="Curso no encontrado")
    
    total = len(evaluaciones)
    promedio = sum(e.calificacion for e in evaluaciones) / total
    aprobados = sum(1 for e in evaluaciones if e.reprobo == 0)
    tasa_aprobacion = (aprobados / total * 100) if total > 0 else 0
    
    docentes = list(set(e.docente for e in evaluaciones if e.docente))
    
    return {
        "curso": curso,
        "total_evaluaciones": total,
        "promedio_calificaciones": round(promedio, 2),
        "tasa_aprobacion": round(tasa_aprobacion, 2),
        "docentes": docentes
    }

@router.get("/analisis/estudiante/{matricula}")
async def analisis_estudiante(matricula: str, db: Session = Depends(get_db)):
    """Análisis de rendimiento por estudiante - solo datos del día actual"""
    fecha_hoy = date.today()
    
    evaluaciones = db.query(Evaluacion).filter(
        Evaluacion.matricula == matricula,
        Evaluacion.fecha_carga == fecha_hoy
    ).all()
    
    if not evaluaciones:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    total = len(evaluaciones)
    promedio = sum(e.calificacion for e in evaluaciones) / total
    aprobados = sum(1 for e in evaluaciones if e.reprobo == 0)
    tasa_aprobacion = (aprobados / total * 100) if total > 0 else 0
    
    cursos = list(set(e.curso for e in evaluaciones if e.curso))
    
    # Determinar riesgo general
    riesgo_alto = sum(1 for e in evaluaciones if e.riesgo_academico == 'ALTO')
    riesgo_general = 'ALTO' if riesgo_alto > total/2 else ('MEDIO' if riesgo_alto > 0 else 'BAJO')
    
    return {
        "matricula": matricula,
        "alumno": evaluaciones[0].alumno if evaluaciones else "",
        "total_evaluaciones": total,
        "promedio_calificaciones": round(promedio, 2),
        "tasa_aprobacion": round(tasa_aprobacion, 2),
        "cursos_inscritos": cursos,
        "riesgo_general": riesgo_general
    }

@router.post("/evaluacion-manual")
async def crear_evaluacion_manual(
    matricula: str,
    alumno: str,
    calificacion: float,
    curso: str = None,
    docente: str = None,
    campus: str = None,
    programa: str = None,
    turno: str = None,
    modalidad: str = None,
    periodo: str = None,
    db: Session = Depends(get_db)
):
    """Crear una evaluación de forma manual"""
    fecha_hoy = date.today()
    
    # Calcular reprobo y riesgo
    reprobo = 1 if calificacion < 7 else 0
    if calificacion >= 8:
        riesgo = "BAJO"
    elif calificacion >= 7:
        riesgo = "MEDIO"
    else:
        riesgo = "ALTO"
    
    evaluacion = Evaluacion(
        matricula=matricula,
        alumno=alumno,
        calificacion=calificacion,
        curso=curso,
        docente=docente,
        campus=campus,
        programa=programa,
        turno=turno,
        modalidad=modalidad,
        periodo=periodo,
        reprobo=reprobo,
        riesgo_academico=riesgo,
        fecha_carga=fecha_hoy
    )
    
    db.add(evaluacion)
    db.commit()
    db.refresh(evaluacion)
    
    return {
        "message": "Evaluación agregada exitosamente",
        "evaluacion_id": evaluacion.id,
        "riesgo_academico": riesgo
    }
