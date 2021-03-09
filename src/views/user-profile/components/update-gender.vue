<template>
  <div class="update-gender">
    <van-picker
      title="标题"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onPickerChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  props: {
    value: {}
  },
  data() {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localGender = this.localGender
        await updateUserProfile({
          gender: localGender
        })
        // console.log(data)
        // 更新视图
        this.$emit('input', localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新昵称失败')
      }
    },
    // 监听数据变化的函数，一旦发生变化，就把索引传给那个数据让其显示
    // vant组件的picker内置的一个方法，picker代表调用的这个函数本身，value是选中的那个值，index就是那个值得索引
    onPickerChange(picker, value, index) {
      // console.log(picker, value, index)
      // 利用组件给的索引显示男和女，刚好接口给的男是0，女是1，和索引一致
      this.localGender = index
    }
  }
}
</script>

<style></style>
