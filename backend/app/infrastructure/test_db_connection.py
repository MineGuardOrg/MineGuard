from database import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("✅ Conexión exitosa a la base de datos.")
except Exception as e:
    print(f"❌ Error de conexión: {e}")
