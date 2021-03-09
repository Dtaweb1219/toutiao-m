<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- 选择头像文件按钮 -->
    <input type="file" hidden ref="file" @change="onFileChange" />

    <!-- 个人信息 -->
    <!-- 让这个标签触发上面那个标签事件 -->
    <van-cell
      class="photo-cell"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    ></van-cell>
    <!-- 编辑昵称 -->
    <van-popup
      style="height:100%;"
      v-model="isUpdateNameShow"
      position="bottom"
    >
      <!-- 更新昵称组件 -->
      <UpdateName
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- 修改性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <!-- 更新性别组件 -->
      <UpdateGender v-model="user.gender" @close="isUpdateGenderShow = false" />
    </van-popup>
    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <!-- 更新性别组件 -->
      <UpdateBirthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>
    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height:100%;"
    >
      <!-- 更新头像组件 -->
      <UpdatePhoto
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data() {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false, // 编辑昵称弹层
      isUpdateGenderShow: false, // 修改性别弹层
      isUpdateBirthdayShow: false, // 修改生日弹层
      isUpdatePhotoShow: false, // 修改头像弹层
      img: null // 预览的图片
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取blob数据
      const data = window.URL.createObjectURL(file)
      // console.log(data)
      this.img = data
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件不会触发change事件
      // 解决办法就是每次使用完毕，把它的value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
