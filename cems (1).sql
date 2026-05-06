-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2026 at 05:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cems`
--

-- --------------------------------------------------------

--
-- Table structure for table `campaigns`
--

CREATE TABLE `campaigns` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `type` enum('email','sms','both') DEFAULT 'email',
  `target_type` enum('all','specific','filtered') DEFAULT 'all',
  `target_data` text DEFAULT NULL,
  `status` enum('draft','scheduled','sent') DEFAULT 'draft',
  `scheduled_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `campaigns`
--

INSERT INTO `campaigns` (`id`, `title`, `message`, `type`, `target_type`, `target_data`, `status`, `scheduled_at`, `created_by`, `created_at`) VALUES
(1, 'new product', ' jnovidn iuh erore fefb fb ffoufg weweewfefbf', 'email', 'specific', '[1]', 'sent', '2026-04-23 10:29:00', 1, '2026-04-23 10:28:38'),
(2, 'moto product', 'mfjfs gkjnriwerwer nsr;ojreior foeir', 'email', 'specific', '[1]', 'sent', '2026-04-23 15:58:00', 1, '2026-04-23 15:57:26'),
(3, 'new moto product', 'l rgr ern eprwsupsend fsdpfisdufs9dnf ', 'both', 'specific', '[1]', 'sent', '2026-04-23 16:42:00', 1, '2026-04-23 16:42:34'),
(4, 'gfhos gsrs r', '0 j0hfh g h0jbf', 'both', 'specific', '[1]', 'sent', '2026-04-23 16:43:00', 1, '2026-04-23 16:43:04');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(180) NOT NULL,
  `email` varchar(180) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `location` varchar(120) DEFAULT NULL,
  `last_purchase_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `customer_type` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `gender`, `location`, `last_purchase_date`, `created_at`, `customer_type`) VALUES
(1, 'firaol tegene', 'firaoltegene4@gmail.com', '0966438359', 'male', 'addis Ababa', '2026-04-22', '2026-04-22 13:52:53', 'g-power');

-- --------------------------------------------------------

--
-- Table structure for table `customer_segments`
--

CREATE TABLE `customer_segments` (
  `id` int(11) NOT NULL,
  `name` varchar(180) NOT NULL,
  `filter_json` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message_queue`
--

CREATE TABLE `message_queue` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `campaign_id` int(11) NOT NULL,
  `channel` enum('email','sms') NOT NULL,
  `status` enum('pending','sent','failed') DEFAULT 'pending',
  `retry_count` int(11) DEFAULT 0,
  `scheduled_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message_queue`
--

INSERT INTO `message_queue` (`id`, `customer_id`, `campaign_id`, `channel`, `status`, `retry_count`, `scheduled_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'email', 'sent', 0, '2026-04-23 15:55:57', '2026-04-23 15:55:57', '2026-04-23 15:56:04'),
(2, 1, 2, 'email', 'sent', 0, '2026-04-23 15:58:04', '2026-04-23 15:58:04', '2026-04-23 15:58:06'),
(3, 1, 3, 'email', 'sent', 0, '2026-04-23 16:42:38', '2026-04-23 16:42:38', '2026-04-23 16:42:42'),
(4, 1, 3, 'sms', 'failed', 3, '2026-04-23 16:42:38', '2026-04-23 16:42:38', '2026-04-23 16:42:49'),
(5, 1, 3, 'email', 'sent', 0, '2026-04-23 16:42:38', '2026-04-23 16:42:38', '2026-04-23 16:42:44'),
(6, 1, 3, 'sms', 'failed', 3, '2026-04-23 16:42:38', '2026-04-23 16:42:38', '2026-04-23 16:42:49'),
(7, 1, 4, 'email', 'sent', 0, '2026-04-23 16:43:05', '2026-04-23 16:43:05', '2026-04-23 16:43:07'),
(8, 1, 4, 'sms', 'failed', 3, '2026-04-23 16:43:05', '2026-04-23 16:43:05', '2026-04-23 16:43:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(120) DEFAULT NULL,
  `email` varchar(180) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'firaol', 'firaolteg46@gmail.com', '$2a$10$oETJtowOLWCPopk913TsUuxKVcQtdI8JmMlJ8OFYjX.1B0vf0TazW', 'admin', '2026-04-22 08:52:58'),
(2, 'fira', 'fira@gmail.com', '$2a$10$GXbcgQf4dxHpSmFWMiuZZ.RzgpUl98cjsF3vXjOM7ByGTrkJzaKRW', 'admin', '2026-04-22 12:25:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `campaigns`
--
ALTER TABLE `campaigns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `customer_segments`
--
ALTER TABLE `customer_segments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message_queue`
--
ALTER TABLE `message_queue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `campaigns`
--
ALTER TABLE `campaigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer_segments`
--
ALTER TABLE `customer_segments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_queue`
--
ALTER TABLE `message_queue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
