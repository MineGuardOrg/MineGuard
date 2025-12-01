# Repositorio del módulo Dashboard
from typing import List, Dict, Any
from sqlalchemy import func, and_, or_

from app.core.database import SessionLocal
from app.modules.auth.models import User
from app.modules.position.models import Position
from app.modules.device.models import Device
from app.modules.area.models import Area
from app.modules.connection.models import Connection
from app.modules.sensor.models import Sensor
from app.modules.reading.models import Reading
from app.modules.alert.models import Alert


class DashboardRepository:
    """Consultas especializadas para el Dashboard"""

    def get_miners_by_supervisor(self, supervisor_id: int) -> List[User]:
        """Usuarios con posición 'Minero' asignados a un supervisor específico (activos)."""
        with SessionLocal() as db:
            return (
                db.query(User)
                .join(Position, User.position_id == Position.id)
                .filter(
                    User.supervisor_id == supervisor_id,
                    User.is_active == True,
                    Position.is_active == True,
                    Position.name == 'Minero'
                )
                .order_by(User.last_name, User.first_name)
                .all()
            )

    def get_active_workers(self) -> List[Dict[str, Any]]:
        """Trabajadores activos por última conexión online del casco con métricas recientes."""
        results: List[Dict[str, Any]] = []
        with SessionLocal() as db:
            # Subconsulta: última conexión por dispositivo
            last_conn_sq = (
                db.query(
                    Connection.device_id.label('device_id'),
                    func.max(Connection.timestamp).label('max_ts')
                )
                .group_by(Connection.device_id)
                .subquery()
            )

            q = (
                db.query(
                    User.id.label('user_id'),
                    User.first_name,
                    User.last_name,
                    Area.name.label('area_name'),
                    Device.id.label('device_id'),
                    Device.battery.label('battery'),
                    Connection.status.label('conn_status'),
                    Connection.timestamp.label('conn_ts')
                )
                .join(Device, Device.user_id == User.id)
                .outerjoin(Area, Area.id == User.area_id)
                .join(last_conn_sq, last_conn_sq.c.device_id == Device.id)
                .join(Connection, and_(
                    Connection.device_id == last_conn_sq.c.device_id,
                    Connection.timestamp == last_conn_sq.c.max_ts
                ))
                .filter(
                    User.is_active == True,
                    Device.is_active == True,
                    Connection.status == 'online',
                    or_(Area.id == None, Area.is_active == True)
                )
            )

            rows = q.all()

            for r in rows:
                # Obtener la última lectura del dispositivo para el usuario
                last_reading = (
                    db.query(Reading)
                    .filter(
                        Reading.user_id == r.user_id,
                        Reading.device_id == r.device_id
                    )
                    .order_by(Reading.timestamp.desc())
                    .first()
                )

                # Extraer valores
                ritmo_cardiaco = None
                temperatura_corporal = None
                
                if last_reading:
                    ritmo_cardiaco = last_reading.pulse
                    temperatura_corporal = last_reading.body_temp

                results.append({
                    'id': r.user_id,
                    'nombre': f"{r.first_name} {r.last_name}",
                    'area': r.area_name,
                    'ritmoCardiaco': ritmo_cardiaco,
                    'temperaturaCorporal': temperatura_corporal,
                    'nivelBateria': r.battery,
                    'tiempoActivo_ts': r.conn_ts,
                    'cascoId': r.device_id,
                })

        return results

    def get_alert_counts_last_month_by_type(self) -> Dict[str, int]:
        """Cuenta alertas del último mes por categorías de dashboard."""
        from datetime import datetime, timedelta, timezone
        start_ts = datetime.now(timezone.utc) - timedelta(days=30)

        # Aliases por categoría (lowercase para comparación case-insensitive)
        gases_aliases = [
            'toxic_gas', 'toxic gas', 'gases toxicos', 'gases_toxicos', 'toxicgas'
        ]
        hr_aliases = [
            'heart_rate_anomaly', 'heart rate anomaly', 'heart_rate_high', 'heart rate high',
            'heart_rate_low', 'heart rate low', 'ritmo_cardiaco_anormal', 'ritmo cardiaco anormal'
        ]
        temp_aliases = [
            'high_body_temperature', 'body temperature high', 'temperatura_corporal_alta', 'temperatura corporal alta'
        ]
        impact_aliases = [
            'fall_detected', 'impact_detected', 'caida', 'impacto', 'caidas_impactos', 'caidas impactos'
        ]

        with SessionLocal() as db:
            def count_for(aliases: List[str]) -> int:
                return db.query(func.count(Alert.id)).filter(
                    Alert.timestamp >= start_ts,
                    func.lower(Alert.alert_type).in_([a.lower() for a in aliases])
                ).scalar() or 0

            return {
                'gasesToxicos': count_for(gases_aliases),
                'ritmoCardiacoAnormal': count_for(hr_aliases),
                'temperaturaCorporalAlta': count_for(temp_aliases),
                'caidasImpactos': count_for(impact_aliases)
            }

    def get_biometrics_avg_by_area(self, days: int = 30) -> List[Dict[str, Any]]:
        """Promedios de ritmo cardiaco y temperatura corporal por área en el rango indicado."""
        from datetime import datetime, timedelta, timezone
        start_ts = datetime.now(timezone.utc) - timedelta(days=days)

        with SessionLocal() as db:
            # Promedios de ritmo cardíaco (pulse) por área
            hr_rows = (
                db.query(
                    Area.name.label('area_name'),
                    func.avg(Reading.pulse).label('hr_avg')
                )
                .join(User, User.id == Reading.user_id)
                .join(Area, Area.id == User.area_id)
                .filter(
                    Reading.timestamp >= start_ts,
                    Reading.pulse != None,
                    User.is_active == True,
                    Area.is_active == True
                )
                .group_by(Area.name)
                .all()
            )

            # Promedios de temperatura corporal (body_temp) por área
            temp_rows = (
                db.query(
                    Area.name.label('area_name'),
                    func.avg(Reading.body_temp).label('temp_avg')
                )
                .join(User, User.id == Reading.user_id)
                .join(Area, Area.id == User.area_id)
                .filter(
                    Reading.timestamp >= start_ts,
                    Reading.body_temp != None,
                    User.is_active == True,
                    Area.is_active == True
                )
                .group_by(Area.name)
                .all()
            )

            # Combinar resultados por área
            hr_map = {r.area_name: float(r.hr_avg) for r in hr_rows if r.hr_avg is not None}
            temp_map = {r.area_name: float(r.temp_avg) for r in temp_rows if r.temp_avg is not None}

            # Áreas presentes en cualquiera de los dos mapas
            all_areas = sorted(set(hr_map.keys()) | set(temp_map.keys()))

            results: List[Dict[str, Any]] = []
            for area in all_areas:
                results.append({
                    'area': area,
                    'hr_avg': hr_map.get(area),
                    'temp_avg': temp_map.get(area)
                })

            return results

    def get_recent_alerts(self, days: int = 7, limit: int = 20) -> List[Dict[str, Any]]:
        """Obtiene alertas recientes con datos enriquecidos de trabajador, área, estado de dispositivo y valor."""
        from datetime import datetime, timedelta, timezone
        start_ts = datetime.now(timezone.utc) - timedelta(days=days)

        with SessionLocal() as db:
            # Última conexión por dispositivo (puede no existir, usamos outer join)
            last_conn_sq = (
                db.query(
                    Connection.device_id.label('device_id'),
                    func.max(Connection.timestamp).label('max_ts')
                )
                .group_by(Connection.device_id)
                .subquery()
            )

            q = (
                db.query(
                    Alert.id.label('id'),
                    Alert.alert_type.label('tipo'),
                    func.concat(User.first_name, ' ', User.last_name).label('trabajador'),
                    Area.name.label('area'),
                    Alert.severity.label('severidad'),
                    Alert.timestamp.label('timestamp'),
                    Connection.status.label('estado'),
                    Reading.pulse.label('pulse'),
                    Reading.body_temp.label('body_temp'),
                    Reading.mq7.label('mq7')
                )
                .join(Reading, Reading.id == Alert.reading_id)
                .join(User, User.id == Reading.user_id)
                .outerjoin(Area, Area.id == User.area_id)
                .join(Device, Device.user_id == User.id)
                .outerjoin(last_conn_sq, last_conn_sq.c.device_id == Device.id)
                .outerjoin(Connection, and_(
                    Connection.device_id == last_conn_sq.c.device_id,
                    Connection.timestamp == last_conn_sq.c.max_ts
                ))
                .filter(
                    Alert.timestamp >= start_ts,
                    User.is_active == True,
                    Device.is_active == True,
                    or_(Area.id == None, Area.is_active == True)
                )
                .order_by(Alert.timestamp.desc())
                .limit(limit)
            )

            rows = q.all()
            results: List[Dict[str, Any]] = []
            for r in rows:
                # Determinar el valor relevante según el tipo de alerta
                valor = None
                alert_type_lower = r.tipo.lower() if r.tipo else ''
                if 'heart' in alert_type_lower or 'cardiaco' in alert_type_lower:
                    valor = float(r.pulse) if r.pulse is not None else None
                elif 'temp' in alert_type_lower or 'temperatura' in alert_type_lower:
                    valor = float(r.body_temp) if r.body_temp is not None else None
                elif 'gas' in alert_type_lower or 'co' in alert_type_lower or 'mq7' in alert_type_lower:
                    valor = float(r.mq7) if r.mq7 is not None else None
                
                results.append({
                    'id': r.id,
                    'tipo': r.tipo,
                    'trabajador': r.trabajador,
                    'area': r.area,
                    'severidad': r.severidad,
                    'timestamp': r.timestamp,
                    'estado': r.estado,
                    'valor': valor
                })

            return results
