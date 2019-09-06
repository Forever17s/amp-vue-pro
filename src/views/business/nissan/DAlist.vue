<template>
  <div style="padding:10px 0;">
    <py-row :gutter="20">
      <py-col :span="22" :offset="1">
        <py-card>
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
            <py-table-column prop="id" label="" width="1" sortable="custom">
              <template slot-scope="scope"> </template>
            </py-table-column>
            <py-table-column
              prop="brand"
              label="品牌"
              sortable="custom"
              :show-overflow-tooltip="true"
              min-width="100"
            >
            </py-table-column>
            <py-table-column
              prop="exchangeDealId"
              label="媒体dealId"
              sortable="custom"
              :show-overflow-tooltip="true"
              min-width="200"
            >
            </py-table-column>
            <py-table-column
              prop="exchangeAdSlotId"
              label="广告位id"
              sortable="custom"
              :show-overflow-tooltip="true"
              min-width="100"
            >
            </py-table-column>
            <py-table-column
              prop="beginDate"
              label="开始日期"
              sortable="custom"
              :show-overflow-tooltip="true"
              min-width="100"
            >
            </py-table-column>
            <py-table-column
              prop="endDate"
              label="结束日期"
              sortable="custom"
              :show-overflow-tooltip="true"
              min-width="100"
            >
            </py-table-column>
            <py-table-column label="操作" width="100">
              <template slot-scope="scope">
                <py-row type="flex" justify="space-around">
                  <py-col :span="10">
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
                      content="删除该项"
                      placement="top-start"
                    >
                      <py-button
                        type="danger"
                        size="small"
                        class="btn-op"
                        v-popover:popover
                        :disabled="scope.row.delLoading || scope.row.active"
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
        </py-card>
      </py-col>
    </py-row>
  </div>
</template>

<script>
import {
  nissanListDealAndAdmasterRel,
  nissanDeleteDealAndAdmasterRel
} from "api";
export default {
  data() {
    return {
      datas: [],
      loading: true
    };
  },
  methods: {
    // 初始化条目
    getDataList() {
      nissanListDealAndAdmasterRel()
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
    // 删除某项信息
    deleteItem(row) {
      const param = { id: row.id };
      this.$set(row, "delLoading", true);
      this.$set(row, "delTipShow", false);
      nissanDeleteDealAndAdmasterRel(param)
        .then(res => {
          this.$set(row, "delLoading", false);
          this.getDataList();
          this.$notify({
            title: "成功",
            message: "删除该项完成",
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
