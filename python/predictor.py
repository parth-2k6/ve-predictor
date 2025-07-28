import sys
import json
import pickle
import os

model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
with open(model_path, 'rb') as f:
    model = pickle.load(f)

input_json = sys.argv[1]
input_data = json.loads(input_json)

X = [input_data["features"]]
prediction = model.predict(X)

print(json.dumps({"prediction": prediction[0]}))