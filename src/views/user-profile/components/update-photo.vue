<template>
  <div class="update-photo">
    <img :src="img" class="img" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {
      cropper: null
    }
  },
  methods: {
    onConfirm() {
      // 基于服务端的裁切使用 getDate() 方法获取裁切参数
      // console.log(this.cropper.getData())
      // 官网的getCroppedCanvas()方法

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        // 这个blob就是上面fil-input框获取的图片信息
        // console.log(blob)
        this.$toast.loading({
          message: '保存中...',
          forbidClick: true, // 禁止背景点击
          duration: 0 // 持续展示
        })
        try {
          // 错误的用法
          // 如果接口要求Content-Type 是 application/json
          // 则传递普通的Javascript 对象
          // UpdateUserPhoto({
          //   photo: blob
          // })
          // 如果接口要求Content-Type 是multipart/form-data
          // 则我们必须传递 FormData 对象
          // 官网的固定写法
          const formData = new FormData()
          formData.append('photo', blob) // 这里的photo是后端数据里的名字
          const { data } = await updateUserPhoto(formData)
          console.log(data)
          // 关闭弹出层
          this.$emit('close')
          // 更新视图
          this.$emit('update-photo', data.data.photo)
          // 成功提示
          this.$toast.success('更换头像成功')
        } catch (err) {
          this.$toast.fail('更换头像失败')
        }
      })
    }
  },
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move', // 这个模式，画布也可以拖动
      aspectRatio: 1 / 1, // 头像比例
      autoCropArea: 1, // 把裁剪框撑满整个画布的大小，前提是上面的比例也要是1/1
      cropBoxMovable: false, // 让画布移动，而不是裁剪框移动
      cropBoxResizable: false, // 控制裁剪框自行缩放，这里不让他自行缩放
      background: false, // 把背景关掉，显示纯黑的背景色
      movable: true // 设置画布是否可以移动，默认就是true
      // crop(event) {
      //   console.log(event.detail.x)
      //   console.log(event.detail.y)
      // }
    })
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block; // 引入cropperjs规定的代码
  max-width: 100%;
}
</style>
