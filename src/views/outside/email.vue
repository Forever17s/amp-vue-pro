<template>
  <p v-html="result"></p>
</template>

<script>
import { alarmConfirmEmail } from "api";
export default {
  data() {
    return {
      result: null
    };
  },
  methods: {},
  mounted() {
    const param = {
      id: this.$route.query.id,
      monitorId: this.$route.query.monitorId,
      openId: this.$route.query.openId || '',
    };
    alarmConfirmEmail(param)
      .then(res => {
        this.result = res;
      })
      .catch(err => {
        this.result = err;
      });
  }
};
</script>

<style scoped></style>
