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
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendanceId` int NOT NULL AUTO_INCREMENT,
  `studentId` int NOT NULL,
  `courseId` int NOT NULL,
  `attendanceDate` date NOT NULL,
  `status` enum('Present','Absent','Tardy','Excused') NOT NULL DEFAULT 'Present',
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`attendanceId`),
  UNIQUE KEY `uniq_attendance` (`studentId`,`courseId`,`attendanceDate`),
  KEY `fk_attendance_course` (`courseId`),
  CONSTRAINT `fk_attendance_course` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE,
  CONSTRAINT `fk_attendance_enroll` FOREIGN KEY (`studentId`, `courseId`) REFERENCES `enrollments` (`studentId`, `courseId`) ON DELETE CASCADE,
  CONSTRAINT `fk_attendance_student` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,1,1,'2025-05-08','Present',NULL),(2,2,1,'2025-05-08','Present',NULL),(3,3,1,'2025-05-08','Present',NULL),(4,4,1,'2025-05-08','Present',NULL),(5,5,1,'2025-05-08','Present',NULL),(6,6,1,'2025-05-08','Present',NULL),(7,10,3,'2025-05-08','Excused',NULL),(8,11,3,'2025-05-08','Absent',NULL),(9,12,3,'2025-05-08','Absent',NULL),(10,13,3,'2025-05-08','Tardy',NULL),(11,14,3,'2025-05-08','Absent',NULL),(12,15,3,'2025-05-08','Present',NULL),(49,10,3,'2025-05-05','Absent',NULL),(50,11,3,'2025-05-05','Tardy',NULL),(51,12,3,'2025-05-05','Present',NULL),(52,13,3,'2025-05-05','Excused',NULL),(53,14,3,'2025-05-05','Present',NULL),(54,15,3,'2025-05-05','Absent',NULL),(79,10,3,'2025-05-01','Absent','No excuse'),(80,11,3,'2025-05-01','Tardy',''),(81,12,3,'2025-05-01','Absent',''),(82,13,3,'2025-05-01','Tardy',''),(83,14,3,'2025-05-01','Excused',''),(84,15,3,'2025-05-01','Present',''),(85,8,23,'2025-04-30','Present',''),(86,9,23,'2025-04-30','Tardy','Making changes'),(87,10,23,'2025-04-30','Present',''),(88,11,23,'2025-04-30','Present',''),(89,12,23,'2025-04-30','Present',''),(90,13,23,'2025-04-30','Present',''),(91,35,23,'2025-04-30','Present',''),(92,36,23,'2025-04-30','Present',''),(93,42,23,'2025-04-30','Present',''),(94,43,23,'2025-04-30','Present',''),(95,44,23,'2025-04-30','Present',''),(96,8,23,'2025-05-02','Present',''),(97,9,23,'2025-05-02','Absent',''),(98,10,23,'2025-05-02','Present',''),(99,11,23,'2025-05-02','Present',''),(100,12,23,'2025-05-02','Present',''),(101,13,23,'2025-05-02','Present',''),(102,35,23,'2025-05-02','Present',''),(103,36,23,'2025-05-02','Present',''),(104,42,23,'2025-05-02','Present',''),(105,43,23,'2025-05-02','Present',''),(106,44,23,'2025-05-02','Present',''),(107,8,23,'2025-05-06','Present',''),(108,9,23,'2025-05-06','Absent','no excuse'),(109,10,23,'2025-05-06','Present',''),(110,11,23,'2025-05-06','Present',''),(111,12,23,'2025-05-06','Present',''),(112,13,23,'2025-05-06','Present',''),(113,35,23,'2025-05-06','Present',''),(114,36,23,'2025-05-06','Present',''),(115,42,23,'2025-05-06','Present',''),(116,43,23,'2025-05-06','Present',''),(117,44,23,'2025-05-06','Present',''),(118,8,23,'2025-04-29','Present',''),(119,9,23,'2025-04-29','Absent','eeek'),(120,10,23,'2025-04-29','Present',''),(121,11,23,'2025-04-29','Present',''),(122,12,23,'2025-04-29','Present',''),(123,13,23,'2025-04-29','Present',''),(124,35,23,'2025-04-29','Present',''),(125,36,23,'2025-04-29','Present',''),(126,42,23,'2025-04-29','Present',''),(127,43,23,'2025-04-29','Present',''),(128,44,23,'2025-04-29','Present',''),(129,8,23,'2025-03-11','Present',''),(130,9,23,'2025-03-11','Absent','absent'),(131,10,23,'2025-03-11','Present',''),(132,11,23,'2025-03-11','Present',''),(133,12,23,'2025-03-11','Present',''),(134,13,23,'2025-03-11','Present',''),(135,35,23,'2025-03-11','Present',''),(136,36,23,'2025-03-11','Present',''),(137,42,23,'2025-03-11','Present',''),(138,43,23,'2025-03-11','Present',''),(139,44,23,'2025-03-11','Present',''),(140,8,23,'2025-03-06','Present',''),(141,9,23,'2025-03-06','Absent','absent'),(142,10,23,'2025-03-06','Present',''),(143,11,23,'2025-03-06','Present',''),(144,12,23,'2025-03-06','Present',''),(145,13,23,'2025-03-06','Present',''),(146,35,23,'2025-03-06','Present',''),(147,36,23,'2025-03-06','Present',''),(148,42,23,'2025-03-06','Present',''),(149,43,23,'2025-03-06','Present',''),(150,44,23,'2025-03-06','Present',''),(151,8,23,'2025-04-21','Present',''),(152,9,23,'2025-04-21','Absent',''),(153,10,23,'2025-04-21','Present',''),(154,11,23,'2025-04-21','Present',''),(155,12,23,'2025-04-21','Present',''),(156,13,23,'2025-04-21','Present',''),(157,35,23,'2025-04-21','Present',''),(158,36,23,'2025-04-21','Present',''),(159,42,23,'2025-04-21','Present',''),(160,43,23,'2025-04-21','Present',''),(161,44,23,'2025-04-21','Present',''),(173,8,23,'2025-04-18','Present',''),(174,9,23,'2025-04-18','Absent',''),(175,10,23,'2025-04-18','Present',''),(176,11,23,'2025-04-18','Present',''),(177,12,23,'2025-04-18','Present',''),(178,13,23,'2025-04-18','Present',''),(179,35,23,'2025-04-18','Present',''),(180,36,23,'2025-04-18','Present',''),(181,42,23,'2025-04-18','Present',''),(182,43,23,'2025-04-18','Present',''),(183,44,23,'2025-04-18','Present',''),(184,8,23,'2025-02-24','Present',''),(185,9,23,'2025-02-24','Absent',''),(186,10,23,'2025-02-24','Present',''),(187,11,23,'2025-02-24','Present',''),(188,12,23,'2025-02-24','Present',''),(189,13,23,'2025-02-24','Present',''),(190,35,23,'2025-02-24','Present',''),(191,36,23,'2025-02-24','Present',''),(192,42,23,'2025-02-24','Present',''),(193,43,23,'2025-02-24','Present',''),(194,44,23,'2025-02-24','Present',''),(195,9,32,'2025-05-28','Absent',''),(196,8,23,'2025-05-08','Present',''),(197,9,23,'2025-05-08','Absent','No excuse!'),(198,10,23,'2025-05-08','Present',''),(199,11,23,'2025-05-08','Present',''),(200,12,23,'2025-05-08','Present',''),(201,13,23,'2025-05-08','Present',''),(202,35,23,'2025-05-08','Present',''),(203,36,23,'2025-05-08','Present',''),(204,42,23,'2025-05-08','Present',''),(205,43,23,'2025-05-08','Present',''),(206,44,23,'2025-05-08','Present','');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
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

-- Dump completed on 2025-05-14 21:29:05
