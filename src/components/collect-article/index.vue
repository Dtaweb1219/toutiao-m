<template>
  <van-icon
    :class="{ collected: isCollected }"
    :name="isCollected ? 'star' : 'star-o'"
    @click="onCollect"
    :loading="loading"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  model: {
    prop: 'isCollected',
    event: 'update-is_collected'
  },
  props: {
    isCollected: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onCollect() {
      // 开始请求
      this.loading = true
      try {
        // 是否收藏
        if (this.isCollected) {
          // 父组件 传递articleId
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('update-is_collected', !this.isCollected) // 原来的值如果是true的话，传给父组件就是让他变成false,反之也是这样
        this.$toast.success(this.isCollected ? '取消收藏' : '收藏成功')
      } catch (err) {
        this.$toast('操作失败，请重试')
      }
      // 请求结束
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  color: #ffa500 !important;
}
</style>
