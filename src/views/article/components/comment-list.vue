<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :immediate-check="false"
    @load="onLoad"
    :error.sync="error"
    error-text="加载失败，请点击重试"
  >
    <!-- 这里的$event是子组件传过来的数据，然后再传给上一级父组件 -->
    <CommentItem
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => [] // 默认值，如果父组件需要这个数据，就传过去，如果不需要，子组件就自己使用
    },
    type: {
      type: String,
      // 自定义prop数据验证
      validator(value) {
        return ['a', 'c'].includes(value) // ?防止子组件（comment-reply）传过来的type写错，所以验证必须是a或c，否则报错
      },
      default: 'a' // ?默认的type参数是a(文章的评论)
    }
  },
  components: { CommentItem },
  data() {
    return {
      // list: [],  // 传给父组件
      loading: false,
      finished: false,
      error: false,
      offset: null, // 获取下一页数据的标记
      limit: 10
    }
  },
  created() {
    // 手动初始onload的话，它不会自动初始loading
    // 所以我们要手动的开启初始loading
    this.loading = true
    this.onLoad() // 让数据一获取到就立马渲染出来，进入页面就能看到所有
  },
  methods: {
    async onLoad() {
      try {
        //  *获取文章的评论和获取评论的回复是同一个接口
        //  *唯一的区别是接口参数是不一样的
        //  *type
        //    *a 文章的评论
        //    *c 评论的回复

        //  *source
        //    *文章的评论，则传递文章的ID
        //    *评论的回复，则传递评论的ID

        // !1.请求获取数据
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
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
