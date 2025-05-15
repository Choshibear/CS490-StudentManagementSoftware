CREATE DATABASE  IF NOT EXISTS `esms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `esms`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: student-portal-db.cdsa0g4q2379.us-east-1.rds.amazonaws.com    Database: esms
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `sender_role` enum('students','teachers','parents','admins') NOT NULL,
  `receiver_id` int NOT NULL,
  `receiver_role` enum('students','teachers','parents','admins') NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `body` text,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `unread` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,'students',46,'students','Hello','have you done the homework?','2025-05-03 22:52:29',0),(2,46,'students',1,'students','Test','We have a test tomorrow','2025-05-03 23:00:39',0),(3,1,'students',46,'students','Homework','Homework12 is due tonight','2025-05-03 23:02:33',0),(4,1,'students',46,'students','HW13','HW is due next week btw','2025-05-03 23:06:40',0),(5,46,'students',46,'students','Re: Test','Yes','2025-05-03 23:52:35',0),(6,1,'students',46,'students','Re: Test','yes, we do','2025-05-03 23:53:11',0),(7,46,'students',1,'students','Re: HW13',' thanks','2025-05-03 23:54:47',0),(8,1,'students',46,'students','Re: Test',' tyyyy','2025-05-03 23:57:07',0),(9,1,'students',46,'students','do we have class friady',' do we?','2025-05-03 23:57:52',0),(10,1,'students',1,'students','Re: do we have class friady',' answer','2025-05-03 23:58:16',0),(11,46,'students',1,'students','Re: do we have class friady',' no we dont','2025-05-04 00:04:27',0),(12,3,'teachers',1,'students','Quiz5',' Please submit quiz 5 as soon as possible','2025-05-04 01:53:11',0),(13,1,'students',3,'teachers','Re: Quiz5',' submitted!','2025-05-04 01:53:52',0),(14,3,'teachers',11,'teachers','Module 2',' Hello Daniel, Have you completed module 2 yet?\n','2025-05-04 01:58:18',1),(15,3,'teachers',1,'parents','Absence',' Jake was sick in class today','2025-05-04 02:01:38',0),(16,3,'teachers',1,'students','Re: Re: Quiz5','Great, will grade soon!','2025-05-04 02:02:03',0),(17,1,'students',12,'students','Hello','How r u','2025-05-04 02:04:43',1),(18,1,'students',46,'students','Hello',' I havent done the hw','2025-05-04 02:05:10',0),(19,46,'students',1,'students','Class','No class on Friday','2025-05-04 02:07:17',0),(20,46,'students',1,'students','monday','Monday is cancelled too','2025-05-04 02:07:30',0),(21,3,'teachers',1,'students',' HW 8',' HW 8 is not turned in','2025-05-04 03:05:31',0),(22,1,'students',46,'students','HW7','  Please turn in hw 7','2025-05-04 03:23:02',0),(23,46,'students',1,'students',' hi',' hi','2025-05-04 03:24:03',0),(24,1,'students',46,'students','Re:  hi',' hello','2025-05-04 03:24:31',0),(25,46,'students',1,'teachers','nn','nn','2025-05-04 03:25:13',0),(26,46,'students',3,'teachers','noo','00','2025-05-04 03:26:15',0),(27,3,'teachers',46,'students','qqqqqs','qsqsqs','2025-05-04 03:27:32',0),(28,3,'teachers',46,'students','tg','tg','2025-05-04 03:27:46',0),(29,46,'students',3,'teachers','Re: tg','hello ','2025-05-04 03:29:46',0),(30,46,'students',3,'teachers','Re: qqqqqs','hi','2025-05-04 03:29:52',0),(31,46,'students',1,'students','Re: Re:  hi','kokok','2025-05-04 03:29:57',0),(32,46,'students',1,'students','Re: HW7','de,ld','2025-05-04 03:30:00',0),(33,1,'students',1,'students','Re: Re: do we have class friady','ded','2025-05-04 03:35:38',0),(34,1,'students',1,'students','Re: Re: do we have class friady','gtgt','2025-05-04 03:35:41',0),(35,1,'students',1,'students','Re: Re: do we have class friady','hyhyh','2025-05-04 03:35:44',0),(36,1,'students',1,'students','Re: Re: do we have class friady','hyhyh','2025-05-04 03:35:47',0),(37,1,'admins',3,'teachers','Lesson Plan',' Lesson plan is revised.','2025-05-04 03:50:28',0),(38,3,'teachers',46,'students','hw4','unsubmitted','2025-05-04 03:51:30',0),(39,3,'teachers',46,'students',' hw5',' unsubmitted','2025-05-04 03:51:42',0),(40,46,'students',3,'teachers','Re:  hw5','Thank u','2025-05-04 03:55:23',0),(41,46,'students',3,'teachers','Re:  hw5',' apprecite it\n','2025-05-04 03:55:28',0),(42,46,'students',3,'teachers','Re:  hw5',' see u tomotw','2025-05-04 03:55:31',0),(43,3,'teachers',46,'students','Re: Re:  hw5','ok','2025-05-04 03:56:31',0),(44,3,'teachers',46,'students','Re: Re:  hw5','ok','2025-05-04 03:56:34',0),(45,3,'teachers',46,'students','Re: Re:  hw5','ok','2025-05-04 03:56:37',0),(46,3,'teachers',46,'students','Re: Re:  hw5','ok','2025-05-04 03:56:40',0),(47,46,'students',1,'students','Re: Hello','hi','2025-05-04 03:59:10',0),(48,46,'students',1,'students','Re: Hello',' by','2025-05-04 03:59:12',0),(49,46,'students',1,'students','Re: Hello',' nu','2025-05-04 03:59:14',0),(50,1,'students',46,'students','Re: Re: Hello','ko','2025-05-04 04:02:10',1),(51,1,'students',46,'students','Re: Re: Hello','ok','2025-05-04 04:02:13',0),(52,1,'students',46,'students','Re: Re: Hello','ok','2025-05-04 04:02:15',0),(53,1,'students',3,'teachers','Re: Quiz5','n','2025-05-04 04:09:27',0),(54,3,'teachers',1,'students','Re: Re: Quiz5','vfd','2025-05-04 04:12:27',1),(55,3,'teachers',1,'students','Re: Re: Quiz5','vdfv','2025-05-04 04:12:30',0),(56,3,'teachers',1,'students','Re: Re: Quiz5','fdvd','2025-05-04 04:12:31',0),(57,1,'students',46,'students','Re: Re: Hello','frff','2025-05-04 04:13:15',0),(58,1,'students',46,'students','Re: Re: Hello','rfrf','2025-05-04 04:13:17',1),(59,1,'students',46,'students','Re: Re: Hello','frf','2025-05-04 04:13:20',1),(60,1,'students',46,'students','Re: Re: Hello','rfrf','2025-05-04 04:13:22',1),(61,1,'parents',1,'teachers','Jake\'s Sick Leave','Jake will not be in class this week for he will be in the hospital.','2025-05-04 04:44:12',0),(62,1,'teachers',1,'parents','Re: Jake\'s Sick Leave','Understandable,Jake will be excused until he returns.','2025-05-04 04:48:16',0),(63,9,'students',1,'teachers','Test?','Will there be a test this week?','2025-05-08 06:23:05',0),(64,8,'parents',3,'teachers','Absence Notice','My daughter Charlotte Harris will not be in school this entire week due to a flu.','2025-05-08 06:25:46',0),(65,9,'students',3,'teachers','Make-up test???','Can I make up this weeks test????','2025-05-08 08:15:27',0),(66,3,'teachers',9,'students','Re: Make-up test???','NO!!!!!! STUDY!!!!!','2025-05-08 08:24:45',0),(67,3,'teachers',8,'parents','Charlottes Behavior','We must set up a meeting about your daughter soon!','2025-05-08 08:25:39',0),(68,9,'students',3,'teachers','Extra Credit?','Can i please get some extra credit???','2025-05-08 10:36:36',0),(69,8,'parents',3,'teachers','Re: Charlottes Behavior','Okay, we will meet soon!','2025-05-08 10:40:18',0),(70,8,'parents',9,'students','My Child','sup','2025-05-08 21:25:32',1),(71,3,'teachers',9,'students','Missing HW','Please turn in your homework!','2025-05-09 05:06:04',0);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-14 21:28:43
