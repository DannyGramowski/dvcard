from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException, Header
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware


import firebase_admin
from data_classes import Symptom, Accommodation, User
from firebase_admin import firestore, auth, credentials

import secrets
from typing import Annotated

# Use a service account.
# NOTE: This needs to be updated for production (google cloud / kubernetes) hosting.
cred = credentials.Certificate('gcloud_key.json')

fastapi_app = firebase_admin.initialize_app(cred)

db = firestore.client()

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def test():
    users_ref = db.collection("users")
    docs = users_ref.stream()
    # create_user("Joe", "random_account")

    for doc in docs:
        print(f"{doc.id} => {doc.to_dict()}")
    return {"status": True}

def decode_token(id_token):
    decoded_token = auth.verify_id_token(id_token)
    uid = decoded_token.get('uid')
    return uid


@app.post("/user")
def create_user(name: str, language: str):
    """
    Creates a new user in the Firestore database.
    """
    # Generate UUID
    ref = db.collection("users")
    uuid = generate_uuid_from_ref(ref)

    # Add user and populate with starter data
    doc_ref = ref.document(uuid)
    doc_ref.set({"uuid": uuid, "name": name, "language": language, "location": None, "photo": None, "lastexport": None})
    
    # Return UUID
    return uuid

# def get_user(Id_Token: Annotated[str | None, Header()] = None):
#     uid = decode_token(Id_Token)
#     ref = db.collection("users")
#     user_ref = ref.document(uid)

#     print(user_ref)

#     return 

# will swap over to auth when I figure that out. same for all the other ones
@app.get("/user")
def get_user(uuid: str):
    ref = db.collection("users")
    user = ref.document(uuid).get().to_dict()
    user.pop("uuid")
    return user


@app.put("/user")
def update_user(uuid: str, name: str = None, language: str = None, location: str = None, lastexport: str = None):
    user = get_user(uuid)
    user["uuid"] = uuid
    if name is not None:
        user["name"] = name
    if language is not None:
        user["language"] = language
    if location is not None:
        user["location"] = location
    if lastexport is not None:
        user["lastexport"] = lastexport

    doc_ref = db.collection("users").document(uuid)
    doc_ref.set(user)

@app.post("/disability")
#Disabilities
def add_disability(user_id, disability_id, name, description):
    """
    Adds a new disability to the specified user.
    """
    # Add disability and populate with specified data
    doc_ref = db.collection("users").document(user_id).collection("disabilities").document(disability_id)
    doc_ref.set({"id": disability_id, "name": name, "description": description})

    # Return disability_id
    return disability_id

def get_disabilities(user_id):
    """
    Gets all of the disabilities of the specified user.
    """
    doc_ref = db.collection("users").document(user_id).collection("disabilities")


def generate_uuid_from_ref(ref):
    """
    Generates a unique UUID based on the current DB reference.
    Guaranteed not to overlap any existing id's.
    """
    uuid = None
    found = False
 
    while True:
        uuid = secrets.token_urlsafe(10)
        docs = ref.stream()

        for doc in docs:
            if str(doc.id) == uuid:
                found = True
        if not found:
            break

    return uuid

def login(id_token):
    """
    Logs in a user given their UUID.
    """
    decoded_token = auth.verify_id_token(id_token)
    uid = decoded_token['uid']
    return uid

@app.get('/login')
def login_endpoint(id_token: str):
    """
    Logs in a user and returns their auth json file.
    """
    return {'result': login(id_token)}

@app.get('/authcheck')
def check_auth(id_token: Annotated[str | None, Header()] = None):
    decoded_token = auth.verify_id_token(id_token)
    uid = decoded_token.get('uid')
    return {'result': uid}



@app.get('/profile')
def profile(Id_Token: Annotated[str | None, Header()] = None):
    uid = decode_token(Id_Token)
    return {'name': uid, 'disabilities': [], 'testimonials': []}

