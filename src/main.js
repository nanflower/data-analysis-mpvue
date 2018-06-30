import Vue from 'vue'
import App from './App'
// import utils from './utils/index'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/index/main', 'pages/bar/main', 'pages/weather/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '数据分析',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#919191',
      selectedColor: '#e64340',
      background: '#ffffff',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/index/main',
          text: '首页',
          iconPath: '/static/assets/img/icon-1.png',
          selectedIconPath: 'static/assets/img/icon-1-1.png'
        },
        {
          pagePath: 'pages/bar/main',
          text: '更多',
          iconPath: 'static/assets/img/icon-4.png',
          selectedIconPath: 'static/assets/img/icon-4-1.png'
        }
      ]
    }
  }
}
