from pymongo import MongoClient
import json
import os
from bson import ObjectId
from datetime import datetime

# Custom JSON Encoder for handling MongoDB ObjectId and datetime objects
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

# Connect to MongoDB
client = MongoClient(os.environ['MONGODB_URI'])
db = client.FMD  # Replace 'FMD' with your actual database name

# Function to fetch and save collection data
def fetch_and_save(collection_name, file_path):
    data = list(db[collection_name].find({}))
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w') as file:
        file.write(JSONEncoder().encode(data))

# Fetch and save FMD.Endpoints
fetch_and_save("Endpoints", 'fmd-telemetry/src/assets/Endpoints.json')

# Fetch and save FMD.UserSession
fetch_and_save("UserSession", 'fmd-telemetry/src/assets/UserSession.json')
