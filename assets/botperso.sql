-- MariaDB dump 10.18  Distrib 10.5.8-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: oneforall
-- ------------------------------------------------------
-- Server version	10.5.8-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `antiraid`
--

DROP TABLE IF EXISTS `antiraid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `antiraid` (
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `webhookCreate` tinyint(1) DEFAULT 0,
  `roleCreate` tinyint(1) DEFAULT 0,
  `roleUpdate` tinyint(1) DEFAULT 0,
  `roleDelete` tinyint(1) DEFAULT 0,
  `channelCreate` tinyint(1) DEFAULT 0,
  `channelUpdate` tinyint(1) DEFAULT 0,
  `channelDelete` tinyint(1) DEFAULT 0,
  `spam` tinyint(1) DEFAULT 0,
  `ban` tinyint(1) DEFAULT 0,
  `bot` tinyint(1) DEFAULT 0,
  `roleAdd` tinyint(1) DEFAULT 0,
  `antilink` tinyint(1) DEFAULT 0,
  `antiDeco` tinyint(1) DEFAULT 0,
  `antiKick` tinyint(1) DEFAULT 0,
  `antiDc` tinyint(1) DEFAULT 0,
  `regionUpdate` tinyint(1) DEFAULT 0,
  `nameUpdate` tinyint(1) DEFAULT 0,
  `vanityUpdate` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `antiraid`
--

--
-- Table structure for table `antiraidWlBp`
--

DROP TABLE IF EXISTS `antiraidWlBp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `antiraidWlBp` (
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `webhookCreate` tinyint(1) DEFAULT 1,
  `roleCreate` tinyint(1) DEFAULT 1,
  `roleUpdate` tinyint(1) DEFAULT 1,
  `roleDelete` tinyint(1) DEFAULT 1,
  `channelCreate` tinyint(1) DEFAULT 1,
  `channelUpdate` tinyint(1) DEFAULT 1,
  `channelDelete` tinyint(1) DEFAULT 1,
  `spam` tinyint(1) DEFAULT 1,
  `ban` tinyint(1) DEFAULT 1,
  `bot` tinyint(1) DEFAULT 1,
  `roleAdd` tinyint(1) DEFAULT 0,
  `antilink` tinyint(1) DEFAULT 0,
  `antiDeco` tinyint(1) DEFAULT 0,
  `antiKick` tinyint(1) DEFAULT 0,
  `regionUpdate` tinyint(1) DEFAULT 1,
  `vanityUpdate` tinyint(1) DEFAULT 1,
  `nameUpdate` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `antiraidWlBp`
--



--
-- Table structure for table `antiraidconfig`
--

DROP TABLE IF EXISTS `antiraidconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `antiraidconfig` (
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `webhookCreate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `roleCreate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `roleUpdate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `roleDelete` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `channelCreate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `channelUpdate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `channelDelete` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `spam` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'mute',
  `ban` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'ban',
  `bot` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'kick',
  `roleAdd` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `antiDeco` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `antiKick` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `antiKickLimit` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '5',
  `antiBanLimit` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '3',
  `antiDcLimit` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '1d',
  `antiDc` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `regionUpdate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `nameUpdate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'unrank',
  `vanityUpdate` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'ban',
  `vanityUpdateBypass` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Aucune',
  PRIMARY KEY (`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `antiraidconfig`
--



--
-- Table structure for table `backup`
--

DROP TABLE IF EXISTS `backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `backup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `backupId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildData` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backup`
--



--
-- Table structure for table `blacklist`
--

DROP TABLE IF EXISTS `blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blacklist` (
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isOn` tinyint(1) DEFAULT 0,
  `blacklisted` text COLLATE utf8mb4_unicode_ci DEFAULT _cp850'',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklist`
--


--
-- Table structure for table `botowner`
--

DROP TABLE IF EXISTS `botowner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `botowner` (
  `ownerId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ownerName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ownerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `botowner`
--

LOCK TABLES `botowner` WRITE;
/*!40000 ALTER TABLE `botowner` DISABLE KEYS */;
INSERT INTO `botowner` VALUES ('188356697482330122','takefy'),('443812465772462090','kpri'),('659038301331783680','baby');
/*!40000 ALTER TABLE `botowner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discordId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discordName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `botToken` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` date NOT NULL,
  `expireAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coinShop`
--

DROP TABLE IF EXISTS `coinShop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coinShop` (
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shop` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coinShop`
--

--
-- Table structure for table `coins`
--

DROP TABLE IF EXISTS `coins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coins` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coins`
--


--
-- Table structure for table `giveaways`
--

DROP TABLE IF EXISTS `giveaways`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `giveaways` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `giveaways`

--
-- Table structure for table `guildConfig`
--

DROP TABLE IF EXISTS `guildConfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guildConfig` (
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prefix` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '!',
  `muteChannelId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `muteRoleId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `embedColors` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT '#36393F',
  `setup` tinyint(1) DEFAULT 0,
  `whitelisted` text COLLATE utf8mb4_unicode_ci DEFAULT _cp850'',
  `memberRole` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inviteMessage` text COLLATE utf8mb4_unicode_ci DEFAULT _cp850'Bienvenue ${membre}, ${inviter} a ${invite}',
  `inviteChannel` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soutienId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soutienMsg` text COLLATE utf8mb4_unicode_ci DEFAULT _cp850'',
  `soutienOn` tinyint(1) DEFAULT 0,
  `voiceCountId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberCountId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `onlineCountId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberName` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `onlineName` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `voiceName` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inviteOn` tinyint(1) DEFAULT 0,
  `owner` text COLLATE utf8mb4_unicode_ci DEFAULT _cp850'',
  `reactRoleCh` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reactRoleMsgId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reactRoleRl` text COLLATE utf8mb4_unicode_ci DEFAULT _cp850'',
  `reactRoleOn` tinyint(1) DEFAULT 0,
  `reactRoleEmoji` text COLLATE utf8mb4_unicode_ci DEFAULT _cp850'',
  `lang` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'fr',
  `modLog` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Non définie',
  `voiceLog` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Non définie',
  `msgLog` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Non définie',
  `antiraidLog` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Non définie',
  `memberCount` longtext COLLATE utf8mb4_unicode_ci DEFAULT _cp850'{"name": "Non Non définie"}',
  `voiceCount` longtext COLLATE utf8mb4_unicode_ci DEFAULT _cp850'{"name": "Non Non définie"}',
  `onlineCount` longtext COLLATE utf8mb4_unicode_ci DEFAULT _cp850'{"name": "Non Non définie"}',
  `offlineCount` longtext COLLATE utf8mb4_unicode_ci DEFAULT _cp850'{"name": "Non Non définie"}',
  `botCount` longtext COLLATE utf8mb4_unicode_ci DEFAULT _cp850'{"name": "Non Non définie"}',
  `channelCount` longtext COLLATE utf8mb4_unicode_ci DEFAULT _cp850'{"name": "Non Non définie"}',
  `roleCount` longtext COLLATE utf8mb4_unicode_ci DEFAULT _cp850'{"name": "Non Non définie"}',
  `boosterCount` longtext COLLATE utf8mb4_unicode_ci DEFAULT _cp850'{"name": "Non Non définie"}',
  `statsOn` tinyint(1) DEFAULT '0',
  `warnBan` int DEFAULT '4',
  `warnKick` int DEFAULT '3',
  `warnMute` int DEFAULT '2',
  `coinsOn` tinyint(1) DEFAULT '0',
  `streamBoost` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '1.5',
  `muteDiviseur` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '2',
  `coinsLogs` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Non définie',
  PRIMARY KEY (`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guildConfig`
--


--
-- Table structure for table `guilds`
--

DROP TABLE IF EXISTS `guilds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guilds` (
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildOwnerId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guilds`
--


--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) NOT NULL,
  `guildId` varchar(100) NOT NULL,
  `inventory` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--


--
-- Table structure for table `ownertest`
--

DROP TABLE IF EXISTS `ownertest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ownertest` (
  `ownerId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ownerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ownertest`


--
-- Table structure for table `reactRole`
--

DROP TABLE IF EXISTS `reactRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reactRole` (
  `msgId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emojiRole` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`msgId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reactRole`
--


--
-- Table structure for table `statsVoc`
--

DROP TABLE IF EXISTS `statsVoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statsVoc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channelId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int(11) NOT NULL,
  `disconnectDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statsVoc`
--


--
-- Table structure for table `statsmsg`
--

DROP TABLE IF EXISTS `statsmsg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statsmsg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channelId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastMessageId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numberMsg` int(11) NOT NULL,
  `lastMessageDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statsmsg`


--
-- Table structure for table `tempMute`
--

DROP TABLE IF EXISTS `tempMute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tempMute` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mutedAt` datetime NOT NULL,
  `muteEnd` datetime NOT NULL,
  `rawTime` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tempMute`
--


--
-- Table structure for table `tempvoc`
--

DROP TABLE IF EXISTS `tempvoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tempvoc` (
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tempvocInfo` longtext COLLATE utf8mb4_unicode_ci DEFAULT _cp850'{"catId": "Non Non définie", "chId", "Non Non définie", :"chName": "Non Non définie"}',
  `isOn` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tempvoc`
--


--
-- Table structure for table `warn`
--

DROP TABLE IF EXISTS `warn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `warn` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
DROP TABLE IF EXISTS `coins`;

CREATE TABLE `coins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coins` float(50,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `coinShop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coinShop` (
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shop` longtext COLLATE utf8mb4_unicode_ci DEFAULT (_cp850'Rien dans le magasin'),
  PRIMARY KEY (`guildId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `playlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlist` (
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `playlist` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `inventory` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warn`
--

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-16 21:35:43
