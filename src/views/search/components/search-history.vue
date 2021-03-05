<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <!-- 子组件是不能删除父组件传过来的数据的，还是得通知父组件来删除 -->
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp; &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistory"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data() {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  // prop数据
  //     prop数据是受父组件影响的
  //    如果是普通数据（数字，字符串，布尔值）绝对不能修改，即便改了也不会传导给父组件
  // 如果是引用类数据（数组，对象）
  //    可以修改，例如[].push/[].splice
  //    不能重新赋值，例如xxx=[]
  props: {
    searchHistory: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录
        this.searchHistory.splice(index, 1)
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style></style>
