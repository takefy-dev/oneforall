import mysql.connector
import sys
import json
import time
import os
from zipfile import ZipFile
import subprocess

dbco = mysql.connector.connect(
    host='localhost',
    user='takefydev',
    passwd="murphy7777",
    database='botperso'
)
db = dbco.cursor()

userId = str(sys.argv[1])


def getDiscordName():
    discordName = '0'
    db.execute("SELECT discordName FROM client WHERE discordId = '{}'".format(userId))
    myresult = db.fetchone()
    for x in myresult:
        discordName = x
    return discordName


def createBot():
    path = 'D:\\Github\\DiscordBot\\' + userId
    print(path)
    discordName = getDiscordName()
    db.execute("DELETE FROM client WHERE discordId = '" + userId + "'")
    command = "pm2 delete --name={} {}".format(discordName, path + '\\index.js')
    subprocess.call('powershell.exe {}'.format(command), cwd=path)
    db.execute("DELETE DATABASE '" + discordName + "'")


def main():
    createBot()
    pass


if __name__ == '__main__':
    main()
