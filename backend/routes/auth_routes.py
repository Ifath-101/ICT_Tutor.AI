from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from auth.security import create_access_token, hash_password, verify_password
from database.database import get_db
from database.models import User

router = APIRouter()


class AuthBody(BaseModel):
    name: str | None = None
    email: str
    password: str


@router.post("/register")
def register(body: AuthBody, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == body.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(body.password)

    new_user = User(
        name=body.name,
        email=body.email,
        password_hash=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


@router.post("/login")
def login(body: AuthBody, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }