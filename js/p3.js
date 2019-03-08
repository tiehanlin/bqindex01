function p3() {
	//地图
	$.ajax({
		type: "get",
		headers: {
			//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
			Authorization: 'Basic '+sessionStorage._tcy8
		},
		//url: "https://tiehanlin.quarkioe.cn/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=1000",
		url: "/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=1000",
		////这边的url在上传之后还需要修改
		success: function(data) {
			var datas = data.managedObjects;
			var devicesOn=[],devicesOff=[]
			for(var i = 0; i < datas.length; i++) {
				if(datas[i].c8y_Availability != undefined&&datas[i].c8y_Position!=undefined) {
					if(datas[i].c8y_Availability.status == "UNAVAILABLE") {
						devicesOff.push({
							name:datas[i].name,
							value:[datas[i].c8y_Position.lng,datas[i].c8y_Position.lat]
						})
					} else {
						devicesOn.push({
							name:datas[i].name,
							value:[datas[i].c8y_Position.lng,datas[i].c8y_Position.lat]
						})
					}
				}
			}
			echartsP3(devicesOn,devicesOff);
		},
		error: function(data) {
			console.log(data)
		}
	});

}

function echartsP3(devicesOn,devicesOff) {
	var myChart = echarts.init(document.getElementById('P3'));
	var option = {
		backgroundColor: 'rgba(18,37,78,0.8)',
		title: {
			text: '设备地图总览',
			left: 'center',
			textStyle: {
				color: '#6ff8fa'
			}
		},
		tooltip: {
			trigger: 'item'
		},
		legend: {
			orient: 'vertical',
			y: 'top',
			x: 'right',
			data: ['在线设备','离线设备'],
			textStyle: {
				color: '#fff'
			}
		},
		geo: {
			map: 'china',
			label: {
				normal: {
						show: false
					},
				emphasis: {
					show: false
				}
			},
			roam: true,
			itemStyle: {
				normal: {
					areaColor: 'rgba(0,0,0,0)',
					borderColor: 'rgb(98,160,236)'
				},
				emphasis: {
					areaColor: 'rgba(98,160,236,0.5)'
				}
			}
		},
		series: [{
				name: '在线设备',
				type: 'effectScatter',
				coordinateSystem: 'geo',
				data: devicesOn,
				symbolSize:10,
				showEffectOn: 'render',
				label: {
					normal: {
						position: 'right',
						show: false
					},
					emphasis: {
						show: false
					}
				},
				itemStyle: {
					normal: {
						color: '#0ff253',
					}
				}
		},{
				name: '离线设备',
				type: 'scatter',
				coordinateSystem: 'geo',
				data: devicesOff,
				symbolSize:15,
				label: {
					normal: {
						position: 'right',
						show: false
					},
					emphasis: {
						show: false
					}
				},
				itemStyle: {
					normal: {
						color: '#f3683e'
					}
				}
		}]
	};
	myChart.setOption(option);
}