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
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `studentId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip` int DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gradeLevelId` int DEFAULT NULL,
  `studentGpa` decimal(3,2) DEFAULT NULL,
  `studentNotes` text,
  PRIMARY KEY (`studentId`),
  KEY `gradeLevel` (`gradeLevelId`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`gradeLevelId`) REFERENCES `gradelevels` (`gradeLevelId`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Emma','Johnson','2010-03-15','emma_johnson@example.com','123 Maple St','Los Angeles','CA',90001,'555-123-4567','ejohnson','pass123',1,1.42,'Emma has an extreme penut allergy and she has an epipen at at the nurses office.'),(2,'Liam','Smith','2009-07-15','liam_smith@example.com','456 Oak Ave.','San Diego','CA',92101,'555-234-5679','lmsmith','SmithPass123',4,1.42,' Behavioral Issues. Do Not Approach!'),(3,'Olivia','Brown','2011-01-10','olivia.brown@example.com','789 Pine Rd','San Francisco','CA',94102,'555-345-6789','obrown','pass789',1,3.11,NULL),(4,'Noah','Davis','2008-05-30','noah.davis@example.com','101 Birch Ln','Sacramento','CA',95814,'555-456-7890','ndavis','pass987',3,2.86,NULL),(5,'Ava','Martinez','2012-09-18','ava.martinez@example.com','202 Cedar Dr','Austin','TX',73301,'555-567-8901','amartinez','pass456',1,1.56,NULL),(6,'William','Wilson','2007-11-25','william.wilson@example.com','303 Walnut Ct','Houston','TX',77001,'555-678-9012','wwilson','pass123',4,2.76,NULL),(7,'Sophia','Anderson','2010-06-13','sophia.anderson@example.com','404 Spruce St','Denver','CO',80202,'555-789-0123','sanderson','pass789',2,2.72,NULL),(8,'James','Thomas','2009-12-05','james.thomas@example.com','505 Redwood Blvd','Phoenix','AZ',85001,'555-890-1234','jthomas','pass456',2,2.66,NULL),(9,'Charlotte','Harris','2011-04-17','charlotte.harris@example.com','606 Aspen Cir','Seattle','WA',98101,'555-901-2345','charris','pass789',1,0.88,''),(10,'Benjamin','White','2008-08-29','benjamin.white@example.com','707 Elm Way','Miami','FL',33101,'555-012-3456','bwhite','pass123',3,2.40,NULL),(11,'Amelia','Clark','2007-02-14','amelia.clark@example.com','808 Magnolia Dr','Dallas','TX',75001,'555-123-6789','aclark','pass789',4,2.40,NULL),(12,'Elijah','Rodriguez','2010-09-09','elijah.rodriguez@example.com','909 Willow Ln','Boston','MA',2101,'555-234-7890','erodriguez','pass456',1,2.40,NULL),(13,'Mia','Lewis','2012-11-23','mia.lewis@example.com','1010 Cypress Ave','Chicago','IL',60601,'555-345-8901','mlewis','pass123',1,2.20,NULL),(14,'Alexander','Walker','2009-05-19','alexander.walker@example.com','1111 Cherry St','Atlanta','GA',30301,'555-456-9012','awalker','pass987',2,2.80,NULL),(15,'Harper','Hall','2008-10-30','harper.hall@example.com','1212 Maple Ct','New York','NY',10001,'555-567-0123','hhall','pass456',3,2.80,NULL),(16,'Daniel','Allen','2011-07-07','daniel.allen@example.com','1313 Birch Blvd','Philadelphia','PA',19101,'555-678-1234','dallen','pass123',2,2.86,NULL),(17,'Evelyn','Young','2007-04-21','evelyn.young@example.com','1414 Oak Cir','Portland','OR',97201,'555-789-2345','eyoung','pass789',4,2.86,NULL),(18,'Matthew','King','2010-03-11','matthew.king@example.com','1515 Pine Way','San Jose','CA',95101,'555-890-3456','mking','pass456',1,2.77,NULL),(19,'Sofia','Scott','2009-06-27','sofia.scott@example.com','1616 Redwood Rd','Las Vegas','NV',89101,'555-901-4567','sscott','pass123',2,2.93,NULL),(20,'Joseph','Green','2008-12-18','joseph.green@example.com','1717 Spruce Ln','Charlotte','NC',28201,'555-012-5678','jgreen','pass789',3,2.88,NULL),(21,'Luna','Adams','2011-08-05','luna.adams@example.com','1818 Cedar Ave','Columbus','OH',43201,'555-123-6789','ladams','pass456',2,2.83,NULL),(22,'David','Baker','2007-09-22','david.baker@example.com','1919 Elm Dr','Indianapolis','IN',46201,'555-234-7890','dbaker','pass123',4,2.83,NULL),(23,'Avery','Gonzalez','2010-11-14','avery.gonzalez@example.com','2020 Magnolia St','Detroit','MI',48201,'555-345-8901','agonzalez','pass789',1,2.94,NULL),(24,'Jackson','Nelson','2009-07-25','jackson.nelson@example.com','2121 Cypress Blvd','Nashville','TN',37201,'555-456-9012','jnelson','pass987',2,2.94,NULL),(25,'Scarlett','Carter','2008-03-09','scarlett.carter@example.com','2222 Willow Cir','Baltimore','MD',21201,'555-567-0123','scarter','pass456',3,3.12,NULL),(26,'Henry','Mitchell','2011-05-28','henry.mitchell@example.com','2323 Cherry Ave','Milwaukee','WI',53201,'555-678-1234','hmitchell','pass123',2,3.06,NULL),(27,'Grace','Perez','2007-10-31','grace.perez@example.com','2424 Maple Ct','Minneapolis','MN',55401,'555-789-2345','gperez','pass789',4,3.06,NULL),(28,'Julian','Roberts','2010-02-26','julian.roberts@example.com','2525 Birch Blvd','Kansas City','MO',64101,'555-890-3456','jroberts','pass456',1,3.06,NULL),(29,'Chloe','Turner','2009-08-17','chloe.turner@example.com','2626 Oak Cir','Oklahoma City','OK',73101,'555-901-4567','cturner','pass123',2,3.00,NULL),(30,'Leo','Collins','2011-03-05','leo.collins@example.com','2727 Pine St','Raleigh','NC',27601,'555-234-5678','lcollins','pass123',1,2.83,NULL),(31,'Zoey','Stewart','2008-07-22','zoey.stewart@example.com','2828 Redwood Rd','Miami','FL',33102,'555-345-6789','zstewart','pass456',3,2.43,NULL),(32,'Nathan','Bell','2012-06-14','nathan.bell@example.com','2929 Spruce Ln','Omaha','NE',68101,'555-456-7890','nbell','pass789',1,2.75,NULL),(33,'Madison','Murphy','2009-11-30','madison.murphy@example.com','3030 Elm Blvd','Tucson','AZ',85701,'555-567-8901','mmurphy','pass456',2,2.43,NULL),(34,'Ethan','Bailey','2007-10-19','ethan.bailey@example.com','3131 Cypress Cir','Albuquerque','NM',87101,'555-678-9012','ebailey','pass123',4,2.75,NULL),(35,'Layla','Rivera','2010-05-23','layla.rivera@example.com','3232 Magnolia Ave','Louisville','KY',40201,'555-789-0123','lrivera','pass789',1,2.00,NULL),(36,'Gabriel','Cooper','2009-09-17','gabriel.cooper@example.com','3333 Willow Way','Virginia Beach','VA',23450,'555-890-1234','gcooper','pass456',2,1.90,NULL),(37,'Aubrey','Richardson','2008-04-12','aubrey.richardson@example.com','3434 Cherry Ln','Fresno','CA',93701,'555-901-2345','arichardson','pass123',3,2.68,NULL),(38,'Carter','Cox','2011-07-29','carter.cox@example.com','3535 Birch St','Mesa','AZ',85201,'555-012-3456','ccox','pass789',1,2.75,NULL),(39,'Hannah','Howard','2007-02-08','hannah.howard@example.com','3636 Oak Dr','Sacramento','CA',95815,'555-123-6789','hhoward','pass987',4,3.00,NULL),(40,'Samuel','Ward','2010-12-11','samuel.ward@example.com','3737 Pine Ct','Atlanta','GA',30303,'555-234-7890','sward','pass456',1,3.00,NULL),(41,'Aria','Torres','2009-06-24','aria.torres@example.com','3838 Redwood Blvd','Las Vegas','NV',89103,'555-345-8901','atorres','pass123',2,2.33,NULL),(42,'Landon','Peterson','2008-10-04','landon.peterson@example.com','3939 Spruce Ln','San Antonio','TX',78201,'555-456-9012','lpeterson','pass789',3,2.00,NULL),(43,'Riley','Gray','2012-01-15','riley.gray@example.com','4040 Elm Cir','Charlotte','NC',28202,'555-567-0123','rgray','pass456',1,2.25,NULL),(44,'Isaac','Ramirez','2007-05-27','isaac.ramirez@example.com','4141 Maple Way','Columbus','OH',43202,'555-678-1234','iramirez','pass123',4,2.18,NULL),(45,'Scarlett','James','2010-03-08','scarlett.james@example.com','4242 Cypress St','Denver','CO',80203,'555-789-2345','sjames','pass789',1,2.93,NULL),(46,'Jonathan','Watson','2009-08-14','jonathan.watson@example.com','4343 Cherry Ave','Minneapolis','MN',55402,'555-890-3456','jwatson','pass456',2,2.85,NULL),(47,'Victoria','Brooks','2008-12-05','victoria.brooks@example.com','4444 Birch Dr','Indianapolis','IN',46202,'555-901-4567','vbrooks','pass123',3,2.90,NULL),(48,'Zachary','Kelly','2011-07-02','zachary.kelly@example.com','4545 Oak Ct','Detroit','MI',48202,'555-012-5678','zkelly','pass789',1,2.90,NULL),(49,'Eleanor','Sanders','2007-09-26','eleanor.sanders@example.com','4646 Pine Rd','Seattle','WA',98102,'555-123-6789','esanders','pass456',4,3.23,NULL),(50,'Thomas','Bennett','2010-04-18','thomas.bennett@example.com','4747 Redwood St','Portland','OR',97203,'555-234-6789','tbennett','pass123',2,3.23,NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
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

-- Dump completed on 2025-05-14 21:29:13
