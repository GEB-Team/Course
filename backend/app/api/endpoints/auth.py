import uuid
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_

from app.db.database import get_db
from app.models.models import User, RoleEnum, RefreshToken, LoginHistory
from app.schemas.schemas import UserCreate, UserResponse, Token, LoginRequest, GoogleLoginRequest
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.core.config import settings
from app.services.google_auth import verify_google_token

router = APIRouter()

def record_login_history(db: AsyncSession, user_id: str, request: Request):
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    history = LoginHistory(user_id=user_id, ip_address=ip_address, user_agent=user_agent)
    db.add(history)

@router.post("/register", response_model=UserResponse)
async def register_employee(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    query = select(User).where(or_(User.email == user_in.email, User.username == user_in.username))
    result = await db.execute(query)
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email or username already exists",
        )
    
    # Create new user
    db_user = User(
        role=RoleEnum.EMPLOYEE,
        full_name=user_in.full_name,
        username=user_in.username,
        email=user_in.email,
        phone_number=user_in.phone_number,
        password_hash=get_password_hash(user_in.password) if user_in.password else None,
        applicant_type=user_in.applicant_type,
        experience_years=user_in.experience_years,
        experience_months=user_in.experience_months,
        group=user_in.group,
        sub_category=user_in.sub_category,
        residence_number=user_in.residence_number,
        residence_expiry_date=user_in.residence_expiry_date
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    # Send confirmation email (mock for now)
    print(f"Mock: Sending confirmation email to {db_user.email}")
    
    return db_user

@router.post("/login/manual", response_model=Token)
async def login_manual(request: Request, login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == login_data.email)
    result = await db.execute(query)
    user = result.scalars().first()
    
    if not user or not user.password_hash:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    # Save refresh token to db
    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(db_token)
    
    record_login_history(db, user.id, request)
    await db.commit()
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/login/google", response_model=Token)
async def login_google(request: Request, login_data: GoogleLoginRequest, db: AsyncSession = Depends(get_db)):
    # Verify Google token
    idinfo = verify_google_token(login_data.credential)
    if not idinfo:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")
    
    email = idinfo.get('email')
    
    # Check if user exists
    query = select(User).where(User.email == email)
    result = await db.execute(query)
    user = result.scalars().first()
    
    if not user:
        # User not found - return a specific status to redirect to registration (for employees)
        # We can throw a 404 with a specific message that the frontend will catch
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail={
                "message": "User not found, redirect to registration", 
                "email": email,
                "name": idinfo.get('name'),
                "picture": idinfo.get('picture')
            }
        )
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

    # Generate tokens
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    # Save refresh token
    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(db_token)
    
    record_login_history(db, user.id, request)
    await db.commit()
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    # Check if refresh token exists and is valid
    query = select(RefreshToken).where(RefreshToken.token == refresh_token, RefreshToken.is_revoked == False)
    result = await db.execute(query)
    db_token = result.scalars().first()
    
    if not db_token or db_token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")
        
    access_token = create_access_token(subject=db_token.user_id)
    # Rotate refresh token
    new_refresh_token = create_refresh_token(subject=db_token.user_id)
    
    db_token.is_revoked = True
    new_db_token = RefreshToken(
        user_id=db_token.user_id,
        token=new_refresh_token,
        expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    db.add(new_db_token)
    await db.commit()
    
    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}
