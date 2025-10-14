import logging
from fastapi import HTTPException, status
from app.domain.schemas.user_schema import UserCreateSchema, UserRegisterSchema, UserSchema
from app.domain.entities.user import User
from app.infrastructure.dao.user_dao import UserDAO
from app.core.security import get_password_hash, verify_password, create_access_token

logger = logging.getLogger(__name__)

class AuthService:
    
    @staticmethod
    def register(user_in: UserRegisterSchema) -> UserSchema:
        """Registra un nuevo usuario con contraseña hasheada"""
        
        # Verificar que el employee_number no esté duplicado
        existing_user = UserDAO.get_by_employee_number(user_in.employee_number)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El número de empleado ya está registrado"
            )
        
        # Verificar que el email no esté duplicado
        existing_email = UserDAO.get_by_email(user_in.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El email ya está registrado"
            )
        
        # Hashear la contraseña
        hashed_password = get_password_hash(user_in.password)
        
        # Crear datos del usuario con contraseña hasheada
        user_data = user_in.dict()
        user_data["password"] = hashed_password
        
        # Si no se proporciona role_id, usar "User" por defecto (id=2)
        if user_data.get("role_id") is None:
            user_data["role_id"] = 2
            logger.info(f"🔹 Role asignado por defecto: User (id=2) para employee: {user_data['employee_number']}")
        
        # Convertir 0 a None para campos opcionales (foreign keys nullable)
        optional_fields = ["area_id", "position_id", "supervisor_id"]
        for field in optional_fields:
            if user_data.get(field) == 0 or user_data.get(field) is None:
                user_data[field] = None
        
        # Crear usuario en la base de datos
        created_user = UserDAO.create(user_data)
        
        # Log de éxito
        logger.info(f"✅ Usuario registrado exitosamente - Employee: {created_user.employee_number}")
        
        # Convertir a UserSchema (sin incluir password)
        return UserSchema.from_orm(created_user)
    
    @staticmethod
    def authenticate(employee_number: str, password: str) -> User:
        """Autentica un usuario por employee_number y password"""
        
        # Buscar usuario por employee_number
        user = UserDAO.get_by_employee_number(employee_number)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        # Verificar contraseña
        if not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        # Log de login exitoso
        logger.info(f"✅ Login exitoso - Employee: {user.employee_number}")
        
        return user
    
    @staticmethod
    def create_token(user: User) -> dict:
        """Crea un JWT token para el usuario autenticado"""
        
        # Crear payload del token (usar user.id como sub)
        token_data = {"sub": str(user.id)}
        
        # Generar token
        access_token = create_access_token(data=token_data)
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    @staticmethod
    def logout(user: User) -> dict:
        """Cierra sesión del usuario actual"""
        
        # Log de logout
        logger.info(f"🚪 Logout exitoso - Employee: {user.employee_number}")
        
        return {
            "message": "Sesión cerrada exitosamente"
        }
