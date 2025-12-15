from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
from app.database import get_db
from app.models.student import Student
from io import BytesIO

router = APIRouter()

@router.post("/upload-dataset")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Subir un archivo CSV o Excel con datos de estudiantes
    """
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(
            status_code=400,
            detail="Formato de archivo no soportado. Use CSV o Excel"
        )
    
    try:
        # Leer el archivo
        contents = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(contents))
        else:
            df = pd.read_excel(BytesIO(contents))
        
        # Validar columnas requeridas
        required_columns = ['nombre']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Columnas faltantes: {missing_columns}"
            )
        
        # Insertar estudiantes en la base de datos
        students_added = 0
        for _, row in df.iterrows():
            student_data = {
                'nombre': row.get('nombre'),
                'edad': row.get('edad'),
                'genero': row.get('genero'),
                'promedio_anterior': row.get('promedio_anterior'),
                'asistencia': row.get('asistencia'),
                'horas_estudio': row.get('horas_estudio'),
                'participacion': row.get('participacion'),
                'calificacion_actual': row.get('calificacion_actual'),
                'reprobo': row.get('reprobo')
            }
            
            # Eliminar valores NaN
            student_data = {k: v for k, v in student_data.items() if pd.notna(v)}
            
            db_student = Student(**student_data)
            db.add(db_student)
            students_added += 1
        
        db.commit()
        
        return {
            "message": "Dataset cargado exitosamente",
            "students_added": students_added,
            "total_rows": len(df)
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error procesando el archivo: {str(e)}"
        )
