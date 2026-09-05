import hashlib
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import User
from app.schemas.schemas import UserCreate, UserResponse, Token
from jose import jwt

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = "SUPER_SECRET_LANDSLIDE_EARLY_WARNING_KEY"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user_in.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pwd = hash_password(user_in.password)
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pwd,
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login_user(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user_in.username).first()
    if not db_user or db_user.hashed_password != hash_password(user_in.password):
        # Convenience fallback for demo quick login
        if user_in.username == "admin" and user_in.password in ["admin", "admin123"]:
            db_user = db.query(User).filter(User.role == "admin").first()
        elif user_in.username == "citizen" and user_in.password in ["citizen", "citizen123"]:
            db_user = db.query(User).filter(User.role == "citizen").first()
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": db_user.username, "role": db_user.role, "id": db_user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": db_user
    }
