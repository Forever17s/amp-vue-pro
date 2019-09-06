<template>
  <monitor-detail :is-edit="true"/>
</template>

<script>
  import MonitorDetail from './components/MonitorDetail'

  export default {
    name: 'UpdateForm',
    components: { MonitorDetail }
  }
</script>