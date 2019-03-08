function p1() {
	//全部设备echarts饼图
	/*$.ajax({
		type: "get",
		headers: {
			UseXBasic:true,
			//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
			Authorization: 'Basic '+sessionStorage._tcy8
		},
		//url: "https://tiehanlin.quarkioe.cn/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=1000",
		url: "/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=1440",
		//这边的url在上传之后还需要修改
		success: function(data) {
			var datas = data.managedObjects;
			var online = 0,
				offline = 0;
			var allCount = 0;
			var p7IdArr=[]
			for(var i = 0; i < datas.length; i++) {
				if(datas[i].c8y_Availability != undefined) {
					if(datas[i].c8y_Availability.status == "UNAVAILABLE") {
						offline++
						allCount++
						p7IdArr.push(datas[i].id)
					}
					if(datas[i].c8y_Availability.status == "AVAILABLE"){
						online++
						allCount++
						p7IdArr.push(datas[i].id)
					}

				}
			}
			thisOwnDevice=p7IdArr;
			p4(allCount,thisOwnDevice);
			p7(p7IdArr);
			p8();
			echartsP1(online, offline,datas.length);
		},
		error: function(data) {
		}
	});*/
}

function echartsP1(online, offline,allCount) {
	var myChart = echarts.init(document.getElementById('P1'));
	var text=`{aa|设备总数量${allCount}台}`
	var ten='10'
	if(window.innerWidth<1518)
	{
		ten='-10'
	}
	var option = {
		backgroundColor: 'rgba(18,37,78,0.8)',
		title: {
			text: text,
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
			data: ['在线设备', '离线设备']
		},
		series: [{
			name: '访问来源',
			type: 'pie',
			radius: ['50%', '70%'],
			avoidLabelOverlap: false,
			color: ['#0ff253', "#f3683e"],
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
					value: online,
					name: '在线设备'
				},
				{
					value: offline,
					name: '离线设备'
				}
			]
		}]
	};
	myChart.setOption(option);
}