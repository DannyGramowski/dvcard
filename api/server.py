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
TESTIMONIALS = "testimonials"

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
    doc_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id)])
    if doc_ref[0] is False:
        return doc_ref[1]
    
    doc_ref = doc_ref[1]

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


    doc_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id)]) #user.collection(DISABILITIES).document(disability_id).collection(SYMPTOMS).document(symptom_id)
    if doc_ref[0] is False:
        return doc_ref[1]
    doc_ref = doc_ref[1].collection(SYMPTOMS).document(symptom_id)
    doc_ref.set({"id": symptom_id, "name": name, "description": description})

    return symptom_id

@app.get("/symptom")
def get_symptom(user_id: str, disability_id: str):
    """
    Gets all of the symptom of the specified user and disability.
    """
    symptoms = dict()
    disability_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id)])
    if disability_ref[0] is False:
        return disability_ref[1]
    
    symptom_ref = disability_ref[1].collection(SYMPTOMS)
    for symptom in symptom_ref.stream():
        symptoms[symptom.id] = symptom_ref.document(symptom.id).get().to_dict()

    return symptoms

@app.put("/symptom")
def update_symptom(user_id: str, disability_id: str, symptom_id:str, name: str = None, description: str = None):
    """
    Updates disability of the specified user.
    """
    doc_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id), (SYMPTOMS, symptom_id)])
    if doc_ref[0] is False:
        return doc_ref[1]
    symptom = doc_ref[1].get().to_dict()
    if name is not None:
        symptom["name"] = name
    if description is not None:
        symptom["description"] = description

    doc_ref[1].set(symptom)

@app.delete("/symptom")
def delete_symptom(user_id: str, disability_id: str, symptom_id: str):
    """
    Deletes the syptom from the disability
    """

    doc_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id), (SYMPTOMS, symptom_id)])
    if doc_ref[0] is False:
        return doc_ref[1]
    doc_ref[1].delete()
    return {"success": f"deleted {disability_id}"}


#Accommodation
@app.post("/accommodation")
def add_accommodation(user_id: str, disability_id: str, accommodation_id: str, name: str, description: str):
    """
    Adds a new accommodation to the specified user and disability.
    """

    doc_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id)])
    if doc_ref[0] is False:
        return doc_ref[1]
    doc_ref = doc_ref[1].collection(ACCOMMODATIONS).document(accommodation_id)
    doc_ref.set({"id": accommodation_id, "name": name, "description": description})

    return accommodation_id

@app.get("/accommodation")
def get_accommodation(user_id: str, disability_id: str):
    """
    Gets all of the symptom of the specified user and disability.
    """
    accommodations = dict()
    disability_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id)])
    if disability_ref[0] is False:
        return disability_ref[1]
    
    accommodation_ref = disability_ref[1].collection(ACCOMMODATIONS)
    for accommodation in accommodation_ref.stream():
        accommodations[accommodation.id] = accommodation_ref.document(accommodation.id).get().to_dict()

    return accommodations

@app.put("/accommodation")
def update_symptom(user_id: str, disability_id: str, accommodation_id:str, name: str = None, description: str = None):
    """
    Updates disability of the specified user.
    """
    doc_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id), (ACCOMMODATIONS, accommodation_id)])
    if doc_ref[0] is False:
        return doc_ref[1]
    accommodation = doc_ref[1].get().to_dict()
    if name is not None:
        accommodation["name"] = name
    if description is not None:
        accommodation["description"] = description

    doc_ref[1].set(accommodation)

@app.delete("/accommodation")
def delete_accommodation(user_id: str, disability_id: str, accommodation_id: str):
    """
    Deletes the accommodation from the disability
    """

    doc_ref = get_doc([(USERS, user_id), (DISABILITIES, disability_id), (ACCOMMODATIONS, accommodation_id)])
    if doc_ref[0] is False:
        return doc_ref[1]
    doc_ref[1].delete()
    return {"success": f"deleted {disability_id}"}


def get_testimonial_id(user_id: str):
    """
    Returns the next largest number since testimonials will be ordered sequentially
    """
    doc_ref = get_doc([(USERS, user_id)])[1].collection(TESTIMONIALS)
    num = -1
    for testimonial in doc_ref.stream():
        num = max(int(testimonial.id), num)
    return num + 1

#Testimonials
@app.post("/testimonial")
def add_testimonial(user_to_id: str, from_name: str, description: str, relationship: str): # date?
        doc_ref = get_doc([(USERS, user_to_id)])
        if doc_ref[0] is False:
            return doc_ref[1]
        
        testimonial_id = get_testimonial_id(user_to_id)
        print("testimonial id", testimonial_id)
        doc_ref = doc_ref[1].collection(TESTIMONIALS).document(str(testimonial_id))
        doc_ref.set({"id": testimonial_id, "fromname": from_name, "description": description, "relationship": relationship})

@app.get("/testimonial")
def get_testimonial(user_id: str):
    testimonials = dict()
    doc_ref = get_doc([(USERS, user_id)])
    if doc_ref[0] is False:
        return doc_ref[1]
    
    testimonial_ref = doc_ref[1].collection(TESTIMONIALS)
    for testimonial in testimonial_ref.stream():
        testimonials[testimonial.id] = testimonial_ref.document(testimonial.id).get().to_dict()

    return testimonials

def get_profile(user_id: str):
    pass


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

