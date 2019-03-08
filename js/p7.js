function p7(p7IdArr) {
	//告警列表
	var datas = [];
	$.ajax({
		type: "get",
		headers: {
			//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
			Authorization: 'Basic ' + sessionStorage._tcy8
		},
		//url: "https://tiehanlin.quarkioe.cn/event/events?dateFrom=1970-01-01&dateTo=" + days + "&pageSize=3",
		url: "/event/events?dateFrom=1970-01-01&dateTo=" + days + "&pageSize=100",
		//这边的url的日期需要拼接
		success: function(data) {
			baojing();
			var alarmsAll = data.events
			var all = [],
				idArr = [];
			var tag = '';
			for(var i = 0; i < alarmsAll.length; i++) {
				var single = alarmsAll[i].text.split(' ');
				for(var j = 0; j < single.length; j++) {
					var types = alarmsAll[i].type;
					var unit
					switch(alarmsAll[i].type) {
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

					if(idArr.indexOf(alarmsAll[i].source.id) == -1) {
						idArr.push(alarmsAll[i].source.id)
					}
					if(types == 'c8y_OutgoingSmsLog') {
						continue
					}
					if(j != 0) {
						if(types == '漏电流报警') {
							pos = ''
							all.push({
								id: alarmsAll[i].source.id,
								name: alarmsAll[i].source.name,
								time: alarmsAll[i].time,
								type: types,
								text: single[j],
								position: pos,
								unit: unit
							})
						}
						if(types == '温度报警' && single[j].substring(3) != 0) {
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
							all.push({
								id: alarmsAll[i].source.id,
								name: alarmsAll[i].source.name,
								time: alarmsAll[i].time,
								type: types,
								text: single[j].substring(3),
								position: pos,
								unit: unit
							})
						}
						if(types == '电压报警' && single[j].substring(2) != 0) {
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
							all.push({
								id: alarmsAll[i].source.id,
								name: alarmsAll[i].source.name,
								time: alarmsAll[i].time,
								type: types,
								text: single[j].substring(2),
								position: pos,
								unit: unit
							})
						}
						if(types == '过流报警' && single[j].substring(2) != 0) {
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
							all.push({
								id: alarmsAll[i].source.id,
								name: alarmsAll[i].source.name,
								time: alarmsAll[i].time,
								type: types,
								text: single[j].substring(2),
								position: pos,
								unit: unit
							})
						}
					}

				}
			}
			console.log(all)
			var counts = 0;
			var deviceId = [];
			var deviceType = [];
			//all已经有了
			$.ajax({
				type: "get",
				headers: {
					UseXBasic: true,
					//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
					Authorization: 'Basic ' + sessionStorage._tcy8
				},
				//url: "https://tiehanlin.quarkioe.cn/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=1000",
				url: "/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=1440",
				//这边的url在上传之后还需要修改
				success: function(datas) {
					var deviceAll = datas.managedObjects;
					deviceId = _.map(deviceAll, function(ele) {
						return ele.id;
					});
					deviceType = _.map(deviceAll, function(ele) {
						return ele.type;
					});
					for(var k = 0; k < all.length; k++) {
						if(deviceId.indexOf(all[k].id) != -1) {
							var index = deviceId.indexOf(all[k].id)
							tag += `<tr>
									<td>${all[k].name}</td>
									<td>${deviceType[index]}</td>
									<td>${all[k].time.substring(0,10)}
										${all[k].time.substring(11,16)}
									</td>
									<td>${all[k].type}${all[k].position}</td>
									<td>${all[k].text}${all[k].unit}</td>
									</tr>`
						}
					}
					$("#deviceAlaram").html(tag)
				},
				error: function(datas) {}
			});
			/*for(var l = 0; l < p7IdArr.length; l++) {
				$.ajax({
					type: "get",
					headers: {
						UseXBasic: true,
						//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
						Authorization: 'Basic ' + sessionStorage._tcy8
					},
					//url: "https://tiehanlin.quarkioe.cn/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=1000",
					url: "/inventory/managedObjects/" + p7IdArr[l] + "?withParents=true",
					//这边的url在上传之后还需要修改
					success: function(data) {
						deviceId.push(data.id)
						deviceType.push(data.type)
						counts++
						if(counts == l) {
							for(var k = 0; k < all.length; k++) {
								if(deviceId.indexOf(all[k].id) != -1) {
									var index = deviceId.indexOf(all[k].id)
									tag += `<tr>
									<td>${all[k].name}</td>
									<td>${deviceType[index]}</td>
									<td>${all[k].time.substring(0,10)}
										${all[k].time.substring(11,16)}
									</td>
									<td>${all[k].type}${all[k].position}</td>
									<td>${all[k].text}${all[k].unit}</td>
									</tr>`
								} else {
									console.log('没找到')
								}
							}
							$("#deviceAlaram").html(tag)
						}
						//data.type==name
					},
					error: function(data) {
						console.log(data)
					}
				});
			}*/
		},
		error: function(data) {
			console.log(data)
		}
	});
}

function baojing() {
	$.ajax({
		type: "get",
		headers: {
			//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
			Authorization: 'Basic ' + sessionStorage._tcy8
		},
		//url: "https://tiehanlin.quarkioe.cn/alarm/alarms?dateFrom=1970-01-01&dateTo="+days+"&pageSize=4&resolved=false&severity=MAJOR&status=ACTIVE",
		url: "/alarm/alarms?dateFrom=1970-01-01&dateTo=" + days + "&pageSize=1024&resolved=false&severity=CRITICAL&status=ACTIVE",
		//这边的url的日期需要拼接critical
		success: function(data) {
			var alarmsArr = data.alarms;
			var deviceId = _.map(alarmsArr, function(alarm) {
				return alarm.source.id
			});
			var onwId = _.intersection(thisOwnDevice, deviceId);
			var count = 0;
			var texts;
			for(var i = 0; i < alarmsArr.length; i++) {
				count = count + alarmsArr[i].count
			}
			texts = `实时报警数量${count}个`
			$("#eventCount").html(texts)
		},
		error: function(data) {
			console.log(data)
		}
	});
}