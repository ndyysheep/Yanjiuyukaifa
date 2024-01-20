import os

import cv2
import pandas as pd
import re
from ultralytics import YOLO
from tracker import Tracker
import easyocr
import datetime

# 创建 OCR 识别器实例
reader = easyocr.Reader(['en'])

def recognize_license_plate(plate_img):
    """
    Recognize the license plate number from an image using EasyOCR.
    Checks if the last six characters are uppercase letters or digits.

    :param plate_img: The image of the license plate.
    :return: The recognized license plate number as a string.
    """
    results = reader.readtext(plate_img)

    for result in results:
        text = result[1].replace(" ", "")  # 移除可能的空格
        if len(text) >= 6 and re.match("^[A-Z0-9]{6}$", text[-6:]):  # 检查后6位是否为大写字母或数字
            return text

    return "未识别"

def track_vehicles(frame, model, tracker, class_list, vehicle_types, height_cutoff, recognized_plates):
    """
    Track vehicles in the lower half of a single frame and recognize license plates.
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

    with open('Data/CarID/results.txt', 'a') as file:
        fixed_time = datetime.datetime(2024, 1, 15, 12, 0, 0)

        # 将固定时间格式化为字符串
        formatted_time = fixed_time.strftime("%Y-%m-%d %H:%M:%S")
        for bbox, vehicle_type in zip(bbox_idx, [vt for _, vt in tracked_vehicles]):
            x3, y3, x4, y4, id1 = bbox
            cv2.rectangle(frame, (x3, y3), (x4, y4), (0, 255, 0), 2)
            cv2.putText(frame, f"Vehicle ID: {id1}", (x3, y3 - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            if id1 not in recognized_plates:
                license_plate = recognize_license_plate(frame[y3:y4, x3:x4])
                if len(license_plate) >= 6:
                    recognized_plates[id1] = "川" + license_plate
                    file.write(f"车辆ID: {id1}, 车牌号: {recognized_plates[id1]},记录时间{formatted_time}\n")

            if id1 in recognized_plates:
                cv2.putText(frame, recognized_plates[id1], (x3, y4 + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

    return frame, tracked_vehicles

# 初始化模型和跟踪器
file_path = 'Data/CarID/results.txt'
if os.path.exists(file_path):
    # 删除文件
    os.remove(file_path)
    print(f"文件 {file_path} 已被删除。")
else:
    # 如果文件不存在，则创建它
    with open(file_path, 'w') as file:
        file.write('')
model_path = 'Data/Flow/yolov8s.pt'
class_file = 'Data/Flow/coco.txt'
vehicle_types = ['car', 'bus']
model = YOLO(model_path)
tracker = Tracker()

# 读取类别文件
with open(class_file, "r") as my_file:
    class_list = my_file.read().split("\n")

# 打开视频文件
video_path = 'Data/CarID/test.mp4'  # 更改为您的视频文件路径
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("错误：无法打开视频文件")
    exit()

ret, test_frame = cap.read()
if ret:
    height, width = test_frame.shape[:2]
    height_cutoff = height // 3  # 只处理视频下半部分的车辆

# 设置输出视频的文件名和格式
output_video_path = 'Data/CarID/output.mp4'
fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # 设置视频编码格式为 mp4v
fps = cap.get(cv2.CAP_PROP_FPS)
out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

# 初始化识别出的车牌号字典
recognized_plates = {}

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # 调用 track_vehicles 函数处理每一帧
    updated_frame, tracked_vehicles = track_vehicles(frame, model, tracker, class_list, vehicle_types, height_cutoff, recognized_plates)

    # 将处理后的帧写入输出视频
    out.write(updated_frame)

    # 显示处理后的帧
    # cv2.imshow("Tracked Vehicles", updated_frame)
    if cv2.waitKey(1) & 0xFF == 27:  # 按下 ESC 键退出
        break

# 释放视频捕获和写入对象
cap.release()
out.release()
cv2.destroyAllWindows()
