function realTime() {
	var settings = {
		"async": true,
		"crossDomain": true,
		//"url": "https://tiehanlin.quarkioe.cn/cep/realtime",
		"url": "/cep/realtime",
		"method": "POST",
		"headers": {
			//"authorization": "Basic dGllaGFubGluOmhlbGxvQDEyMw==",
			"authorization": "Basic " + sessionStorage._tcy8,
			"content-type": "application/json",
			"cache-control": "no-cache"
		},
		"processData": false,
		"data": "[\n\t{\n    \t\"version\":\"1.0\",\n        \"minimumVersion\":\"0.9\",\n        \"channel\":\"/meta/handshake\",\n        \"supportedConnectionTypes\":[\"long-polling\"],\n        \"advice\":{\n        \t\"timeout\":60000,\"interval\":0\n        }\n    }\n]"
	}
	$.ajax(settings).done(function(response) {
		var clientId = response[0].clientId;
		real(clientId);
	});
}

function real(clientId) {
	var data = `[{"channel":"/meta/subscribe","subscription":"/alarms/*","clientId":"${clientId}"},{"channel":"/meta/subscribe","subscription":"/events/*","clientId":"${clientId}"}]`
	var settings = {
		"async": true,
		"crossDomain": true,
		//"url": "https://tiehanlin.quarkioe.cn/cep/realtime",
		"url": "/cep/realtime",
		"method": "POST",
		"headers": {
			//"authorization": "Basic dGllaGFubGluOmhlbGxvQDEyMw==",
			"authorization": "Basic " + sessionStorage._tcy8,
			"content-type": "application/json",
			"cache-control": "no-cache"
		},
		"processData": false,
		"data": data
	}

	$.ajax(settings).done(function(response) {
		if(response[0].successful == true) {
			longs(clientId)
		}
	});
}

function longs(clientId) {
	var data = `[{"channel":"/meta/connect","connectionType":"long-polling","clientId":"${clientId}"}]`
	var settings = {
		"async": true,
		"crossDomain": true,
		//"url": "https://tiehanlin.quarkioe.cn/cep/realtime",
		"url": "/cep/realtime",
		"method": "POST",
		"headers": {
			//"authorization": "Basic dGllaGFubGluOmhlbGxvQDEyMw==",
			"authorization": "Basic " + sessionStorage._tcy8,
			"content-type": "application/json",
			"cache-control": "no-cache"
		},
		"processData": false,
		"data": data
	}
	$.ajax(settings).done(function(data1) {
		var mydata;
		longs(clientId);
		if(Array.isArray(data1)) {
			mydata = data1;
		} else {
			mydata = JSON.parse(data1);
		}
		if(mydata[0].channel.substring(0, 7) == '/alarms') {
			if(thisOwnDevice.indexOf(mydata[0].data.data.source.id) == -1) {
				return
			}
			if(mydata[0].data.data.severity == "MAJOR") {
				$("#P8 h4 button").css({
					'box-shadow': '0px 0px 10px #D43F3A inset',
					'border': '#D43F3A 1px solid'
				});
				if(audio2.paused) {
					audio2.play();
				}
				realTimeErrorId(mydata[0].data.data.source.id, mydata[0].data.data.time, mydata[0].data.data.text)
				//p1()
				//p8();
			}
		}
		if(mydata[0].channel.substring(0, 7) == '/events') {
			if(thisOwnDevice.indexOf(mydata[0].data.data.source.id) == -1) {
				return
			}
			if(mydata[0].data.data.type == 'c8y_漏电流报警' || mydata[0].data.data.type == 'c8y_温度报警' || mydata[0].data.data.type == 'c8y_电压报警' || mydata[0].data.data.type == 'c8y_过流报警') {
				$("#P7 h4 button").css({
					'box-shadow': '0px 0px 10px #D43F3A inset',
					'border': '#D43F3A 1px solid'
				});
				if(audio1.paused) {
					audio1.play();
				}
				realTimeEventId(mydata[0].data.data.source.id, mydata[0].data.data.time, mydata[0].data.data.text, mydata[0].data.data.type)
				//p1(); //这里应该是p7。但是p7由p1触发
			}
		}
	});
}

function realTimeErrorId(id, errorTime, errorName) {
	$.ajax({
		type: "get",
		headers: {
			UseXBasic: true,
			//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
			Authorization: 'Basic ' + sessionStorage._tcy8
		},
		//url: "https://tiehanlin.quarkioe.cn/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=1000",
		url: "/inventory/managedObjects/" + id + "?withParents=true",
		success: function(data) {
			if(errorName == 'No data received from device within required interval.') {
				errorName = '设备没有在所需时间内接收到数据'
			}
			var tag = `<tr><td>${data.name}</td>
							<td>${data.type}</td>
							<td>${errorTime.substring(0,10)} ${errorTime.substring(11,16)}</td>
							<td>${errorName}</td></tr>`;
			var tr = $("#breakTable tr");
			for(var i = 0; i < tr.length; i++) {
				if(tr[i].cells[0].innerHTML == data.name) {
					tr.splice(i, 1);
					$("#breakTable").html(tr)
					$("#breakTable").prepend(tag)
					break
				} else {
					$("#breakTable").prepend(tag)
				}
			}
		},
		error: function(data) {}
	});
}

function realTimeEventId(id, eventTime, eventText, eventType) {
	$.ajax({
		type: "get",
		headers: {
			UseXBasic: true,
			//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
			Authorization: 'Basic ' + sessionStorage._tcy8
		},
		//url: "https://tiehanlin.quarkioe.cn/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=1000",
		url: "/inventory/managedObjects/" + id + "?withParents=true",
		success: function(data) {
			baojing();
			//新增这个
			var all = [];
			var single = eventText.split(' ');
			for(var j = 0; j < single.length; j++) {
				var types = eventType;
				var unit = '',
					tag;
				switch(eventType) {
					case 'c8y_漏电流报警':
						types = '漏电流报警'
						unit = 'mA'
						break;
					case 'c8y_温度报警':
						types = '温度报警'
						unit = "℃"
						break;
					case 'c8y_电压报警':
						types = '电压报警'
						unit = 'V'
						break;
					case 'c8y_过流报警':
						types = '过流报警'
						unit = 'A'
						break;
				}
				var pos;
				switch(j) {
					case 1:
						pos = 'A相'
						break;
					case 2:
						pos = 'B相'
						break;
					case 3:
						pos = 'C相'
						break;
					case 4:
						pos = 'N相'
						break;
				}
				if(types == '漏电流报警') {
					pos = ''
				}
				if(types == 'c8y_OutgoingSmsLog') {
					continue
				}
				var tr = $("#deviceAlaram tr")
				if(tr.length > 150) {
					tr.splice(149, 1)
					$("#deviceAlaram").html(tr)
				}
				if(j != 0) {
					if(types == '漏电流报警') {
						pos = ''
						tag = `<tr><td>${data.name}</td>
									<td>${data.type}</td>
									<td>${eventTime.substring(0,10)}
										${eventTime.substring(11,16)}
									</td>
									<td>${types}${pos}</td>
									<td>${single[j]}${unit}</td></tr>`
						$("#deviceAlaram").prepend(tag)
					}
					if(types == '温度报警'&& single[j].substring(3) != 0) {
						switch(j) {
								case 1:
									pos = 'T1'
									break;
								case 2:
									pos = 'T2'
									break;
								case 3:
									pos = 'T3'
									break;
								case 4:
									pos = 'T4'
									break;
							}
						tag = `<tr><td>${data.name}</td>
									<td>${data.type}</td>
									<td>${eventTime.substring(0,10)}
										${eventTime.substring(11,16)}
									</td>
									<td>${types}${pos}</td>
									<td>${single[j].substring(3)}${unit}</td></tr>`
						$("#deviceAlaram").prepend(tag)
					}
					if(types == '电压报警' && single[j].substring(2) != 0){
						switch(j) {
								case 1:
									pos = 'A相'
									break;
								case 2:
									pos = 'B相'
									break;
								case 3:
									pos = 'C相'
									break;
							}
						tag = `<tr><td>${data.name}</td>
									<td>${data.type}</td>
									<td>${eventTime.substring(0,10)}
										${eventTime.substring(11,16)}
									</td>
									<td>${types}${pos}</td>
									<td>${single[j].substring(2)}${unit}</td></tr>`
						$("#deviceAlaram").prepend(tag)
					}
					if(types == '过流报警' && single[j].substring(2) != 0){
						switch(j) {
								case 1:
									pos = 'A相'
									break;
								case 2:
									pos = 'B相'
									break;
								case 3:
									pos = 'C相'
									break;
							}
						tag = `<tr><td>${data.name}</td>
									<td>${data.type}</td>
									<td>${eventTime.substring(0,10)}
										${eventTime.substring(11,16)}
									</td>
									<td>${types}${pos}</td>
									<td>${single[j].substring(2)}${unit}</td></tr>`
						$("#deviceAlaram").prepend(tag)
					}
				}
			}
		},
		error: function(data) {}
	});
}