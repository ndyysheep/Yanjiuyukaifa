# Yanjiuyukaifa
---
title: 个人项目 v1.0.0
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

# Authentication

# Default

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


