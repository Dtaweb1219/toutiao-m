<template>
  <div class="channel-edit">
    <!-- 我的频道标题 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- 我的频道内容 -->
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- 通过插槽自定义图标 -->
        <van-icon
          v-show="isEdit && !fixedChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐标题 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <!-- 频道推荐内容 -->
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        icon="plus"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
      >
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [],
      isEdit: false, // 控制编辑状态的显示
      fixedChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    // 获取user
    ...mapState(['user']),
    recommendChannels() {
      // 数组的filter方法，遍历数组，把符合条件元素存储到新的数组，它的内部会自己创建一个新数组
      return this.allChannels.filter(channel => {
        // 数组的find方法：遍历数组，把符合条件的第一个元素返回
        // 这里筛选出不属于我的频道的channel
        // 因为filter也是接收布尔值，这里的 非 就是传给filter一个布尔值，如果是非，就传给filter筛选的数据
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch {
        this.$toast('获取数据失败')
      }
    },
    // 添加频道操作
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      // console.log(channel)
      // 数据持久化处理
      if (this.user) {
        // 已登录，把数据请求接口放到线上
        try {
          await addUserChannel({
            id: channel.id, // 频道Id
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 点击我的频道
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        // 执行删除操作
        // 判断是否为推荐
        if (index === 0) return
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        this.myChannels.splice(index, 1)
        // 删除数据持久化
        this.deleteChannel(channel)
      } else {
        // 执行跳转操作
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('删除频道失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 36px;
        color: #ccc;
      }
    }
  }
  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
