from flask import Flask, request, jsonify, render_template
import numpy as np
import json
import joblib

app = Flask(__name__)

__data_columns = None
__locations = None
__areas = None
__model = None


print('loading saved artifacts')


with open('columns.json', 'r') as f:
    __data_columns = json.load(f)['data_columns']
    __locations = __data_columns[4:]

with open('areas.json', 'r') as f:
    __areas = json.load(f)

__model = joblib.load('bengaluru_home_price_model')
print('loading saved artifacts....done')


def get_location_names():
    return __locations


def get_area_names():
    return [key for key, val in __areas.items()]


def get_estimated_price(location, bedrooms, baths, area_type, total_sqft):
    data = np.zeros(len(__data_columns))
    try:
        loc_index = __data_columns.index((location.lower()))
    except:
        loc_index = -1

    if area_type in __areas:
        area_type = __areas[area_type]
    data[0] = total_sqft
    data[1] = baths
    data[2] = area_type
    data[3] = bedrooms
    if loc_index >= 0:
        data[loc_index] = 1
    return round(__model.predict([data])[0], 2)


@app.route('/')
def home():
    return render_template('app.html')


@app.route('/locations', methods=['GET'])
def locations():
    response = jsonify({
        'locations': get_location_names()
    })

    return response


@app.route('/areas', methods=['GET'])
def areas():
    response = jsonify({
        'areas': get_area_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# methods=['GET', 'POST']
@app.route('/predict_home_price', methods=['GET', 'POST'])
def predict_home_price():
    data = request.get_json()
    total_sqft = data['total_sqft']
    location = data['location']
    baths = data['baths']
    area_type = data['area_type']
    bedrooms = data['bedrooms']

    response = jsonify({
        "estimated_price": get_estimated_price(location, bedrooms, baths, area_type, total_sqft)
             })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    print('starting python flask server for home price prediction')
    app.run()

