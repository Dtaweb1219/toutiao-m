<template>
  <van-icon
    :class="{ collected: value }"
    :color="value ? '#ffa500' : ''"
    :name="value ? 'star' : 'star-o'"
  />
</template>

<script>
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  color: #ffa500 !important;
}
</style>
