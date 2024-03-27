from pymongo import MongoClient
import json
import os

# Connect to MongoDB
client = MongoClient(os.environ['MONGODB_URI'])
db = client.FMD  # Assuming 'FMD' is your database name

# Fetch data from FMD.Endpoints collection
endpoints_data = list(db.Endpoints.find({}))

# Save Endpoints data to a JSON file
endpoints_file_path = 'fmd-telemetry/fmd-telemetry/src/assets/Endpoints.json'
os.makedirs(os.path.dirname(endpoints_file_path), exist_ok=True)
with open(endpoints_file_path, 'w') as file:
    json.dump(endpoints_data, file)

# Fetch data from FMD.UserSession collection
user_session_data = list(db.UserSession.find({}))

# Save UserSession data to a JSON file
user_session_file_path = 'fmd-telemetry/fmd-telemetry/src/assets/UserSession.json'
os.makedirs(os.path.dirname(user_session_file_path), exist_ok=True)
with open(user_session_file_path, 'w') as file:
    json.dump(user_session_data, file)
