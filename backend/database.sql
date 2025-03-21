
-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS learning_platform;
USE learning_platform;

-- Bảng users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng courses
CREATE TABLE IF NOT EXISTS `courses` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng lessons
CREATE TABLE IF NOT EXISTS `lessons` (
  `lesson_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text DEFAULT NULL,
  `video_link` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT NULL,
  PRIMARY KEY (`lesson_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng resources
CREATE TABLE IF NOT EXISTS `resources` (
  `resource_id` int(11) NOT NULL AUTO_INCREMENT,
  `resource_type` enum('PDF','Word','Excel','PPT') NOT NULL,
  `resource_link` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bảng blogposts
CREATE TABLE IF NOT EXISTS `blogposts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `blogposts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dữ liệu mẫu cho courses
INSERT INTO `courses` (`title`, `description`)
VALUES 
('Lập trình JavaScript cơ bản', 'Khóa học giới thiệu về JavaScript cho người mới bắt đầu'),
('React.js cho người mới bắt đầu', 'Học cách xây dựng ứng dụng web với React.js'),
('Node.js và Express', 'Xây dựng REST API với Node.js và Express'),
('MySQL cơ bản đến nâng cao', 'Tất cả về cơ sở dữ liệu quan hệ với MySQL');

-- Dữ liệu mẫu cho resources
INSERT INTO `resources` (`resource_type`, `resource_link`, `description`, `price`)
VALUES
('PDF', '/resources/javascript-cheatsheet.pdf', 'Tài liệu tham khảo JavaScript', 5.99),
('Word', '/resources/nodejs-guide.docx', 'Hướng dẫn sử dụng Node.js', 9.99),
('PDF', '/resources/react-components.pdf', 'Tạo component trong React', 7.99),
('PPT', '/resources/mysql-introduction.pptx', 'Giới thiệu về MySQL', 4.99);
