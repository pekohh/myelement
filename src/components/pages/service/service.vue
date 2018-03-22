<template>
  <div class="service">
    <header-top head-title="服务中心" :goBack="goBack"></header-top>
    <section class="service_connect">
      <a href="https://ecs-im.ele.me/" class="service_left">
        <svg>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#human"></use>
        </svg>
        <span>在线客服</span>
      </a>
      <a href="tel:10105757" class="service_right">
        <svg>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#phone"></use>
        </svg>
        <span>在线客服</span>
      </a>
    </section>
    <section class="hot_questions" v-if="serviceData">
      <h4 class="question_header">热门问题</h4>
      <ul>
        <li v-for="(item, index) in questionTitle" :key="index" class="question_title" @click="toQuestionDetail(item, index)">
          <span>{{item}}</span>
          <svg class="arrow-svg" fill="#999">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
          </svg>
        </li>
      </ul>
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import {mapMutations} from 'vuex'
import {getService} from 'service/getData'
export default {
  data () {
    return {
      goBack: true,
      questionTitle: [], // 问题标题
      serviceData: null, // 服务信息
      questionDetail: [] // 问题详情
    }
  },
  components: {
    headerTop
  },
  mounted () {
    this.initData()
  },
  methods: {
    ...mapMutations([
      'SAVE_QUESTION'
    ]),
    // 获取信息
    async initData () {
      this.serviceData = await getService()
      Object.keys(this.serviceData).forEach(item => {
        let avoidRepeat = false
        this.questionTitle.forEach((insertItem) => {
          // 防止重复的数据，后台返回的数据有些是重复的
          if (insertItem === this.serviceData[item]) {
            avoidRepeat = true
          }
        })
        // 将标题和内容分别放进数组中
        if (item.indexOf('Caption') !== -1 && !avoidRepeat) {
          this.questionTitle.push(this.serviceData[item])
        } else if (!avoidRepeat) {
          this.questionDetail.push(this.serviceData[item])
        }
      })
    },
    // 保存问题详情
    toQuestionDetail (title, index) {
      this.SAVE_QUESTION({
        title,
        detail: this.questionDetail[index]
      })
      this.$router.push('/service/questionDetail')
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.service
  background-color:#fff
  padding-top: 100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .service_connect
    fj()
    a
      flex: 1
      display: flex
      flex-direction: column
      align-items:center
      justify-content: center
      height: 200px
      border-bottom:1px solid #f5f5f5
      svg
        wh(50px, 50px)
      span
        margin-top:20px
        sc(30px, #666)
  .hot_questions
    .question_header
      sc(30px, #333)
      line-height: 150px
      border-bottom:1px solid #f5f5f5
      padding-left: 20px
    .question_title
      padding:0 20px
      line-height: 100px
      border-bottom:1px solid #f5f5f5
      fj()
      align-items: center
      span
        sc(26px, #666)
      svg
        wh(30px, 30px)

  .router-slid-enter-active, .router-slid-leave-active
    transition: all .4s
  .router-slid-enter, .router-slid-leave-active
    transform: translate3d(20px, 0, 0)
    opacity: 0
</style>
