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

            # Subconsulta: usuarios que tienen al menos una lectura con valores válidos
            users_with_readings_sq = (
                db.query(Reading.user_id.distinct())
                .filter(
                    Reading.pulse.isnot(None),
                    Reading.body_temp.isnot(None)
                )
                .subquery()
            )

            q = (
                db.query(
                    User.id.label('user_id'),
                    User.first_name,
                    User.last_name,
                    User.employee_number,
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
                    or_(Area.id == None, Area.is_active == True),
                    User.id.in_(users_with_readings_sq)
                )
            )

            rows = q.all()

            for r in rows:
                # Obtener la última lectura con valores válidos del dispositivo para el usuario
                last_reading = (
                    db.query(Reading)
                    .filter(
                        Reading.user_id == r.user_id,
                        Reading.device_id == r.device_id,
                        Reading.pulse.isnot(None),
                        Reading.body_temp.isnot(None)
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
                    'numeroEmpleado': r.employee_number,
                    'area': r.area_name,
                    'ritmoCardiaco': ritmo_cardiaco,
                    'temperaturaCorporal': temperatura_corporal,
                    'nivelBateria': r.battery,
                    'tiempoActivo_ts': r.conn_ts,
                    'cascoId': r.device_id,
                })

        return results

    def get_active_workers_by_supervisor(self, supervisor_id: int) -> List[Dict[str, Any]]:
        """Trabajadores activos filtrados por supervisor_id con métricas recientes."""
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

            # Subconsulta: usuarios que tienen al menos una lectura con valores válidos
            users_with_readings_sq = (
                db.query(Reading.user_id.distinct())
                .filter(
                    Reading.pulse.isnot(None),
                    Reading.body_temp.isnot(None)
                )
                .subquery()
            )

            q = (
                db.query(
                    User.id.label('user_id'),
                    User.first_name,
                    User.last_name,
                    User.employee_number,
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
                    User.supervisor_id == supervisor_id,
                    User.is_active == True,
                    Device.is_active == True,
                    Connection.status == 'online',
                    or_(Area.id == None, Area.is_active == True),
                    User.id.in_(users_with_readings_sq)
                )
            )

            rows = q.all()

            for r in rows:
                # Obtener la última lectura con valores válidos del dispositivo para el usuario
                last_reading = (
                    db.query(Reading)
                    .filter(
                        Reading.user_id == r.user_id,
                        Reading.device_id == r.device_id,
                        Reading.pulse.isnot(None),
                        Reading.body_temp.isnot(None)
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
                    'numeroEmpleado': r.employee_number,
                    'area': r.area_name,
                    'ritmoCardiaco': ritmo_cardiaco,
                    'temperaturaCorporal': temperatura_corporal,
                    'nivelBateria': r.battery,
                    'tiempoActivo_ts': r.conn_ts,
                    'cascoId': r.device_id,
                })

        return results

    def get_critical_alerts_stats(self) -> Dict[str, int]:
        """Obtiene estadísticas de alertas críticas y de alta severidad de las últimas 24h."""
        from datetime import datetime, timedelta, timezone
        from app.modules.alert.models import Alert
        
        with SessionLocal() as db:
            now = datetime.now(timezone.utc)
            last_24h = now - timedelta(hours=24)
            
            # Contar alertas críticas y de alta severidad de las últimas 24h
            critical_count = (
                db.query(Alert)
                .filter(
                    Alert.severity.in_(['critical', 'high']),
                    Alert.timestamp >= last_24h
                )
                .count()
            )
            
            # Contar todas las alertas de las últimas 24h
            total_last_24h = (
                db.query(Alert)
                .filter(Alert.timestamp >= last_24h)
                .count()
            )
            
            return {
                'critical_count': critical_count,
                'total_last_24h': total_last_24h
            }

    def get_device_stats(self) -> Dict[str, any]:
        """Obtiene estadísticas de dispositivos activos y totales."""
        from app.modules.device.models import Device
        
        with SessionLocal() as db:
            # Total de dispositivos activos en el sistema
            total_devices = (
                db.query(Device)
                .filter(Device.is_active == True)
                .count()
            )
            
            # Dispositivos actualmente conectados (desde active_workers)
            active_devices_count = len(self.get_active_workers())
            
            # Calcular porcentaje de conexión
            connection_rate = round((active_devices_count / total_devices * 100), 2) if total_devices > 0 else 0.0
            
            return {
                'active_devices': active_devices_count,
                'total_devices': total_devices,
                'connection_rate': connection_rate
            }

    def get_risk_level(self) -> Dict[str, any]:
        """Calcula el nivel de riesgo basado en alertas críticas de las últimas 24h."""
        from datetime import datetime, timedelta, timezone
        from app.modules.alert.models import Alert
        from app.modules.users.models import User
        from app.modules.area.models import Area
        from sqlalchemy import distinct
        
        with SessionLocal() as db:
            now = datetime.now(timezone.utc)
            last_24h = now - timedelta(hours=24)
            
            # Contar alertas críticas y high de las últimas 24h
            critical_alerts_count = (
                db.query(Alert)
                .filter(
                    Alert.severity.in_(['critical', 'high']),
                    Alert.timestamp >= last_24h
                )
                .count()
            )
            
            # Contar áreas únicas afectadas por alertas críticas/high
            affected_areas = (
                db.query(distinct(User.area_id))
                .join(Alert, Alert.user_id == User.id)
                .filter(
                    Alert.severity.in_(['critical', 'high']),
                    Alert.timestamp >= last_24h,
                    User.area_id.isnot(None)
                )
                .all()
            )
            affected_areas_count = len(affected_areas)
            
            # Calcular nivel de riesgo
            if critical_alerts_count == 0:
                risk_level = 'low'
                recommendation = 'Sistema operando normalmente'
            elif critical_alerts_count <= 2:
                risk_level = 'low'
                recommendation = f'{affected_areas_count} área(s) con alertas menores'
            elif critical_alerts_count <= 5:
                risk_level = 'medium'
                recommendation = f'{affected_areas_count} área(s) requieren atención'
            elif critical_alerts_count <= 10:
                risk_level = 'high'
                recommendation = f'{affected_areas_count} área(s) requieren atención urgente'
            else:
                risk_level = 'critical'
                recommendation = f'Situación crítica en {affected_areas_count} área(s)'
            
            return {
                'risk_level': risk_level,
                'critical_alerts_count': critical_alerts_count,
                'affected_areas_count': affected_areas_count,
                'recommendation': recommendation
            }

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

    def get_alerts_by_type_weekly(self) -> Dict[str, any]:
        """Cuenta alertas de las últimas 4 semanas por categorías, agrupadas por semana."""
        from datetime import datetime, timedelta, timezone
        from app.modules.alert.models import Alert
        
        now = datetime.now(timezone.utc)
        
        # Aliases por categoría
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
            def count_for_week(aliases: List[str], week_start: datetime, week_end: datetime) -> int:
                return db.query(func.count(Alert.id)).filter(
                    Alert.timestamp >= week_start,
                    Alert.timestamp < week_end,
                    func.lower(Alert.alert_type).in_([a.lower() for a in aliases])
                ).scalar() or 0

            # Calcular rangos de 4 semanas (28 días hacia atrás)
            weeks = []
            gases_data = []
            hr_data = []
            temp_data = []
            impact_data = []
            
            for i in range(4):
                week_end = now - timedelta(days=i*7)
                week_start = week_end - timedelta(days=7)
                weeks.insert(0, f'Semana {4-i}')
                
                gases_data.insert(0, count_for_week(gases_aliases, week_start, week_end))
                hr_data.insert(0, count_for_week(hr_aliases, week_start, week_end))
                temp_data.insert(0, count_for_week(temp_aliases, week_start, week_end))
                impact_data.insert(0, count_for_week(impact_aliases, week_start, week_end))

            return {
                'labels': weeks,
                'gasesToxicos': gases_data,
                'ritmoCardiacoAnormal': hr_data,
                'temperaturaCorporalAlta': temp_data,
                'caidasImpactos': impact_data
            }

    def get_biometrics_avg_by_area(self, days: int = 30) -> List[Dict[str, Any]]:
        """Promedios de ritmo cardiaco y temperatura corporal por área en el rango indicado (máximo 4 áreas)."""
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
                .order_by(func.count(Reading.id).desc())  # Ordenar por cantidad de lecturas
                .limit(4)  # Limitar a 4 áreas
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
                .order_by(func.count(Reading.id).desc())  # Ordenar por cantidad de lecturas
                .limit(4)  # Limitar a 4 áreas
                .all()
            )

            # Combinar resultados por área
            hr_map = {r.area_name: float(r.hr_avg) for r in hr_rows if r.hr_avg is not None}
            temp_map = {r.area_name: float(r.temp_avg) for r in temp_rows if r.temp_avg is not None}

            # Áreas presentes en cualquiera de los dos mapas (máximo 4)
            all_areas = sorted(set(hr_map.keys()) | set(temp_map.keys()))[:4]

            results: List[Dict[str, Any]] = []
            for area in all_areas:
                results.append({
                    'area': area,
                    'hr_avg': hr_map.get(area),
                    'temp_avg': temp_map.get(area)
                })

            return results

    def get_biometrics_avg_by_area_by_supervisor(self, supervisor_id: int, days: int = 30) -> List[Dict[str, Any]]:
        """Promedios de ritmo cardiaco y temperatura corporal por área filtrados por supervisor."""
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
                    User.supervisor_id == supervisor_id,
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
                    User.supervisor_id == supervisor_id,
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
                    Alert.message.label('mensaje'),
                    Alert.reading_id.label('reading_id'),
                    Alert.user_id.label('user_id'),
                    func.concat(User.first_name, ' ', User.last_name).label('trabajador'),
                    Area.name.label('area'),
                    Alert.severity.label('severidad'),
                    Alert.timestamp.label('timestamp'),
                    Connection.status.label('estado'),
                    Device.id.label('device_id'),
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
                    'user_id': r.user_id,
                    'area': r.area,
                    'severidad': r.severidad,
                    'timestamp': r.timestamp,
                    'estado': r.estado,
                    'device_id': r.device_id,
                    'reading_id': r.reading_id,
                    'valor': valor,
                    'mensaje': r.mensaje  # Usar el mensaje de la tabla alert
                })

            return results

    def get_recent_alerts_by_supervisor(self, supervisor_id: int, days: int = 7, limit: int = 20) -> List[Dict[str, Any]]:
        """Obtiene alertas recientes filtradas por supervisor_id."""
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
                    Alert.message.label('mensaje'),
                    Alert.reading_id.label('reading_id'),
                    Alert.user_id.label('user_id'),
                    func.concat(User.first_name, ' ', User.last_name).label('trabajador'),
                    Area.name.label('area'),
                    Alert.severity.label('severidad'),
                    Alert.timestamp.label('timestamp'),
                    Connection.status.label('estado'),
                    Device.id.label('device_id'),
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
                    User.supervisor_id == supervisor_id,
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
                    'valor': valor,
                    'mensaje': r.mensaje,  # Usar el mensaje de la tabla alert
                    'user_id': r.user_id,
                    'device_id': r.device_id,
                    'reading_id': r.reading_id
                })

            return results

    def get_supervisor_area_biometrics(self, supervisor_id: int, days: int = 30) -> Dict[str, Any]:
        """Obtiene promedios biométricos del área del supervisor."""
        from datetime import datetime, timedelta, timezone
        start_ts = datetime.now(timezone.utc) - timedelta(days=days)

        with SessionLocal() as db:
            # Primero obtener el área del supervisor
            supervisor = db.query(User).filter(User.id == supervisor_id).first()
            if not supervisor or not supervisor.area_id:
                return None

            # Calcular promedios para el área del supervisor
            result = (
                db.query(
                    Area.name.label('area'),
                    func.avg(Reading.pulse).label('hr_avg'),
                    func.avg(Reading.body_temp).label('temp_avg'),
                    func.count(func.distinct(User.id)).label('worker_count')
                )
                .join(User, User.area_id == Area.id)
                .join(Reading, Reading.user_id == User.id)
                .filter(
                    Area.id == supervisor.area_id,
                    Area.is_active == True,
                    User.is_active == True,
                    Reading.timestamp >= start_ts,
                    Reading.pulse.isnot(None),
                    Reading.body_temp.isnot(None)
                )
                .group_by(Area.name)
                .first()
            )

            if not result:
                return None

            return {
                'area': result.area,
                'hr_avg': float(result.hr_avg) if result.hr_avg else 0.0,
                'temp_avg': float(result.temp_avg) if result.temp_avg else 0.0,
                'worker_count': result.worker_count or 0
            }

    def get_incidents_by_supervisor(self, supervisor_id: int, days: int = 30, limit: int = 50) -> List[Dict[str, Any]]:
        """Obtiene incidentes de usuarios a cargo del supervisor."""
        from datetime import datetime, timedelta, timezone
        from app.modules.incident_report.models import IncidentReport
        
        start_ts = datetime.now(timezone.utc) - timedelta(days=days)

        with SessionLocal() as db:
            q = (
                db.query(
                    IncidentReport.id.label('id'),
                    IncidentReport.description.label('description'),
                    IncidentReport.severity.label('severity'),
                    func.concat(User.first_name, ' ', User.last_name).label('user_full_name'),
                    User.employee_number.label('user_employee_number'),
                    Area.name.label('area'),
                    IncidentReport.created_at.label('created_at'),
                    Reading.timestamp.label('reading_timestamp')
                )
                .join(User, User.id == IncidentReport.user_id)
                .outerjoin(Area, Area.id == User.area_id)
                .outerjoin(Reading, Reading.id == IncidentReport.reading_id)
                .filter(
                    User.supervisor_id == supervisor_id,
                    IncidentReport.created_at >= start_ts,
                    User.is_active == True
                )
                .order_by(IncidentReport.created_at.desc())
                .limit(limit)
            )

            rows = q.all()
            results: List[Dict[str, Any]] = []
            for r in rows:
                results.append({
                    'id': r.id,
                    'description': r.description,
                    'severity': r.severity,
                    'user_full_name': r.user_full_name,
                    'user_employee_number': r.user_employee_number,
                    'area': r.area,
                    'created_at': r.created_at,
                    'reading_timestamp': r.reading_timestamp
                })

            return results
