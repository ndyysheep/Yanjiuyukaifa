/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50151
Source Host           : localhost:3366
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50151
File Encoding         : 65001

Date: 2023-06-05 14:08:39
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for device_file
-- ----------------------------
DROP TABLE IF EXISTS `device_file`;
CREATE TABLE `device_file` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` varchar(255) DEFAULT NULL,
  `device_id` varchar(255) DEFAULT '',
  `device_name` varchar(255) DEFAULT NULL,
  `device_type` varchar(255) DEFAULT NULL,
  `check_tag` int(11) DEFAULT '0',
  `checker` varchar(255) DEFAULT NULL,
  `check_time` datetime DEFAULT NULL,
  `used_tag` bit(1) DEFAULT b'0',
  `creator_id` varchar(255) DEFAULT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of device_file
-- ----------------------------
INSERT INTO `device_file` VALUES ('15', null, 'VIDEO0001', '大门口摄像头', 'video', '1', '超管张三', '2019-02-21 00:00:00', '', null, 'admin', '2019-02-20 00:00:00');
INSERT INTO `device_file` VALUES ('16', null, 'VIDEO0002', '仓库区1区西南角摄像头AAAAAAAA', 'video', '1', '超管李四', '2019-02-21 00:00:00', '', null, '超管', '2019-02-20 00:00:00');
INSERT INTO `device_file` VALUES ('17', null, 'VIDEO0003', '公司办公区问讯处摄像机', 'video', '0', null, null, '\0', null, 'admin', '2020-02-23 00:00:00');
INSERT INTO `device_file` VALUES ('19', null, 'CDYLX039980288811', '广东公司传感器设备', 'sensor', '0', null, null, '', null, 'admin', '2022-10-01 16:00:00');
INSERT INTO `device_file` VALUES ('20', null, 'QJZL01', '成都中石油探测器AEb', 'sensor', '0', null, null, '\0', null, null, '2022-10-01 16:00:00');
INSERT INTO `device_file` VALUES ('21', null, 'QJZL02', '成都中石油探测器', 'sensor', '0', null, null, '\0', null, null, '2022-10-01 16:00:00');
INSERT INTO `device_file` VALUES ('22', null, 'CDYLX888819944', '农业大棚设备-温湿度传感器', 'sensor', '0', null, null, '\0', null, null, '2022-11-12 16:00:00');
INSERT INTO `device_file` VALUES ('23', null, 'CDYLX888819945', '修改后的名称', 'sensor', '0', null, null, '\0', null, null, '2022-11-12 16:00:00');
INSERT INTO `device_file` VALUES ('25', null, 'AAAAABBBBB', '张3丰的设备', null, '0', null, null, '\0', null, null, null);
INSERT INTO `device_file` VALUES ('26', null, 'AAAAAA', '张四丰的设备', null, '0', null, null, '\0', null, null, null);
INSERT INTO `device_file` VALUES ('27', null, 'AAAAAB', '张五丰的设备', null, '0', null, null, '\0', null, null, null);
INSERT INTO `device_file` VALUES ('28', null, 'LMDQQJDL02aa', 'vvvvvv', 'sensor', '0', null, null, '', '20220000000000001', 'student', '2023-06-05 13:59:10');
