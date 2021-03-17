CREATE DATABASE OneForAll;
USE OneForAll;
CREATE TABLE guilds (
    guildId VARCHAR(100) NOT NULL PRIMARY KEY,
    guildOwnerId VARCHAR(100) NOT NULL 
);

CREATE TABLE guildConfig(
    guildId VARCHAR(100) NOT NULL PRIMARY KEY,
    prefix VARCHAR(10) DEFAULT '!',
    muteChannelId VARCHAR(100),
    muteRoleId VARCHAR(100),
    setup BOOLEAN DEFAULT FALSE,
    embedColors VARCHAR(10) DEFAULT '#36393F',
    whitelisted TEXT DEFAULT ('')
);

CREATE TABLE botOwner(
    ownerId VARCHAR(100) NOT NULL PRIMARY KEY,
    ownerName VARCHAR(100) NOT NULL,

);

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
    roleAdd BOOLEAN DEFAULT FALSE
);

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
        roleAdd VARCHAR(100) DEFAULT 'unrank'

);

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
    roleAdd BOOLEAN DEFAULT TRUE

);

CREATE TABLE giveaway(
    guildId VARCHAR(100) NOT NULL,
    temps VARCHAR(100) DEFAULT '6000',
    channel VARCHAR(100) DEFAULT 'Aucun',
    gagnant VARCHAR(100),
    vc BOOLEAN DEFAULT FALSE,
    gain VARCHAR(100) DEFAULT 'Aucun'

);
CREATE TABLE reactRole(
    guildId VARCHAR(100) NOT NULL,
    channelId VARCHAR(100) DEFAULT NULL,
    msgId VARCHAR(100) DEFAULT NULL,
    role TEXT DEFAULT (''),
    emoji TEXT DEFAULT ('')
);

CREATE TABLE isOn(
    ison BOOLEAN DEFAULT FALSE
);
INSERT INTO botOwner VALUES ('188356697482330122', 'takefy');
INSERT INTO botOwner VALUES ('443812465772462090', 'kpri');
INSERT INTO botOwner VALUES ('659038301331783680', 'baby');



