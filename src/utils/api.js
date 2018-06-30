let env = 'sit'
let prefix = ''

if (env === 'sit') {
  prefix = 'http://jisutqybmf.market.alicloudapi.com/'
} else {
  prefix = 'https://jisutqybmf.market.alicloudapi.com/'
}

export default {
  queryWeather: prefix + 'weather/query'
}
