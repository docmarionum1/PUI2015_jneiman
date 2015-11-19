import os
from os import path
import pandas as pd
from zipfile import ZipFile
from StringIO import StringIO
import urllib2

HOME_DIR = 'C:\Users\Jeremy\Documents\workspace\PUI2015_jneiman'

#Define a function to handle path for windows users without PUI2015 environment variable
def getFilePath(relativePath, directory=HOME_DIR):
    if os.getenv('PUI2015'):
        p = path.join(os.getenv('PUI2015'), relativePath)
        if path.exists(p):
            return p
    
    return path.join(directory, relativePath)

# A function to pull citibike data from the web directly into memory for a given list of months.
# Months can be any of the following: ['01', '02', '03', '04', '05', '06']
def pullCitibikeData(months):
    ride_frames = []

    for month in months:
        url = "https://s3.amazonaws.com/tripdata/2015%s-citibike-tripdata.zip" % month
        r = urllib2.urlopen(url).read()
        f = ZipFile(StringIO(r))
        csv = f.open("2015%s-citibike-tripdata.csv" % month)
        frame = pd.read_csv(csv)
        ride_frames.append(frame)

    # Concatenate all the individual months into one.
    return pd.concat(ride_frames, ignore_index=True)

def convertDatetime(col):
    # Citibike date format is inconsistent between months...
    try:
        return pd.to_datetime(frame.starttime, format='%m/%d/%Y %H:%M:%S')
    except:
        try:
            return pd.to_datetime(frame.starttime, format='%m/%d/%Y %H:%M')
        except:
            return pd.to_datetime(frame.starttime)