<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(item, index) in suggestions"
      :key="index"
      :title="item"
      icon="search"
    ></van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search.js'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] // 联想建议存到这
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当 searchText发生改变的时候就会调用handler函数，这个函数名字是固定的
      handler(val) {
        this.loadSearchSuggestion(val)
      },
      immediate: true // 该回调将会再侦听开始之后就被立即调用
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestion(q)
        this.suggestions = data.data.options
      } catch {
        this.$toast('获取失败')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
