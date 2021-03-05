<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      error-text="加载失败，请点击重试"
      :error.sync="error"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1,
      per_page: 20
    }
  },
  methods: {
    async onLoad() {
      try {
        // 1.异步请求数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.per_page, // 每页显示数据多少
          q: this.searchText // 查询关键字
        })
        // console.log(data)

        // 模拟随机获取数据失败的状态
        // if (Math.random() > 0.5) {
        //   JSON.parse('sfsdgdsf')
        // }
        // 2.将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)

        // 3.加载状态结束
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          // 如果还有数据，则更新获取下一个数据的页码
          this.page++
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (error) {
        // 展示加载失败的提示状态
        this.error = true
        // 加载失败了 loading 也要关闭
        this.loading = false
        // this.$toast('数据获取失败，请稍后重试')
      }
    }
  }
}
</script>

<style></style>
