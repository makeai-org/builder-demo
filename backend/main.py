from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import uuid

import tensorflow as tf

import numpy as np

import tensorflow.keras.datasets.mnist as mnist

import time
import os

built_model = None

(x_train, y_train), (x_test, y_test) = mnist.load_data()

x_train = x_train / 255
x_test = x_test / 255

x_train = x_train.reshape((x_train.shape[0],28,28,1))
x_test = x_test.reshape((x_test.shape[0],28,28,1))

y_train = tf.keras.utils.to_categorical(y_train)
y_test = tf.keras.utils.to_categorical(y_test)

#SUBCLASS
#each layer will be inputted as this, as part of an array of layers in Model
class Layer(BaseModel):
    #the name is a string like "Dense Layer" or "Convolutional Layer", case sensitive
    name: str
    #the number of layers or nodes for that layer as a number, example: 32
    layers: int
    #pooling: int by int
    pooling: int
#SUBCLASS
#the custom data will be submitted as an array of these, each object has a label and drawing
class CustomData(BaseModel):
    #the drawing is submitted encoded as a pixels list
    drawing: List[int]
    #the label is a string that identifies the submitted image, example: cat
    label: str

#INPUTS:

#this is the input for /train, which includes all the parameters for training
class Model(BaseModel):
    #array of layers derived from the blocks
    layers: List[Layer]
    #number of epochs for training, as an int, example: 2
    epochs: int
    #learning rate for training, as a float, example: 0.001
    learningRate: float
    #the custom data for the model training
    #if the array is [] or null, use pre-made number data
    customData: List[CustomData]

#this is the input for /predict
class Predict(BaseModel):
    #the unique id of the model used for predicting
    modelID: str
    #the image that needs to be predicted, encoded as a pixels list
    predictImg: List[int]
    #the list of labels, in order of first appearance
    labels: List[str]

#RETURNS:

#api will return these stats after training the model
class Stats(BaseModel):
    #the unique id of the model, can be used to access the model later
    modelID: str
    #accuracy as a number, not including the %, example: 96.5
    accuracy: float
    #number of parameters as a number, example: 7000
    parameters: int
    #training time in seconds, example: 9
    trainingTime: float
    #the error
    error: str

#api will return the prediction from the /predict
class Prediction(BaseModel):
    #prediction, as an str, example: cat
    prediction: str

app = FastAPI()

class PoolingError(Exception):
    def __init__(self, message="This is a custom exception"):
        super().__init__(message)

def unique(list):
    found = []
    uni = 0
    for pos,val in enumerate(list):
        if val not in found:
            uni += 1
            found.append(val)
    return uni

def fKeras(labels):
    ret_mat = []
    classes = unique(labels)
    found = []
    for i,val in enumerate(labels):
        if val not in found:
            found.append(val)
    for i,val in enumerate(labels):
        temp = []
        for pos,string in enumerate(found):
            if string == val:
                temp.append(1)
            else:
                temp.append(0)
        ret_mat.append(temp)
    return ret_mat, classes

def FindNum(num):
    greatest = num[0][0]
    greatest_num = 0
    for num_i in range(len(num[0])):
        comp = num[0][num_i]
        if comp > greatest:
            greatest_num = num_i
            greatest = comp
    return greatest_num

def build_model(model: Model, type, numclasses):

    classes = None

    if type == "pretrained":
        classes = 10

    elif type == "custom":
        classes = numclasses

    built_model = tf.keras.models.Sequential()

    prev_layer = None

    prev_nodes = 0

    built_model.add(tf.keras.Input(shape=(28,28,1)))

    for pos,layer in enumerate(model.layers):
        if layer.name == "Dense Layer" and (prev_layer == "Convolutional Layer" or pos == 0):
            built_model.add(tf.keras.layers.Flatten())
        elif layer.name == "Convolutional Layer" and prev_layer == "Dense Layer":
            built_model.add(tf.keras.layers.Reshape(target_shape=(prev_nodes,1,1)))

        if layer.name == "Convolutional Layer":
            built_model.add(tf.keras.layers.Conv2D(layer.layers, (4,4), activation="relu", padding="same"))
            if layer.pooling > 0:
                try: 
                    built_model.add(tf.keras.layers.MaxPool2D((layer.pooling,layer.pooling)))
                except:
                    raise PoolingError()
        elif layer.name == "Dense Layer":
            built_model.add(tf.keras.layers.Dense(layer.layers, activation="relu"))
        else:
            print("Error: Unrecognized Layer")
        prev_layer = layer.name
        prev_nodes = layer.layers
    if prev_layer == "Convolutional Layer" or len(model.layers)==0:
        built_model.add(tf.keras.layers.Flatten())

    built_model.add(tf.keras.layers.Dense(classes, activation="softmax"))

    return built_model

def ParamLimit(value):
    if value >= 200000:
        return True
    return False

def fr_train_model(model, built_model, method, c_x_train, c_y_train):
    time_now = time.time()

    if method == "pretrained":
        built_model.fit(x_train,y_train, epochs=model.epochs, batch_size=100, verbose=2)

    elif method == "custom":
        built_model.fit(c_x_train,c_y_train, epochs=model.epochs, batch_size=100, verbose=2)
    
    return built_model, round(time.time() - time_now,3)

@app.get("/")
async def root():
    return {"message": "You were the chosen one..."}

@app.post("/train/")
async def train_model(model: Model):
    
    model_accuracy = None

    if (len(model.customData) == 0):

        try:
            built_model = build_model(model, "pretrained", None)
        except PoolingError as e:
            return [
                Stats(modelID="0", accuracy=0, parameters=0, trainingTime=0, error="Error during pooling")
            ]

        built_model.compile(metrics=["accuracy"], optimizer=tf.keras.optimizers.Adam(lr=model.learningRate), loss=tf.keras.losses.CategoricalCrossentropy())

        too_many_params_premade = built_model.count_params()

        if ParamLimit(too_many_params_premade):
            error_params = "Model is too big, you have " + str(too_many_params_premade) + " parameters, try decreasing number of layers or other parameters. Please don't set our servers on fire :("
            return [
                Stats(modelID="0", accuracy=0, parameters=too_many_params_premade, trainingTime=0, error=error_params)
            ]

        built_model,tt = fr_train_model(model,built_model,"pretrained", None, None)

        model_accuracy = float(round(built_model.evaluate(x_test,y_test)[1],4) * 100)
        
    else:
        c_y_train = []
        c_x_train = []

        for instance in model.customData:
            c_x_train.append(instance.drawing)
            c_y_train.append(instance.label)

        c_x_train = np.array(c_x_train).reshape(len(c_x_train),28,28,1) / 255

        c_y_train,numclasses = fKeras(c_y_train)
        try:
            built_model = build_model(model, "custom", numclasses)
        except PoolingError as e:
            return [
                Stats(modelID="0", accuracy=0, parameters=0, trainingTime=0, error="Error during pooling")
            ]
        
        built_model.compile(metrics=["accuracy"], optimizer=tf.keras.optimizers.Adam(lr=model.learningRate), loss=tf.keras.losses.CategoricalCrossentropy())

        too_many_params_custom = built_model.count_params()

        if ParamLimit(too_many_params_custom):
            error_params = "Model is too big, you have " + str(too_many_params_custom) + " parameters, try decreasing number of layers or other parameters. Please don't set our servers on fire :("
            return [
                Stats(modelID="0", accuracy=0, parameters=too_many_params_premade, trainingTime=0, error=error_params)
            ]

        c_y_train = np.array(c_y_train)

        built_model,tt = fr_train_model(model,built_model,"custom", c_x_train, c_y_train)

        #if model accuracy is 101 it means custom model was trained so accuracy not available
        model_accuracy = 101

    model_params = built_model.count_params()

    model_id = str(uuid.uuid4())
    model_name = "model-" + model_id + ".keras"

    built_model.save("models/" + model_name)

    #delete models older than 1 day
    for model_filename in os.listdir("models"):
        model_location = os.path.join("models", model_filename)
        model_time = os.path.getmtime(model_location)
        if(model_time < time.time() - 60*60*24):
            os.remove(model_location)

    return [
        Stats(modelID=model_id, accuracy=model_accuracy, parameters=model_params, trainingTime=tt, error="")
    ]

@app.post("/predict/")
async def predict(predict: Predict):

    pred_model_name = "model-" + predict.modelID + ".keras"
    loaded_model = tf.keras.models.load_model("models/" + pred_model_name)

    image = np.array(predict.predictImg).reshape((1,28,28,1))

    prediction =  str(predict.labels[FindNum(loaded_model.predict(image))])

    return [
        Prediction(prediction=prediction)
    ]
