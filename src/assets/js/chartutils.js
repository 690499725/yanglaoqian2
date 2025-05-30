import * as echarts from 'echarts';
// 移除高德地图扩展
// import 'echarts-extension-amap';

const $echarts = echarts;

import utils from './utils.js'
import config from './config.js'

// 通用样式配置
const commonStyle = {
	axisLine: {
		show: true,
		lineStyle: {
			color: '#ffffff88'
		}
	},
	axisLabel: {
		color: '#ffffff88'
	},
	axisTick: {
		show: false
	},
	splitLine: {
		show: false
	}
};

export default {
	/**
	 * 创建图表标题
	 * @param {Object} title
	 */
	createChartTitle: (title) => ({
		show: true,
		text: title,
		textStyle: {
			color: "#ddd",
			fontWeight: 'normal'
		},
		x: 'center',
		y: '5vh'
	}),
	/**
	 * 创建图表背景
	 * @param {Object} title
	 */
	createChartGaid: (left = '30vh', right = '10vh', top = '10vh', bottom = '40vh') => ({
		left,
		right,
		top,
		bottom
	}),
	/**
	 * 创建图表背景
	 * @param {Object} title
	 */
	createChartBaseOption: function(title, left, right, top, bottom, categorys)  {
		return {
			title: this.createChartTitle(title),
			tooltip: {
				show: true,
				trigger: 'axis'
			},
			grid: this.createChartGaid(left, right, top, bottom),
			xAxis: {
				type: 'category',
				...commonStyle,
				boundaryGap: false,
				data: categorys
			},
			yAxis: {
				type: 'value',
				...commonStyle,
				splitLine: {
					lineStyle: {
						color: '#ffffff88',
						type: 'dashed'
					}
				}
			}
		}
	},
	/**
	 * 获取x轴颜色
	 * @param {Object} title
	 */
	getChartXColor: () => {
		return '#ffffff88'
	},
	/**
	 * 获取x轴文本颜色
	 * @param {Object} title
	 */
	getChartXTextColor: () => {
		return '#ffffff88'
	},
	/**
	 * 获取y轴颜色
	 * @param {Object} title
	 */
	getChartYColor: () => {
		return '#ffffff88'
	},
	/**
	 * 获取y轴文本颜色
	 * @param {Object} title
	 */
	getChartYTextColor: () => {
		return '#ffffff88'
	},
	initMapChart: function(ele) {
		const option = {
			title: {
				text: '设备分布图',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: ['安防设备', '公共设施', '通讯设备', '娱乐设备', '休闲设备']
			},
			xAxis: {
				type: 'value',
				name: '经度',
				min: 108.83,
				max: 108.85
			},
			yAxis: {
				type: 'value',
				name: '纬度',
				min: 34.20,
				max: 34.22
			},
			series: [
				{
					name: '安防设备',
					type: 'scatter',
					symbol: 'rect',
					symbolSize: 10,
					itemStyle: { color: '#fac858' },
					data: [
						[108.837888, 34.211216],
						[108.838226, 34.211233],
						[108.839781, 34.21126],
						[108.840548, 34.210506],
						[108.837662, 34.209774],
						[108.839942, 34.208909]
					]
				},
				{
					name: '公共设施',
					type: 'scatter',
					symbol: 'pin',
					symbolSize: 10,
					itemStyle: { color: '#FF8A26' },
					data: [
						[108.841063, 34.210337],
						[108.837475, 34.20941],
						[108.842002, 34.209903],
						[108.837813, 34.208439],
						[108.842142, 34.208922],
						[108.84366, 34.20906],
						[108.844309, 34.209188]
					]
				},
				{
					name: '通讯设备',
					type: 'scatter',
					symbol: 'roundRect',
					symbolSize: 10,
					itemStyle: { color: '#FF5722' },
					data: [
						[108.841589, 34.210311],
						[108.841525, 34.210435],
						[108.84153, 34.21028],
						[108.841643, 34.210586]
					]
				},
				{
					name: '娱乐设备',
					type: 'scatter',
					symbol: 'circle',
					symbolSize: 10,
					itemStyle: { color: '#FF8A26' },
					data: [
						[108.839835, 34.209623],
						[108.839588, 34.208403],
						[108.840441, 34.208163],
						[108.841743, 34.208785],
						[108.842323, 34.209037],
						[108.842709, 34.20957]
					]
				},
				{
					name: '休闲设备',
					type: 'scatter',
					symbol: 'diamond',
					symbolSize: 10,
					itemStyle: { color: '#91cc75' },
					data: [
						[108.838226, 34.211233],
						[108.839781, 34.21126],
						[108.840548, 34.210506],
						[108.837662, 34.209774]
					]
				}
			]
		};

		const mapchart = echarts.init(ele);
		mapchart.setOption(option);
		return mapchart;
	},
	initPieChart: function(option, category, values)  {
		const datas = category.map((item, index) => ({
			value: values[index],
			name: item
		}));

		Object.assign(option, {
			color: config.colors,
			xAxis: { show: false },
			yAxis: { show: false },
			legend: {
				right: '10',
				y: 'center',
				data: category,
				orient: 'vertical',
				textStyle: { color: '#fff' },
				itemGap: 10
			},
			series: [{
				name: '告警级别分布',
				type: 'pie',
				center: ['40%', '50%'],
				radius: ['85%', '65%'],
				avoidLabelOverlap: true,
				itemStyle: {
					borderRadius: 15,
					borderColor: 'rgba(200,200,200,0.3)',
					borderWidth: 0,
					shadowColor: 'rgba(200, 200, 200, 0.5)',
					shadowBlur: 5
				},
				label: {
					show: true,
					color: '#fff',
					position: 'outside',
					fontSize: 14,
					textBorderWidth: 0
				},
				labelLine: {
					show: true,
					length: 20,
					length2: 30,
					lineStyle: { width: 2 }
				},
				data: datas
			}]
		});
	},
	initPieFullChart: function(option, category, values)  {
		let datas = [];
		category.forEach((item, index) => {
			datas.push({
				value: values[index],
				name: item
			});
		});
		let option_ = {
			color:config.colors,
			xAxis:{
				show:false
			},
			yAxis:{
				show:false
			},
			legend:{
				right:'10',
				y:'center',
				data:category,
				orient :'vertical',
				textStyle:{
					color:'#fff'
				},
				itemGap:10
			},
			series: [{
				name: '告警级别分布',
				type: 'pie',
				center:['35%','50%'],
				// radius: ['85%', '15%'],
				avoidLabelOverlap: true,
				selectedOffset:20,
				roseType:'area',
				itemStyle: {
					borderRadius: 10,
					borderColor: 'rgba(200,200,200,0.3)',
					borderWidth: 0,
					shadowColor: 'rgba(200, 200, 200, 0.5)',
					shadowBlur: 5
				},
				label: {
					show: true,
					color:'#fff',
					position: 'outside',
					fontSize:'1.4rem',
					textBorderWidth:0,
					// textShadowBlur:0
				},
				labelLine:{
					show:true,
					length:10,
					length2:20,
					lineStyle:{
						width:1
					}
				},
				data: datas
			}]
		};
		for (let key in option_) {
			option[key] = option_[key];
		}
	},
	initBarChart: function(option, category, values, color) {
		Object.assign(option, {
			backgroundColor: '#000000',
			grid: this.createChartGaid('30vh', '5vh', "15vh", "20vh"),
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'shadow' }
			},
			xAxis: {
				...commonStyle,
				data: category,
				type: 'category'
			},
			yAxis: {
				...commonStyle,
				splitLine: {
					lineStyle: {
						color: '#ffffff88',
						type: 'dashed'
					}
				}
			},
			series: [{
				name: "打分",
				data: values,
				type: 'bar',
				barWidth: '20vh',
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: color + 'ff' },
						{ offset: 1, color: color + 'bb' }
					]),
					barBorderRadius: 20
				},
				label: {
					show: true,
					position: 'top',
					textStyle: {
						fontSize: "1.2rem",
						color: '#fff'
					}
				}
			}]
		});
	},
	initLineChart: function(option, category, values, color)  {
		Object.assign(option, {
			backgroundColor: '#000000',
			grid: this.createChartGaid('40vw', null, "15vh", "20vh"),
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'shadow' }
			},
			xAxis: {
				...commonStyle,
				data: category,
				boundaryGap: false,
				type: 'category'
			},
			yAxis: {
				...commonStyle,
				splitLine: {
					lineStyle: {
						color: '#ffffff88',
						type: 'dashed'
					}
				}
			},
			series: [{
				name: "打分",
				data: values,
				type: 'line',
				itemStyle: {
					normal: {
						color: color,
						lineStyle: {
							width: 1,
							color: color
						}
					}
				},
				lineStyle: {
					width: 1,
					color: color
				},
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{ offset: 0, color: color + 'ff' },
							{ offset: 1, color: color + '00' }
						]
					}
				},
				label: {
					show: true,
					color: '#ddd',
					position: 'top'
				}
			}]
		});
	},
	initRadarChart:function(option,category,values){
		var indicator = [];
		category.forEach((item,index)=>{
			indicator.push({
				text: item,
				min: 0,
				max: 1000
			});
		});
		let option_ = {
			hoverAnimation: true,
			tooltip: {
				trigger: 'item',
			},
			radar: {
				nameGap: 6, // 图中工艺等字距离图的距离
				radius: '80%',
				center: ['50%', '50%'],
				name: {
					textStyle: {
						color: '#fff',
						fontSize: 14,
					},
				},
				indicator: indicator,
				axisLine: {
					//指向外圈文本的分隔线样式
					lineStyle: {
						color: 'rgba(245, 166, 35, 0.3)',
					},
				},
				splitLine: {
					lineStyle: {
						color: 'rgba(245, 166, 35, 0.3)', // 分隔线颜色
						width: 1, // 分隔线线宽
					},
				},
				splitArea: {
					// 坐标轴在 grid 区域中的分隔区域，默认不显示。
					show: true,
					areaStyle: {
						// 分隔区域的样式设置。
						color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
					}
				}
			},
			series: [{
				type: 'radar',
				z: 1,
				data: [{ 
					value: values,
				}],
				name: '告警数量',
				symbol: 'circle',
				symbolSize: 5,
				areaStyle: {
					normal: {
						color: 'rgba(245, 166, 35, 0.2)',
					},
				},
				itemStyle: {
					color: 'rgba(245, 166, 35, 1)',
					borderColor: 'rgba(245, 166, 35, 0.3)',
					borderWidth: 10,
				},
				lineStyle: {
					normal: {
						type: 'dashed',
	
						color: 'rgba(245, 166, 35, 1)',
						width: 1,
					},
				},
			}],
		};
		for (let key in option_) {
			option[key] = option_[key];
		}
	},
	initPictorialBar:function(option,category,values){
		let option_ = {
			backgroundColor: '#000000',
			grid: this.createChartGaid('40vh', '10vh', "20vh", "30vh"),
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
			},
			xAxis: {
				axisLine: {
					show: true,
					lineStyle: {
						color: this.getChartXColor()
					}
				},
				axisLabel: {
					color: this.getChartXTextColor()
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},
				data: category,
				type: 'category',
			},
			yAxis: {
				axisLabel: {
					color: this.getChartYTextColor(),
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: this.getChartXColor()
					}
				},
				splitLine: {
					lineStyle: {
						color: this.getChartYColor(),
						type: 'dashed'
					},
				},
				name: '',
			},
			series: [{
				type: 'pictorialBar',
				itemStyle: {
					normal: {
						color: '#FF5252',
					},
				},
				symbolRepeat: 'fixed',
				symbolMargin: 4,
				symbol: 'roundRect',
				symbolClip: true,
				symbolSize: [20, 8],
				symbolPosition: 'start',
				symbolOffset: [0, -1],
				barBorderRadius: 20,
				data: values,
				z: 0,
				zlevel: 8,
				label: {
					show: true,
					position: 'top',
					textStyle: {
						fontSize: "1.2rem",
						color: '#fff'
					}
				}
			}]
		};
		for (let key in option_) {
			option[key] = option_[key];
		}
	}
}
