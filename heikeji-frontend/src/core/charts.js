/**
 * VCharts图表组件注册模块
 * 负责按需注册VCharts图表组件
 */

// 按需导入VCharts组件 (临时注释掉liquidfill以解决构建问题)
import VeLine from 'v-charts/lib/line'
import VeBar from 'v-charts/lib/bar'
import VePie from 'v-charts/lib/pie'
import VeRadar from 'v-charts/lib/radar'
import VeMap from 'v-charts/lib/map'
import VeScatter from 'v-charts/lib/scatter'
import VeHeatmap from 'v-charts/lib/heatmap'
import VeTree from 'v-charts/lib/tree'
// import VeLiquidfill from 'v-charts/lib/liquidfill' // 临时注释掉，与echarts 5.x不兼容
import VeRing from 'v-charts/lib/ring'
import VeFunnel from 'v-charts/lib/funnel'
import VeGauge from 'v-charts/lib/gauge'
import VeSankey from 'v-charts/lib/sankey'

// VCharts图表组件定义
const chartComponents = {
  've-line': VeLine,
  've-bar': VeBar,
  've-pie': VePie,
  've-radar': VeRadar,
  've-map': VeMap,
  've-scatter': VeScatter,
  've-heatmap': VeHeatmap,
  've-tree': VeTree,
  // 've-liquidfill': VeLiquidfill, // 临时注释掉，与echarts 5.x不兼容
  've-ring': VeRing,
  've-funnel': VeFunnel,
  've-gauge': VeGauge,
  've-sankey': VeSankey,
}

/**
 * 注册图表组件的辅助函数
 * @param {Object} components - 组件对象，键为组件名，值为组件定义
 * @param {Vue} Vue - Vue实例
 */
function registerChartComponents(components, Vue) {
  Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component)
  })
}

/**
 * 注册所有VCharts组件
 * @param {Vue} Vue - Vue实例
 */
export function registerAllCharts(Vue) {
  registerChartComponents(chartComponents, Vue)

  return {
    success: true,
    message: 'VCharts图表组件注册成功',
  }
}

// 导出图表组件配置（用于按需导入）
export { chartComponents }

// 默认导出注册函数
export default registerAllCharts
