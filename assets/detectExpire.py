import mysql.connector
import sys
import datetime
import schedule
import time
import shutil
import os
import subprocess


def detectExpire():  # check si abonnement est expiré ou non
    dbco = mysql.connector.connect(
        host='localhost',
        user='takefydev',
        passwd="murphy7777",
        database='botperso'
    )


    db = dbco.cursor()
    db.execute("SELECT discordId FROM client WHERE expireAt <= CURDATE()")
    expireDiscordId = [item[0] for item in db.fetchall()]
    db.execute("SELECT discordName FROM client WHERE expireAt <= CURDATE()")
    expireDiscordName = [item[0] for item in db.fetchall()]
    for i in expireDiscordId:
        print('Start')

        path = 'D:/Github/DiscordBot/' + i
        for x in expireDiscordName:
            print(x)
            command = "pm2 delete --name={} {}".format(x, path + '/index.js')
            subprocess.call('powershell.exe {}'.format(command), cwd=path)
            db.execute("DROP DATABASE {}".format(x))
        shutil.rmtree(path)
        db.execute("DELETE FROM client WHERE discordId ='" + i + "'")

        dbco.commit()


schedule.every(10).seconds.do(detectExpire)

while True:
    schedule.run_pending()
    time.sleep(1)
pass
