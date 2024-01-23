import os

import cv2
import pandas as pd
from ultralytics import YOLO
from tracker import Tracker, is_moving_direction
from datetime import datetime, timedelta

def track_vehicles(frame, model, tracker, class_list, vehicle_types, last_positions, reverse_counter, start_time, frame_rate, frame_number):
    results = model.predict(frame)
    px = pd.DataFrame(results[0].boxes.data).astype("float")
    tracked_vehicles = []
    frame_height = frame.shape[0]
    cutoff_height = frame_height * 1 // 2  # 从下到上1/2的高度

    for index, row in px.iterrows():
        x1, y1, x2, y2, _, d = map(int, row)
        c = class_list[d]
        bbox = [x1, y1, x2, y2]
        if y1 >= cutoff_height or y2 >= cutoff_height:
            for vehicle_type in vehicle_types:
                if vehicle_type in c:
                    tracked_vehicles.append((bbox, vehicle_type))

    bbox_idx = tracker.update([bbox for bbox, _ in tracked_vehicles])

    with open('Data/Back/results.txt', 'a', encoding='utf-8') as file:
        for bbox, vehicle_type in zip(bbox_idx, [vt for _, vt in tracked_vehicles]):
            x3, y3, x4, y4, id1 = bbox
            current_bbox = [x3, y3, x4, y4]
            color = (0, 255, 0)  # 默认绿色框（南向北）

            reverse_counter[id1] = reverse_counter.get(id1, 0)

            if id1 in last_positions:
                if is_moving_direction(last_positions[id1], current_bbox, 'south'):
                    reverse_counter[id1] += 1  # 增加逆行计数
                    if reverse_counter[id1] >= 3:  # 连续三帧或以上逆行
                        color = (0, 0, 255)  # 逆行（北向南）为红色框
                        current_time = start_time + timedelta(seconds=frame_number / frame_rate)
                        file.write(f" 车辆位置: {current_bbox}, 逆行时间: {current_time}\n")
                else:
                    reverse_counter[id1] = 0  # 重置逆行计数

            cv2.rectangle(frame, (x3, y3), (x4, y4), color, 2)
            cv2.putText(frame, f"{vehicle_type} ID: {id1}", (x3, y3 - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            last_positions[id1] = current_bbox

    return frame, tracked_vehicles


def demo_track_vehicles(video_path, model_path, class_file, vehicle_types, start_time):
    model = YOLO(model_path)
    tracker = Tracker()
    frame_number = 0

    with open(class_file, "r") as my_file:
        class_list = my_file.read().split("\n")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Cannot open video file")
        return
    frame_rate = cap.get(cv2.CAP_PROP_FPS)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # 创建 VideoWriter 对象以写入视频
    out = cv2.VideoWriter(current_dir+'/Data/Back/output.mp4', cv2.VideoWriter_fourcc(*'MP4V'), frame_rate, (frame_width, frame_height))

    last_positions = {}
    reverse_counter = {}  # 用于跟踪每辆车的逆行帧数

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        updated_frame, tracked_vehicles = track_vehicles(frame, model, tracker, class_list, vehicle_types,
                                                         last_positions, reverse_counter, start_time, frame_rate, frame_number)

        # 将处理后的帧写入输出视频
        out.write(updated_frame)

        # cv2.imshow("Tracked Vehicles", updated_frame)
        # frame_number += 1
        if cv2.waitKey(1) & 0xFF == 27:  # Press ESC to exit
            break

    cap.release()
    out.release()  # 释放 VideoWriter 对象
    cv2.destroyAllWindows()
file_path = 'Data/Back/results.txt'
if os.path.exists(file_path):
    # 删除文件
    os.remove(file_path)
    print(f"文件 {file_path} 已被删除。")
else:
    # 如果文件不存在，则创建它
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write('')
current_dir =os.path.dirname(os.path.abspath(__file__))
print("当前运行环境的绝对路径：", current_dir)
video_path = current_dir+'/Data/Back/test.mp4'
model_path = current_dir+'/Data/Flow/yolov8s.pt'
class_file = current_dir+'/Data/Flow/coco.txt'
vehicle_types = ['car', 'bus']
start_time = datetime(2023, 12, 10, 12, 0)


demo_track_vehicles(video_path, model_path, class_file, vehicle_types, start_time)
