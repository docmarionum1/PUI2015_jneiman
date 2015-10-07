import os
from os import path

HOME_DIR = 'C:\Users\Jeremy\Documents\workspace\PUI2015_jneiman'

#Define a function to handle path for windows users without PUI2015 environment variable
def getFilePath(relativePath, directory=HOME_DIR):
    if os.getenv('PUI2015'):
        p = path.join(os.getenv('PUI2015'), relativePath)
        if path.exists(p):
            return p
    
    return path.join(directory, relativePath)

