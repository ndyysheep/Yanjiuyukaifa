import cv2
import pandas as pd
from ultralytics import YOLO
import datetime
from tracker import *
import cvzone
from datetime import datetime, timedelta


def flow_count(video_path, vehicle_types=['car'], directions=['north', 'south'], model_path='Data/Flow/yolov8s.pt', class_file='Data/Flow/coco.txt', cy1=424, offset=6, output_video_path='output.mp4'):
    start_time = datetime(2023, 12, 10, 12, 0)  # 设置起始时间
    model = YOLO(model_path)
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("错误：视频文件打不开")
        return

    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))
    frame_rate = int(cap.get(5))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))  # 获取视频总帧数

    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    out = cv2.VideoWriter(output_video_path, fourcc, frame_rate, (frame_width, frame_height))

    with open(class_file, "r") as my_file:
        data = my_file.read()
    class_list = data.split("\n")

    tracker1 = Tracker()
    counters = {direction: {vehicle_type: [] for vehicle_type in vehicle_types} for direction in directions}
    last_positions = {}

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(frame)
        px = pd.DataFrame(results[0].boxes.data).astype("float")

        list1 = []
        for index, row in px.iterrows():
            x1, y1, x2, y2, _, d = map(int, row)
            c = class_list[d]
            bbox = [x1, y1, x2, y2]
            for vehicle_type in vehicle_types:
                if vehicle_type in c:
                    list1.append((bbox, vehicle_type))

        bbox1_idx = tracker1.update([bbox for bbox, _ in list1])

        for bbox1, vehicle_type in zip(bbox1_idx, [vt for _, vt in list1]):
            x3, y3, x4, y4, id1 = bbox1
            current_bbox = [x3, y3, x4, y4]
            cxm = (x3 + x4) // 2
            cym = (y3 + y4) // 2

            for direction in directions:
                if cy1 - offset < cym < cy1 + offset and is_moving_direction(last_positions.get(id1, current_bbox), current_bbox, direction):
                    counter = counters[direction][vehicle_type]
                    if id1 not in counter:
                        counter.append(id1)
                        # 以下是绘图代码，可以根据需要保留或删除
                        cv2.circle(frame, (cxm, cym), 4, (0, 255, 0), -1)
                        cv2.rectangle(frame, (x3, y3), (x4, y4), (0, 0, 255), 1)
                        cvzone.putTextRect(frame, f'{len(counter)}', (x3, y3), 1, 1)

            last_positions[id1] = current_bbox

        cv2.line(frame, (2, cy1), (794, cy1), (0, 0, 255), 2)

        y_text = 30
        for direction in directions:
            for vehicle_type, counter in counters[direction].items():
                cvzone.putTextRect(frame, f'{direction} {vehicle_type} Count: {len(counter)}', (10, y_text), 2, 1)
                y_text += 30

        out.write(frame)  # 写入当前帧到输出视频

        # 移除了 cv2.imshow("RGB", frame) 的调用

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    out.release()  # 关闭视频写入器
    cv2.destroyAllWindows()
    total_num = 0
    with open('Data/Flow/results.txt', 'w') as file:
        for direction in directions:
            for vehicle_type, counter in counters[direction].items():
                file.write(f"总计 {direction} {vehicle_type}: {len(counter)} 辆\n")
                total_num += len(counter)

        video_duration = timedelta(seconds=total_frames / frame_rate)
        end_time = start_time + video_duration

        file.write(f"总计车流量为：{total_num}\n")
        file.write(f"视频起始时间: {start_time}\n")
        file.write(f"视频结束时间: {end_time}\n")

        lst = [str(start_time), str(end_time), str(total_num)]

    return list


# 使用示例，并保存处理后的视频
# rows = fetch_table_contents('video_info')
# for row in rows:
#         # # 检查每行的最后一个元素
#         # if row[-1] is not None:
#         #     # print(row[-1])
#         #     url = row[-1]
#         #     # print(url)
url = 'Data/Flow/test.mp4'
new_values = flow_count(url, ['car'], ['north', 'south'], output_video_path='Data/Flow/output.mp4')


