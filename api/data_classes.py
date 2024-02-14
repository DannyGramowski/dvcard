from pydantic import BaseModel

class Accommodation(BaseModel):
    id: str
    name: str
    description: str

    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description

class Symptom(BaseModel):
    id: str
    name: str
    description: str

    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description

class Disabilities(BaseModel):
    id: str
    name: str
    description: str
    accommodations: list[Accommodation]
    symptoms: list[Symptom]
    extra_info: str

    def __init__(self, id, name, description, extra_info):
        self.id = id
        self.name = name
        self.description = description
        self.extra_info = extra_info

class User(BaseModel):
    id: str | None = None
    name: str | None = None
    language: str | None = None
    location: str | None = None
    accommodations: list[Accommodation] | None = None
    symptoms: list[Symptom] | None = None
    extrainfo: str | None = None
    publicprofile: bool | None = None
    lastexport: str | None = None

    # def __init__(self, id, name, language="EN", location="US", accommodations=None, symptoms=None, extrainfo=""):
    #     self.id = id
    #     self.name = name
    #     self.language = language
    #     self.location = location
    #     self.accommodations = accommodations
    #     self.symptoms = symptoms
    #     self.extrainfo = extrainfo


class Testimonial(BaseModel):
    from_name: str
    description: str
    relationship: str
    #need uuid for post but dont store in database
    
