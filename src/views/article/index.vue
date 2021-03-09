<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="黑马头条">
      <van-icon
        slot="left"
        name="arrow-left"
        size="18px"
        @click="$router.back()"
      ></van-icon>
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->
      <!-- 加载完成-文章详情 -->
      <!-- 只要数据中的标题/时间/内容/头像等中的一项加载出来了，就证明数据已经加载完了 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 关注与取消关注按钮组件 -->
          <!-- 模板中的$event 是事件参数 -->
          <!--          当我们传递给子组件的数据既要使用还要修改。
          传递：
          :is-followed="article.is_followed"
          修改：
          @update-is_followed="article.is_followed = $event"
          简写方式：在父组件上使用v-model
          v-model有自己内置的两个属性，一个是value,一个是input
          value是传给子组件要使用的值，Input是子组件传给父组件修改
          value="article.is_followed"
          input="article.is_followed=$event"

          一个组件只能使用一个v-model，
          如果有多个数据需要实现类似于v-model的效果，可以使用属性的 .sync 修饰符 -->

          <!-- <follow-user
            class="follow-btn"
            :is-followed="article.is_followed"
            :user-id="article.aut_id"
            @update-is_followed="article.is_followed = $event"
          /> -->
          <!-- <follow-user
            class="follow-btn"
            :user-id="article.aut_id"
            v-model="article.is_followed"
          /> -->
          <follow-user
            class="follow-btn"
            :user-id="article.aut_id"
            :is-followed.sync="article.is_followed"
          />

          <!-- <van-button
            class="follow-btn"
            round
            size="small"
            v-if="article.is_followed"
            @click="onFollow"
            :loading="loadFollow"
            >已关注</van-button
          >
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
            :loading="loadFollow"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <!-- 用markdown的样式来调整文章的布局 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 文章品论列表区域 -->
        <CommentList
          :source="article.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          :list="commentList"
          @reply-click="onReplyClick"
        ></CommentList>

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="totalCommentCount" color="#777" />
          <!-- 文章收藏按钮 -->
          <CollectArticle
            v-model="article.is_collected"
            class="btn-item"
            :article-id="article.art_id"
          />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <!-- 文章点赞按钮 -->
          <LikeArticle
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <!-- 评论框组件 -->
          <CommentPost :target="article.art_id" @post-success="onPostSuccess" />
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复弹出层 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%;">
      <!-- 回复评论组件 -->
      <CommentReply :comment="currentComment" @close="isReplyShow = false48" />
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
// 这个插件必须单独引用，那个文件需要就在哪个文件引用它
import { ImagePreview } from 'vant'
import followUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'

// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   // 起始位置，从0开始
//   startPosition: 1
// })
export default {
  name: 'ArticleIndex',
  components: {
    followUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  props: {
    // 接收路由传过来的地址参数，这样可以提高性能，解耦路由参数
    articleId: {
      // 从页面中跳转过去的是字符串型，从地址直接输入跳转路径又会是数字型，所以这两种接受类型都要写
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章详情数据
      loading: true, // 加载中
      errStatus: 0, // 失败状态码
      loadFollow: false, // 控制关注按钮切换的Loading显示
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论的显示与隐藏状态
      commentList: [], // 子组件传过来的list列表数据
      isReplyShow: false, // 评论回复弹出层显示与隐藏
      currentComment: {} // 当前点击回复的评论项
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      this.loading = true // 加载失败后重新按加载按钮的时候让loading 显示出来
      try {
        const { data } = await getArticleById(this.articleId)
        // console.log(data)
        // 用来测试数据获取成功之后，因为特殊原因加载失败的样子
        // if (Math.random() > 0.4) {
        //   JSON.parse('hsfjhdj')
        // }
        this.article = data.data
        // this.loading = false // 数据加载完成之后关闭loading加载状态
        // 请求数据成功就可以预览图片了
        // 初始化图片预览
        // console.log(this.$refs['article-content'])
        // 因为刚请求到的数据是拿不到的，数据更新，它也要让视图数据也要更新才能拿到img，所以要获取所有的img要延迟一会
        // 可以设置一个定时器，时间可设为0
        setTimeout(() => {
          // console.log(this.$refs['article-content'])
          this.previewImage() // 图片预览
        }, 0)
        // this.$nextTick(this.previewImage) // 用于等待数据渲染之后获取节点元素（img），必须在loading结束之后调用这个函数
      } catch (error) {
        // console.log('获取数据失败')
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
      }
      this.loading = false // 数据无论成功还是失败，都需要关闭loading加载状态
    },
    previewImage() {
      // 得到所有的img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // console.log(imgs)
      // 获取所有的img地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // console.log(images)
        // 点击图片预览事件
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images: images,
            // 起始位置，从0开始
            startPosition: index
          })
        }
      })
    },
    // 接收子组件（comment-post）传过来的事件
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将最新发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick(comment) {
      // console.log(comment)
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style lang="less" scoped>
// 导入markdown.css文件
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify; // 实现两端对齐文本效果
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    // .btn-item {
    //   border: none;
    //   padding: 0;
    //   height: 40px;
    //   line-height: 40px;
    //   color: #777777;
    // }
  }
}
</style>
