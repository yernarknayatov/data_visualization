import glob

from itsdangerous import json
import json

path = "lab 4/data/"
jsonFilesList = glob.glob(path+"*json")

histData = open("lab 4/hist_data.json", "w") 

histData.write("[\n") # start json

for jsonName in jsonFilesList:
    with open(jsonName,"r") as jsonFile:
        data = json.load(jsonFile)
        lenData = len(data)
        for i in range(lenData):
            abstract = len(data[i]["abstract"])
            text = '  { "abstract": ' + str(abstract) + " }" # pretty code
            if (jsonName==jsonFilesList[-1]) and (i==lenData-1):
                histData.write(text+'\n') # pretty code
            else:
                histData.write(text+",\n" ) # pretty code
else:
    histData.write("]")
