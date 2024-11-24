import pymongo
import os
from os.path import join, dirname

from bson import ObjectId
from dotenv import load_dotenv
from bson.json_util import dumps, loads

load_dotenv()
MONGO_ATLAS_URI = os.getenv('MONGO_ATLAS_URI')

def connect_db():
    global client, database
    client = pymongo.MongoClient(MONGO_ATLAS_URI, server_api=pymongo.server_api.ServerApi(version="1", strict=True, deprecation_errors=True))
    database = client["data"]

def disconnect_db():
    client.close()

# ---------------------------------------------------------
# instruction
# ---------------------------------------------------------
def get_organization_instructions_names(organization_id: str):
    collection = database["instruction"]
    organizations = loads(dumps(collection.find({"organization_id": ObjectId(organization_id)}, {"name":1})))
    for organization in organizations:
        organization["_id"] = str(organization["_id"])
    return organizations

def get_instruction(_id: str):
    collection = database["instruction"]
    instruction = collection.find_one({"_id": ObjectId(_id)})
    instruction["_id"] = str(instruction["_id"])
    instruction["organization_id"] = str(instruction["organization_id"])
    print(instruction)
    return instruction

def add_instruction(name: str, description: str, organization_id: str = None):
    collection = database["instruction"]
    collection.insert_one({"name": name, "description": description, "organization_id": ObjectId(organization_id)})
    id = collection.find_one({"name" : name}, {"_id" : 1})
    id["_id"] = str(id["_id"])  
    return loads(dumps(id))

def remove_instruction(_id: str):
    collection = database["instruction"]
    collection.delete_one({"_id": ObjectId(_id)})

# ---------------------------------------------------------
# Organization
# ---------------------------------------------------------
def add_organization(name: str):
    collection = database["organization"]
    collection.insert_one({"name": name})

def remove_organization(_id: str):
    collection = database["organization"]
    collection.delete_one({"_id": ObjectId(_id)})

def get_organization(_id: str):
    collection = database["organization"]
    return collection.find_one({"_id": ObjectId(_id)})

# ---------------------------------------------------------
# Users
# ---------------------------------------------------------
def add_user(username:str , password: str, organization_id: str) -> bool:
    collection = database["user"]
    if get_user(username) is None:
        collection.insert_one({"username": username, "password": password, "organization_id": ObjectId(organization_id), "threads_history": [] })
        return True
    else:
        return False

def remove_user(_id: str):
    collection = database["user"]
    collection.delete_one({"_id": ObjectId(_id)})

def get_user(username: str):
    collection = database["user"]
    return collection.find_one({"username": username})

def get_threads_history(username: str):
    collection = database["user"]
    return collection.find_one({"username": username})["threads_history"]

def add_thread(username: str, thread_id: str, thread_name: str):
    collection = database["user"]
    threads_history = get_threads_history(username)
    threads_history.append({"id": thread_id, "name": thread_name})
    collection.update_one({"username": username}, {"$set": {"threads_history": threads_history}})

def remove_thread(username: str, thread_id: str):
    collection = database["user"]
    threads_history = get_threads_history(username)
    threads_history.remove(thread_id)
    collection.update_one({"username": username}, {"$set": {"threads_history": threads_history}})

def clear_threads_history(username: str):
    collection = database["user"]
    collection.update_one({"username": username}, {"$set": {"threads_history": []}})

connect_db()
print(get_user("user"))
disconnect_db()