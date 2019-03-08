function p8() {
	//设备故障表
	$.ajax({
		type: "get",
		headers: {
			//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
			Authorization: 'Basic ' + sessionStorage._tcy8
		},
		//url: "https://tiehanlin.quarkioe.cn/alarm/alarms?dateFrom=1970-01-01&dateTo="+days+"&pageSize=4&resolved=false&severity=MAJOR&status=ACTIVE",
		url: "/alarm/alarms?dateFrom=1970-01-01&dateTo=" + days + "&pageSize=100&resolved=false&severity=MAJOR&status=ACTIVE",
		//这边的url的日期需要拼接
		success: function(data) {
			var breakAll = data.alarms
			var tag = '';
			var idArr = [];
			for(var i = 0; i < breakAll.length; i++) {
				if(idArr.indexOf(breakAll[i].source.id) == -1) {
					idArr.push(breakAll[i].source.id)
				}
			}
			var counts = 0;
			var deviceId = [];
			var deviceType = [];
			idArr = _.intersection(thisOwnDevice, idArr);
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
					for(var k = 0; k < breakAll.length; k++) {
						var text = breakAll[k].text;
						if(breakAll[k].text == 'No data received from device within required interval.') {
							text = '设备没有在所需时间内接收到数据'
						}
						if(breakAll[k].type == 'c8y_CepRuntimeException@system:SendSms') {
							continue
						}
						if(deviceId.indexOf(breakAll[k].source.id) != -1) {
							var index = deviceId.indexOf(breakAll[k].source.id)
							tag += `<tr>
												<td>${breakAll[k].source.name}</td>
												<td>${deviceType[index]}</td>
												<td>${breakAll[k].time.substring(0,10)}
													${breakAll[k].time.substring(11,16)}
												</td>
												<td>${text}</td>
											</tr>`
						}
						$("#breakTable").html(tag)
					}
				},
				error: function(datas) {}
			});
			/*for(var l = 0; l < idArr.length; l++) {
				$.ajax({
					type: "get",
					headers: {
						UseXBasic: true,
						//Authorization: 'Basic dGllaGFubGluL3RpZWhhbmxpbjpoZWxsb0AxMjM='
						Authorization: 'Basic ' + sessionStorage._tcy8
					},
					//url: "https://tiehanlin.quarkioe.cn/inventory/managedObjects?fragmentType=c8y_IsDevice&pageSize=1000",
					url: "/inventory/managedObjects/" + idArr[l] + "?withParents=true",
					success: function(data) {
						deviceId.push(data.id)
						deviceType.push(data.type)
						counts++
						if(counts == l) {
							for(var k = 0; k < breakAll.length; k++) {
								var text = breakAll[k].text;
								if(breakAll[k].text == 'No data received from device within required interval.') {
									text = '设备没有在所需时间内接收到数据'
								}
								if(breakAll[k].type == 'c8y_CepRuntimeException@system:SendSms') {
									continue
								}
								if(deviceId.indexOf(breakAll[k].source.id) != -1) {
									var index = deviceId.indexOf(breakAll[k].source.id)
									tag += `<tr>
												<td>${breakAll[k].source.name}</td>
												<td>${deviceType[index]}</td>
												<td>${breakAll[k].time.substring(0,10)}
													${breakAll[k].time.substring(11,16)}
												</td>
												<td>${text}</td>
											</tr>`
								}
								
							}
					}
						$("#breakTable").html(tag)
					},
					error: function(data) {
					}
				});
			}*/

		},
		error: function(data) {}
	});
}