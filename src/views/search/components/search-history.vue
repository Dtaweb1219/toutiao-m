<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span>全部删除</span>
        &nbsp; &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell :title="item" v-for="(item, index) in searchHistory" :key="index">
      <van-icon v-show="isDeleteShow" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistory: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false // 控制删除显示元素
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style></style>
