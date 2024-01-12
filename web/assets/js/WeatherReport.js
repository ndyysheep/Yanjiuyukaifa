var WeatherChart = function() {


    return {
        //main function to initiate the module
        initChart: function() {
            if (!jQuery.plot) {
                return;
            }
            var data = [];
            var totalPoints = 250;

            // random data generator for plot charts

            function getRandomData() {
                if (data.length > 0) data = data.slice(1);
                // do a random walk
                while (data.length < totalPoints) {
                    var prev = data.length > 0 ? data[data.length - 1] : 50;
                    var y = prev + Math.random() * 10 - 5;
                    if (y < 0) y = 0;
                    if (y > 100) y = 100;
                    data.push(y);
                }
                // zip the generated y values with the x values
                var res = [];
                for (var i = 0; i < data.length; ++i) {
                    res.push([i, data[i]]);
                }

                return res;
            }

            //Interactive Chart

            function chart2() {

                if ($('#chart_2').size() != 1) {
                    console.log("size不为1")
                    return;
                }
                var citycode;
                $.ajax({
                    url:"https://restapi.amap.com/v3/ip?key=d2c44e1851f19a159cc1daf1dbf9a518",
                    async: false,
                    type:'get',
                    dataType: 'json',
                    success: function (res) {
                        citycode = res["adcode"];
                    }
                })
                // 请求天气数据
                var dayTemp = []
                var nightTemp = []
                $.ajax({
                    async: false,
                    url:"https://restapi.amap.com/v3/weather/weatherInfo",
                    type:'get',
                    data:{
                        key:"d2c44e1851f19a159cc1daf1dbf9a518",
                        city:citycode,
                        output:"JSON",
                        extensions:"all"
                    },
                    dataType: 'json',
                    success: function (res) {
                        console.log(res);
                        var list = res.forecasts[0]["casts"]
                        $("#curcity").text("    "+res.forecasts[0]["city"])
                        for(var i = 0; i < list.length; ++i)
                        {
                            var time = new Date(list[i]["date"]).getTime()
                            dayTemp[i]=[time,parseInt(list[i]["daytemp"])]
                            nightTemp[i]=[time,parseInt(list[i]["nighttemp"])]
                            var t = i + 1
                            var weather = "#weather" + t;
                            var daytemp = "#daytemp" + t;
                            var nighttemp = "#nighttemp" + t;
                            var wind = "#wind" + t;
                            var power = "#power" + t;
                            $(weather).text("    " + list[i]["dayweather"])
                            $(daytemp).text("    " + list[i]["daytemp"]+"℃")
                            $(nighttemp).text("    " + list[i]["nighttemp"]+"℃")
                            $(wind).text("    " + list[i]["daywind"])
                            $(power).text("    " + list[i]["daypower"])

                        }
                        $("#day1").text(list[0]["date"])
                        $("#day2").text(list[1]["date"])
                        $("#day3").text(list[2]["date"])
                        $("#day4").text(list[3]["date"])

                    }
                })

                var plot = $.plot($("#chart_2"), [{
                    data: dayTemp,
                    label: "day temparture",
                    lines: {
                        lineWidth: 1,
                    },
                    shadowSize: 0

                }, {
                    data: nightTemp,
                    label: "night temparture",
                    lines: {
                        lineWidth: 1,
                    },
                    shadowSize: 0
                }], {
                    series: {
                        lines: {
                            show: true,
                            lineWidth: 2,
                            fill: true,
                            fillColor: {
                                colors: [{
                                    opacity: 0.05
                                }, {
                                    opacity: 0.01
                                }]
                            }
                        },
                        points: {
                            show: true,
                            radius: 3,
                            lineWidth: 1
                        },
                        shadowSize: 2
                    },
                    grid: {
                        hoverable: true,
                        clickable: true,
                        tickColor: "#eee",
                        borderColor: "#eee",
                        borderWidth: 1
                    },
                    colors: ["#d12610", "#37b7f3", "#52e136"],
                    xaxis: {
                        mode:"time",
                        ticks: 4,
                        tickDecimals: 0,
                        tickColor: "#eee",
                    },
                    yaxis: {
                        ticks: 10,
                        tickDecimals: 0,
                        tickColor: "#eee",
                    }
                });


                function showTooltip(x, y, contents) {
                    $('<div id="tooltip">' + contents + '</div>').css({
                        position: 'absolute',
                        display: 'none',
                        top: y + 5,
                        left: x + 15,
                        border: '1px solid #333',
                        padding: '4px',
                        color: '#fff',
                        'border-radius': '3px',
                        'background-color': '#333',
                        opacity: 0.80
                    }).appendTo("body").fadeIn(200);
                }

                var previousPoint = null;
                $("#chart_2").bind("plothover", function(event, pos, item) {
                    $("#x").text(pos.x.toFixed(2));
                    $("#y").text(pos.y.toFixed(2));

                    if (item) {
                        if (previousPoint != item.dataIndex) {
                            previousPoint = item.dataIndex;

                            $("#tooltip").remove();
                            var x = item.datapoint[0].toFixed(2),
                                y = item.datapoint[1].toFixed(2);

                            showTooltip(item.pageX, item.pageY, item.series.label + " is " + y);
                        }
                    } else {
                        $("#tooltip").remove();
                        previousPoint = null;
                    }
                });
            }

            //graph
            chart2();
        },


    };

}();