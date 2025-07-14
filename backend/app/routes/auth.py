from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schema import UserCreate, UserLogin, UserOut
from app.models.user_model import UserInDB
from app.database import db
from app.utils.auth import get_password_hash, verify_password, create_access_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from bson import ObjectId
from pprint import pprint

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")



@router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    user_dict = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password
    }

    result = await db["users"].insert_one(user_dict)

    # ✅ Add these lines for debugging
    print("Inserted ID:", result.inserted_id)
    inserted = await db["users"].find_one({"_id": result.inserted_id})
    pprint(inserted)

    return UserOut(
        id=str(result.inserted_id),
        username=user.username,
        email=user.email
    )

@router.post("/login")
async def login(user: UserLogin):
    db_user = await db["users"].find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(db_user["_id"])})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def get_me(token: str = Depends(oauth2_scheme)):
    from jose import jwt, JWTError

    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY", "yournote-secret-key"), algorithms=["HS256"])
        user_id = payload.get("sub")
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserOut(id=str(user["_id"]), username=user["username"], email=user["email"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")