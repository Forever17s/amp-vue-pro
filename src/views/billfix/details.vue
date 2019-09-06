<template>
  <py-tabs
    v-model="activeName"
    type="border-card"
    @tab-click="handleClick"
    style="margin-top: 10px;"
  >
    <py-tab-pane label="广告主" name="advertiser">
      <div>
        <py-table
          ref="multipleTable"
          :data="advertiserDatas"
          table-search
          table-pagination
          tooltip-effect="dark"
          style="width: 100%;margin-top: 10px;"
          @selection-change="handleSelectionChange"
          v-loading="loading"
        >
          <py-table-column prop="advertiserId" label="广告主id">
          </py-table-column>
          <py-table-column prop="advertiserName" label="广告主">
          </py-table-column>
          <py-table-column prop="partnerName" label="客户"> </py-table-column>
          <py-table-column prop="oldApiAllocated" label="Old预算(分)">
          </py-table-column>
          <py-table-column prop="newApiAllocatedPlan1" label="New预算(分)">
          </py-table-column>

          <py-table-column label="旧/New差值(分)">
            <template slot-scope="scope">
              <div :style="{ color: scope.row.OAcolor }">
                {{ scope.row.OACompare }}
              </div>
            </template>
          </py-table-column>

          <py-table-column prop="apiMaxAllocatedPlan1" label="Max预算(分)">
          </py-table-column>

          <py-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <py-button
                size="small"
                type="primary"
                @click="recalcu(scope.row.advertiserId, scope.row);"
                :loading="scope.row.calLoading"
                >计算</py-button
              ><br /><br />
              <py-popover
                ref="popover"
                placement="top"
                width="160"
                v-model="scope.row.recTipShow"
              >
                <p>确定修复吗？</p>
                <div style="text-align: right; margin: 0">
                  <py-button
                    size="mini"
                    type="text"
                    @click="scope.row.recTipShow = false;"
                    >取消</py-button
                  >
                  <py-button
                    type="primary"
                    size="mini"
                    @click="recover(scope.row.advertiserId, scope.row);"
                    >确定</py-button
                  >
                </div>
              </py-popover>
              <py-button
                size="small"
                type="danger"
                :loading="scope.row.recLoading"
                v-popover:popover
                >{{ scope.row.schedule || "修复" }}</py-button
              >
            </template>
          </py-table-column>
          <py-table-column
            prop="recoverMsg"
            label="状态"
            :filters="[
              { text: '已修复', value: 'true' },
              { text: '待修复', value: 'false' }
            ]"
            :filter-method="filterValue"
          >
          </py-table-column>
        </py-table>
      </div>
    </py-tab-pane>
    <py-tab-pane label="订单" name="order">
      <div>
        <py-table
          ref="multipleTable"
          :data="orderDatas"
          table-search
          table-pagination
          tooltip-effect="dark"
          style="width: 100%;margin-top: 10px;"
          @selection-change="handleSelectionChange"
          v-loading="loading"
        >
          <py-table-column prop="orderId" label="订单id"> </py-table-column>
          <py-table-column prop="orderName" label="订单"> </py-table-column>
          <py-table-column prop="advertiserName" label="广告主">
          </py-table-column>
          <py-table-column prop="partnerName" label="客户"> </py-table-column>

          <py-table-column prop="oldApiAllocated" label="Old预算(分)">
          </py-table-column>
          <py-table-column prop="newApiAllocatedPlan1" label="New预算(分)">
          </py-table-column>

          <!-- <py-table-column -->
          <!-- prop="newApiAllocatedPlan2" -->
          <!-- label="New预算B" -->
          <!-- &gt; -->
          <!-- </py-table-column> -->
          <py-table-column label="旧/New差值(分)">
            <template slot-scope="scope">
              <div :style="{ color: scope.row.OAcolor }">
                {{ scope.row.OACompare }}
              </div>
            </template>
          </py-table-column>
          <!-- <py-table-column -->
          <!-- label="NewA/NewB差值(分)"> -->
          <!-- <template slot-scope="scope"> -->
          <!-- <div :style="{ color: scope.row.ABcolor }"> -->
          <!-- {{scope.row.ABCompare}} -->
          <!-- </div> -->
          <!-- </template> -->
          <!-- </py-table-column> -->
          <py-table-column prop="apiMaxAllocatedPlan1" label="Max预算(分)">
          </py-table-column>
          <!-- <py-table-column -->
          <!-- prop="apiMaxAllocatedPlan2" -->
          <!-- label="Max预算B" -->
          <!-- &gt; -->
          <!-- </py-table-column> -->

          <py-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <py-button
                size="small"
                type="primary"
                @click="recalcu(scope.row.orderId, scope.row);"
                :loading="scope.row.calLoading"
                >计算</py-button
              ><br /><br />
              <py-popover
                ref="popover"
                placement="top"
                width="160"
                v-model="scope.row.recTipShow"
              >
                <p>确定修复吗？</p>
                <div style="text-align: right; margin: 0">
                  <py-button
                    size="mini"
                    type="text"
                    @click="scope.row.recTipShow = false;"
                    >取消</py-button
                  >
                  <py-button
                    type="primary"
                    size="mini"
                    @click="recover(scope.row.orderId, scope.row);"
                    >确定</py-button
                  >
                </div>
              </py-popover>
              <py-button
                size="small"
                type="danger"
                :loading="scope.row.recLoading"
                v-popover:popover
                >{{ scope.row.schedule || "修复" }}</py-button
              >
            </template>
          </py-table-column>
          <py-table-column
            prop="recoverMsg"
            label="状态"
            :filters="[
              { text: '已修复', value: 'true' },
              { text: '待修复', value: 'false' }
            ]"
            :filter-method="filterValue"
          >
          </py-table-column>
        </py-table>
      </div>
    </py-tab-pane>
    <py-tab-pane label="计划" name="line">
      <div>
        <py-table
          ref="multipleTable"
          :data="lineItemDatas"
          table-search
          table-pagination
          tooltip-effect="dark"
          style="width: 100%;margin-top: 10px;"
          @selection-change="handleSelectionChange"
          v-loading="loading"
        >
          <py-table-column prop="lineItemId" label="计划id"> </py-table-column>
          <py-table-column prop="lineItemName" label="计划"> </py-table-column>
          <py-table-column prop="orderName" label="订单"> </py-table-column>
          <py-table-column prop="advertiserName" label="广告主">
          </py-table-column>
          <py-table-column prop="partnerName" label="客户"> </py-table-column>

          <py-table-column prop="oldApiAllocated" label="Old预算(分)">
          </py-table-column>
          <py-table-column prop="newApiAllocatedPlan1" label="New预算(分)">
          </py-table-column>
          <!-- <py-table-column -->
          <!-- prop="newApiAllocatedPlan2" -->
          <!-- label="New预算(分)" -->
          <!-- &gt; -->
          <!-- </py-table-column> -->
          <py-table-column label="旧/New差值(分)">
            <template slot-scope="scope">
              <div :style="{ color: scope.row.OAcolor }">
                {{ scope.row.OACompare }}
              </div>
            </template>
          </py-table-column>
          <!-- <py-table-column -->
          <!-- label="NewA/NewB差值(分)"> -->
          <!-- <template slot-scope="scope"> -->
          <!-- <div :style="{ color: scope.row.ABcolor }"> -->
          <!-- {{scope.row.ABCompare}} -->
          <!-- </div> -->
          <!-- </template> -->
          <!-- </py-table-column> -->
          <py-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <py-button
                size="small"
                type="primary"
                @click="recalcu(scope.row.lineItemId, scope.row);"
                :loading="scope.row.calLoading"
                >计算</py-button
              ><br /><br />
              <py-popover
                ref="popover"
                placement="top"
                width="160"
                v-model="scope.row.recTipShow"
              >
                <p>确定修复吗？</p>
                <div style="text-align: right; margin: 0">
                  <py-button
                    size="mini"
                    type="text"
                    @click="scope.row.recTipShow = false;"
                    >取消</py-button
                  >
                  <py-button
                    type="primary"
                    size="mini"
                    @click="recover(scope.row.lineItemId, scope.row);"
                    >确定</py-button
                  >
                </div>
              </py-popover>
              <py-button
                size="small"
                type="danger"
                :loading="scope.row.recLoading"
                v-popover:popover
                >{{ scope.row.schedule || "修复" }}</py-button
              >
            </template>
          </py-table-column>
          <py-table-column
            prop="recoverMsg"
            label="状态"
            :filters="[
              { text: '已修复', value: 'true' },
              { text: '待修复', value: 'false' }
            ]"
            :filter-method="filterValue"
          >
          </py-table-column>
        </py-table>
      </div>
    </py-tab-pane>
    <py-tab-pane label="细分运算" name="virtual">
      <div>
        <py-table
          ref="multipleTable"
          :data="virtualLineItemDatas"
          table-search
          table-pagination
          tooltip-effect="dark"
          style="width: 100%;margin-top: 10px;"
          @selection-change="handleSelectionChange"
          v-loading="loading"
        >
          <py-table-column prop="virtualLineItemId" label="细分运算id">
          </py-table-column>
          <py-table-column prop="virtualLineItemName" label="细分运算">
          </py-table-column>
          <py-table-column prop="advertiserName" label="广告主">
          </py-table-column>
          <py-table-column prop="partnerName" label="客户"> </py-table-column>
          <py-table-column prop="orderName" label="订单"> </py-table-column>
          <py-table-column prop="oldApiAllocated" label="Old预算(分)">
          </py-table-column>
          <py-table-column prop="newApiAllocatedPlan1" label="New预算(分)">
          </py-table-column>
          <!-- <py-table-column -->
          <!-- prop="newApiAllocatedPlan2" -->
          <!-- label="New预算B" -->
          <!-- &gt; -->
          <!-- </py-table-column> -->
          <py-table-column label="旧/New差值(分)">
            <template slot-scope="scope">
              <div :style="{ color: scope.row.OAcolor }">
                {{ scope.row.OACompare }}
              </div>
            </template>
          </py-table-column>
          <!-- <py-table-column -->
          <!-- label="NewA/NewB差值(分)"> -->
          <!-- <template slot-scope="scope"> -->
          <!-- <div :style="{ color: scope.row.ABcolor }"> -->
          <!-- {{scope.row.ABCompare}} -->
          <!-- </div> -->
          <!-- </template> -->
          <!-- </py-table-column> -->
          <py-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <py-button
                size="small"
                type="primary"
                @click="recalcu(scope.row.virtualLineItemId, scope.row);"
                :loading="scope.row.calLoading"
                >计算</py-button
              ><br /><br />
              <py-popover
                ref="popover"
                placement="top"
                width="160"
                v-model="scope.row.recTipShow"
              >
                <p>确定修复吗？</p>
                <div style="text-align: right; margin: 0">
                  <py-button
                    size="mini"
                    type="text"
                    @click="scope.row.recTipShow = false;"
                    >取消</py-button
                  >
                  <py-button
                    type="primary"
                    size="mini"
                    @click="recover(scope.row.virtualLineItemId, scope.row);"
                    >确定</py-button
                  >
                </div>
              </py-popover>
              <py-button
                size="small"
                type="danger"
                :loading="scope.row.recLoading"
                v-popover:popover
                >{{ scope.row.schedule || "修复" }}</py-button
              >
            </template>
          </py-table-column>
          <py-table-column
            prop="recoverMsg"
            label="状态"
            :filters="[
              { text: '已修复', value: 'true' },
              { text: '待修复', value: 'false' }
            ]"
            :filter-method="filterValue"
          >
          </py-table-column>
        </py-table>
      </div>
    </py-tab-pane>
  </py-tabs>
</template>
<script>
import {
  getFinacialDataList,
  getOnlineFinacial,
  operateItemOne,
  getAdvertiserItems,
  getOrderItems,
  getLineItems,
  getVirtualItems,
  getFinacialRecalcu,
  scheduleBillFix
} from "api";
export default {
  data() {
    return {
      loading: true,
      detailsId: null,
      activeName: "advertiser",
      filters: {
        keyWords: ""
      },
      advertiserDatas: [],
      orderDatas: [],
      lineItemDatas: [],
      virtualLineItemDatas: [],
      sels: [], // 列表选中列
      multipleSelection: []
    };
  },
  methods: {
    //获取数据
    getDetailsData() {
      this.loading = true;
      let para = { id: this.detailsId };
      getAdvertiserItems(para)
        .then(res => {
          this.loading = false;
          this.advertiserDatas = res;
          this.advertiserDatas.forEach(row => {
            this.diffeFun(row);
            row.type = "advertiser";
            this.$set(row, "calLoading", false);
            this.$set(row, "recTipShow", false);
            this.$set(row, "recLoading", false);
            let curState = row.billFix;
            if (curState === true) {
              this.$set(row, "recoverMsg", "已修复");
            } else {
              this.$set(row, "recoverMsg", "待修复");
            }
          });
        })
        .catch(error => {
          // 异常处理
          this.loading = false;
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    handleClick(tab) {
      let para = { id: this.detailsId };
      switch (tab.name) {
        case "advertiser":
          if (this.advertiserDatas.length === 0) {
            this.loading = true;
            getAdvertiserItems(para)
              .then(res => {
                this.loading = false;
                this.advertiserDatas = res;
                this.advertiserDatas.forEach(row => {
                  this.diffeFun(row);
                  row.type = "advertiser";
                  this.$set(row, "calLoading", false);
                  this.$set(row, "recTipShow", false);
                  this.$set(row, "recLoading", false);
                  let curState = row.billFix;
                  if (curState === true) {
                    this.$set(row, "recoverMsg", "已修复");
                  } else {
                    this.$set(row, "recoverMsg", "待修复");
                  }
                });
              })
              .catch(error => {
                // 异常处理
                this.loading = false;
                this.$notify.error({
                  title: "错误",
                  message: error.message,
                  duration: 0
                });
              });
          }
          break;
        case "order":
          if (this.orderDatas.length === 0) {
            this.loading = true;
            getOrderItems(para)
              .then(res => {
                this.loading = false;
                this.orderDatas = res;
                this.orderDatas.forEach(row => {
                  this.diffeFun(row);
                  row.type = "order";
                  this.$set(row, "calLoading", false);
                  this.$set(row, "recTipShow", false);
                  this.$set(row, "recLoading", false);
                  let curState = row.billFix;
                  if (curState === true) {
                    this.$set(row, "recoverMsg", "已修复");
                  } else {
                    this.$set(row, "recoverMsg", "待修复");
                  }
                });
              })
              .catch(error => {
                // 异常处理
                this.loading = false;
                this.$notify.error({
                  title: "错误",
                  message: error.message,
                  duration: 0
                });
              });
          }
          break;
        case "line":
          if (this.lineItemDatas.length === 0) {
            this.loading = true;
            getLineItems(para)
              .then(res => {
                this.loading = false;
                this.lineItemDatas = res;
                this.lineItemDatas.forEach(row => {
                  this.diffeFun(row);
                  row.type = "lineItem";
                  this.$set(row, "calLoading", false);
                  this.$set(row, "recTipShow", false);
                  this.$set(row, "recLoading", false);
                  let curState = row.billFix;
                  if (curState === true) {
                    this.$set(row, "recoverMsg", "已修复");
                  } else {
                    this.$set(row, "recoverMsg", "待修复");
                  }
                });
              })
              .catch(error => {
                // 异常处理
                this.loading = false;
                this.$notify.error({
                  title: "错误",
                  message: error.message,
                  duration: 0
                });
              });
          }
          break;
        case "virtual":
          if (this.virtualLineItemDatas.length === 0) {
            this.loading = true;
            getVirtualItems(para)
              .then(res => {
                this.loading = false;
                this.virtualLineItemDatas = res;
                this.virtualLineItemDatas.forEach(row => {
                  this.diffeFun(row);
                  row.type = "virtualLineItem";
                  this.$set(row, "calLoading", false);
                  this.$set(row, "recTipShow", false);
                  this.$set(row, "recLoading", false);
                  let curState = row.billFix;
                  if (curState === true) {
                    this.$set(row, "recoverMsg", "已修复");
                  } else {
                    this.$set(row, "recoverMsg", "待修复");
                  }
                });
              })
              .catch(error => {
                // 异常处理
                this.loading = false;
                this.$notify.error({
                  title: "错误",
                  message: error.message,
                  duration: 0
                });
              });
          }
          break;
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    selsChange(sels) {
      this.sels = sels;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    filterValue(value, row) {
      return row.billFix.toString() === value.toString();
    },
    //差值封装
    diffeFun(row) {
      if (row.oldApiAllocated === "-" || row.newApiAllocatedPlan1 === "-") {
        row.OACompare = "-";
      } else {
        row.OACompare = (
          row.newApiAllocatedPlan1 - row.oldApiAllocated
        ).toFixed(2);
      }
      if (
        row.newApiAllocatedPlan1 === "-" ||
        row.newApiAllocatedPlan2 === "-"
      ) {
        row.ABCompare = "-";
      } else
        row.ABCompare = (
          row.newApiAllocatedPlan2 - row.newApiAllocatedPlan1
        ).toFixed(2);
      if (Math.abs(row.OACompare) < 10 && row.OACompare !== "-") {
        row.OAcolor = "green";
      } else if (Math.abs(row.OACompare) < 50 && row.OACompare !== "-") {
        row.OAcolor = "gray";
      } else if (row.OACompare !== "-") {
        row.OAcolor = "red";
      }
      if (Math.abs(row.ABCompare) < 10 && row.ABCompare !== "-") {
        row.ABcolor = "green";
      } else if (Math.abs(row.ABCompare) < 50 && row.ABCompare !== "-") {
        row.ABcolor = "gray";
      } else if (row.ABCompare !== "-") {
        row.ABcolor = "red";
      }
    },
    //计算
    recalcu(id, row) {
      let para = {
        id: id,
        type: row.type
      };
      this.$set(row, "calLoading", true);
      getFinacialRecalcu(para)
        .then(res => {
          this.$set(row, "calLoading", false);
          row.oldApiAllocated = res.oldApiAllocated || "-";
          row.newApiAllocatedPlan2 = res.apiAllocated || "-";
          row.apiMaxAllocatedPlan2 = res.apiMaxAllocated || "-";
          row.newApiAllocatedPlan1 = res.apiAllocatedSimple || "-";
          row.apiMaxAllocatedPlan1 = res.apiMaxAllocatedSimple || "-";
          this.diffeFun(row);
          this.$notify({
            title: "提示",
            dangerouslyUseHTMLString: true,
            message:
              "<strong>" +
              para.type +
              ":" +
              row[para.type + "Name"] +
              "计算完成！</strong>"
          });
        })
        .catch(error => {
          // 异常处理
          this.$set(row, "calLoading", false);
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    // 修复
    recover(id, row) {
      let para = {
        id: id,
        type: row.type
      };
      this.$set(row, "recTipShow", false);
      this.$set(row, "recLoading", true);
      let scheduleInterval = setInterval(() => {
        this.getSchedule(row, para);
      }, 500);
      operateItemOne(para)
        .then(res => {
          this.$set(row, "recLoading", false);
          if (res.success === true) {
            //重新获取数据
            clearInterval(scheduleInterval);
            this.$set(row, "schedule", "修复");
            this.$set(row, "recoverMsg", "已修复");
            this.$notify({
              title: "提示",
              dangerouslyUseHTMLString: true,
              message:
                "<strong>" +
                para.type +
                ":" +
                row[para.type + "Name"] +
                "修复成功！</strong>",
              duration: 0
            });
          }
        })
        .catch(error => {
          // 异常处理
          clearInterval(scheduleInterval);
          this.$notify({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    //获取修复进度
    getSchedule(row, para) {
      scheduleBillFix(para)
        .then(sche => {
          //                    let total = sche[para.type+'Total'];
          //                    let fixed = sche[para.type+'Fixed'];
          //仍使用总的返回来记数
          let total =
            sche.advertiserTotal +
            sche.orderTotal +
            sche.lineItemTotal +
            sche.virtualLineItemTotal;
          let fixed =
            sche.advertiserFixed +
            sche.orderFixed +
            sche.lineItemFixed +
            sche.virtualLineItemFixed;
          this.$set(row, "schedule", fixed + "/" + total);
        })
        .catch(error => {
          // 异常处理
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    }
  },
  mounted() {
    this.detailsId = this.$route.params.id;
    setTimeout(() => {
      this.getDetailsData();
    }, 200);
  }
};
</script>
<style scoped></style>
