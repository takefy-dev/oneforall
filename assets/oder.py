import mysql.connector
import sys
import json
import time
import os
from zipfile import ZipFile
import subprocess
from selenium import webdriver
import win32clipboard

dbco = mysql.connector.connect(
    host='localhost',
    user='takefydev',
    passwd="murphy7777",
    database='botperso'
)
db = dbco.cursor()

userId = str(sys.argv[1])
discordName = str(sys.argv[2])
# print(discordName)

# userId = '443812465772462090'
# discordName = 'takefyssss'


def getToken():
    # token = '0'
    # db.execute("SELECT botToken FROM client WHERE discordId = '{}'".format(userId))
    # myresult = db.fetchone()
    # for x in myresult:
    #     token = x

        accountToken = "mfa.8MflT_1kOLlR8obRKBHt13GdY0DO-6_jM9euNwupmQpu3FUiuMrhnxliHL_LuR7UeKRTrZpzAqsPPb7v0NPi"
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"

        options = webdriver.ChromeOptions()
        options.headless = True
        options.add_argument(f'user-agent={user_agent}')
        options.add_argument("--window-size=1920,1080")
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--allow-running-insecure-content')
        options.add_argument("--disable-extensions")
        options.add_argument("--proxy-server='direct://'")
        options.add_argument("--proxy-bypass-list=*")
        options.add_argument("--start-maximized")
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--no-sandbox')
        driver = webdriver.Chrome(
            "./assets/chromedriver.exe", options=options)

        driver.get("https://discord.com/developers/applications")
        print(driver.title)
        time.sleep(3)
        driver.execute_script("""
            setInterval(() => {
            document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"ODExOTM1NDE4NzUxOTA5ODk5.YC5cyA.pCilZ2R6h7AvQZiIrkp2V5UA_QI"`
            }, 50);
            setTimeout(() => {
            location.reload();
            }, 2500);
            """)
        time.sleep(10)

        driver.find_element_by_xpath(
            '/html/body/div[1]/div/div/div[1]/div[3]/div[2]/div/div[1]/div[1]/h2/div[2]/button').click()
        # appName
        driver.find_element_by_xpath(
            '/html/body/div[2]/div/form/div/div[3]/div/div[1]/div/input').send_keys(f'ONEF PERSO {discordName}')
        driver.find_element_by_xpath(
            '/html/body/div[2]/div/form/footer/button[2]').click()
        time.sleep(3)
        driver.get_screenshot_as_file('sreen.png')
        driver.find_element_by_xpath(
            '//*[@id="app-mount"]/div/div/div[1]/div[1]/div/div/div/div[1]/div[2]/ul/li[3]/a').click()
        driver.get_screenshot_as_file('sreen2.png')

        # grab clipboard data
        print(driver.current_url.split('/'))
        data = driver.current_url.split('/')[5]
        # click on bot menu
        time.sleep(4)
        driver.find_element_by_xpath(
            '//*[@id="app-mount"]/div/div/div[1]/div[3]/div[2]/div/div[1]/div[2]/div/button').click()
        driver.find_element_by_xpath(
            '/html/body/div[5]/div/footer/button[2]').click()
        time.sleep(2)
        # save token
        driver.find_element_by_xpath(
            '//*[@id="app-mount"]/div/div/div[1]/div[3]/div[2]/div/div[1]/div[2]/form/div[1]/div[1]/div[2]/div/div[2]/div/div/button[1]').click()

        driver.find_element_by_xpath('//*[@id="3"]').click()
        driver.find_element_by_xpath('//*[@id="4"]').click()
        # grab clipboard data

        win32clipboard.OpenClipboard()
        token_clipboard = win32clipboard.GetClipboardData()
        win32clipboard.CloseClipboard()

        # driver.execute_script(f"login({accountToken})")
        return [token_clipboard, data]


# def getDiscordName():
#     discordName = '0'
#     db.execute(
#         "SELECT discordName FROM client WHERE discordId = '{}'".format(userId))
#     myresult = db.fetchone()
#     for x in myresult:
#         discordName = x
#     return discordName


def createBot():
    clientIdToken = getToken()
    token = clientIdToken[0]
    clientId = clientIdToken[1]
    path = 'D:\\Github\\DiscordBot\\' + userId
    print(path)

    os.mkdir(path)
    with ZipFile('D:/Github/DiscordBot/BotPerso.zip', 'r') as zipObj:
        zipObj.extractall(path)

    createDatase = mysql.connector.connect(
        host='localhost',
        user='takefydev',
        passwd="murphy7777"
    )
    createDb = createDatase.cursor()

    createDb.execute("CREATE DATABASE {}".format(discordName))
    con = mysql.connector.connect(
        host='localhost',
        user='takefydev',
        passwd="murphy7777",
        database=discordName
    )
    dbcon = con.cursor()
    dbcon.execute(f"""
        USE botperso;
        UPDATE client SET botToken='{token}';
        UPDATE client SET botId = '{clientId}';
    """)
    dbcon.execute(
        "CREATE TABLE guilds(guildId VARCHAR(100) NOT NULL PRIMARY KEY,guildOwnerId VARCHAR(100) NOT NULL)")
    dbcon.execute("""CREATE TABLE guildConfig(
        guildId VARCHAR(100) NOT NULL PRIMARY KEY,
        prefix VARCHAR(10) DEFAULT '!',
        muteChannelId VARCHAR(100),
        muteRoleId VARCHAR(100) DEFAULT NULL,
        setup BOOLEAN DEFAULT FALSE,
        embedColors VARCHAR(10) DEFAULT '#36393F',
        whitelisted TEXT DEFAULT (''),
        memberRole VARCHAR(100) DEFAULT NULL,
        inviteChannel VARCHAR(100) DEFAULT NULL,
        inviteMessage TEXT DEFAULT ('Bienvenue ${invited}, ${inviter} à ${count} invites.'),
        soutienMsg TEXT DEFAULT(''),
        soutienOn BOOLEAN DEFAULT FALSE,
        soutienId VARCHAR(100) DEFAULT NULL,
        inviteOn BOOLEAN DEFAULT FALSE,
        owner TEXT DEFAULT (''),
        lang VARCHAR(25) DEFAULT 'fr',
        antiraidLog VARCHAR(100) DEFAULT 'Non définie',
        modLog  VARCHAR(100) DEFAULT 'Non définie' ,
        voiceLog  VARCHAR(100) DEFAULT 'Non définie',
        msgLog  VARCHAR(100) DEFAULT 'Non définie',
        memberCount LONGTEXT DEFAULT('{ "name": "Non définie" }'),
        voiceCount LONGTEXT DEFAULT('{ "name": "Non définie" }'),
        onlineCount LONGTEXT DEFAULT('{ "name": "Non définie" }'),
        offlineCount LONGTEXT DEFAULT('{ "name": "Non définie" }'),
        botCount LONGTEXT DEFAULT('{ "name": "Non définie" }'),
        channelCount LONGTEXT DEFAULT('{ "name": "Non définie" }'),
        roleCount LONGTEXT DEFAULT('{ "name": "Non définie" }'),
        boosterCount LONGTEXT DEFAULT('{ "name": "Non définie" }')
        )

        """)
    dbcon.execute("""
        CREATE TABLE antiraid(
        guildId VARCHAR(100) NOT NULL PRIMARY KEY,
        webhookCreate BOOLEAN DEFAULT FALSE,
        roleCreate BOOLEAN DEFAULT FALSE,
        roleUpdate BOOLEAN DEFAULT FALSE,
        roleDelete BOOLEAN DEFAULT FALSE,
        channelCreate BOOLEAN DEFAULT FALSE,
        channelUpdate BOOLEAN DEFAULT FALSE,
        channelDelete BOOLEAN DEFAULT FALSE,
        spam BOOLEAN DEFAULT FALSE,
        ban BOOLEAN DEFAULT FALSE,
        bot BOOLEAN DEFAULT FALSE,
        roleAdd BOOLEAN DEFAULT FALSE,
        antilink BOOLEAN DEFAULT FALSE,
        antiDeco BOOLEAN DEFAULT FALSE,
        antiKick BOOLEAN DEFAULT FALSE,
        antiDc BOOLEAN DEFAULT FALSE,
        nameUpdate  BOOLEAN DEFAULT FALSE,
        regionUpdate BOOLEAN DEFAULT FALSE,
        vanityUpdate BOOLEAN DEFAULT FALSE
        )
    """)
    dbcon.execute("""
        CREATE TABLE antiraidWlBp(
        guildId VARCHAR(100) NOT NULL PRIMARY KEY,
        webhookCreate BOOLEAN DEFAULT TRUE,
        roleCreate BOOLEAN DEFAULT TRUE,
        roleUpdate BOOLEAN DEFAULT TRUE,
        roleDelete BOOLEAN DEFAULT TRUE,
        channelCreate BOOLEAN DEFAULT TRUE,
        channelUpdate BOOLEAN DEFAULT TRUE,
        channelDelete BOOLEAN DEFAULT TRUE,
        spam BOOLEAN DEFAULT TRUE,
        ban BOOLEAN DEFAULT TRUE,
        bot BOOLEAN DEFAULT TRUE,
        roleAdd BOOLEAN DEFAULT TRUE,
        antilink BOOLEAN DEFAULT TRUE,
        antiDeco BOOLEAN DEFAULT TRUE,
        antiKick BOOLEAN DEFAULT TRUE,
        nameUpdate  BOOLEAN DEFAULT TRUE,
        regionUpdate BOOLEAN DEFAULT TRUE,
        vanityUpdate BOOLEAN DEFAULT FALSE

        )
    """)
    dbcon.execute("""
    CREATE TABLE antiraidconfig(
        guildId VARCHAR(100) NOT NULL PRIMARY KEY,
        webhookCreate VARCHAR(100) DEFAULT 'unrank',
        roleCreate VARCHAR(100) DEFAULT 'unrank',
        roleUpdate VARCHAR(100) DEFAULT 'unrank',
        roleDelete VARCHAR(100) DEFAULT 'unrank',
        channelCreate VARCHAR(100) DEFAULT 'unrank',
        channelUpdate VARCHAR(100) DEFAULT 'unrank',
        channelDelete VARCHAR(100) DEFAULT 'unrank',
        spam VARCHAR(100) DEFAULT 'mute',
        ban VARCHAR(100) DEFAULT 'ban',
        bot VARCHAR(100) DEFAULT 'kick',
        roleAdd VARCHAR(100) DEFAULT 'unrank',
        antiDeco VARCHAR(100) DEFAULT 'unrank',
        antiKick VARCHAR(100) DEFAULT 'unrank',
        antiKickLimit VARCHAR(100) DEFAULT '5',
        antiBanLimit VARCHAR(100) DEFAULT '5',
        antiDcLimit VARCHAR(100) DEFAULT '1 day',
        antiDc VARCHAR(100) DEFAULT 'kick',
        nameUpdate  VARCHAR(100) DEFAULT 'unrank',
        regionUpdate  VARCHAR(100) DEFAULT 'unrank',
        vanityUpdate  VARCHAR(100) DEFAULT 'ban',
        vanityUpdateBypass   VARCHAR(100) DEFAULT 'Aucune'
        )
    """)
    dbcon.execute("""

        CREATE TABLE reactRole(
            msgId VARCHAR(100) NOT NULL PRIMARY KEY,
            guildId VARCHAR(100) NOT NULL,
            emojiRole LONGTEXT NOT NULL
        )
    """)
    dbcon.execute("""
    CREATE TABLE backup(
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        userId VARCHAR(100) NOT NULL,
        backupId VARCHAR(100) NOT NULL,
        guildName VARCHAR(100) NOT NULL,
        guildData LONGTEXT NOT NULL
    )
    """)
    dbcon.execute("""
    CREATE TABLE blacklist(
        userId VARCHAR(100) NOT NULL PRIMARY KEY,
        isOn BOOLEAN DEFAULT FALSE,
        blacklisted TEXT DEFAULT('')


    )
    """)
    dbcon.execute("""
   CREATE TABLE tempvoc(
    guildId VARCHAR(100) NOT NULL PRIMARY KEY,
    tempvocInfo LONGTEXT DEFAULT('{"catId": "Non définie", "chId", "Non définie", :"chName": "Non définie"}'),
    isOn BOOLEAN DEFAULT FALSE
    )
    """)
    dbcon.execute("""
        CREATE TABLE tempMute(
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            userId VARCHAR(100) NOT NULL,
            guildId VARCHAR(100) NOT NULL,
            mutedAt DATETIME NOT NULL,
            muteEnd DATETIME NOT NULL,
            rawTime VARCHAR(25) NOT NULL
        )
    """)

    with open(path + "/.env", "w") as f:
        f.write(
            "TOKEN={}\nOWNER={}\nDB_USER=takefydev\nDB_PASS=murphy7777\nDB_NAME={}".format(token, userId, discordName))

    data = {}
    data['apps'] = []
    data['apps'].append({
        "name": discordName,
        'script': path + '\\index.js'
    })
    with open(path + "\\pm2.json", 'w') as w:
        json.dump(data, w)

    item = subprocess.Popen(["powershell", "D:\Github\DiscordBot\OneForAll\assets\runBot.bat", str(path)],
                            stdout=subprocess.PIPE)
    for line in item.stdout:
        print(line)


def main():

    try:
        createBot()
    except:
        print('rate limited')
        exit()
    pass


if __name__ == '__main__':
    main()
