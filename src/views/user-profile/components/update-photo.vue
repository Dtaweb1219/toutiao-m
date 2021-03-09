<template>
  <div class="update-photo">
    <img :src="img" class="img" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {
    const image = this.$refs.img
    const cropper = new Cropper(image, {
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
    console.log(cropper)
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
