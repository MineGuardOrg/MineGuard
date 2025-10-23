"""
Script para probar la conexión a la base de datos
Ejecutar desde el directorio backend: python test_db_connection.py
"""
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from urllib.parse import quote_plus
import os
import sys

# Cargar variables de entorno
load_dotenv()

def test_connection():
    """Prueba la conexión a la base de datos"""
    
    # Leer configuración
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME")
    DB_SSL_CERT = os.getenv("DB_SSL_CERT")
    
    # Verificar que exista el certificado SSL
    if DB_SSL_CERT and os.path.exists(DB_SSL_CERT):
        connect_args = {
            "ssl": {
                "ssl_ca": DB_SSL_CERT
            }
        }
    else:
        connect_args = {}
    
    # Codificar la contraseña para URL (maneja caracteres especiales)
    encoded_password = quote_plus(DB_PASSWORD)
    
    # Construir URL de conexión con contraseña codificada
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            echo=False,
            connect_args=connect_args
        )
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1 as test"))
            row = result.fetchone()
            
            if row and row[0] == 1:
                print("Conexion exitosa")
                return True
            else:
                print("Error en la conexion")
                return False
                
    except Exception as e:
        print(f"Error: {str(e)}")
        return False
    finally:
        if 'engine' in locals():
            engine.dispose()

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
