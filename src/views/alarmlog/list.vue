<template>
  <div style="padding:10px 0;">
    <py-table
      :data="datas"
      v-loading="loading"
      table-search
      table-pagination
      stripe
      @sort-change="sortChange"
      :default-sort="{ order: 'descending', prop: 'lastModified' }"
      style="width: 100%;margin-top: -40px;"
    >
      <py-table-column
        prop="id"
        label="报警ID"
        sortable="custom"
        min-width="50"
        v-if="false"
      ></py-table-column>
      <py-table-column prop="monitorId" label sortable="custom" width="1">
        <template slot-scope="scope"></template>
      </py-table-column>
      <py-table-column label min-width="5"></py-table-column>
      <py-table-column
        prop="monitorName"
        label="监控名称"
        sortable="custom"
        :show-overflow-tooltip="true"
        min-width="240"
      >
        <template slot-scope="scope">
          <py-button type="text" @click="getAlarmContent(scope.row);">
            {{ scope.row.monitorName }}
          </py-button>
        </template>
      </py-table-column>
      <py-table-column
        prop="beginTime"
        label="开始时间"
        sortable="custom"
        :show-overflow-tooltip="true"
        min-width="150"
        key="index"
        v-if="screenWidth > minShowColum"
      ></py-table-column>
      <py-table-column
        prop="endTime"
        label="结束时间"
        sortable="custom"
        :show-overflow-tooltip="true"
        min-width="150"
        v-if="false"
      ></py-table-column>
      <py-table-column
        prop="count"
        label="计数"
        sortable="custom"
        min-width="100"
      ></py-table-column>
      <py-table-column
        prop="status"
        label="状态"
        sortable="custom"
        min-width="160"
      >
        <template slot-scope="scope">
          <span
            class="py-dropdown-link"
            v-if="!scope.row.statusChange ? true : false"
          >
            <py-tag
              :type="scope.row.status == 'resolved' ? 'success' : 'danger'"
              >{{ scope.row.status }}</py-tag
            >
          </span>
          <py-dropdown
            @command="changeStatus($event, scope.row);"
            v-if="scope.row.statusChange ? true : false"
          >
            <span class="py-dropdown-link">
              {{ scope.row.status }}
              <i class="py-icon-arrow-down py-icon--right"></i>
            </span>
            <py-dropdown-menu slot="dropdown">
              <!--
                notice可以修改为confirm和resolved两种状态
                confirm可以修改为resolved
                resolved不可以再修改状态
              -->
              <py-dropdown-item
                v-for="item in statusData"
                :key="item.index"
                :command="item.value"
                :disabled="
                  item.value == scope.row.status ||
                    (item.value == 'notice' && scope.row.status == 'confirm')
                "
                >{{ item.value }}</py-dropdown-item
              >
            </py-dropdown-menu>
          </py-dropdown>
        </template>
      </py-table-column>
      <py-table-column
        prop="creation"
        label="创建时间"
        sortable="custom"
        :show-overflow-tooltip="true"
        min-width="150"
        v-if="false"
      ></py-table-column>
      <py-table-column
        prop="solver"
        label="最后修改人"
        sortable="custom"
        :show-overflow-tooltip="true"
        min-width="200"
        key="index"
        v-if="screenWidth > minShowColum"
      ></py-table-column>
      <py-table-column
        prop="solution"
        label="解决方式"
        :show-overflow-tooltip="true"
        min-width="120"
        v-if="false"
      ></py-table-column>
      <py-table-column
        prop="lastModified"
        label="最近更新时间"
        sortable="custom"
        :show-overflow-tooltip="true"
        min-width="150"
        key="index"
        v-if="screenWidth > minShowColum"
      ></py-table-column>
      <py-table-column
        prop="removed"
        label="是否删除"
        sortable="custom"
        min-width="120"
        v-if="false"
      >
        <template slot-scope="scope">
          <py-row type="flex" justify="space-around">
            <py-tag :type="scope.row.removed ? 'success' : 'danger'">
              {{ scope.row.removed ? '已删除' : '未删除' }}
            </py-tag>
          </py-row>
        </template>
      </py-table-column>
      <py-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <py-row type="flex" justify="space-around">
            <py-col :span="7">
              <py-tooltip
                class="item"
                effect="dark"
                content="修改状态"
                placement="top-end"
              >
                <py-button
                  type="primary"
                  size="mini"
                  class="btn-op"
                  @click="changeState(scope.row);"
                  :disabled="
                    scope.row.changeDisabled || scope.row.status == 'resolved'
                  "
                >
                  <i
                    :class="
                      scope.row.changeLoading
                        ? 'py-icon-loading'
                        : 'py-icon-edit'
                    "
                  ></i>
                </py-button>
              </py-tooltip>
            </py-col>
            <py-col :span="7">
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
                >
                  <i
                    :class="
                      scope.row.refLoading
                        ? 'py-icon-loading'
                        : 'py-icon-refresh'
                    "
                  ></i>
                </py-button>
              </py-tooltip>
            </py-col>
            <py-col :span="7" v-permission="permission_delete">
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
                    @click="delAlarm(scope.row);"
                    >确定</py-button
                  >
                </div>
              </py-popover>
              <py-tooltip
                class="item"
                effect="dark"
                content="删除记录"
                placement="top-start"
              >
                <py-button
                  type="danger"
                  size="mini"
                  class="btn-op"
                  v-popover:popover
                  :disabled="scope.row.delLoading"
                >
                  <i
                    :class="
                      scope.row.delLoading
                        ? 'py-icon-loading'
                        : 'py-icon-delete'
                    "
                  ></i>
                </py-button>
              </py-tooltip>
            </py-col>
          </py-row>
        </template>
      </py-table-column>
    </py-table>
    <py-dialog :visible.sync="dialogContentVisible">
      <py-scrollbar wrap-class="dialog-content-scrollbar">
        <p v-html="content"></p>
      </py-scrollbar>
    </py-dialog>
  </div>
</template>

<script>
  import {
    getAlarmLogList,
    getAlarmContent,
    alarmChangeState,
    getExecute,
    deleteAlarm
  } from 'api';
  import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        datas: [],
        content: null,
        //状态修改下拉列键值对
        statusData: [
          {
            value: 'notice',
            label: 'notice'
          },
          {
            value: 'confirm',
            label: 'confirm'
          },
          {
            value: 'resolved',
            label: 'resolved'
          }
        ],
        loading: true,
        dialogContentVisible: false,
        minShowColum: 1000, // 最小显示table列的浏览器宽度
        permission_delete: 'alarmLog:delete'
      };
    },
    methods: {
      //初始化监控条目
      getAlarmLogData() {
        getAlarmLogList()
          .then(res => {
            this.loading = false;
            this.datas = res;
            const column = { order: 'descending', prop: 'lastModified' };
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
      //更新监控，打开状态选项
      changeState(row) {
        this.$set(row, 'statusChange', true);
        this.$set(row, 'changeDisabled', true);
      },
      //选择新的状态更新
      changeStatus(val, row) {
        this.$set(row, 'changeLoading', true);
        let params = {
          enums: val,
          monitorId: row.monitorId,
          id: row.id
        };
        //执行修改后改变status，再初始化操作
        alarmChangeState(params)
          .then(res => {
            this.$set(row, 'status', val);
            this.$notify({
              title: '成功',
              message: '修改状态成功',
              type: 'success'
            });
            this.$set(row, 'statusChange', false);
            this.$set(row, 'changeLoading', false);
            this.$set(row, 'changeDisabled', false);
            this.getAlarmLogData();
          })
          .catch(error => {
            this.$set(row, 'statusChange', false);
            this.$set(row, 'changeLoading', false);
            this.$set(row, 'changeDisabled', false);
            this.$notify.error({
              title: '错误',
              message: error.message,
              duration: 0
            });
          });
      },
      //手动触发监控
      triggerManual(row) {
        let para = { id: row.monitorId };
        this.$set(row, 'refLoading', true);
        getExecute(para)
          .then(res => {
            this.$set(row, 'refLoading', false);
            this.$notify({
              title: '成功',
              message: '手动触发成功',
              type: 'success'
            });
            this.getAlarmLogData();
          })
          .catch(error => {
            this.$set(row, 'refLoading', false);
            this.$notify.error({
              title: '错误',
              message: error.message,
              duration: 0
            });
          });
      },
      //删除监控
      delAlarm(row) {
        this.$set(row, 'delLoading', true);
        this.$set(row, 'delTipShow', false);
        let params = {
          id: row.id
        };
        deleteAlarm(params)
          .then(res => {
            this.$set(row, 'delLoading', false);
            this.$set(row, 'removed', true);
            this.getAlarmLogData();
          })
          .catch(error => {
            this.$set(row, 'delLoading', false);
            this.$notify.error({
              title: '错误',
              message: error.message,
              duration: 0
            });
          });
      },
      //获取监控具体信息
      getAlarmContent(row) {
        this.content = null;
        this.dialogContentVisible = true;
        const param = { id: row.id };
        getAlarmContent(param)
          .then(res => {
            this.content = res;
          })
          .catch(error => {
            this.$notify.error({
              title: '错误',
              message: error.message,
              duration: 0
            });
          });
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
      // 初始化报警列表
      this.getAlarmLogData();
    }
  };
</script>

<style scoped></style>
