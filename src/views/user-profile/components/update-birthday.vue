<template>
  <div class="update-birthday">
    <!--   currentDate 双向绑定了日期选择器
     设置日期选择器的默认值
     同步日期选择器选择的日期
     min-date:可选的最小日期
     min-date:可选的最大日期
     -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1), // 可选的最小日期
      maxDate: new Date(), // 可选的最大日期
      currentDate: new Date(this.value) // 因为传过来的是字符串，但是我们组件接收对象格式，new Date()就可以直接转成对象格式
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
        // 利用dayjs把数据从对象转换成字符串给后端，后端需要的数据是字符串型的
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserProfile({
          birthday: currentDate
        })
        // console.log(data)
        // 更新视图
        this.$emit('input', currentDate)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新昵称失败')
      }
    }
  }
}
</script>

<style></style>
