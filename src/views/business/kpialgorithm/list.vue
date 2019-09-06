<template>
  <div style="padding:10px 0;">
    <py-row :gutter="20">
      <py-col :span="22" :offset="1">
        <py-card>
          <py-button
            v-permission="permission_operate"
            type="primary"
            @click="createItem"
            style="position: relative;z-index: 999;float: left"
            >创建配置</py-button
          >
          <py-table
            :data="datas"
            v-loading="loading"
            table-search
            table-pagination
            stripe
            @sort-change="sortChange"
            empty-text="暂无数据"
            :default-sort="{ prop: 'id', order: 'descending' }"
            style="width: 100%;"
          >
            <py-table-column prop="id" label width="1" sortable="custom">
              <template slot-scope="scope"></template>
            </py-table-column>
            <py-table-column
              prop="name"
              label="名称"
              sortable="custom"
              :show-overflow-tooltip="true"
              min-width="100"
            ></py-table-column>
            <py-table-column
              prop="active"
              label="状态"
              sortable="custom"
              min-width="100"
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
            <py-table-column label="操作" width="200">
              <template slot-scope="scope">
                <py-row type="flex" justify="space-around">
                  <py-col :span="10">
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
                        @click="updateItem(scope.row);"
                      >
                        <i class="py-icon-edit"></i>
                      </py-button>
                    </py-tooltip>
                  </py-col>
                  <py-col :span="10" v-permission="permission_operate">
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
                          @click="deleteItem(scope.row);"
                          >确定</py-button
                        >
                      </div>
                    </py-popover>
                    <py-tooltip
                      class="item"
                      effect="dark"
                      content="删除配置"
                      placement="top-start"
                    >
                      <py-button
                        type="danger"
                        size="small"
                        class="btn-op"
                        v-popover:popover
                        :disabled="scope.row.delLoading || scope.row.active"
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
        </py-card>
      </py-col>
    </py-row>
  </div>
</template>

<script>
import {
  pdbAlgoRuleGetRuleList,
  pdbAlgoRuleDeactiveRule,
  pdbAlgoRuleActiveRule,
  pdbAlgoRuleDeleteRule
} from "api";
import util from "../../../common/js/util";
export default {
  data() {
    return {
      datas: [],
      loading: true,
      permission_operate: "business:nissan:multi_KPI_algorithm:operat"
    };
  },
  methods: {
    // 初始化监控条目
    getDataList() {
      pdbAlgoRuleGetRuleList()
        .then(res => {
          this.loading = false;
          this.datas = res;
          const column = { prop: "id", order: "descending" };
          this.sortChange(column);
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    // 创建配置按钮
    createItem() {
      this.$router.push("/business/kpialgorithm/operat/0");
    },
    // 改变状态开关
    changeStatus(row) {
      // switch运行机制存在执行问题，暂且取反判断状态，通过setter进行改变
      const state = !row.active;
      const para = { ruleId: row.id };
      if (state) {
        // 暂停配置
        pdbAlgoRuleDeactiveRule(para)
          .then(res => {
            this.$notify({
              title: "成功",
              message: "状态更新成功",
              type: "success"
            });
            this.$set(row, "active", false);
          })
          .catch(error => {
            this.$notify.error({
              title: "状态更新错误",
              message: error.message
            });
            this.$set(row, "active", true);
          });
      } else {
        // 恢复配置
        pdbAlgoRuleActiveRule(para)
          .then(res => {
            this.$notify({
              title: "成功",
              message: "状态更新成功",
              type: "success"
            });
            this.$set(row, "active", true);
          })
          .catch(error => {
            this.$notify.error({
              title: "状态更新错误",
              message: error.message
            });
            this.$set(row, "active", false);
          });
      }
    },
    // 更新配置按钮
    updateItem(row) {
      this.$router.push("/business/kpialgorithm/operat/" + row.id);
    },
    // 删除某项配置
    deleteItem(row) {
      const para = { ruleId: row.id };
      this.$set(row, "delLoading", true);
      this.$set(row, "delTipShow", false);
      pdbAlgoRuleDeleteRule(para)
        .then(res => {
          this.$set(row, "delLoading", false);
          this.getDataList();
          this.$notify({
            title: "成功",
            message: "删除配置完成",
            type: "success"
          });
        })
        .catch(error => {
          this.$set(row, "delLoading", false);
          this.$notify.error({
            title: "删除错误",
            message: error.message
          });
        });
    },
    // 表格排序
    sortChange(column) {
      this.datas.sort(this.getDataSort(column.order, column.prop));
    },
    getDataSort(order, sortBy) {
      const ordAlpah = order === "ascending" ? ">" : "<";
      const sortData = new Function(
        "a",
        "b",
        "return a." + sortBy + ordAlpah + "b." + sortBy + "?1:-1"
      );
      return sortData;
    }
  },
  mounted() {
    this.getDataList();
  }
};
</script>

<style scoped></style>
