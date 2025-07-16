from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo
from app.routes import auth, user, note, journal, reminder
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles



load_dotenv()

app = FastAPI(title="YourNote API", version="1.0.0")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="app/static"), name="static")

# MongoDB connection
@app.on_event("startup")
async def startup_db():
    await connect_to_mongo()

@app.get("/")
def read_root():
    return {"Hello": "Welcome to YourNote API! 🚀"}

# Routes

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
#app.include_router(user.router, prefix="/api/user", tags=["User"])
app.include_router(note.router, tags=["Note"])
#app.include_router(journal.router, prefix="/api/journal", tags=["Journal"])
#app.include_router(reminder.router, prefix="/api/reminder", tags=["Reminder"])