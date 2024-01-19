import cv2
import numpy as np
from red_tracker import *
from trafficSignal import *

def process_frame(frame, object_detector, tracker, vehicle_count, template):
    # Detect traffic light state
    yellow, green, red, frame_processed = trafficSignal.trafficLigh(frame, template)
    final_frame = frame_processed
    if red > max(green, yellow, 30):
        # Process for red light condition
        roi = frame_processed[230:270, 100:800]
        trafficSignal.Signalline(frame_processed)
        mask = object_detector.apply(roi)
        _, mask = cv2.threshold(mask, 30, 255, cv2.THRESH_BINARY)
        kernel = np.ones((3, 3), np.uint8)
        dilated = cv2.dilate(mask, kernel, iterations=1)

        contours, _ = cv2.findContours(dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        detections = [cv2.boundingRect(cnt) for cnt in contours if cv2.contourArea(cnt) > 900]

        boxes_ids = tracker.update(detections)
        for x, y, w, h, id in boxes_ids:
            cv2.rectangle(roi, (x, y), (x + w, y + h), (0, 0, 255), 3)
            if 195 < x < 205:
                vehicle_count += 1

        display_traffic_info(frame_processed, vehicle_count, detections, id)

    cv2.imshow("Final Frame", final_frame)
    return vehicle_count

def display_traffic_info(frame, vehicle_count, detections, last_id):
    cv2.putText(frame, f"Violation{id}", (20, 40), cv2.FONT_HERSHEY_PLAIN, 1, (255, 0, 0), 2)

def main():
    source = "Data/light/left.mp4"
    cap = cv2.VideoCapture(source)
    object_detector = cv2.createBackgroundSubtractorMOG2(history=100, varThreshold=40)
    tracker = EuclideanDistTracker()
    template_path = 'Data/light/template_image/red.png'
    template = cv2.imread(template_path, 0)
    vehicle_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        vehicle_count = process_frame(frame, object_detector, tracker, vehicle_count, template)

        if cv2.waitKey(30) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("Error occurred:", e)
        print("----Video Ends---")
