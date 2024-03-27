from pymongo import MongoClient
import json
import os

# Connect to MongoDB
client = MongoClient(os.environ['MONGODB_URI'])
db = client.FMD  # Assuming 'FMD' is your database name

# Function to fetch and save collection data
def fetch_and_save(collection_name, file_path):
    data = list(db[collection_name].find({}))
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w') as file:
        json.dump(data, file)

# Fetch and save FMD.Endpoints
fetch_and_save("Endpoints", 'fmd-telemetry/fmd-telemetry/src/assets/Endpoints.json')

# Fetch and save FMD.UserSession
fetch_and_save("UserSession", 'fmd-telemetry/fmd-telemetry/src/assets/UserSession.json')
