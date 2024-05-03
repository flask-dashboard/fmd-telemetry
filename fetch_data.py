import requests
import json
import os

# Parse Server credentials
# Reading the server IP and port from the file 'ip_address' in the same directory
with open('ip_address', 'r') as file:
    server_info = file.read().strip()

# Construct the Parse Server URL using the read server info
PARSE_SERVER_URL = f"http://{server_info}/parse"

PARSE_APP_ID = os.environ['PARSE_APP_ID']

if not PARSE_APP_ID:
    raise EnvironmentError("The 'PARSE_APP_ID' environment variable is not set.")

# HTTP headers
headers = {
    'X-Parse-Application-Id': PARSE_APP_ID,
    'Content-Type': 'application/json'
}

# Function to fetch and save collection data with pagination
def fetch_and_save(class_name, file_path):
    limit = 100  # Maximum number of items per page
    skip = 0     # Offset to start fetching the data
    all_data = []  # List to store all records across pages

    while True:
        # Append limit and skip to the URL to control pagination
        url = f"{PARSE_SERVER_URL}/classes/{class_name}?limit={limit}&skip={skip}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error if the request fails
        data = response.json()["results"]
        
        all_data.extend(data)
        
        if len(data) < limit:
            # If fewer items are returned than the limit, assume it's the last page
            break
        skip += limit  # Move to the next set of items

    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w') as file:
        json.dump(all_data, file, indent=2)

# Fetch and save various classes
fetch_and_save("Endpoints", 'fmd-telemetry/src/assets/Endpoints.json')
fetch_and_save("UserSession", 'fmd-telemetry/src/assets/UserSession.json')
fetch_and_save("DatabasePruning", 'fmd-telemetry/src/assets/DatabasePruning.json')
fetch_and_save("FollowUp", 'fmd-telemetry/src/assets/FollowUp.json')
