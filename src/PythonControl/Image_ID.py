import os
from collections import Counter

import cv2
import pandas as pd
import re
from ultralytics import YOLO
from tracker import Tracker
import easyocr
import datetime
import numpy as np

# 创建 OCR 识别器实例
reader = easyocr.Reader(['en'])


def get_dominant_color(image):
    """
    获取图像中的主要颜色。
    :return: RGB格式的主要颜色。
    """

    # 将图像从BGR转换为RGB颜色空间
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # 重塑图像数据为一维数组
    pixels = image.reshape(-1, 3)

    # 将每个颜色转换为一个整数值
    pixels = [tuple(pix) for pix in pixels]

    # 计算每种颜色的出现次数
    color_counts = Counter(pixels)

    # 找出出现次数最多的颜色
    most_common_color = color_counts.most_common(1)[0][0]

    return most_common_color

def closest_color(rgb_color):
    """
    将RGB颜色映射到基本颜色名称。
    :param rgb_color: RGB格式的颜色。
    :return: 颜色名称字符串。
    """
    color_names = {
        "green": (0, 128, 0),
        "blue": (0, 0, 255),
        # 可以根据需要添加更多颜色
    }

    min_distance = float('inf')
    closest_color_name = None

    for name, color_value in color_names.items():
        distance = sum((s - q) ** 2 for s, q in zip(rgb_color, color_value))
        if distance < min_distance:
            min_distance = distance
            closest_color_name = name

    return closest_color_name
def recognize_license_plate(plate_img):
    """
    Recognize the license plate number from an image using EasyOCR.
    Replaces the first character with '川'.

    :param plate_img: The image of the license plate.
    :return: The recognized license plate number as a string, with the first character replaced by '川'.
    """
    color = '未识别'
    # 使用EasyOCR识别图像中的文本
    try:
        results = reader.readtext(plate_img)

        # 初始化变量来存储最大方框的信息
        max_area = 0
        max_bbox = None
        max_index = -1

        # 查找最大的方框
        for index, (bbox, text, prob) in enumerate(results):
            # 将bbox坐标转换为整数
            (top_left, top_right, bottom_right, bottom_left) = bbox
            top_left = (int(top_left[0]), int(top_left[1]))
            bottom_right = (int(bottom_right[0]), int(bottom_right[1]))

            # 计算方框面积
            area = (bottom_right[0] - top_left[0]) * (bottom_right[1] - top_left[1])

            # 更新最大方框信息
            if area > max_area:
                max_area = area
                max_bbox = (top_left, bottom_right)
                max_index = index

        top_left, bottom_right = max_bbox

        text_img = plate_img[top_left[1]:bottom_right[1], top_left[0]:bottom_right[0]]

        cv2.waitKey(0)

        # 处理颜色信息
        mid = get_dominant_color(text_img)
        color = closest_color(mid)


        # 处理文本信息
        secondary_results = reader.readtext(text_img)
        text = max(secondary_results, key=lambda x: (x[0][1][0] - x[0][0][0]) * (x[0][2][1] - x[0][1][1]))[1]
        space_index = text.find(' ')
        if space_index != -1:
            # 如果找到空格，只保留“川”+空格前的第一个字符+空格后的内容
            if color =="blue":
                modified_text = '川' + text[space_index - 1] + ' ' + text[space_index + 1:9]
            elif color =="green":
                modified_text = '川' + text[space_index - 1] + ' ' + text[space_index + 1:10]
        return modified_text, color
    except:
        return "未识别", color  # 如果没有找到合适的结果



def track_vehicles(frame, model, tracker, class_list, vehicle_types, height_cutoff, recognized_plates):
    """
    Track vehicles in a single frame and recognize license plates and their colors.
    Keeps track of recognized license plates to avoid re-detection.

    :param frame: The current frame from the video.
    :param model: The YOLO model for object detection.
    :param tracker: The tracker object.
    :param class_list: List of classes for object detection.
    :param vehicle_types: List of vehicle types to track.
    :param height_cutoff: The cutoff height to consider the lower half of the frame.
    :param recognized_plates: Dictionary to store recognized license plates.
    :return: Updated frame with tracking information, list of vehicle bounding boxes with types.
    """
    results = model.predict(frame)
    px = pd.DataFrame(results[0].boxes.data).astype("float")

    tracked_vehicles = []
    for index, row in px.iterrows():
        x1, y1, x2, y2, _, d = map(int, row)
        if y1 >= height_cutoff:
            c = class_list[d]
            bbox = [x1, y1, x2, y2]
            for vehicle_type in vehicle_types:
                if vehicle_type in c:
                    tracked_vehicles.append((bbox, vehicle_type))

    bbox_idx = tracker.update([bbox for bbox, _ in tracked_vehicles])

    for bbox, vehicle_type in zip(bbox_idx, [vt for _, vt in tracked_vehicles]):
        x3, y3, x4, y4, id1 = bbox
        cv2.rectangle(frame, (x3, y3), (x4, y4), (0, 255, 0), 2)
        cv2.putText(frame, f"Vehicle ID: {id1}", (x3, y3 - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        if id1 not in recognized_plates:
            plate_img = frame[y3:y4, x3:x4]


            license_plate, color = recognize_license_plate(plate_img)
            # print("ID:"+str(id1)+" 车牌号："+str(license_plate)+" 车牌颜色："+color)
            # 构建要输出的字符串
            output_content = f"ID:{id1} 车牌号：{license_plate} 车牌颜色：{color}\n"

            # 文件路径
            file_path = 'Data/Image_ID/results.txt'

            # 写入文件（覆盖模式）
            with open(file_path, 'a') as file:
                file.write(output_content)


            if license_plate != "未识别":
                recognized_plates[id1] = {"number": license_plate, "color": color}
                cv2.putText(frame, f"{license_plate} ({color})", (x3, y4 + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

    return frame, tracked_vehicles


def resize_image_to_fit_screen(img, screen_width, screen_height, margin=10):
    """
    Resize the image to fit the screen while maintaining the aspect ratio.

    :param img: The original image.
    :param screen_width: Width of the screen.
    :param screen_height: Height of the screen.
    :param margin: Margin to leave on the screen (default 10 pixels).
    :return: Resized image.
    """
    img_height, img_width = img.shape[:2]

    # 计算适应屏幕的缩放比例
    scale_width = (screen_width - margin) / img_width
    scale_height = (screen_height - margin) / img_height
    scale = min(scale_width, scale_height)

    # 应用缩放比例
    width = int(img_width * scale)
    height = int(img_height * scale)

    return cv2.resize(img, (width, height))

# 初始化模型和跟踪器
model_path = 'Data/Flow/yolov8s.pt'
class_file = 'Data/Flow/coco.txt'
vehicle_types = ['car', 'bus']
model = YOLO(model_path)
tracker = Tracker()
try:
    os.remove("Data/Image_ID/results.txt")
except:
    pass
# 读取类别文件
with open(class_file, "r") as my_file:
    class_list = my_file.read().split("\n")

# 读取图片文件
img_path = 'Data/Image_ID/test.png'  # 更改为您的图片文件路径
img = cv2.imread(img_path)

if img is None:
    print("错误：无法打开图片文件")
    exit()

height, width = img.shape[:2]
height_cutoff = height // 3  # 处理图片下半部分的车辆

# 初始化识别出的车牌号字典
recognized_plates = {}

# 处理单张图片
updated_img, tracked_vehicles = track_vehicles(img, model, tracker, class_list, vehicle_types, height_cutoff, recognized_plates)
cv2.imwrite("Data/Image_ID/output.png", updated_img)
