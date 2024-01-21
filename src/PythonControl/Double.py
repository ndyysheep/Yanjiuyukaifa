import datetime
import cv2 as cv
import numpy as np

def is_parallel(line1, line2, min_angle_diff, max_dist_diff):
    # 计算线条的角度
    angle1 = np.arctan2(line1[0][3] - line1[0][1], line1[0][2] - line1[0][0]) * 180 / np.pi
    angle2 = np.arctan2(line2[0][3] - line2[0][1], line2[0][2] - line2[0][0]) * 180 / np.pi
    # 检查角度差异
    if abs(angle1 - angle2) < min_angle_diff:
        # 检查线条间距离
        dist1 = np.sqrt((line1[0][2] - line1[0][0])**2 + (line1[0][3] - line1[0][1])**2)
        dist2 = np.sqrt((line2[0][2] - line2[0][0])**2 + (line2[0][3] - line2[0][1])**2)
        if abs(dist1 - dist2) < max_dist_diff:
            return True
    return False

def detect_yellow_lines(frame, longest_rect, max_length):
    # 转换到HSV颜色空间
    hsv = cv.cvtColor(frame, cv.COLOR_BGR2HSV)

    # 定义黄色在HSV空间的范围
    lower_yellow = np.array([5, 5, 5])
    upper_yellow = np.array([35, 255, 255])

    # 创建黄色区域的掩模
    mask = cv.inRange(hsv, lower_yellow, upper_yellow)

    # 应用Canny边缘检测
    edges = cv.Canny(mask, 50, 150)

    # 使用霍夫变换检测线条
    lines = cv.HoughLinesP(edges, 1, np.pi / 180, 40, minLineLength=270, maxLineGap=30)

    # 检查线条是否成对
    paired_lines = []
    if lines is not None:
        for idx1, line1 in enumerate(lines):
            for idx2, line2 in enumerate(lines):
                if idx1 != idx2 and is_parallel(line1, line2, 10, 20):
                    paired_lines.append(line1)
                    paired_lines.append(line2)

    # 收集成对线条的端点
    all_points = [point for line in paired_lines for point in [line[0][:2], line[0][2:]]]

    # 计算和更新最长矩形
    if len(all_points) >= 4:
        rect = cv.minAreaRect(np.array(all_points))
        box = cv.boxPoints(rect)
        diagonal_length = np.sqrt((box[0][0] - box[2][0])**2 + (box[0][1] - box[2][1])**2)

        if diagonal_length > max_length:
            max_length = diagonal_length
            longest_rect = rect

    # 绘制最长的矩形
    if longest_rect is not None:
        box = cv.boxPoints(longest_rect)
        box = np.intp(box)
        cv.drawContours(frame, [box], 0, (0, 0, 255), 2)

    return frame, longest_rect, max_length

def extract_subregions(frame, rect, region_size=10):
    box = cv.boxPoints(rect)
    box = np.intp(box)
    subregions = []

    for x, y in box:
        x, y = int(x), int(y)
        # 确保不超出图像边界
        x_min, x_max = max(x - region_size, 0), min(x + region_size, frame.shape[1])
        y_min, y_max = max(y - region_size, 0), min(y + region_size, frame.shape[0])

        # 如果提取的区域有效
        if x_min < x_max and y_min < y_max:
            subregion = frame[y_min:y_max, x_min:x_max]
            subregions.append((subregion, (x, y)))

    return subregions


def has_pixel_changed(prev_subregion, current_subregion, threshold=50):
    if prev_subregion is None or current_subregion is None:
        return False
    diff = cv.absdiff(prev_subregion, current_subregion)
    return np.mean(diff) > threshold


# 初始化视频捕获
cap = cv.VideoCapture('Data/Double/test.mp4')  # 替换为视频文件路径或摄像头索引

# 获取视频的分辨率和帧率
frame_width = int(cap.get(cv.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv.CAP_PROP_FRAME_HEIGHT))
frame_rate = int(cap.get(cv.CAP_PROP_FPS))

# 创建视频写入器对象
fourcc = cv.VideoWriter_fourcc(*'avc1')  # 使用 MP4 兼容的编解码器
out = cv.VideoWriter('Data/Double/output.mp4', fourcc, frame_rate, (frame_width, frame_height))

# 初始化用于存储最长矩形的变量和第一次覆盖时间
longest_rect = None
max_length = 0
prev_subregions = [None] * 4  # 存储前一帧的四个角的小区域

# 视频开始时间
start_time = datetime.datetime(2023, 12, 10, 12, 0, 0)

with open('Data/Double/results.txt', 'w') as file:
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame, longest_rect, max_length = detect_yellow_lines(frame, longest_rect, max_length)

        if longest_rect is not None:
            current_subregions = extract_subregions(frame, longest_rect)
            for i, (current_subregion, (x, y)) in enumerate(current_subregions):
                if has_pixel_changed(prev_subregions[i], current_subregion[0]):
                    current_time = start_time + datetime.timedelta(seconds=cap.get(cv.CAP_PROP_POS_FRAMES) / frame_rate)
                    file.write(f"压线时间：{current_time}压线位置：({x}, {y})\n")
                    # 可以在这里加入额外的处理
                prev_subregions[i] = current_subregion[0]  # 更新前一帧的区域

        # 将处理后的帧写入视频文件
        out.write(frame)

        # cv.imshow('Yellow Line Detection', frame)
        if cv.waitKey(1) & 0xFF == ord('q'):
            break

# 释放视频捕获和视频写入器
cap.release()
out.release()
cv.destroyAllWindows()
