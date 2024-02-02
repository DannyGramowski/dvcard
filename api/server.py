from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import secrets

# Use a service account.
# NOTE: This needs to be updated for production (google cloud / kubernetes) hosting.
cred = credentials.Certificate('gcloud_key.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

app = FastAPI(docs_url=None, redoc_url=None)

@app.get("/")
def test():
    users_ref = db.collection("users")
    docs = users_ref.stream()
    create_user("Joe", "random_account")

    for doc in docs:
        print(f"{doc.id} => {doc.to_dict()}")
    return {"status": True}


def create_user(name, account):
    """
    Creates a new user in the Firestore database.
    """
    # Generate UUID
    ref = db.collection("users")
    uuid = generate_uuid_from_ref(ref)

    # Add user and populate with starter data
    doc_ref = ref.document(uuid)
    doc_ref.set({"uuid": uuid, "name": name, "account": account, "language": None, "location": None, "photo": None, "lastexport": None})
    
    # Return UUID
    return uuid

def add_disability(user_id, disability_id, name, description):
    """
    Adds a new disability to the specified user.
    """
    # Add disability and populate with specified data
    doc_ref = db.collection("users").document(user_id).collection("disabilities").document(disability_id)
    doc_ref.set({"id": disability_id, "name": name, "description": description})

    # Return disability_id
    return disability_id

def generate_uuid_from_ref(ref):
    """
    Generates a unique UUID based on the current DB reference.
    Guaranteed not to overlap any existing id's.
    """
    uuid = None

    while True:
        uuid = secrets.token_urlsafe(10)
        docs = ref.stream()

        for doc in docs:
            if str(doc.id) == uuid:
                found = True
        if not found:
            break

    return uuid
