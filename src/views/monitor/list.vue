<template>
  <div style="padding:10px 0;">
    <py-button
      v-permission="permission_create"
      type="primary"
      @click="$router.push('/monitor/create');"
      style="position: relative;z-index: 999"
      >创建监控</py-button
    >
    <py-table
      :data="datas"
      v-loading="loading"
      table-search
      table-pagination
      stripe
      @sort-change="sortChange"
      :default-sort="{ prop: 'id', order: 'descending' }"
      style="width: 100%;margin-top: -40px;"
    >
      <py-table-column
        prop="id"
        label="配置ID"
        min-width="60"
        v-if="false"
        sortable="custom"
      >
      </py-table-column>
      <py-table-column prop="id" label="" width="1">
        <template slot-scope="scope"> </template>
      </py-table-column>
      <py-table-column prop="" label="" min-width="5"> </py-table-column>
      <py-table-column
        prop="name"
        label="名称"
        sortable="custom"
        min-width="250"
      >
      </py-table-column>
      <py-table-column
        prop="active"
        label="状态"
        sortable="custom"
        min-width="80"
      >
        <template slot-scope="scope">
          <py-switch
            v-model="scope.row.active"
            active-text="开启"
            inactive-text="关闭"
            @change="changeStatus(scope.row);"
          ></py-switch>
        </template>
      </py-table-column>
      <py-table-column
        prop="groupName"
        label="组别"
        sortable="custom"
        min-width="100"
        key="index"
        v-if="screenWidth > minShowColum"
      >
      </py-table-column>
      <py-table-column
        prop="cronExpression"
        label="时间表达式"
        sortable="custom"
        min-width="120"
        key="index"
        v-if="screenWidth > minShowColum"
      >
      </py-table-column
      >-->
      <!-- <py-table-column -->
      <!-- prop="线索" -->
      <!-- label="leads" -->
      <!-- min-width="100" -->
      <!-- &gt; -->
      <!-- </py-table-column> -->
      <py-table-column
        prop="level"
        label="等级"
        sortable="custom"
        min-width="70"
        key="index"
        v-if="screenWidth > minShowColum"
      >
      </py-table-column>
      <py-table-column
        prop="notice"
        label="提示方式"
        sortable="custom"
        min-width="80"
        key="index"
        v-if="screenWidth > minShowColum"
      >
      </py-table-column>
      <py-table-column
        prop="operationMode"
        label="操作模式"
        sortable="custom"
        min-width="100"
        key="index"
        v-if="screenWidth > minShowColum"
      >
      </py-table-column>
      <py-table-column
        prop="type"
        label="类型"
        sortable="custom"
        min-width="100"
        :show-overflow-tooltip="true"
        key="index"
        v-if="screenWidth > minShowColum"
      >
      </py-table-column>
      <py-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <py-row type="flex" justify="space-around">
            <py-col :span="6" v-permission="permission_update">
              <py-tooltip
                class="item"
                effect="dark"
                content="查看编辑"
                placement="top-end"
              >
                <py-button
                  type="primary"
                  size="small"
                  class="btn-op"
                  @click="updateMon(scope.row);"
                  ><i class="py-icon-edit"></i></py-button
              ></py-tooltip>
            </py-col>
            <py-col :span="6">
              <py-tooltip
                class="item"
                effect="dark"
                content="手动触发"
                placement="top"
              >
                <py-button
                  type="primary"
                  size="small"
                  class="btn-op"
                  @click="triggerManual(scope.row);"
                  :disabled="scope.row.refLoading"
                  ><i
                    :class="
                      scope.row.refLoading
                        ? 'py-icon-loading'
                        : 'py-icon-refresh'
                    "
                  ></i
                ></py-button>
              </py-tooltip>
            </py-col>
            <py-col :span="6">
              <py-tooltip
                class="item"
                effect="dark"
                :content="
                  scope.row.notifications.indexOf(account) != -1
                    ? '取消订阅'
                    : '订阅监控'
                "
                placement="top"
              >
                <py-button
                  :type="
                    scope.row.notifications.indexOf(account) != -1
                      ? 'warning'
                      : 'primary'
                  "
                  size="small"
                  class="btn-op"
                  @click="staronMonitor(scope.row);"
                  ><i
                    :class="
                      scope.row.notifications.indexOf(account) != -1
                        ? 'py-icon-star-on'
                        : 'py-icon-star-off'
                    "
                  ></i
                ></py-button>
              </py-tooltip>
            </py-col>
            <py-col :span="6" v-permission="permission_delete">
              <py-popover
                ref="popover"
                placement="top"
                width="160"
                v-model="scope.row.delTipShow"
              >
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <py-button
                    size="mini"
                    type="text"
                    @click="scope.row.delTipShow = !scope.row.delTipShow;"
                    >取消</py-button
                  >
                  <py-button
                    type="primary"
                    size="mini"
                    @click="deleteOneMon(scope.row);"
                    >确定</py-button
                  >
                </div>
              </py-popover>
              <py-tooltip
                class="item"
                effect="dark"
                content="删除监控"
                placement="top-start"
              >
                <py-button
                  type="danger"
                  size="small"
                  class="btn-op"
                  v-popover:popover
                  :disabled="scope.row.delLoading"
                  ><i
                    :class="
                      scope.row.delLoading
                        ? 'py-icon-loading'
                        : 'py-icon-delete'
                    "
                  ></i></py-button
              ></py-tooltip>
            </py-col>
          </py-row>
        </template>
      </py-table-column>
    </py-table>
  </div>
</template>

<script>
  import {
    getMonitorList,
    setDelete,
    setPause,
    setReschedule,
    setResume,
    setUpdate,
    getExecute,
    getOneMonitor,
    subscribeMonitor,
    unsubscribeMonitor
  } from 'api';
  import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        datas: [],
        loading: true,
        minShowColum: 1000, // 最小显示table列的浏览器宽度
        permission_create: 'monitor:create',
        permission_update: 'monitor:update',
        permission_delete: 'monitor:delete',
        account: null
      };
    },
    methods: {
      //初始化监控条目
      getMonitorData() {
        getMonitorList()
          .then(res => {
            this.loading = false;
            this.datas = res;
            const column = { order: 'descending', prop: 'id' };
            this.sortChange(column);
          })
          .catch(error => {
            this.$notify.error({
              title: '错误',
              message: error.message,
              duration: 0
            });
          });
      },
      //元素为空优化脚本
      isNull(str) {
        if (str === '') return true;
        let regu = '^[ ]+$';
        let re = new RegExp(regu);
        return re.test(str);
      },
      //改变状态开关
      changeStatus(row) {
        //switch运行机制存在执行问题，暂且取反判断状态，通过setter进行改变
        let state = !row.active;
        let para = { id: row.id };
        //暂停监控
        if (state) {
          setPause(para)
            .then(res => {
              this.$notify({
                title: '成功',
                message: '状态更新成功',
                type: 'success'
              });
              this.$set(row, 'active', false);
            })
            .catch(error => {
              this.$notify.error({
                title: '状态更新错误',
                message: error.message
              });
              this.$set(row, 'active', true);
            });
        }
        //恢复监控
        else {
          setResume(para)
            .then(res => {
              this.$notify({
                title: '成功',
                message: '状态更新成功',
                type: 'success'
              });
              this.$set(row, 'active', true);
            })
            .catch(error => {
              this.$notify.error({
                title: '状态更新错误',
                message: error.message
              });
              this.$set(row, 'active', false);
            });
        }
      },
      //手动触发监控
      triggerManual(row) {
        let para = { id: row.id };
        this.$set(row, 'refLoading', true);
        getExecute(para)
          .then(res => {
            this.$set(row, 'refLoading', false);
            this.$notify({
              title: '成功',
              message: '手动触发成功',
              type: 'success'
            });
          })
          .catch(error => {
            this.$set(row, 'refLoading', false);
            this.$notify({
              title: 'ERROR',
              message: error.message,
              type: 'error'
            });
          });
      },
      //删除某项监控
      //订阅获取消监控
      staronMonitor(row) {
        console.log(row.notifications);
        let para = { id: row.id };
        if (row.notifications.indexOf(this.account) === -1) {
          subscribeMonitor(para)
            .then(res => {
              getOneMonitor(para).then(res =>
                this.$set(row, 'notifications', res.notifications)
              );
              this.$notify({
                title: '成功',
                message: '订阅监控成功',
                type: 'success'
              });
            })
            .catch(error => {
              this.$notify({
                title: 'ERROR',
                message: '订阅监控失败',
                type: 'error'
              });
            });
        } else {
          unsubscribeMonitor(para)
            .then(res => {
              getOneMonitor(para).then(res =>
                this.$set(row, 'notifications', res.notifications)
              );
              this.$notify({
                title: '成功',
                message: '取消订阅成功',
                type: 'success'
              });
            })
            .catch(error => {
              this.$notify({
                title: 'ERROR',
                message: '取消订阅失败',
                type: 'error'
              });
            });
        }
      },
      deleteOneMon(row) {
        let para = { id: row.id };
        this.$set(row, 'delLoading', true);
        this.$set(row, 'delTipShow', false);
        setDelete(para)
          .then(res => {
            this.$set(row, 'delLoading', false);
            this.getMonitorData();
          })
          .catch(error => {
            this.$set(row, 'delLoading', false);
            this.getMonitorData();
            this.$notify.error({
              title: '删除错误',
              message: error.message
            });
          });
      },
      //更新监控
      updateMon(row) {
        this.$router.push('/monitor/update/' + row.id);
      },
      //表格排序
      sortChange(column) {
        this.datas.sort(this.getDataSort(column.order, column.prop));
      },
      getDataSort(order, sortBy) {
        const ordAlpah = order === 'ascending' ? '>' : '<';
        const sortData = new Function(
          'a',
          'b',
          'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1'
        );
        return sortData;
      }
    },
    computed: {
      ...mapGetters({
        screenWidth: 'getScreenWidth'
      })
    },
    mounted() {
      this.account = JSON.parse(sessionStorage.getItem('userInfo')).account;
      this.getMonitorData();
    }
  };
</script>

<style scoped></style>
