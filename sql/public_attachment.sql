/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50151
Source Host           : localhost:3366
Source Database       : ylxdb

Target Server Type    : MYSQL
Target Server Version : 50151
File Encoding         : 65001

Date: 2023-04-23 12:39:44
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for public_attachment
-- ----------------------------
DROP TABLE IF EXISTS `public_attachment`;
CREATE TABLE `public_attachment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` varchar(255) DEFAULT NULL,
  `object_id` varchar(255) DEFAULT NULL,
  `module` varchar(255) DEFAULT NULL,
  `sub` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT '',
  `content` varchar(4096) DEFAULT '',
  `description` mediumtext,
  `attachment_name` varchar(255) DEFAULT NULL,
  `attachment_filename` varchar(255) DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `attachment_size` int(10) DEFAULT NULL,
  `attachment_type` varchar(255) DEFAULT NULL,
  `view_count` int(10) DEFAULT '0',
  `comment_count` int(10) DEFAULT '0',
  `like_count` int(10) DEFAULT '0',
  `hate_count` int(10) DEFAULT '0',
  `download_count` int(10) DEFAULT '0',
  `source` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT '',
  `user_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `creator_id` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `checker` varchar(255) DEFAULT NULL,
  `check_time` varchar(255) DEFAULT NULL,
  `check_result` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`) USING BTREE,
  KEY `parent_id` (`parent_id`) USING BTREE,
  KEY `object_id` (`object_id`) USING BTREE,
  KEY `module` (`module`) USING BTREE,
  KEY `sub` (`sub`) USING BTREE,
  KEY `title` (`title`) USING BTREE,
  KEY `content` (`content`(255)) USING BTREE,
  KEY `attachment_name` (`attachment_name`) USING BTREE,
  KEY `attachment_filename` (`attachment_filename`) USING BTREE,
  KEY `attachment_url` (`attachment_url`) USING BTREE,
  KEY `attachment_size` (`attachment_size`) USING BTREE,
  KEY `attachment_type` (`attachment_type`) USING BTREE,
  KEY `view_count` (`view_count`) USING BTREE,
  KEY `comment_count` (`comment_count`) USING BTREE,
  KEY `like_count` (`like_count`) USING BTREE,
  KEY `hate_count` (`hate_count`) USING BTREE,
  KEY `download_count` (`download_count`) USING BTREE,
  KEY `source` (`source`) USING BTREE,
  KEY `type` (`type`) USING BTREE,
  KEY `category_id` (`category_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  KEY `user_name` (`user_name`) USING BTREE,
  KEY `tags` (`tags`) USING BTREE,
  KEY `creator_id` (`creator_id`) USING BTREE,
  KEY `creator` (`creator`) USING BTREE,
  KEY `create_time` (`create_time`) USING BTREE,
  KEY `checker` (`checker`) USING BTREE,
  KEY `check_time` (`check_time`) USING BTREE,
  KEY `check_result` (`check_result`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of public_attachment
-- ----------------------------
INSERT INTO `public_attachment` VALUES ('1', 'HOMEWORK_2018010100000002_20230110204406', 'ATTACHMENT_2018010100000002_20230407173002_0000', 'teach', 'homework', '', '', null, 'IMG_20171130_133644.jpg', 'teach\\homework\\20230407\\2018010100000002\\IMG_20171130_133644.jpg', 'teach/homework/20230407/2018010100000002/IMG_20171130_133644.jpg', '0', 'teach_homework_attachment', '0', '0', '0', '0', '0', null, null, '', '2018010100000002', 'admin', null, '2018010100000002', 'admin', '2023-04-07 17:30:02', null, null, '0');
INSERT INTO `public_attachment` VALUES ('2', 'HOMEWORK_2018010100000002_20230110204406', 'ATTACHMENT_2018010100000002_20230407175118_0000', 'teach', 'homework', '', '', null, 'IMG_20171122_082114.jpg', 'teach\\homework\\20230407\\2018010100000002\\IMG_20171122_082114.jpg', 'teach/homework/20230407/2018010100000002/IMG_20171122_082114.jpg', '0', 'teach_homework_attachment', '0', '0', '0', '0', '0', null, null, '', '2020082900002106', 'admin', null, '2018010100000002', 'admin', '2023-04-07 17:51:17', null, null, '0');
INSERT INTO `public_attachment` VALUES ('3', 'HOMEWORK_2018010100000002_20230110204406', 'ATTACHMENT_2018010100000002_20230407175651_0000', 'teach', 'homework', '', '', null, 'IMG_20171129_174035.jpg', 'teach\\homework\\20230407\\2018010100000002\\IMG_20171129_174035.jpg', 'teach/homework/20230407/2018010100000002/IMG_20171129_174035.jpg', '0', 'teach_homework_attachment', '0', '0', '0', '0', '0', null, null, '', '2021101400002207', 'admin', null, '2018010100000002', 'admin', '2023-04-07 17:56:51', null, null, '0');
INSERT INTO `public_attachment` VALUES ('4', 'HOMEWORK_2018010100000002_20230110204406', 'ATTACHMENT_2018010100000002_20230407185834_0000', 'teach', 'homework', '', '', null, '第05周作业-2021141460316-编辑地图和初步显示.zip', 'teach\\homework\\20230407\\2018010100000002\\第05周作业-2021141460316-编辑地图和初步显示.zip', 'teach/homework/20230407/2018010100000002/第05周作业-2021141460316-编辑地图和初步显示.zip', '0', 'teach_homework_attachment', '0', '0', '0', '0', '0', null, null, '', '2018010100000002', 'admin', null, '2018010100000002', 'admin', '2023-04-07 18:58:34', null, null, '0');
INSERT INTO `public_attachment` VALUES ('6', 'HOMEWORK_2018010100000002_20230110204406', 'ATTACHMENT_2018010100000002_20230407190216_0000', 'teach', 'homework', '', '', null, '八坂塔01.jpg', 'teach\\homework\\20230407\\2018010100000002\\八坂塔01.jpg', 'teach/homework/20230407/2018010100000002/八坂塔01.jpg', '0', 'teach_homework_attachment', '0', '0', '0', '0', '0', null, null, '', '2018010100000002', 'admin', null, '2018010100000002', 'admin', '2023-04-07 19:02:16', null, null, '0');
INSERT INTO `public_attachment` VALUES ('7', 'HOMEWORK_2018010100000002_20230110204406', 'ATTACHMENT_2018010100000002_20230407190224_0000', 'teach', 'homework', '', '', null, '八坂塔02.jpg', 'teach\\homework\\20230407\\2018010100000002\\八坂塔02.jpg', 'teach/homework/20230407/2018010100000002/八坂塔02.jpg', '0', 'teach_homework_attachment', '0', '0', '0', '0', '0', null, null, '', '2020082900002106', 'admin', null, '2018010100000002', 'admin', '2023-04-07 19:02:24', null, null, '0');
