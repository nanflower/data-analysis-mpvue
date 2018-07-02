import request from './request'
import api from './api'
import utils from './index'

const common = {
  install(Vue) {
    Vue.mixin({
      created: function () {
        this.$request = request
        this.$api = api
        this.$utils = utils
      }
    })
  }
}

export default common
