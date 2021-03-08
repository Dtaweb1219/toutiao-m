<template>
  <!-- 评论列表 -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <comment-item v-for="item in list" :comment="item" :key="item.art_id" />
  </van-list>
  <!-- 评论列表 -->
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => [] // 默认值，如果父组件需要这个数据，就传过去，如果不需要，子组件就自己使用
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      error: false,
      offset: null, // 获取下一页数据的标记
      limit: 10
    }
  },
  created() {
    this.onLoad() // 让数据一获取到就立马渲染出来，进入页面就能看到所有
  },
  methods: {
    async onLoad() {
      try {
        // !1.请求获取数据
        const { data } = await getComments({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // 用来测试获取数据失败的
        // if (Math.random() > 0.3) {
        //   JSON.parse('jhfsjhfk')
        // }
        // !2.将数据添加到列表中
        // console.log(data)
        const { results } = data.data
        this.list.push(...results)

        // ?把文章评论的总数量传递到外部组件
        this.$emit('onload-success', data.data)
        // !3.将loading 设置为false
        this.loading = false
        // !4.判断是否还有数据
        if (results.length) {
          //   有就更新下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
