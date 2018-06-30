<template>
  <div class="container">

    <swiper class="img-swiper" autoplay="true" interval="5000" duration="1000" circular="true" indicator-color="#fff" indicator-dots="true" indicator-active-color="#e9403b">
      <block v-for="(item, index) in imgUrls" :key="item">
        <swiper-item>
          <image :src="item" class="slide-image" @click="" data-id="index"></image>
        </swiper-item>
      </block>
    </swiper>

    <ul class="pages-index-items clearfix">
      <li v-for="(item, index) in serviceList" :key="item.url">
      <view @click="serviceChoice(index)" class="pages-index-item">
        <image class="img" :src="item.src" mode="scaleToFill"></image>
        <view class="pages-index-itemtext">{{ item.name }}</view>
      </view>
      </li>
    </ul>
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data () {
    return {
      motto: 'Hello World',
      imgUrls: [
        '/static/assets/img/game.jpeg',
        '/static/assets/img/game.jpeg'
      ],
      serviceList: [{
        name: 'airline-safety',
        src: '/static/assets/img/timg.jpeg',
        url: '/pages/weather/main'
      }, {
        name: '荒野之息',
        src: '/static/assets/img/timg.jpeg',
        url: ''
      }, {
        name: '荒野之息',
        src: '/static/assets/img/timg.jpeg',
        url: ''
      }, {
        name: '荒野之息',
        src: '/static/assets/img/timg.jpeg',
        url: ''
      }, {
        name: '荒野之息',
        src: '/static/assets/img/timg.jpeg',
        url: ''
      }, {
        name: '荒野之息',
        src: '/static/assets/img/timg.jpeg',
        url: ''
      }, {
        name: '荒野之息',
        src: '/static/assets/img/timg.jpeg',
        url: ''
      }, {
        name: '荒野之息',
        src: '/static/assets/img/timg.jpeg',
        url: ''
      }, {
        name: '荒野之息',
        src: '/static/assets/img/timg.jpeg',
        url: ''
      }],
      userInfo: {}
    }
  },

  components: {
    card
  },

  methods: {
    serviceChoice (index) {
      console.log(this.serviceList[index].url)
      if (this.serviceList[index].url) {
        wx.navigateTo({
          url: this.serviceList[index].url
        })
      }
    },
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      console.log('clickHandle:', msg, ev)
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
.img-swiper{
  width: 750rpx;
  height: 240rpx;
  display: block;
}
.slide-image{
  width: 750rpx;
  height: 240rpx;
  display: block;
}
.pages-index-items {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  flex-wrap:wrap;
  background-color: #fff;
}
.pages-index-items li {
  box-sizing: border-box;
  width: 33.3%;
  height: 250rpx;
  float: left;
  background-color: #fff;
  border-right: 1px solid #f0f0f0; 
  border-bottom: 1px solid #f0f0f0;
  padding: 0;
  margin: 0;
}
.pages-index-item {
  text-align: center;
  position: relative;
  width: 100%;
  height: 250rpx;
  padding-top: 2rpx;
}
.pages-index-item .img {
  height: 100rpx;
  width: 100rpx;
  margin-top: 38rpx;
}
.pages-index-itemtext {
  font-size: 26rpx;
  margin-top: 10rpx;
  font-weight: normal;
}
</style>
