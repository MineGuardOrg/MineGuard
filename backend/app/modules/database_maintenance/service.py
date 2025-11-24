import os
import pymysql
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from app.shared.exceptions import DatabaseError

# Cargar variables de entorno
load_dotenv()


class DatabaseMaintenanceService:
    """Servicio para mantenimiento de base de datos usando pymysql"""
    
    def __init__(self):
        self.db_user = os.getenv("DB_USER")
        self.db_password = os.getenv("DB_PASSWORD")
        self.db_host = os.getenv("DB_HOST")
        self.db_port = int(os.getenv("DB_PORT", "3306"))
        self.db_name = os.getenv("DB_NAME")
        self.db_ssl_cert = os.getenv("DB_SSL_CERT")
        
        # Ruta donde se guardarán los backups
        self.backup_dir = Path(__file__).resolve().parents[3] / "sql"
        self.backup_dir.mkdir(exist_ok=True)
    
    def _get_connection(self):
        """Crear conexión a MySQL con soporte SSL para Azure"""
        ssl_config = None
        if self.db_ssl_cert and os.path.exists(self.db_ssl_cert):
            ssl_config = {"ca": self.db_ssl_cert}
        elif self.db_host and "mysql.database.azure.com" in self.db_host:
            # Para Azure, habilitar SSL sin certificado específico
            ssl_config = {"check_hostname": False}
        
        return pymysql.connect(
            host=self.db_host,
            port=self.db_port,
            user=self.db_user,
            password=self.db_password,
            database=self.db_name,
            charset='utf8mb4',
            ssl=ssl_config,
            cursorclass=pymysql.cursors.Cursor
        )
    
    def _escape_string(self, value):
        """Escapar valores para SQL de forma segura"""
        if value is None:
            return 'NULL'
        elif isinstance(value, (int, float)):
            return str(value)
        elif isinstance(value, bytes):
            return f"0x{value.hex()}"
        else:
            # Escapar comillas y caracteres especiales
            escaped = str(value).replace('\\', '\\\\').replace("'", "\\'")
            return f"'{escaped}'"
    
    def create_backup(self) -> dict:
        """
        Crea un backup completo de la base de datos MySQL
        Retorna información sobre el backup creado
        """
        connection = None
        try:
            # Generar nombre del archivo con fecha
            backup_date = datetime.now()
            filename = f"backup_{backup_date.strftime('%Y%m%d_%H%M%S')}.sql"
            backup_path = self.backup_dir / filename
            
            # Conectar a la base de datos
            connection = self._get_connection()
            cursor = connection.cursor()
            
            # Abrir archivo para escribir backup
            with open(backup_path, 'w', encoding='utf-8') as backup_file:
                # Encabezado del backup
                backup_file.write(f"-- MineGuard Database Backup\n")
                backup_file.write(f"-- Database: {self.db_name}\n")
                backup_file.write(f"-- Date: {backup_date.strftime('%Y-%m-%d')}\n")
                backup_file.write(f"-- Host: {self.db_host}\n")
                backup_file.write(f"--\n\n")
                backup_file.write("SET NAMES utf8mb4;\n")
                backup_file.write("SET FOREIGN_KEY_CHECKS = 0;\n\n")
                
                # Obtener todas las tablas
                cursor.execute("SHOW TABLES")
                tables = [table[0] for table in cursor.fetchall()]
                
                for table in tables:
                    backup_file.write(f"\n-- ----------------------------\n")
                    backup_file.write(f"-- Table structure for {table}\n")
                    backup_file.write(f"-- ----------------------------\n")
                    backup_file.write(f"DROP TABLE IF EXISTS `{table}`;\n")
                    
                    # Obtener estructura de la tabla
                    cursor.execute(f"SHOW CREATE TABLE `{table}`")
                    create_table = cursor.fetchone()[1]
                    backup_file.write(f"{create_table};\n\n")
                    
                    # Obtener datos de la tabla
                    backup_file.write(f"-- ----------------------------\n")
                    backup_file.write(f"-- Records of {table}\n")
                    backup_file.write(f"-- ----------------------------\n")
                    
                    cursor.execute(f"SELECT * FROM `{table}`")
                    rows = cursor.fetchall()
                    
                    if rows:
                        # Obtener nombres de columnas
                        cursor.execute(f"SHOW COLUMNS FROM `{table}`")
                        columns = [col[0] for col in cursor.fetchall()]
                        column_list = ', '.join([f"`{col}`" for col in columns])
                        
                        # Insertar datos en lotes de 100 registros
                        batch_size = 100
                        for i in range(0, len(rows), batch_size):
                            batch = rows[i:i + batch_size]
                            values_list = []
                            
                            for row in batch:
                                values = ', '.join([self._escape_string(value) for value in row])
                                values_list.append(f"({values})")
                            
                            insert_statement = f"INSERT INTO `{table}` ({column_list}) VALUES\n"
                            insert_statement += ',\n'.join(values_list)
                            insert_statement += ';\n'
                            backup_file.write(insert_statement)
                    
                    backup_file.write('\n')
                
                # Obtener y respaldar stored procedures
                cursor.execute("SHOW PROCEDURE STATUS WHERE Db = %s", (self.db_name,))
                procedures = cursor.fetchall()
                
                if procedures:
                    backup_file.write(f"\n-- ----------------------------\n")
                    backup_file.write(f"-- Procedures\n")
                    backup_file.write(f"-- ----------------------------\n")
                    
                    for proc in procedures:
                        proc_name = proc[1]
                        cursor.execute(f"SHOW CREATE PROCEDURE `{proc_name}`")
                        result = cursor.fetchone()
                        if result:
                            backup_file.write(f"DROP PROCEDURE IF EXISTS `{proc_name}`;\n")
                            backup_file.write(f"DELIMITER ;;\n")
                            backup_file.write(f"{result[2]};;\n")
                            backup_file.write(f"DELIMITER ;\n\n")
                
                # Obtener y respaldar functions
                cursor.execute("SHOW FUNCTION STATUS WHERE Db = %s", (self.db_name,))
                functions = cursor.fetchall()
                
                if functions:
                    backup_file.write(f"\n-- ----------------------------\n")
                    backup_file.write(f"-- Functions\n")
                    backup_file.write(f"-- ----------------------------\n")
                    
                    for func in functions:
                        func_name = func[1]
                        cursor.execute(f"SHOW CREATE FUNCTION `{func_name}`")
                        result = cursor.fetchone()
                        if result:
                            backup_file.write(f"DROP FUNCTION IF EXISTS `{func_name}`;\n")
                            backup_file.write(f"DELIMITER ;;\n")
                            backup_file.write(f"{result[2]};;\n")
                            backup_file.write(f"DELIMITER ;\n\n")
                
                # Restaurar configuración
                backup_file.write("\nSET FOREIGN_KEY_CHECKS = 1;\n")
            
            cursor.close()
            
            # Obtener tamaño del archivo
            file_size_bytes = backup_path.stat().st_size
            file_size_mb = round(file_size_bytes / (1024 * 1024), 2)
            
            return {
                "success": True,
                "message": "Backup creado exitosamente",
                "backup_file": filename,
                "backup_date": backup_date,
                "file_size_mb": file_size_mb
            }
            
        except pymysql.Error as e:
            raise DatabaseError(f"Error de base de datos al crear backup: {str(e)}")
        except Exception as e:
            raise DatabaseError(f"Error inesperado al crear backup: {str(e)}")
        finally:
            if connection:
                connection.close()
