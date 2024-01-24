import cv2
import datetime
from red_tracker import *
from trafficSignal import *
MIN_WIDTH = 200
MAX_WIDTH = 350
MIN_HEIGHT = 180
MAX_HEIGHT = 400
recorded_ids = set()

def process_frame(frame, object_detector, tracker, vehicle_count, template):
    # Detect traffic light state
    yellow, green, red, frame_processed = trafficSignal.trafficLigh(frame, template)
    final_frame = frame_processed
    if red > max(green, yellow, 30):
        # Process for red light condition

        # 获取帧的尺寸
        frame_height, frame_width = frame_processed.shape[:2]

        # 计算感兴趣区域的坐标
        top_y = frame_height * 2 // 7  # 从下往上的 3/7 位置
        bottom_y = frame_height * 5 // 7  # 从下往上的 5/7 位置
        left_x = frame_width * 0 // 5  # 从左到右的 0/5 位置
        right_x = frame_width * 4 // 5  # 从左到右的 4/5 位置

        # 定义感兴趣的区域
        roi = frame_processed[top_y:bottom_y, left_x:right_x]
        trafficSignal.Signalline(frame_processed)
        mask = object_detector.apply(roi)
        _, mask = cv2.threshold(mask, 30, 255, cv2.THRESH_BINARY)
        kernel = np.ones((3, 3), np.uint8)
        dilated = cv2.dilate(mask, kernel, iterations=1)

        contours, _ = cv2.findContours(dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        detections = []
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)

            # 替换面积条件为长宽条件
            if MIN_WIDTH < w < MAX_WIDTH and MIN_HEIGHT < h < MAX_HEIGHT:
                detections.append((x, y, w, h))

        boxes_ids = tracker.update(detections)
        for box_id in boxes_ids:
            x, y, w, h, id = box_id
            cv2.rectangle(roi, (x, y), (x + w, y + h), (0, 0, 255), 3)
            # 这里可以添加其他处理

        # 在这里调用display_traffic_info，确保有有效的ID
        if boxes_ids:
            last_id = boxes_ids[-1][-1]  # 获取最后一个检测到的id
            display_traffic_info(frame_processed, vehicle_count, detections, last_id)

    # cv2.imshow("Final Frame", final_frame)
    return vehicle_count


def display_traffic_info(frame, vehicle_count, detections, last_id):
    global recorded_ids  # 使用全局变量

    fixed_time = datetime.datetime(2024, 1, 15, 12, 0, 0)

    # 将固定时间格式化为字符串
    formatted_time = fixed_time.strftime("%Y-%m-%d %H:%M:%S")

    # 打印违规信息
    if detections and last_id not in recorded_ids:  # 检查ID是否已记录
        x, y, w, h = detections[-1]  # 获取最后一个检测到的车辆的位置
        cv2.putText(frame, f"Violation: ID {last_id}", (20, 40), cv2.FONT_HERSHEY_PLAIN, 1, (255, 0, 0), 2)

        # 写入到文件中，并将ID添加到已记录集合中
        with open('Data/light/results.txt', 'a', encoding='utf-8') as file:
            file.write(f"车辆ID:{last_id} 闯红灯位置:(X:{x}, Y:{y}) 闯红灯时间:{formatted_time}\n")
            recorded_ids.add(last_id)  # 记录ID


# 在程序开始时清空文件
with open('Data/light/results.txt', 'w', encoding='utf-8'):
    pass


def main():
    source = "Data/light/test.mp4"
    cap = cv2.VideoCapture(source)
    object_detector = cv2.createBackgroundSubtractorMOG2(history=100, varThreshold=40)
    tracker = EuclideanDistTracker()
    template_path = 'Data/light/template_image/red.png'
    template = cv2.imread(template_path, 0)
    vehicle_count = 0

    # 获取原始视频的分辨率和帧率
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    # 初始化VideoWriter对象
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    out = cv2.VideoWriter('Data/light/output.mp4', fourcc, fps, (frame_width, frame_height))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        vehicle_count = process_frame(frame, object_detector, tracker, vehicle_count, template)

        # 将处理后的帧写入视频文件
        out.write(frame)

        if cv2.waitKey(30) == 27:
            break

    # 释放资源
    cap.release()
    out.release()  # 释放VideoWriter对象
    cv2.destroyAllWindows()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("Error occurred:", e)
        print("----Video Ends---")
