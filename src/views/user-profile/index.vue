<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>

    <!-- 个人信息 -->
    <van-cell title="头像" is-link>
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
    <van-cell title="生日" :value="user.birthday" is-link></van-cell>
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
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
export default {
  name: 'UserProfile',
  components: { UpdateName, UpdateGender },
  data() {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false, // 编辑昵称弹层
      isUpdateGenderShow: false // 修改性别弹层
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
