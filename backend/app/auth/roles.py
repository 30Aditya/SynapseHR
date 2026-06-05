from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.auth.jwt_handler import decode_token

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = decode_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return payload

def require_role(required_role: str):

    def role_checker(
        user=Depends(get_current_user)
    ):

        if user["role"] != required_role:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        return user

    return role_checker