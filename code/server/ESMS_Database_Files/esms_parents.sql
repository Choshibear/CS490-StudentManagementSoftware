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
-- Table structure for table `parents`
--

DROP TABLE IF EXISTS `parents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parents` (
  `parentId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`parentId`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parents`
--

LOCK TABLES `parents` WRITE;
/*!40000 ALTER TABLE `parents` DISABLE KEYS */;
INSERT INTO `parents` VALUES (1,'James-Johnny','Johnson','j_johnson@example.com','123 Maple St.','Los Angeles','CA','90001','555-111-2222','jjohnson','JohnsonPass123!'),(2,'Laura-Lane','Smith','l-smith@example.com','456 Oak Ave.','San Diego','CA','92101','555-222-3333','lsmith','ParentPass2@'),(3,'Robert','Brown','r.brown@example.com','789 Pine Rd','San Francisco','CA','94102','555-333-4444','rbrown','ParentPass3#'),(4,'Maria','Davis','m.davis@example.com','101 Birch Ln','Sacramento','CA','95814','555-444-5555','mdavis','ParentPass4$'),(5,'Daniel','Martinez','d.martinez@example.com','202 Cedar Dr','Austin','TX','73301','555-555-6666','dmartinez','ParentPass5%'),(6,'Mia','Lopez','mia.lopez1@example.com','916 Poplar Ave','San Francisco','CA','57777','555-728-2086','mlopez1','ParentPass1%'),(7,'Matthew','Gonzalez','matthew.gonzalez2@example.com','471 Walnut St','New York','NY','85774','555-562-7264','mgonzalez2','ParentPass2%'),(8,'Julie','Harris','seldo002@csusm.edu','259 Cedar Dr','Miami','FL','17682','555-272-7823','mmoore3','ParentPass3%'),(9,'Evelyn','Thomas','evelyn.thomas4@example.com','728 Maple Ave','Chicago','IL','94995','555-653-3554','ethomas4','ParentPass4%'),(10,'Harper','Lopez','harper.lopez5@example.com','663 Birch Ln','San Francisco','CA','37934','555-419-7991','hlopez5','ParentPass5%'),(11,'Charlotte','Jones','charlotte.jones6@example.com','636 Poplar Ave','Chicago','IL','87553','555-742-5988','cjones6','ParentPass6%'),(12,'James','Davis','james.davis7@example.com','781 Elm St','Seattle','WA','68430','555-328-3713','jdavis7','ParentPass7%'),(13,'Harper','Hernandez','harper.hernandez8@example.com','998 Poplar Ave','San Francisco','CA','26532','555-877-3165','hhernandez8','ParentPass8%'),(14,'Charlotte','Moore','cruz560@csusm.edu','190 Poplar Ave','Seattle','WA','37687','555-333-6026','cmoore9','ParentPass9%'),(15,'Joseph','Brown','joseph.brown10@example.com','453 Maple Ave','Seattle','WA','85160','555-452-8453','jbrown10','ParentPass10%'),(16,'Olivia','Miller','olivia.miller11@example.com','688 Maple Ave','Chicago','IL','82706','555-368-7612','omiller11','ParentPass11%'),(17,'Isabella','Smith','isabella.smith12@example.com','575 Spruce Dr','Chicago','IL','67850','555-899-9108','ismith12','ParentPass12%'),(18,'Isabella','Miller','isabella.miller13@example.com','685 Cherry Rd','Miami','FL','67368','555-264-2362','imiller13','ParentPass13%'),(19,'Mia','Hernandez','mia.hernandez14@example.com','469 Poplar Ave','Austin','TX','51561','555-929-5947','mhernandez14','ParentPass14%'),(20,'David','Smith','david.smith15@example.com','754 Poplar Ave','Houston','TX','18624','555-330-6869','dsmith15','ParentPass15%'),(21,'Emily','Anderson','emily.anderson16@example.com','849 Birch Ln','Houston','TX','83332','555-770-1349','eanderson16','ParentPass16%'),(22,'Evelyn','Martin','evelyn.martin17@example.com','407 Poplar Ave','Miami','FL','10614','555-902-9115','emartin17','ParentPass17%'),(23,'Michael','Wilson','michael.wilson18@example.com','791 Spruce Dr','Denver','CO','16352','555-651-8576','mwilson18','ParentPass18%'),(24,'Amelia','Lopez','amelia.lopez19@example.com','286 Walnut St','Miami','FL','62799','555-299-1390','alopez19','ParentPass19%'),(25,'Mia','Williams','mia.williams20@example.com','829 Cherry Rd','Seattle','WA','93627','555-662-8891','mwilliams20','ParentPass20%'),(26,'Joseph','Gonzalez','joseph.gonzalez21@example.com','963 Spruce Dr','Miami','FL','43887','555-513-1315','jgonzalez21','ParentPass21%'),(27,'Sophia','Smith','sophia.smith22@example.com','747 Cedar Dr','Austin','TX','58898','555-638-1626','ssmith22','ParentPass22%'),(28,'Olivia','Johnson','olivia.johnson23@example.com','233 Cedar Dr','Miami','FL','96419','555-182-4888','ojohnson23','ParentPass23%'),(29,'Mia','Garcia','mia.garcia24@example.com','262 Cedar Dr','Dallas','TX','95978','555-146-2918','mgarcia24','ParentPass24%'),(30,'Amelia','Lopez','amelia.lopez25@example.com','398 Spruce Dr','Los Angeles','CA','38561','555-673-8651','alopez25','ParentPass25%'),(31,'Andrew','Wilson','andrew.wilson26@example.com','157 Oak St','Miami','FL','97959','555-616-7198','awilson26','ParentPass26%'),(32,'Isabella','Brown','isabella.brown27@example.com','336 Birch Ln','Chicago','IL','30840','555-660-9738','ibrown27','ParentPass27%'),(33,'Ava','Jones','ava.jones28@example.com','848 Maple Ave','Seattle','WA','31578','555-526-5135','ajones28','ParentPass28%'),(34,'Daniel','Wilson','daniel.wilson29@example.com','402 Spruce Dr','Denver','CO','36972','555-939-2671','dwilson29','ParentPass29%'),(35,'Olivia','Wilson','olivia.wilson30@example.com','247 Cherry Rd','San Francisco','CA','58270','555-156-4890','owilson30','ParentPass30%'),(36,'Ava','Jackson','ava.jackson31@example.com','605 Maple Ave','New York','NY','77925','555-789-9540','ajackson31','ParentPass31%'),(37,'Michael','Wilson','michael.wilson32@example.com','223 Pine Rd','Dallas','TX','11492','555-756-7703','mwilson32','ParentPass32%'),(38,'James','Thomas','james.thomas33@example.com','489 Cedar Dr','San Francisco','CA','88299','555-370-1925','jthomas33','ParentPass33%'),(39,'Mia','Davis','mia.davis34@example.com','508 Maple Ave','Seattle','WA','44084','555-659-9568','mdavis34','ParentPass34%'),(40,'Mia','Davis','mia.davis35@example.com','139 Oak St','Chicago','IL','56202','555-271-2885','mdavis35','ParentPass35%'),(41,'Olivia','Martin','olivia.martin36@example.com','487 Maple Ave','Los Angeles','CA','41915','555-993-6041','omartin36','ParentPass36%'),(42,'Anthony','Miller','anthony.miller37@example.com','761 Poplar Ave','Los Angeles','CA','14817','555-643-6153','amiller37','ParentPass37%'),(43,'Anthony','Rodriguez','anthony.rodriguez38@example.com','954 Cherry Rd','Houston','TX','46163','555-320-1035','arodriguez38','ParentPass38%'),(44,'Joseph','Rodriguez','joseph.rodriguez39@example.com','831 Poplar Ave','New York','NY','90618','555-812-4596','jrodriguez39','ParentPass39%'),(45,'Joshua','Garcia','joshua.garcia40@example.com','340 Maple Ave','San Francisco','CA','44423','555-912-5265','jgarcia40','ParentPass40%'),(46,'Isabella','Miller','isabella.miller41@example.com','727 Maple Ave','New York','NY','89498','555-273-6558','imiller41','ParentPass41%'),(47,'Joshua','Hernandez','joshua.hernandez42@example.com','830 Elm St','Houston','TX','97963','555-559-2036','jhernandez42','ParentPass42%'),(48,'Michael','Brown','michael.brown43@example.com','833 Cherry Rd','New York','NY','17363','555-112-6885','mbrown43','ParentPass43%'),(49,'Mia','Wilson','mia.wilson44@example.com','317 Walnut St','New York','NY','76142','555-700-4851','mwilson44','ParentPass44%'),(50,'James','Lopez','james.lopez45@example.com','775 Spruce Dr','Dallas','TX','90243','555-305-8915','jlopez45','ParentPass45%');
/*!40000 ALTER TABLE `parents` ENABLE KEYS */;
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

-- Dump completed on 2025-05-14 21:28:45
