<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <article-list :channel="channel"></article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn">
        <i
          class="iconfont toutiao-gengduo"
          @click="isEditChannelShow = true"
        ></i>
      </div>
    </van-tabs>
    <!-- 频道编辑 -->
    <van-popup
      class="edit-channel-popup"
      v-model="isEditChannelShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <!-- 传递channels 传递active高亮索引 定义update-active事件-->
      <channel-edit
        @update-active="onUpdateActive"
        :active="active"
        :myChannels="channels"
      />
    </van-popup>
    <!-- /频道编辑 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 1,
      // 4. 定义数据接收频道列表
      channels: [],
      isEditChannelShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    // 3. 调用获取频道列表
    this.loadChannels()
  },
  mounted() {},
  methods: {
    async loadChannels() {
      try {
        // 已登录，请求获取用户频道列表
        let channels = [] // 先定义一个空的频道列表
        if (this.user) {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表
          const localChannel = getItem('TOUTIAO_CHANNELS')
          // 有，拿来使用
          if (localChannel) {
            channels = localChannel
          } else {
            // 没有，请求获取默认的频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        // 把存到本地的频道列表赋值给创建的那个空列表
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive(index, isChannelEditShow = true) {
      // console.log(index)
      // 把父组件的active和chennel-edit里面的index绑定，更新激活的频道项
      this.active = index
      // 关闭弹层
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style scoped lang="less">
// 当前组件中加了 scoped 对内部样式的修改需要加 /deep/，或者去掉 scoped
.home-container {
  // #3
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .artcile-list {
      height: 79vh;
      overflow: auto;
    }
    // #2
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      height: 82px;
    }
    // Tab 标签页
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    // 汉堡
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.iconfont {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
