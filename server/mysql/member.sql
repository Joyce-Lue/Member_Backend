-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-11-11 16:58:58
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `member`
--

-- --------------------------------------------------------

--
-- 資料表結構 `account_setting`
--

CREATE TABLE `account_setting` (
  `userID` int(11) NOT NULL,
  `userName` varchar(10) NOT NULL,
  `birthday` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `phoneNumber` varchar(10) DEFAULT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `account_setting`
--

INSERT INTO `account_setting` (`userID`, `userName`, `birthday`, `gender`, `email`, `phoneNumber`, `password`) VALUES
(1, 'JIU', '1902-02-02', 'female', 'test2@gmail.com', '0922222222', 'test000'),
(2, 'Sua', '1994-08-10', 'female', 'test2@gmail.com', '0911222444', 'test2'),
(3, 'Siyeon', '1995-10-03', 'female', 'test3@gmail.com', '0911222555', 'test3');

-- --------------------------------------------------------

--
-- 資料表結構 `collection`
--

CREATE TABLE `collection` (
  `userID` int(11) DEFAULT NULL,
  `collectID` int(11) DEFAULT NULL,
  `productID` int(11) DEFAULT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `unitPrice` int(11) DEFAULT NULL,
  `img_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `collection`
--

INSERT INTO `collection` (`userID`, `collectID`, `productID`, `productName`, `capacity`, `unitPrice`, `img_url`) VALUES
(1, 1, 15, '海風輕撫香水', 100, 3000, 'https://i.imgur.com/RpvvMRZ.jpeg'),
(1, 2, 16, '落葉輕舞香水', 50, 1500, 'https://i.imgur.com/fue2zni.jpeg'),
(1, 3, 17, '雪夜之夢香水', 30, 1000, 'https://i.imgur.com/x4U5W9W.jpeg');

-- --------------------------------------------------------

--
-- 資料表結構 `login`
--

CREATE TABLE `login` (
  `userID` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `login`
--

INSERT INTO `login` (`userID`, `email`, `password`) VALUES
(1, 'test1@gmail.com', 'test1'),
(2, 'test2@gmail.com', 'test2'),
(3, 'test3@gmail.com', 'test3');

-- --------------------------------------------------------

--
-- 資料表結構 `my_account`
--

CREATE TABLE `my_account` (
  `userID` int(11) NOT NULL,
  `userName` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phoneNumber` varchar(10) DEFAULT NULL,
  `address1` varchar(50) DEFAULT NULL,
  `address2` varchar(50) DEFAULT NULL,
  `newsLetter` tinyint(1) DEFAULT NULL,
  `telePhone` varchar(10) DEFAULT '---'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `my_account`
--

INSERT INTO `my_account` (`userID`, `userName`, `email`, `phoneNumber`, `address1`, `address2`, `newsLetter`, `telePhone`) VALUES
(1, 'Jiu', 'test2@gmail.com', '0900000000', ' 台中市南屯區公益路二段51號', ' 台中市南屯區公益路二段999號', 0, '0400000000'),
(2, 'Sua', 'test2@gmail.com', '0977342199', '台中市烏日區長春街300號', '台中市烏日區中山路一段497號', 0, '---'),
(3, 'Siyeon', 'test3@gmail.com', '0995031019', '台中市太平區環中東路四段19號', '台中市東區東英八街213號', 0, '---');

-- --------------------------------------------------------

--
-- 資料表結構 `orders_log`
--

CREATE TABLE `orders_log` (
  `userID` int(11) DEFAULT NULL,
  `orderID` varchar(10) DEFAULT NULL,
  `orderDate` datetime DEFAULT NULL,
  `orderStatus` varchar(10) DEFAULT NULL,
  `totalAmount` int(11) DEFAULT NULL,
  `productID` int(11) DEFAULT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `unitPrice` int(11) DEFAULT NULL,
  `img_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `orders_log`
--

INSERT INTO `orders_log` (`userID`, `orderID`, `orderDate`, `orderStatus`, `totalAmount`, `productID`, `productName`, `capacity`, `quantity`, `unitPrice`, `img_url`) VALUES
(1, 'A00001', '2024-10-26 14:30:00', '運送中', 9000, 1, '暮光之影香水', 30, 3, 1000, 'https://i.imgur.com/a2R0fUA.jpeg'),
(1, 'A00001', '2024-10-26 14:30:00', '運送中', 9000, 2, '躍動微風香水', 50, 2, 1500, 'https://i.imgur.com/YspEKTb.jpeg'),
(1, 'A00001', '2024-10-26 14:30:00', '運送中', 9000, 3, '迷霧初晨香水', 100, 1, 3000, 'https://i.imgur.com/Ta4bG3y.jpeg');

-- --------------------------------------------------------

--
-- 資料表結構 `register`
--

CREATE TABLE `register` (
  `userID` int(11) NOT NULL,
  `userName` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `register`
--

INSERT INTO `register` (`userID`, `userName`, `email`, `password`) VALUES
(1, 'Jiu', 'test1@gmail.com', 'test1'),
(2, 'Sua', 'test2@gmail.com', 'test2'),
(3, 'Siyeon', 'test3@gmail.com', 'test3');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `account_setting`
--
ALTER TABLE `account_setting`
  ADD PRIMARY KEY (`userID`);

--
-- 資料表索引 `collection`
--
ALTER TABLE `collection`
  ADD KEY `fk_userID_collection` (`userID`);

--
-- 資料表索引 `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`userID`);

--
-- 資料表索引 `my_account`
--
ALTER TABLE `my_account`
  ADD PRIMARY KEY (`userID`);

--
-- 資料表索引 `orders_log`
--
ALTER TABLE `orders_log`
  ADD KEY `fk_userID_orders_log` (`userID`);

--
-- 資料表索引 `register`
--
ALTER TABLE `register`
  ADD PRIMARY KEY (`userID`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `account_setting`
--
ALTER TABLE `account_setting`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `login`
--
ALTER TABLE `login`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `my_account`
--
ALTER TABLE `my_account`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `register`
--
ALTER TABLE `register`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `collection`
--
ALTER TABLE `collection`
  ADD CONSTRAINT `fk_userID_collection` FOREIGN KEY (`userID`) REFERENCES `register` (`userID`);

--
-- 資料表的限制式 `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `fk_userID_login` FOREIGN KEY (`userID`) REFERENCES `my_account` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `my_account`
--
ALTER TABLE `my_account`
  ADD CONSTRAINT `fk_userID_my_account` FOREIGN KEY (`userID`) REFERENCES `account_setting` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `orders_log`
--
ALTER TABLE `orders_log`
  ADD CONSTRAINT `fk_userID_orders_log` FOREIGN KEY (`userID`) REFERENCES `register` (`userID`);

--
-- 資料表的限制式 `register`
--
ALTER TABLE `register`
  ADD CONSTRAINT `fk_userID_register` FOREIGN KEY (`userID`) REFERENCES `login` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
