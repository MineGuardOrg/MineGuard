# Endpoints de roles
from fastapi import APIRouter, HTTPException
from app.application.role_service import RoleService
from app.domain.schemas.role_schema import RoleSchema

role_router = APIRouter()

@role_router.get("/", response_model=list[RoleSchema])
def get_all_roles():
    return RoleService.get_all_roles()

@role_router.get("/{role_id}", response_model=RoleSchema)
def get_role(role_id: int):
    role = RoleService.get_role_by_id(role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return role

@role_router.post("/", response_model=RoleSchema)
def create_role(role: RoleSchema):
    role_dict = role.dict(exclude_unset=True)
    new_role = RoleService.create_role(role_dict)
    return new_role

@role_router.delete("/{role_id}")
def delete_role(role_id: int):
    result = RoleService.soft_delete_role(role_id)
    if not result:
        raise HTTPException(status_code=404, detail="Rol no encontrado o ya eliminado")
    return {"message": "Rol eliminado (soft delete)"}
