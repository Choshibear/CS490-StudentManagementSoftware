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
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `teacherId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` int DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`teacherId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,'John','Smith','j.smith@school.edu',NULL,NULL,NULL,NULL,NULL,'johnsmith1','T3acherP@ss1'),(2,'Mary','Jones','m.jones@school.edu',NULL,NULL,NULL,NULL,NULL,'mjones','T3acherP@ss2'),(3,'John','Smith','john.smith@example.com','123 Elm St','Los Angeles','CA',90001,'555-123-4567','jsmith','password123'),(4,'Jane','Doe','jane.doe@example.com','456 Oak Ave','San Diego','CA',92101,'555-234-5678','jdoe','securepass456'),(5,'Michael','Johnson','michael.j@example.com','789 Pine Rd','San Francisco','CA',94102,'555-345-6789','mjohnson','mypass789'),(6,'Emily','Davis','emily.d@example.com','101 Maple Ln','Sacramento','CA',95814,'555-456-7890','edavis','pass987'),(7,'David','Martinez','david.m@example.com','202 Birch Dr','Austin','TX',73301,'555-567-8901','dmartinez','davidpass456'),(8,'Sarah','Wilson','sarah.w@example.com','303 Cedar Ct','Houston','TX',77001,'555-678-9012','swilson','swilsonpass123'),(9,'Robert','Anderson','robert.a@example.com','404 Walnut St','Denver','CO',80202,'555-789-0123','randerson','andersonpass789'),(10,'Jessica','Thomas','jessica.t@example.com','505 Spruce Blvd','Phoenix','AZ',85001,'555-890-1234','jthomas','jesspass456'),(11,'Daniel','Harris','daniel.h@example.com','606 Redwood Cir','Seattle','WA',98101,'555-901-2345','dharris','harrispass789'),(12,'Laura','White','laura.w@example.com','707 Aspen Way','Miami','FL',33101,'555-012-3456','lwhite','whitepass123');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
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

-- Dump completed on 2025-05-14 21:28:53
