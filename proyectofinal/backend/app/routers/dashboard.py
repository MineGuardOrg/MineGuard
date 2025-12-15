from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.student import Student

router = APIRouter()

@router.get("/dashboard/variables")
async def get_dashboard_variables(db: Session = Depends(get_db)):
    """
    Obtener estadísticas y variables para el dashboard
    """
    # Contar estudiantes totales
    total_students = db.query(func.count(Student.id)).scalar()
    
    # Contar estudiantes en riesgo (predicción > 0.5)
    students_at_risk = db.query(func.count(Student.id)).filter(
        Student.prediccion_reprobacion > 0.5
    ).scalar()
    
    # Promedio de asistencia
    avg_asistencia = db.query(func.avg(Student.asistencia)).scalar()
    
    # Promedio de calificaciones
    avg_calificacion = db.query(func.avg(Student.calificacion_actual)).scalar()
    
    # Distribución por género
    gender_distribution = db.query(
        Student.genero,
        func.count(Student.id)
    ).group_by(Student.genero).all()
    
    # Estudiantes que reprobaron
    failed_students = db.query(func.count(Student.id)).filter(
        Student.reprobo == 1
    ).scalar()
    
    return {
        "total_estudiantes": total_students or 0,
        "estudiantes_en_riesgo": students_at_risk or 0,
        "promedio_asistencia": round(avg_asistencia, 2) if avg_asistencia else 0,
        "promedio_calificacion": round(avg_calificacion, 2) if avg_calificacion else 0,
        "estudiantes_reprobados": failed_students or 0,
        "distribucion_genero": [
            {"genero": g, "cantidad": c} for g, c in gender_distribution
        ] if gender_distribution else []
    }
