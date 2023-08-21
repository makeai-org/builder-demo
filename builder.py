from flask import Flask as fk
from flask import render_template as RT
from flask import request as req
from flask import url_for as uf
from flask import redirect as rd
import tensorflow as tf
import keras as k
from keras import layers
from keras.datasets import mnist
#import matplotlib.pyplot as plt
import numpy as np
import os
import time
#from PIL import Image
(X_train, y_train),(X_test,y_test) = mnist.load_data()
y_train, y_test = tf.keras.utils.to_categorical(y_train),tf.keras.utils.to_categorical(y_test)
print(tf.shape(y_train))
print(tf.shape(y_test))
y_train, y_test = y_train.reshape(60000,10),y_test.reshape(10000,10)
print(tf.shape(X_train))

app = fk(__name__)

test_model = ""
start_cerial = 0
endrun_key = ""
org_time = time.time()

def unique(list):
    found = []
    uni = 0
    for pos,val in enumerate(list):
        if val not in found:
            uni += 1
            found.append(val)
    return uni

def getRef(list):
    found = []
    uni = 0
    for pos,val in enumerate(list):
        if val not in found:
            uni += 1
            found.append(val)
    return found

def execute_order_66():
    jedi = os.listdir(str(os.getcwd()) + "/models")
    for target in jedi:
        os.remove(f"models/{target}")
    return "You were my brother Anakin"

def FindNum(num):
  greatest = num[0][0]
  greatest_num = 0
  for num_i in range(len(num[0])):
      print(num[0][num_i])
      comp = num[0][num_i]
      if comp > greatest:
          greatest_num = num_i
          greatest = comp
  return greatest_num

def parse_data(data,lr,rest):
    lastLay = 0
    if rest[0] == True:
        lastLay += 10
    if rest[1] == True:
        print(rest)
        lastLay += unique(rest[3])
    print(f"LayLast {lastLay}")
    model = tf.keras.models.Sequential()
    model.add(layers.Input(shape=(28,28,1)))
    ites = 0
    prev_layer = ""
    prev_nodes = 0
    for i,layer in enumerate(data):
        print(layer)
        if layer[1]['textInLayers'] == 'def':
            nodes = 28
        elif layer[1]["textInLayers"].isnumeric():
            nodes = layer[1]["textInLayers"]
        if layer[2]["textInActivation"].isalpha():
            activationIn = layer[2]["textInActivation"]
        if layer[0]["name"] == "dense":
            if prev_layer == "conv" or ites == 0:
                model.add(layers.Flatten())
            model.add(layers.Dense(int(nodes), activation=activationIn))
            prev_layer = "dense"
        elif layer[0]["name"] == "conv":
            if prev_layer == "dense":
                model.add(layers.Reshape((int(prev_nodes),1,1)))
            model.add(layers.Conv2D(int(nodes), activation=activationIn,kernel_size=4, padding="same"))
            prev_layer = "conv"
        ites = ites + 1
        prev_nodes = nodes
    if prev_layer == "conv" or ites == 0:
        model.add(layers.Flatten())
    model.add(layers.Dense(lastLay,activation="softmax"))
    model.compile(metrics=["accuracy"],loss=tf.keras.losses.CategoricalCrossentropy(),optimizer=tf.keras.optimizers.Adam(lr=float(lr)))
    print(model.summary())
    return model

def doKeras(labels):
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
    return ret_mat

def train_model(model, epochs,trainHandlers):
    print("start")
    useMNIST = trainHandlers[0]
    useCustom = trainHandlers[1]
    customData = trainHandlers[2]
    customLabel = trainHandlers[3]
    print("handler good")
    if useMNIST == True:
        model.fit(X_train,y_train, epochs=int(epochs),batch_size=128, verbose=1)
    if useCustom == True and len(customData) > 0:
        convCustom = np.asarray(customData)
        label = doKeras(customLabel)
        label = np.asarray(label)
        print(label)
        convCustom = np.reshape(convCustom,(len(customData),28,28,1))
        print(tf.shape(convCustom))
        print(tf.shape(label))
        model.fit(convCustom,label,epochs=int(epochs),batch_size=1,verbose=1)
        print("Train fine")
    else:
        if useMNIST == False:
            return model, str("101")
    #print(customData.length)
    #eval = model.evaluate(X_test,y_test,verbose=1)
    print(model.metrics_names)
    #acc = eval[1]
    #test = X_train[0]
    #visualize(test)
    #test = test.reshape(1,28,28,1)
    #print(tf.shape(X_train[0]))
    #pred = model.predict(test)
    #print(pred)
    #pred = FindNum(pred)
    #print(pred)
    print("At point")
    if useMNIST == True:
        eval = model.evaluate(X_test,y_test,verbose=1)
        print("MNIST true")
        acc = eval[1]
        return model, str(acc)
    else:
        acc = "Nan"
        return model, str(acc)

@app.route("/", methods=["GET","POST"])
def demo_main():
    return RT("index.html", Train_Acc = "None", Test_Acc = "None", model = "None", mod_weight = "None")

@app.route("/draw/", methods=["GET","POST"])
def draw():
    if req.method == "POST":
        try:
            dataDraw = req.get_json(force=True)
            modelKey = dataDraw[-1]
            dataRef = getRef(dataDraw[-2])
            useAlp = dataDraw[-3]
            useCust = dataDraw[-4]
            print(dataRef)
            dataDraw.remove(dataDraw[-2])
            dataDraw.remove(dataDraw[-3])
            dataDraw.remove(dataDraw[-4])
            dataDraw.remove(modelKey)
            print(modelKey)
            modelLoad = tf.keras.models.load_model(modelKey)
            predImg = tf.Variable(dataDraw)
            #visualize(predImg)
            predImg = tf.reshape(predImg, shape=(1,28,28,1))
            print(tf.shape(predImg))
            responsePred = FindNum(modelLoad.predict(predImg))
            #return str(responsePred)
            if useAlp == True:
                return str(responsePred)
            if useCust == True:
                return str(dataRef[responsePred])
        except Exception as f:
            print(f)
            return "No Model"
    return "Error"

@app.route("/misc/",methods=["GET","POST"])
def misc():
    if req.method == "POST":
        execute_order_66()
        return ":)"
    else:
        return ":("

@app.route("/main/", methods=["GET","POST"])
def demo():
    global org_time
    time_now = time.time()
    if int(time_now) - int(org_time) > 43200:
        execute_order_66()
        org_time = time_now
    """
    if req.method == "POST":
        global test_model
        test_model = tf.keras.models.Sequential()
        test_model.add(tf.keras.Input(shape=(1)))
        test_model.add(layers.Dense(1, activation="relu"))
        test_model.compile(metrics=["accuracy"],loss=tf.keras.losses.CategoricalCrossentropy(),optimizer=tf.keras.optimizers.Adam(lr=0.01))
        x_t = tf.Variable([1,1,1,1])
        y_t = tf.Variable([0,0,0,0])
        x_t = np.asarray(x_t)
        y_t = np.asarray(y_t)
        test_model.fit(x_t,y_t, epochs=1,batch_size=1, verbose=1)
        print(test_model.count_params())
        return str(f"{test_model.evaluate(x_t,y_t,verbose=1)},Model,{test_model.count_params()}")
    """
    print("Here")
    Test_Acc_In = "None"
    Parameters = 0
    Model = "None"
    global start_cerial
    if req.method == "POST":
        data = req.get_json(force=True)
        try:
            LetAlpCheck = data[3]
            CustomChecked = data[4]
            print(LetAlpCheck)
            print(CustomChecked)
        except:
            return str(f"{Test_Acc_In},Failed at model parse,{Parameters}")
        try:
            model = parse_data(data[0],data[2],data[3:])
        except Exception as erro:
            print(erro)
            return str(f"{Test_Acc_In},Failed at model parse,{Parameters}")
        try:
            para = int(model.count_params())
        except:
             return str(f"{Test_Acc_In},Failed at param count,{Parameters}")
        print(para)
        if para <= 100000:
            try:
                model,acc = train_model(model,data[1],data[3:])
            except Exception as e:
                print(e)
                return str(f"{Test_Acc_In},Failed at training,{Parameters}")
            Test_Acc_In = str(float(acc) * 100)
            Model = data[0]
            model_loc =f"models/model{start_cerial}.h5"
            start_cerial += 1
            model.save(model_loc)
            print("data")
            return str(f"{Test_Acc_In}={Model}={model_loc}={para}")
        else:
            print(para)
            return str("105")
    else:
        return "Wrong Page Homie"

@app.route("/delete/",methods=["GET","POST"])
def delete():
    if req.method == "POST":
        flname = req.get_json(force=True)
        print(flname)
        if "models" in flname:
            os.remove(flname)
            print("Removed " + flname)
        return "(:"
    else:
        return "Wrong Page"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000', debug=False)
