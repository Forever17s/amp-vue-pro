import store from 'store'

const { body } = document
const WIDTH = 1024
const RATIO = 3

export default {
  watch: {
    
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeHandler)
  },
  mounted() {
    const isMobile = this.isMobile()
    if (isMobile) store.dispatch('setDevice', 'mobile')
  },
  methods: {
    isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - RATIO < WIDTH
    },
    resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.isMobile()
        store.dispatch('setDevice', isMobile ? 'mobile' : 'desktop')
      }
    }
  }
}
