# Yanjiuyukaifa
---
title: 研究与开发实践 v1.0.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.17"

---

# 个人项目

> v1.0.0

Base URLs:

* <a href="http://localhost:9999/my_pro_war_exploded">测试环境: http://localhost:9999/my_pro_war_exploded</a>

# Authentication

# 研究与开发实践

## POST 文件上传接口

POST /my_pro_war_exploded/monitor_data_servlet_action

文件上传的接口,注意 目表目录需要自己创建,还不完善,只能支持最低限度的文件上传

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|action|query|string| no |none|
|ajax|query|string| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### Responses Data Schema



## POST 研开-车辆监测数据

POST /my_pro_war_exploded/monitor_data_servlet_action

车辆监测数据的接口

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|action|query|string| yes |action,实际的请求类型|
|id|query|string| no |查询检测信息的序号|
|car_code|query|string| no |该条检测数据的车牌号|
|vehicle_type|query|string| no |车辆类型|
|illegal_status|query|integer| no |0-正常行驶 1-违停 2-闯红灯 3-压双黄线 4-逆行|
|capture_time|query|string| no |支持yyyy-mm-dd形式的日期,也可接收yyyy-mm-dd HH:mm:ss格式|
|speed|query|string| no |车辆行驶速度|
|lane_name|query|string| no |道路名称,注意:遵从外码约束,引用表lane_data|
|ajax|query|integer| yes |ajax方式请求|

> Response Examples

> 200 Response

```json
{
  "result_msg": "string",
  "aaColumn": [
    "string"
  ],
  "aaData": [
    {
      "speed_limit": "string",
      "creator": "string",
      "create_time": "string",
      "device_id": "string",
      "vehicle_type": "string",
      "lane_id": "string",
      "speed": "string",
      "illegal_status": "string",
      "car_code": "string",
      "id": "string",
      "lane_name": "string",
      "capture_time": "string",
      "video_id": "string",
      "speed_limit_for_others": "string",
      "park_limit_tag": "string"
    }
  ],
  "action": "string",
  "result_code": 0,
  "ajax": true
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» result_msg|string|true|none||返回的字段信息|
|» aaColumn|[string]|true|none||返回数据含有的列名称|
|» aaData|[object]|true|none||返回数据的主干|
|»» speed_limit|string|false|none||该路段的限速信息|
|»» creator|string|false|none||该条目创建者|
|»» create_time|string|false|none||该条目创建时间|
|»» device_id|string|false|none||监控的设备id|
|»» vehicle_type|string|false|none||车辆类型|
|»» lane_id|string|false|none||该条记录道路id|
|»» speed|string|false|none||该条记录的车速|
|»» illegal_status|string|false|none||违法状态|
|»» car_code|string|false|none||车牌号|
|»» id|string|false|none||该条目的序号,主码|
|»» lane_name|string|false|none||道路名称-和laneid一一对应|
|»» capture_time|string|false|none||此记录相关的抓拍时间|
|»» video_id|string|false|none||采取的视频id|
|»» speed_limit_for_others|string|false|none||除小型车之外其它的限速信息|
|»» park_limit_tag|string|false|none||是否允许停车的字段|
|» action|string|true|none||提交的请求信息|
|» result_code|integer|true|none||返回的结果信息|
|» ajax|boolean|true|none||是否使用ajax跳转方式|





## POST 研开-车辆监测数据-统计

## POST 研开-违法监测数据

POST /my_pro_war_exploded/illegal_data_servlet_action

违法监测数据的接口--和车辆监测数据的接口高度类似,区别在于该接口只返回违法车辆信息,后期可能优化合并,故只对部分字段进行注释

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|action|query|string| yes |action,实际的请求类型|
|id|query|string| no |查询检测信息的序号|
|car_code|query|string| no |该条检测数据的车牌号|
|vehicle_type|query|string| no |车辆类型|
|illegal_status|query|integer| no |0-正常行驶 1-违停 2-闯红灯 3-压双黄线 4-逆行|
|capture_time|query|string| no |支持yyyy-mm-dd形式的日期,也可接收yyyy-mm-dd HH:mm:ss格式|
|speed|query|string| no |车辆行驶速度|
|lane_name|query|string| no |道路名称,注意:遵从外码约束,引用表lane_data|
|ajax|query|integer| yes |ajax方式请求|

> Response Examples

> 200 Response

```json
{
  "result_msg": "string",
  "aaColumn": [
    "string"
  ],
  "aaData": [
    {
      "creator": "string",
      "create_time": "string",
      "device_id": "string",
      "vehicle_type": "string",
      "lane_id": "string",
      "speed": "string",
      "illegal_status": "string",
      "car_code": "string",
      "id": "string",
      "lane_name": "string",
      "capture_time": "string",
      "video_id": "string",
      "image_url": "string"
    }
  ],
  "action": "string",
  "result_code": 0,
  "ajax": true
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» result_msg|string|true|none||none|
|» aaColumn|[string]|true|none||none|
|» aaData|[object]|true|none||none|
|»» creator|string|false|none||none|
|»» create_time|string|false|none||none|
|»» device_id|string|false|none||none|
|»» vehicle_type|string|false|none||none|
|»» lane_id|string|false|none||none|
|»» speed|string|false|none||none|
|»» illegal_status|string|false|none||none|
|»» car_code|string|false|none||none|
|»» id|string|false|none||none|
|»» lane_name|string|false|none||none|
|»» capture_time|string|false|none||none|
|»» video_id|string|false|none||none|
|»» image_url|string|false|none||抓拍图片的地址(虚拟地址)|
|» action|string|true|none||none|
|» result_code|integer|true|none||none|
|» ajax|boolean|true|none||none|


## POST 研开-违法监测数据-统计

POST /my_pro_war_exploded/illegal_data_servlet_action

违法监测数据的接口--统计部分

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|action|query|string| yes |action,实际的请求类型|
|time_from|query|string| no |查询记录起始时间 格式至少包含yyyy-mm-dd 若不填则返回所有记录的统计,若time_to填写,则返回从现在开始的记录值|
|time_to|query|string| no |查询记录截止时间 格式至少包含yyyy-mm-dd,若time_from填写,则返回截止现在的记录值|
|ajax|query|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "result_msg": "string",
  "aaColumn": [
    "string"
  ],
  "aaData": [
    {
      "num": "string",
      "vehicle_type": "string"
    }
  ],
  "action": "string",
  "result_code": 0,
  "ajax": true,
  "hour_aaData": [
    {
      "status1": 0,
      "status2": 0,
      "time_interval": 0,
      "status3": 0,
      "status4": 0
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» result_msg|string|true|none||返回的结果信息|
|» aaColumn|[string]|true|none||返回的aaData列集合|
|» aaData|[object]|true|none||返回车辆类型-数目|
|»» num|string|true|none||数量|
|»» vehicle_type|string|true|none||违法车辆类型|
|» action|string|true|none||none|
|» result_code|integer|true|none||none|
|» ajax|boolean|true|none||none|
|» hour_aaData|[object]|true|none||返回按小时段统计的违法信息|
|»» status1|integer|true|none||状态:违停|
|»» status2|integer|true|none||状态:闯红灯|
|»» time_interval|integer|true|none||小时段|
|»» status3|integer|true|none||状态:压双黄线|
|»» status4|integer|true|none||状态:逆行|

## POST 研开-车流量监测数据表

POST /my_pro_war_exploded/flow_data_servlet_action

车流量监测数据的表信息,包括路段,车流量总数等 没有标记则参数都非必选

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|time_from|query|string| no |选取记录查找筛查起点 和time_to任一为空值则查询当前时间->time_to范围字段|
|time_to|query|string| no |选取记录查找筛查起点 time_from为空值则查询time_from->当前时间范围字段|
|action|query|string| yes |action,请求类型|
|ajax|query|string| yes |ajax跳转方式|
|id|query|string| no |记录序号|
|lane_name|query|string| no |抓拍路段|
|start_time|query|string| no |车流量统计计时开始时间,和time_from time_to结合查询|
|end_time|query|string| no |车流量统计计时结束时间,和time_from time_to结合查询|
|total_num|query|integer| no |车流量计数|

> Response Examples

> 200 Response

```json
{
  "result_msg": "string",
  "aaColumn": [
    "string"
  ],
  "aaData": [
    {
      "speed_limit": "string",
      "start_time": "string",
      "total_num": "string",
      "end_time": "string",
      "lane_id": "string",
      "id": "string",
      "lane_name": "string",
      "speed_limit_for_others": "string",
      "park_limit_tag": "string"
    }
  ],
  "action": "string",
  "result_code": 0,
  "ajax": true
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» result_msg|string|true|none||返回的结果信息|
|» aaColumn|[string]|true|none||返回aaData的列集合|
|» aaData|[object]|true|none||返回的结果集|
|»» speed_limit|string|false|none||小型车限速信息|
|»» start_time|string|false|none||车流量计算开始时间|
|»» total_num|string|false|none||车流量|
|»» end_time|string|false|none||车流量计算截止时间|
|»» lane_id|string|false|none||道路id 和道路名称一 一对应|
|»» id|string|false|none||记录序号|
|»» lane_name|string|false|none||道路名称|
|»» speed_limit_for_others|string|false|none||小型车之外的限速信息|
|»» park_limit_tag|string|false|none||是否允许停车的标志|
|» action|string|true|none||none|
|» result_code|integer|true|none||返回的状态码|
|» ajax|boolean|true|none||none|

## POST 研开-车流量监测数据--统计

POST /my_pro_war_exploded/flow_data_servlet_action

对车辆监测数据的部分统计信息,包括总车流量前十道路统计,单次车流量前十统计

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|time_from|query|string| 否 |选取记录查找筛查起点 和time_to任一为空值则查询当前时间->time_to范围字段|
|time_to|query|string| 否 |选取记录查找筛查起点 time_from为空值则查询time_from->当前时间范围字段|
|action|query|string| 是 |action,请求类型|
|ajax|query|string| 是 |ajax跳转方式|

> 返回示例

> 200 Response

```json
{
  "result_msg": "string",
  "aaColumn": [
    "string"
  ],
  "aaData": [
    {
      "num": "string",
      "lane_name": "string"
    }
  ],
  "action": "string",
  "result_code": 0,
  "ajax": true,
  "hour_aaData": [
    {
      "num": 0,
      "lane_name": "string"
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» result_msg|string|true|none||返回结果信息|
|» aaColumn|[string]|true|none||返回aaData的列集合|
|» aaData|[object]|true|none||车辆类型统计|
|»» num|string|true|none||数量|
|»» lane_name|string|true|none||道路名称|
|» action|string|true|none||none|
|» result_code|integer|true|none||返回的状态码|
|» ajax|boolean|true|none||none|
|» hour_aaData|[object]|true|none||按小时计统计信息|
|»» num|integer|false|none||数字|
|»» lane_name|string|false|none||道路名称|

# Data Schema



