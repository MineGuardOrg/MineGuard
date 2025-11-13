"""
Factories para generar datos de prueba usando Factory Boy
"""
import factory
from faker import Faker
from app.modules.auth.models import User

fake = Faker()


class UserFactory(factory.Factory):
    """Factory para crear usuarios de prueba"""
    
    class Meta:
        model = dict  # Usar dict porque User es un modelo SQLAlchemy
    
    id = factory.Sequence(lambda n: n)
    employee_number = factory.Sequence(lambda n: f"EMP{n:03d}")
    email = factory.LazyAttribute(lambda obj: f"user{obj.id}@mineguard.com")
    password = "TestPassword123!"
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    phone = factory.Faker('phone_number')
    role_id = 1
    area_id = factory.Faker('random_int', min=1, max=5)
    position_id = factory.Faker('random_int', min=1, max=10)
    supervisor_id = None
    is_active = True
    created_at = factory.Faker('date_time_this_year')
    updated_at = factory.Faker('date_time_this_year')


class AdminUserFactory(UserFactory):
    """Factory para usuarios administradores"""
    
    role_id = 1
    first_name = "Admin"
    email = "admin@mineguard.com"


class RegularUserFactory(UserFactory):
    """Factory para usuarios regulares"""
    
    role_id = 2
    

class AreaFactory(factory.Factory):
    """Factory para áreas"""
    
    class Meta:
        model = dict
    
    id = factory.Sequence(lambda n: n)
    name = factory.Faker('word')
    description = factory.Faker('sentence')
    is_active = True


class RoleFactory(factory.Factory):
    """Factory para roles"""
    
    class Meta:
        model = dict
    
    id = factory.Sequence(lambda n: n)
    name = factory.Faker('job')
    description = factory.Faker('sentence')
    is_active = True


class DeviceFactory(factory.Factory):
    """Factory para dispositivos"""
    
    class Meta:
        model = dict
    
    id = factory.Sequence(lambda n: n)
    device_code = factory.Sequence(lambda n: f"DEV{n:03d}")
    name = factory.Faker('word')
    model = factory.Faker('word')
    manufacturer = factory.Faker('company')
    area_id = factory.Faker('random_int', min=1, max=5)
    is_active = True


# Datos de muestra predefinidos
SAMPLE_USERS = [
    {
        "employee_number": "EMP001",
        "email": "john.doe@mineguard.com", 
        "password": "TestPassword123!",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "1234567890",
        "role_id": 1
    },
    {
        "employee_number": "EMP002", 
        "email": "jane.smith@mineguard.com",
        "password": "TestPassword123!",
        "first_name": "Jane", 
        "last_name": "Smith",
        "phone": "0987654321",
        "role_id": 2
    }
]

SAMPLE_LOGIN_DATA = [
    {
        "employee_number": "EMP001",
        "password": "TestPassword123!"
    },
    {
        "employee_number": "EMP002", 
        "password": "TestPassword123!"
    }
]

SAMPLE_ROLES = [
    {"id": 1, "name": "Administrador", "description": "Acceso completo al sistema", "is_active": True},
    {"id": 2, "name": "Supervisor", "description": "Supervisor de área", "is_active": True},
    {"id": 3, "name": "Operario", "description": "Trabajador de campo", "is_active": True}
]

SAMPLE_AREAS = [
    {"id": 1, "name": "Área Norte", "description": "Zona de extracción norte", "is_active": True},
    {"id": 2, "name": "Área Sur", "description": "Zona de extracción sur", "is_active": True},
    {"id": 3, "name": "Área Central", "description": "Zona administrativa", "is_active": True}
]