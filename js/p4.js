function p4(count,thisOwnDeviceId) {
	//故障设备饼图
	/*$.ajax({
		type: "get",
		headers: {
			//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
			Authorization: 'Basic '+sessionStorage._tcy8
		},
		//url: "https://tiehanlin.quarkioe.cn/alarm/alarms?dateFrom=1970-01-01&dateTo="+days+"&pageSize=1000&resolved=false&severity=MAJOR&status=ACTIVE",
		url: "/alarm/alarms?dateFrom=1970-01-01&dateTo="+days+"&pageSize=1000&resolved=false&severity=MAJOR&status=ACTIVE",
		//这边的url的日期需要拼接
		success: function(data) {
			var allDivice=[];
			for(var i=0;i<data.alarms.length;i++){
				var a=allDivice.indexOf(data.alarms[i].source.id,0)
				if(a==-1)
				{
					allDivice.push(data.alarms[i].source.id)
				}
			}
			var normal=count;
			var breaks=_.intersection(thisOwnDeviceId,allDivice);
			var errorLength=breaks.length
			var texts=`实时故障数量${errorLength}个`
			//模拟器的话有小问题，待解决
			$("#guzhangCount").html(texts)
			echartsP4(normal,errorLength);
		},
		error: function(data) {

		}
	});*/
}

function echartsP4(normal,breaks) {
	var myChart = echarts.init(document.getElementById('P4'));
	var ten='10'
	if(window.innerWidth<1518)
	{
		ten='-10'
	}
	var option = {
		backgroundColor: 'rgba(18,37,78,0.8)',
//		toolbox: {
//			right: '0',
//			top: ten,
//			itemSize: 80,
//			showTitle: false,
//			feature: {
//				restore: {
//					show: true,
//					icon: 'image://img/quanbushebeibai.png'
//				}
//			}
//		},
		title: {
			text: '{aa|设备故障比例}',
			textStyle: {
				color: '#6ff8fa',
				rich: {
					aa: {
						backgroundColor: {
							image: 'img/three.png'
						},
						height: 20,
						width: 0,
						fontSize: 20,
						padding: [0, 0, 0, 40]
					}
				},
			}
		},
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b}: {c} ({d}%)"
		},
		legend: {
			orient: 'horizontal',
			x: 'center',
			y: 'bottom',
			align: 'left',
			textStyle: {
				color: '#FFFFFF',
				fontSize: 14
			},
			data: ['正常设备', '故障设备']
		},
		series: [{
			name: '访问来源',
			type: 'pie',
			radius: ['50%', '70%'],
			avoidLabelOverlap: false,
			color: ['#f1e852', "#58fbff"],
			label: {
				normal: {
					show: false,
					position: 'center'
				},
				emphasis: {
					show: true,
					textStyle: {
						fontSize: '30',
						fontWeight: 'bold'
					}
				}
			},
			labelLine: {
				normal: {
					show: false
				}
			},
			data: [{
					value: breaks,
					name: '故障设备'
				},
				{
					value: normal-breaks,
					name: '正常设备'
				}
			]
		}]
	};
	myChart.setOption(option);
}