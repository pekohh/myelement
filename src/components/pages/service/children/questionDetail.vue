<template>
  <div class="detail_page">
    <header-top :head-title="questions.title" :goBack="goBack"></header-top>
    <section id="scroll_section" class="scroll_container">
      <section v-html="this.questions.detail" class="markdown"></section>
    </section>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import BScroll from 'better-scroll'
import {mapGetters} from 'vuex'
import {getStore} from 'config/Util'

export default {
  data () {
    return {
      goBack: true,
      headTitle: '',
      questions: null
    }
  },
  components: {
    headerTop
  },
  computed: {
    ...mapGetters([
      'question'
    ])
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.questions = JSON.parse(getStore('question'))
      this.$nextTick(() => {
        /* eslint-disable no-new */
        this.bsScroll = new BScroll('#scroll_section', {
        /* eslint-disable no-new */
          deceleration: 0.001,
          bounce: true,
          swipeTime: 1800,
          click: true
        })
      })
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.detail_page
  position: fixed
  top:0
  left:0
  right:0
  bottom:0
  background-color:#fff
  z-index: 202
  padding-top:100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .scroll_container
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 1.95rem
    overflow-y: auto
    .markdown
      font-size:30px
      padding:0 20px
      color:#666
      padding-bottom:30px
      text-indent: 40px
</style>
