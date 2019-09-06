<template>
  <monitor-detail :is-edit="false"/>
</template>

<script>
  import MonitorDetail from './components/MonitorDetail'

  export default {
    name: 'CreateForm',
    components: { MonitorDetail }
  }
</script>