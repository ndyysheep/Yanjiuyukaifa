/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50151
Source Host           : localhost:3366
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50151
File Encoding         : 65001

Date: 2023-06-05 14:08:34
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for project_todo
-- ----------------------------
DROP TABLE IF EXISTS `project_todo`;
CREATE TABLE `project_todo` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` varchar(255) DEFAULT NULL,
  `object_id` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT '',
  `content` varchar(255) DEFAULT '',
  `limit_time` varchar(255) DEFAULT '',
  `begin_time` varchar(255) DEFAULT NULL,
  `end_time` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `top` varchar(255) DEFAULT '',
  `creator_id` varchar(255) DEFAULT '',
  `creator` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of project_todo
-- ----------------------------
INSERT INTO `project_todo` VALUES ('164', null, 'TODO_20211112113811', '到图书馆看书', '', '2021-11-12 11-37-28', null, null, '等待完成', '', '00000000', '系统管理员', '2021-11-12 11:38:11');
