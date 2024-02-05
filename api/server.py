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

USERS = "users"
DISABILITIES = "disabilities"
SYMPTOMS = "symptoms"
ACCOMMODATIONS = "accommodations"

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
    users_ref = db.collection(USERS)
    docs = users_ref.stream()
    # create_user("Joe", "random_account")

    for doc in docs:
        print(f"{doc.id} => {doc.to_dict()}")
    return {"status": True}

def decode_token(id_token):
    decoded_token = auth.verify_id_token(id_token)
    uid = decoded_token.get('uid')
    return uid


def get_doc(input: [(str, str)]):
    """
    [(str, str)] a list of tuples where the first one is the collection name(ie. users) and the second str is the id of the document
    returns (bool, error|doc) the first value is success or fail and the second element either the document or an error message
    """
    if len(input) == 0:
        return (False, {"Error": "No data given"})
    doc = db
    for pair in input:
        doc = doc.collection(pair[0]).document(pair[1])
        if not doc.get().exists:
            return (False, {"Error": f"{pair[1]} not in {pair[0]}"})
    
    return (True, doc)


@app.post("/user")
def create_user(name: str, language: str):
    """
    Creates a new user in the Firestore database.
    """
    # Generate UUID
    ref = db.collection(USERS)
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
    result = get_doc([(USERS, uuid)])
    if result[0] is False:
        return result[1]
    user = result[1].get().to_dict()
    user.pop("uuid")
    return user


@app.put("/user")
def update_user(uuid: str, name: str = None, language: str = None, location: str = None, lastexport: str = None):
    """
    Update user attributes besides disabilities
    """
    result = get_doc([(USERS, uuid)])
    if result[0] is False:
        return result[1]
    user = result[1].get().to_dict()
    
    user["uuid"] = uuid
    if name is not None:
        user["name"] = name
    if language is not None:
        user["language"] = language
    if location is not None:
        user["location"] = location
    if lastexport is not None:
        user["lastexport"] = lastexport

    doc_ref = result[1]
    doc_ref.set(user)

#Disabilities
@app.post("/disability")
def add_disability(user_id: str, disability_id: str, name: str, description: str):
    """
    Adds a new disability to the specified user.
    """

    result = get_doc([(USERS, user_id)])
    if result[0] is False:
        return result[1]
    disability = result[1].collection(DISABILITIES).document(disability_id)
    disability.set({"id": disability_id, "name": name, "description": description, "extrainfo": ""})

    # Return disability_id
    return disability_id

@app.get("/disability")
def get_disabilities(user_id: str):
    """
    Gets all of the disabilities of the specified user.
    """
    disabilities = dict()
    result = get_doc([(USERS, user_id)])
    if result[0] is False:
        return result[1]
    disability_ref = result[1].collection(DISABILITIES)
    for disability in disability_ref.stream():
        disabilities[disability.id] = disability_ref.document(disability.id).get().to_dict()

    return disabilities

@app.put("/disability")
def update_disabilites(user_id: str, disability_id: str, name: str = None, description: str = None, extrainfo: str = None):
    """
    Updates disability of the specified user.
    """
    # Add disability and populate with specified data
    user = db.collection(USERS).document(user_id)
    if user == {"error": "user does not exist"}:
        return {"error": "user does not exist"}

    doc_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id)])
    if doc_ref[0] is False:
        return doc_ref[1]
    
    doc_ref = doc_ref[1]
    # if not doc_ref.exists():
    #     return {"error": "disability does not exist"}

    disability = doc_ref.get().to_dict()

    if name is not None:
        disability["name"] = name
    if description is not None:
        disability["description"] = description
    if extrainfo is not None:
        disability["extrainfo"] = extrainfo

    doc_ref.set(disability)

@app.delete("/disability")
def delete_disability(user_id: str, disability_id: str):
    doc_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id)])
    if doc_ref[0] is False:
        return doc_ref[1]
    
    doc_ref[1].delete()
    return {"success": f"deleted {disability_id}"}


#Symptoms
@app.post("/symptom")
def add_symptom(user_id: str, disability_id: str, symptom_id: str, name: str, description: str):
    """
    Adds a new symptom to the specified user and disability.
    """
    # Add disability and populate with specified data
    user = db.collection(USERS).document(user_id)
    if user == {"error": "user does not exist"}:
        return {"error": "user does not exist"}

    doc_ref = user.collection(DISABILITIES).document(disability_id).collection(SYMPTOMS).document(symptom_id)
    doc_ref.set({"id": symptom_id, "name": name, "description": description})

    return symptom_id

@app.get("/symptom")
def get_symptom(user_id: str, disability_id: str):
    """
    Gets all of the symptom of the specified user and disability.
    """
    disabilities = dict()
    disability_ref = db.collection(USERS).document(user_id).collection(DISABILITIES).document(disability_id).collection(SYMPTOMS)
    for disability in disability_ref.stream():
        disabilities[disability.id] = disability_ref.document(disability.id).get().to_dict()

    return disabilities

@app.put("/symptom")
def update_symptom(user_id: str, disability_id: str, symptom_id:str, name: str = None, description: str = None):
    """
    Updates disability of the specified user.
    """
    # Update symptom data
    user = db.collection(USERS).document(user_id)
    if user == {"error": "user does not exist"}:
        return {"error": "user does not exist"}

    doc_ref = user.collection(DISABILITIES).document(disability_id).collection(SYMPTOMS).document(symptom_id)
    # if not doc_ref.exists():
    #     return {"error": "disability does not exist"}

    symptom = doc_ref.get().to_dict()

    if name is not None:
        symptom["name"] = name
    if description is not None:
        symptom["description"] = description

    doc_ref.set(symptom)

@app.delete("/symptom")
def delete_symptom(user_id: str, disability_id: str, symptom_id: str):
    """
    Deletes the syptom from the disability
    """
    user = db.collection(USERS).document(user_id)
    if user == {"error": "user does not exist"}:
        return {"error": "user does not exist"}

    doc_ref = user.collection(DISABILITIES).document(disability_id).collection(SYMPTOMS).document(symptom_id)
    doc_ref.delete()
    return {"success": f"deleted {disability_id}"}



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

