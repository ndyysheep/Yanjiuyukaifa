import os
import cv2
import numpy as np

class trafficSignal:
    def trafficLigh(img, template):
      frame = img
      Yello = 0
      Green = 100
      Red = 0

      height, width = frame.shape[:2]
      roi = frame[0:height // 2, width // 3:2 * width // 3]
      gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
      res = cv2.matchTemplate(gray_roi, template, cv2.TM_CCOEFF_NORMED)
      threshold = 0.8
      loc = np.where(res >= threshold)

      found = False
      for pt in zip(*loc[::-1]):
          cv2.rectangle(frame, (pt[0] + width // 3, pt[1]),
                        (pt[0] + width // 3 + template.shape[1], pt[1] + template.shape[0]), (0, 255, 255), 2)
          found = True
      if found == 1:
          Red = 200
      else:
          Red = 0
      return Yello,Green,Red,frame

    def Signalline(frame):
        # 获取帧的高度
        height = frame.shape[0]

        # 计算从下往上的 3/7 位置
        line_position = height - int((3 / 7) * height)

        # 在计算出的位置画线
        cv2.line(frame, (0, line_position), (frame.shape[1], line_position), (0, 255, 0), 1)  # GreenLine
        cv2.line(frame, (0, line_position + 20), (frame.shape[1], line_position + 20), (0, 0, 255), 3)  # RedLine
        cv2.line(frame, (0, line_position + 40), (frame.shape[1], line_position + 40), (0, 255, 0), 1)  # GreenLine


#=-----------------------------------------------------------------------------
"""
imgpath="/home/sumeetgadewar/Downloads/Project eDBDA/Red.png"
font = cv2.FONT_HERSHEY_SIMPLEX
Limg = cv2.imread(imgpath) 
#Function CAll
Yello,Green,Red,frame = trafficSignal.trafficLigh(Limg)


if Red>Green and Red>Yello:
    print("red")
elif Green>Yello and Green>Red:
    print("Green")
else:
    print("Yello")
"""
#------------------------------------------------------------------------------    
""" 
#from The Automation File
    ### Red Light   ###################################################################
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    font = cv2.FONT_HERSHEY_SIMPLEX
    # color range
    lower_red1 = np.array([0,100,100])
    upper_red1 = np.array([10,255,255])

    lower_red2 = np.array([160,100,100])
    upper_red2 = np.array([180,255,255])

    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    r_circles = cv2.HoughCircles(maskr, cv2.HOUGH_GRADIENT, 1, 80, param1=50, param2=10, minRadius=0, maxRadius=30)

    maskr = cv2.add(mask1, mask2)
    size = frame.shape
    # print size

    # hough circle detect
    r_circles = cv2.HoughCircles(maskr, cv2.HOUGH_GRADIENT, 1, 80, param1=50, param2=10, minRadius=0, maxRadius=30)

     # traffic light detect
    r = 5
    bound = 4.0 / 10
    if r_circles is not None:
        r_circles = np.uint16(np.around(r_circles))

    for i in r_circles[0, :]:
        if i[0] > size[1] or i[1] > size[0]or i[1] > size[0]*bound:
            continue
    h, s = 0.0, 0.0
    for m in range(-r, r):
      for n in range(-r, r):

        if (i[1]+m) >= size[0] or (i[0]+n) >= size[1]:
          continue
        h += maskr[i[1]+m, i[0]+n]
        s += 1
    if h / s > 50:
      cv2.circle(frame, (i[0], i[1]), i[2]+10, (0, 255, 0), 2)
      cv2.circle(maskr, (i[0], i[1]), i[2]+30, (255, 255, 255), 2)
      cv2.putText(frame,'RED',(i[0], i[1]), font, 1,(255,0,0),2,cv2.LINE_AA)
    #################################################################################
"""