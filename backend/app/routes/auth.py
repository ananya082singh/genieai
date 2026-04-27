from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.schemas import UserRegister, UserLogin, Token, User
from app.utils.auth import verify_password, get_password_hash, create_access_token, verify_token
from app.utils.user_store import create_user, get_user_by_email, user_exists

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    if user_exists(user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    user = create_user(
        email=user_data.email,
        hashed_password=hashed_password,
        name=user_data.name,
        branch=user_data.branch
    )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    email = payload.get("sub")
    user = get_user_by_email(email)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        branch=user.get("branch")
    )