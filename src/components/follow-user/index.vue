<template>
  <van-button
    class="follow-btn"
    round
    size="small"
    v-if="isFollowed"
    @click="onFollow"
    :loading="loading"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    :loading="loading"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'followUser',
  model: {
    prop: 'isFollowed', // 把model默认的value属性这个名字改成名为isFollowed
    event: 'update-is_followed' // 把model的默认input事件名改成update-is_followed
  },
  props: {
    isFollowed: { type: Boolean, required: true },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false // 控制loading状态
    }
  },
  components: {},
  methods: {
    async onFollow() {
      this.loading = true
      try {
        if (this.isFollowed) {
          // console.log(111)
          // 已关注，取消关注
          const { data } = await deleteFollow(this.userId)
          console.log(data)
          // this.article.is_followed = false
        } else {
          // 没有关注，添加关注
          // console.log(222)
          const { data } = await addFollow(this.userId)
          console.log(data)
          // this.article.is_followed = true
        }
        // 控制关注和取消关注按钮切换
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (error) {
        let message = '操作失败，请重试！'
        if (error.response && error.response.status === 404) {
          message = '你不能关注你自己！'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style></style>
