from pymongo import MongoClient
import json
import os

# Connect to MongoDB
client = MongoClient(os.environ['MONGODB_URI'])
db = client.your_database_name # Replace with your database name

# Fetch data from a collection
collection = db.your_collection_name # Replace with your collection name
data = list(collection.find({}))

# Save to a JSON file
with open('data.json', 'w') as file:
    json.dump(data, file)
