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
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `enrollmentId` int NOT NULL AUTO_INCREMENT,
  `studentId` int DEFAULT NULL,
  `courseId` int DEFAULT NULL,
  `enrollmentDate` date DEFAULT NULL,
  PRIMARY KEY (`enrollmentId`),
  KEY `studentId` (`studentId`),
  KEY `courseId` (`courseId`),
  KEY `idx_enroll_student_course` (`studentId`,`courseId`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`),
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`)
) ENGINE=InnoDB AUTO_INCREMENT=255 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (1,1,1,'2025-03-27'),(2,2,1,'2025-03-27'),(3,3,1,'2025-03-27'),(4,4,1,'2025-03-27'),(5,5,1,'2025-03-27'),(6,6,1,'2025-03-27'),(7,1,2,'2025-03-27'),(8,2,2,'2025-03-27'),(9,3,2,'2025-03-27'),(10,7,2,'2025-03-27'),(11,8,2,'2025-03-27'),(12,9,2,'2025-03-27'),(13,10,3,'2025-03-27'),(14,11,3,'2025-03-27'),(15,12,3,'2025-03-27'),(16,13,3,'2025-03-27'),(17,14,3,'2025-03-27'),(18,15,3,'2025-03-27'),(19,2,4,'2025-03-27'),(20,16,4,'2025-03-27'),(21,17,4,'2025-03-27'),(22,18,4,'2025-03-27'),(23,19,4,'2025-03-27'),(24,20,4,'2025-03-27'),(25,3,5,'2025-03-27'),(26,21,5,'2025-03-27'),(27,22,5,'2025-03-27'),(28,23,5,'2025-03-27'),(29,24,5,'2025-03-27'),(30,25,5,'2025-03-27'),(31,4,6,'2025-03-27'),(32,26,6,'2025-03-27'),(33,27,6,'2025-03-27'),(34,28,6,'2025-03-27'),(35,29,6,'2025-03-27'),(36,30,6,'2025-03-27'),(37,1,7,'2025-03-27'),(38,5,7,'2025-03-27'),(39,6,7,'2025-03-27'),(40,7,7,'2025-03-27'),(41,8,7,'2025-03-27'),(42,9,7,'2025-03-27'),(43,2,8,'2025-03-27'),(44,10,8,'2025-03-27'),(45,11,8,'2025-03-27'),(46,12,8,'2025-03-27'),(47,13,8,'2025-03-27'),(48,14,8,'2025-03-27'),(49,3,9,'2025-03-27'),(50,15,9,'2025-03-27'),(51,16,9,'2025-03-27'),(52,17,9,'2025-03-27'),(53,18,9,'2025-03-27'),(54,19,9,'2025-03-27'),(55,4,10,'2025-03-27'),(56,20,10,'2025-03-27'),(57,21,10,'2025-03-27'),(58,22,10,'2025-03-27'),(59,23,10,'2025-03-27'),(60,24,10,'2025-03-27'),(61,5,11,'2025-03-27'),(62,25,11,'2025-03-27'),(63,26,11,'2025-03-27'),(64,27,11,'2025-03-27'),(65,28,11,'2025-03-27'),(66,29,11,'2025-03-27'),(67,6,12,'2025-03-27'),(68,30,12,'2025-03-27'),(69,18,12,'2025-03-27'),(70,19,12,'2025-03-27'),(71,20,12,'2025-03-27'),(72,21,12,'2025-03-27'),(73,22,12,'2025-03-27'),(74,1,13,'2025-03-27'),(75,3,13,'2025-03-27'),(76,25,13,'2025-03-27'),(77,26,13,'2025-03-27'),(78,27,13,'2025-03-27'),(79,28,13,'2025-03-27'),(80,2,14,'2025-03-27'),(81,5,14,'2025-03-27'),(82,31,14,'2025-03-27'),(83,32,14,'2025-03-27'),(84,33,14,'2025-03-27'),(85,34,14,'2025-03-27'),(86,6,15,'2025-03-27'),(87,7,15,'2025-03-27'),(88,37,15,'2025-03-27'),(89,38,15,'2025-03-27'),(90,39,15,'2025-03-27'),(91,40,15,'2025-03-27'),(92,41,16,'2025-03-27'),(93,42,16,'2025-03-27'),(94,43,16,'2025-03-27'),(95,44,16,'2025-03-27'),(96,45,16,'2025-03-27'),(97,46,16,'2025-03-27'),(98,1,17,'2025-03-27'),(99,2,17,'2025-03-27'),(100,3,17,'2025-03-27'),(101,4,17,'2025-03-27'),(102,5,17,'2025-03-27'),(103,6,17,'2025-03-27'),(104,7,18,'2025-03-27'),(105,8,18,'2025-03-27'),(106,9,18,'2025-03-27'),(107,10,18,'2025-03-27'),(108,11,18,'2025-03-27'),(109,12,18,'2025-03-27'),(110,13,19,'2025-03-27'),(111,14,19,'2025-03-27'),(112,15,19,'2025-03-27'),(113,16,19,'2025-03-27'),(114,17,19,'2025-03-27'),(115,18,19,'2025-03-27'),(116,19,20,'2025-03-27'),(117,20,20,'2025-03-27'),(118,21,20,'2025-03-27'),(119,22,20,'2025-03-27'),(120,23,20,'2025-03-27'),(121,24,20,'2025-03-27'),(122,25,21,'2025-03-27'),(123,26,21,'2025-03-27'),(124,27,21,'2025-03-27'),(125,28,21,'2025-03-27'),(126,29,21,'2025-03-27'),(127,30,21,'2025-03-27'),(128,1,22,'2025-03-27'),(129,3,22,'2025-03-27'),(130,4,22,'2025-03-27'),(131,5,22,'2025-03-27'),(132,6,22,'2025-03-27'),(133,7,22,'2025-03-27'),(134,8,23,'2025-03-27'),(135,9,23,'2025-03-27'),(136,10,23,'2025-03-27'),(137,11,23,'2025-03-27'),(138,12,23,'2025-03-27'),(139,13,23,'2025-03-27'),(140,14,24,'2025-03-27'),(141,15,24,'2025-03-27'),(142,16,24,'2025-03-27'),(143,17,24,'2025-03-27'),(144,18,24,'2025-03-27'),(145,19,24,'2025-03-27'),(146,20,25,'2025-03-27'),(147,21,25,'2025-03-27'),(148,22,25,'2025-03-27'),(149,23,25,'2025-03-27'),(150,24,25,'2025-03-27'),(151,25,25,'2025-03-27'),(152,26,26,'2025-03-27'),(153,27,26,'2025-03-27'),(154,28,26,'2025-03-27'),(155,29,26,'2025-03-27'),(156,30,26,'2025-03-27'),(157,1,27,'2025-03-27'),(158,2,27,'2025-03-27'),(159,3,27,'2025-03-27'),(160,4,27,'2025-03-27'),(161,5,27,'2025-03-27'),(162,6,27,'2025-03-27'),(163,7,28,'2025-03-27'),(164,8,28,'2025-03-27'),(165,9,28,'2025-03-27'),(166,10,28,'2025-03-27'),(167,11,28,'2025-03-27'),(168,12,28,'2025-03-27'),(169,13,29,'2025-03-27'),(170,14,29,'2025-03-27'),(171,15,29,'2025-03-27'),(172,16,29,'2025-03-27'),(173,17,29,'2025-03-27'),(174,18,29,'2025-03-27'),(175,19,30,'2025-03-27'),(176,20,30,'2025-03-27'),(177,21,30,'2025-03-27'),(178,22,30,'2025-03-27'),(179,23,30,'2025-03-27'),(180,24,30,'2025-03-27'),(181,25,30,'2025-03-27'),(182,31,17,'2025-03-27'),(183,31,18,'2025-03-27'),(184,31,19,'2025-03-27'),(185,32,17,'2025-03-27'),(186,32,20,'2025-03-27'),(187,32,21,'2025-03-27'),(188,33,18,'2025-03-27'),(189,33,19,'2025-03-27'),(190,33,22,'2025-03-27'),(191,34,20,'2025-03-27'),(192,34,21,'2025-03-27'),(193,34,24,'2025-03-27'),(194,35,22,'2025-03-27'),(195,35,23,'2025-03-27'),(196,35,24,'2025-03-27'),(197,36,23,'2025-03-27'),(198,36,24,'2025-03-27'),(199,36,25,'2025-03-27'),(200,37,25,'2025-03-27'),(201,37,26,'2025-03-27'),(202,37,27,'2025-03-27'),(203,38,26,'2025-03-27'),(204,38,27,'2025-03-27'),(205,38,28,'2025-03-27'),(206,39,28,'2025-03-27'),(207,39,29,'2025-03-27'),(208,39,30,'2025-03-27'),(209,40,29,'2025-03-27'),(210,40,30,'2025-03-27'),(211,40,17,'2025-03-27'),(212,41,18,'2025-03-27'),(213,41,19,'2025-03-27'),(214,41,20,'2025-03-27'),(215,42,19,'2025-03-27'),(216,42,22,'2025-03-27'),(217,42,23,'2025-03-27'),(218,43,22,'2025-03-27'),(219,43,23,'2025-03-27'),(220,43,24,'2025-03-27'),(221,44,23,'2025-03-27'),(222,44,24,'2025-03-27'),(223,44,25,'2025-03-27'),(224,45,24,'2025-03-27'),(225,45,25,'2025-03-27'),(226,45,26,'2025-03-27'),(227,46,25,'2025-03-27'),(228,46,26,'2025-03-27'),(229,46,27,'2025-03-27'),(230,47,26,'2025-03-27'),(231,47,27,'2025-03-27'),(232,47,28,'2025-03-27'),(233,48,27,'2025-03-27'),(234,48,28,'2025-03-27'),(235,48,29,'2025-03-27'),(236,49,28,'2025-03-27'),(237,49,29,'2025-03-27'),(238,49,30,'2025-03-27'),(239,50,29,'2025-03-27'),(240,50,30,'2025-03-27'),(241,50,17,'2025-03-27'),(244,9,NULL,'2025-05-08'),(247,9,32,'2025-05-08'),(248,2,NULL,'2025-05-09'),(249,1,NULL,'2025-05-09'),(250,9,NULL,'2025-05-09'),(251,5,NULL,'2025-05-09'),(252,2,33,'2025-05-09'),(253,9,33,'2025-05-09'),(254,1,33,'2025-05-09');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
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

-- Dump completed on 2025-05-14 21:29:03
