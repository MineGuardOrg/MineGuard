"""
Script para agregar la columna fecha_carga a la tabla evaluaciones
y remover el índice único de matricula
"""
from sqlalchemy import create_engine, text
from app.database import DATABASE_URL

engine = create_engine(DATABASE_URL)

def migrate_database():
    with engine.connect() as conn:
        try:
            # 1. Remover índice único de matricula si existe
            print("Removiendo índice único de matricula...")
            try:
                conn.execute(text("ALTER TABLE evaluaciones DROP INDEX ix_evaluaciones_matricula;"))
                conn.commit()
                print("✓ Índice único removido")
            except Exception as e:
                print(f"Índice ya no existe o error: {e}")
            
            # 2. Recrear índice sin unique
            print("Creando índice no-único para matricula...")
            try:
                conn.execute(text("CREATE INDEX ix_evaluaciones_matricula ON evaluaciones(matricula);"))
                conn.commit()
                print("✓ Índice creado")
            except Exception as e:
                print(f"Índice ya existe: {e}")
            
            # 3. Agregar columna fecha_carga
            print("Agregando columna fecha_carga...")
            try:
                conn.execute(text("""
                    ALTER TABLE evaluaciones 
                    ADD COLUMN fecha_carga DATE DEFAULT CURRENT_DATE
                """))
                conn.commit()
                print("✓ Columna fecha_carga agregada")
            except Exception as e:
                print(f"Error agregando columna (puede que ya exista): {e}")
            
            # 4. Crear índice para fecha_carga
            print("Creando índice para fecha_carga...")
            try:
                conn.execute(text("CREATE INDEX ix_evaluaciones_fecha_carga ON evaluaciones(fecha_carga);"))
                conn.commit()
                print("✓ Índice para fecha_carga creado")
            except Exception as e:
                print(f"Índice ya existe: {e}")
            
            print("\n✅ Migración completada exitosamente!")
            print("Ahora puedes subir tu dataset sin problemas de duplicados.")
            
        except Exception as e:
            conn.rollback()
            print(f"\n❌ Error durante la migración: {e}")
            raise

if __name__ == "__main__":
    print("=== Iniciando migración de base de datos ===\n")
    migrate_database()
