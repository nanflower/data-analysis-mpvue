let prefix = ''

if (process.env.NODE_ENV === 'production') {
  prefix = 'https://0000.com/'
} else { // development
  prefix = 'http://0000.com/'
}

export default {
  queryWeather: prefix + 'eshopwap/mainPage/getIntegralInfo.do',
  query: prefix + ''
}
