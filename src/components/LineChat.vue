<template>
  <div :id="id" class="line_chart">折线图</div>
</template>

<script>
import echarts from '@/assets/js/echarts.min.js'
export default {
  name: 'Home',
  components: {},
  props: {
    id: {
      type: String,
      default: 'lineChart'
    },
    title: {
      type: String,
      default: 'XXX折线图'
    },
    vm: {
      type: Object,
      default: function() {
        return {
          xAxis: 'xAxis',
          names: 'names',
          values: 'values'
        }
      }
    }
  },
  data() {
    return {
      option: {
        title: {
          text: '7日个类商品销售额',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          bottom: '5%',
          left: 'center'
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '14%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: []
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [
          // {
          // 	name: 'Forest',
          // 	type: 'bar',
          // 	barGap: 0,
          // 	emphasis: {
          // 		focus: 'series'
          // 	},
          // 	data: [320, 332, 301, 334, 390]
          // },
        ]
      }
    }
  },
  computed: {
    series() {
      var vm = this.vm
      var list = this.vm.names
      var values = vm.values
      var series = []
      for (let i = 0; i < list.length; i++) {
        const data = []
        for (let j = 0; j < values.length; j++) {
          data.push(values[j][i])
        }
        const dict_type = {
          name: list[i],
          type: 'line',
          // eslint-disable-next-line no-mixed-spaces-and-tabs
						 	data: data
        }
        series.push(dict_type)
      }

      return series
    }
  },
  watch: {
    list() {
      this.init_chart()
    }
  },
  created() {

  },
  mounted() {
    const that = this
    setTimeout(function() {
      that.init_chart()
    }, 600)
  },
  methods: {
    init_chart() {
      var option = this.option

      var title = this.title
      if (title) {
        option.title.text = title
      }

      var series = this.series
      option.series = series

      var xAxis = option.xAxis[0]
      xAxis.data = this.vm.xAxis

      const myChart = echarts.init(document.getElementById(this.id))
      myChart.setOption(option)
    }
  }
}
</script>
