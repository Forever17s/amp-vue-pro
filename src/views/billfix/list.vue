<template>
  <div style="margin-top: 20px;">
    <py-form :inline="true" :model="formInline">
      <py-form-item label="广告主ApiIds">
        <py-input
          v-model="formInline.advertisers"
          placeholder="广告主api_id"
        ></py-input>
      </py-form-item>
      <py-form-item label="订单ApiIds">
        <py-input
          v-model="formInline.orders"
          placeholder="订单pi_id"
        ></py-input>
      </py-form-item>
      <py-form-item>
        <py-button size="small" @click="autoCostcompare">自动比较</py-button>
        <py-button type="primary" size="small" @click="fixDataDetails"
          >差异详情</py-button
        >
        <py-button
          type="primary"
          size="small"
          :loading="buttonLoading"
          @click="smartGetBillFixData"
          >重新计算</py-button
        >
        <py-button
          type="primary"
          size="small"
          :loading="buttonLoading"
          @click="smartBillFix"
          >{{ bottonLoadingText || "批量修复" }}</py-button
        >
      </py-form-item>
    </py-form>
    <div style="position: relative;left:-20px;top: 0px;z-index: 999;width:70%;height: 40px;min-width: 400px;">
      <py-button
        style="margin-left: 20px;"
        @click="getAdvertiserBill"
        class="btn btn1"
        size="small"
        >生成广告主数据</py-button
      >
      <py-button @click="getOrderBill" class="btn btn2" size="small"
        >生成订单数据</py-button
      >
      <py-button @click="getLineItemBill" class="btn btn3" size="small"
        >生成计划数据</py-button
      >
      <py-button @click="getVirtualLineItemBill" class="btn btn4" size="small"
        >生成虚拟计划数据</py-button
      >
      <py-button @click="openPartnerFixData" class="btn" size="small"
        >单个客户数据生成</py-button
      >
      <!-- <py-popover -->
      <!-- ref="popover" -->
      <!-- width="160" -->
      <!-- v-model="recTipShow"> -->
      <!-- <p>确定修复吗？</p> -->
      <!-- <div style="text-align: right; margin: 0"> -->
      <!--
        <py-button size="mini" type="text" @click="recTipShow = false">取消</py-button>
      -->
      <!--
        <py-button type="primary" size="mini" @click="operateAllBill">确定</py-button>
      -->
      <!-- </div> -->
      <!-- </py-popover> -->
      <!--
        <py-button type="danger" @click="operateAllBill"  class="btn btn5" v-bind:disabled="recAllBtn" v-popover:popover>修复全部</py-button>
      -->
      <!--
        <py-button type="danger" @click="operateAllBillSync"  >异步修复全部</py-button>
      -->
      <!--
        <py-button type="danger" @click="emptyBillFix"  >清空所有修复数据</py-button>
      -->
      <!-- 新增界面 -->
    </div>
    <py-dialog
      title="修复单个客户"
      :visible.sync="fixPartnerVisible"
      :close-on-click-modal="false"
    >
      <py-form label-width="80px">
        <py-form-item label="客户id">
          <py-input v-model="partnerId" auto-complete="off"></py-input>
        </py-form-item>
      </py-form>
      <div slot="footer" class="dialog-footer">
        <py-button
          type="primary"
          size="small"
          @click="onePartnerFixData"
          :loading="buttonLoading2"
          >单个客户数据生成</py-button
        >
      </div>
    </py-dialog>
    <py-dialog
      title="修复详情"
      :visible.sync="fixDataDetailsVisible"
      :close-on-click-modal="false"
      width="80%"
    >
      <py-table
        :data="detailDatas"
        max-height="480"
        style="width: 100%;margin-top: 10px;"
      >
        <py-table-column prop="partnerId" label="客户id"> </py-table-column>
        <py-table-column prop="partnerName" label="客户名称"> </py-table-column>
        <py-table-column prop="advertiserId" label="广告主id">
        </py-table-column>
        <py-table-column prop="advertiserApiId" label="广告主apiId">
        </py-table-column>
        <py-table-column prop="advertiserName" label="广告主名称">
        </py-table-column>
        <py-table-column prop="orderId" label="订单id"> </py-table-column>
        <py-table-column prop="orderApiId" label="订单apiId"> </py-table-column>
        <py-table-column prop="orderName" label="订单名称"> </py-table-column>
        <py-table-column prop="difference" label="差异"> </py-table-column>
      </py-table>
    </py-dialog>
    <py-table
      :data="datas"
      v-loading="loading"
      table-search
      table-pagination
      style="width: 100%;margin-top: -40px;"
    >
      <py-table-column label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </py-table-column>
      <py-table-column prop="partnerId" label="" width="1">
        <template slot-scope="scope"> </template>
      </py-table-column>
      <py-table-column prop="name" label="客户名称"> </py-table-column>
      <py-table-column prop="cooperationMode_replace" label="渠道">
        <!--
          :filters="[{ text: '自助', value: 'self_help' }, { text: '托管', value: 'trusteeship' }]"
        -->
        <!-- :filter-method="filterValue"> -->
      </py-table-column>
      <py-table-column prop="type" label="类型"> </py-table-column>
      <py-table-column label="操作">
        <template slot-scope="scope">
          <py-row type="flex" justify="space-between">
            <py-col :span="7">
                <py-button
                    type="primary"
                    size="small"
                    @click="getPartnerFixData(scope.row);"
                    :loading="scope.row.calLoading"
                    class="btn-op"
                >
                    重新计算
                </py-button>
            </py-col>
            <py-col :span="7">
                <py-button
                    type="primary"
                    size="small"
                    @click="toDetails(scope.row);"
                    class="btn-op"
                >
                    查看详情
                </py-button>
            </py-col>
            <py-col :span="7">
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
                  >
                      取消
                  </py-button>
                  <py-button
                          type="primary"
                          size="mini"
                          @click="recoverPartenerOne(scope.row);"
                  >
                      确定
                  </py-button>
                </div>
              </py-popover>
              <py-button
                      type="danger"
                      size="small"
                      class="btn-op btn-op2"
                      :loading="scope.row.recLoading"
                      v-bind:disabled="scope.row.btnClick"
                      v-popover:popover
              >
                  {{ scope.row.schedule || "一键修复" }}
              </py-button>
            </py-col>
          </py-row>
        </template>
      </py-table-column>
      <!-- <py-table-column -->
      <!-- prop="recoverState" -->
      <!-- label="状态" -->
      <!-- &gt; -->
      <!-- </py-table-column> -->
    </py-table>
  </div>
</template>
<script>
import util from "../../common/js/util";
import {
  operatePartenerOne,
  insertOne,
  operateAll,
  getOnlineFinacial,
  insertAdvertiserBill,
  insertOrderBill,
  insertLineItemBill,
  insertVirtualLineItemBill,
  getPartnerFixData,
  emptyBillFix,
  scheduleBillFix,
  costcompare,
  smartBillFix,
  smartGetBillFixData,
  getSmartFixedProgress,
  clearCache,
  fixDataDetails
} from "api";
import PyButton from "../../components/button/src/button.vue";
import PyCard from "../../components/card/src/main.vue";
export default {
  components: { PyCard },
  data() {
    return {
      datas: [],
      loading: true,
      recAllBtn: false,
      recTipShow: false,
      buttonLoading: false,
      bottonLoadingText: "批量修复",
      partnerId: "",
      fixPartnerVisible: false,
      buttonLoading2: false,
      detailDatas: [],
      fixDataDetailsVisible: false,
      formInline: {
        advertisers: "",
        orders: ""
      }
    };
  },
  methods: {
    recoverPartenerOne(row) {
      let para = {
        id: row.partnerId,
        type: "partner"
      };
      this.$set(row, "recTipShow", false);
      this.$set(row, "recLoading", true);
      this.$set(row, "schedule", "Loading");
      let scheduleInterval = setInterval(() => {
        this.getSchedule(row, para);
      }, 500);
      operatePartenerOne(para)
        .then(res => {
          this.$set(row, "recLoading", false);
          if (res.success === true) {
            clearInterval(scheduleInterval);
            this.$set(row, "btnClick", true);
            this.$set(row, "schedule", "修复完成");
            this.$notify({
              title: "提示",
              dangerouslyUseHTMLString: true,
              message: "<strong>" + row.name + "修复完成！</strong>",
              duration: 0
            });
          }
        })
        .catch(error => {
          // 异常处理
          clearInterval(scheduleInterval);
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    //获取修复进度
    getSchedule(row, para) {
      scheduleBillFix(para).then(sche => {
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
      });
    },
    //获取修复进度
    getSmartSchedule() {
      getSmartFixedProgress({}).then(sche => {
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
        this.bottonLoadingText = "进度" + fixed + "/" + total;
      });
    },
    operateAllBill() {
      this.recTipShow = false;
      this.loading = true;
      operateAll().then(res => {
        this.loading = false;
        if (res.httpStatusCode === 200) {
          this.recAllBtn = true;
          this.$notify({
            title: "提示",
            dangerouslyUseHTMLString: true,
            message: "<strong>修复全部成功！</strong>",
            duration: 0
          });
        }
      });
    },
    operateAllBillSync() {
      this.datas.forEach(item => {
        let para = {
          id: item.partnerId,
          type: "partner"
        };
        operatePartenerOne(para).then(res => {
          if (res.success === true) {
            console.log("修复成功");
          }
        });
      });
    },
    repairAllPartner() {
      this.datas.map(row => {
        let para = {
          id: row.partnerId,
          type: "partner"
        };
        operatePartenerOne(para).then(res => {
          if (res.success == true) {
            this.getCustomData();
            row.recoverState = "已修复";
            console.log("已修复");
          } else {
            row.recoverState = "待修复";
          }
        });
      });
    },
    //清空所有的billfix表中的数据
    emptyBillFix() {
      emptyBillFix().then(res => {
        if (res.success === true) {
          this.$message({
            message: "删除数据成功"
          });
        }
      });
    },
    getAdvertiserBill() {
      insertAdvertiserBill().then(res => {
        if (res.success === true) {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: "<strong>插入广告主成功</strong>"
          });
        }
      });
    },
    getOrderBill() {
      insertOrderBill().then(res => {
        if (res.success === true) {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: "<strong>插入订单成功</strong>"
          });
        }
      });
    },
    getLineItemBill() {
      insertLineItemBill().then(res => {
        if (res.success === true) {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: "<strong>插入计划成功</strong>"
          });
        }
      });
    },
    getVirtualLineItemBill() {
      insertVirtualLineItemBill().then(res => {
        if (res.success === true) {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: "<strong>插入虚拟计划成功</strong>"
          });
        }
      });
    },
    filterValue(value, row) {
      return row.cooperationMode.toString() === value.toString();
    },
    //计算客户底下广告主，订单，计划虚拟计划的修复数据
    getPartnerFixData(row) {
      this.$set(row, "calLoading", true);
      let para = {
        partnerId: row.partnerId
      };
      getPartnerFixData(para).then(res => {
        this.$set(row, "calLoading", false);
        if (res.success === true) {
          this.$notify({
            title: "提示",
            dangerouslyUseHTMLString: true,
            message: "<strong>" + row.name + "计算完成！</strong>"
          });
        }
      });
    },
    toDetails(row) {
      this.$router.push("/billfix/details/" + row.partnerId);
    },
    autoCostcompare() {
      costcompare()
        .then(res => {
          if (res.success) {
            this.formInline.advertisers = res.advertisers.join(",");
            this.formInline.orders = res.orders.join(",");
            this.$notify({
              title: "提示",
              dangerouslyUseHTMLString: true,
              message: "获取成功"
            });
          } else {
            this.$notify({
              title: "错误",
              dangerouslyUseHTMLString: true,
              message: "获取错误"
            });
          }
        })
        .catch(error => {
          // 异常处理
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    smartGetBillFixData() {
      this.buttonLoading = true;
      smartGetBillFixData(this.formInline)
        .then(res => {
          this.buttonLoading = false;
          if (res.success === true) {
            this.$notify({
              title: "提示",
              dangerouslyUseHTMLString: true,
              message: "处理完成"
            });
          }
        })
        .catch(error => {
          // 异常处理
          this.buttonLoading = false;
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    smartBillFix() {
      //智能修复指定的广告主api_id,订单api_id
      this.buttonLoading = true;
      let scheduleSmartInterval = setInterval(() => {
        this.getSmartSchedule();
      }, 500);
      smartBillFix(this.formInline)
        .then(res => {
          this.buttonLoading = false;
          clearInterval(scheduleSmartInterval);
          clearCache().then();
          if (res.success === true) {
            this.$notify({
              title: "提示",
              dangerouslyUseHTMLString: true,
              message: "处理完成"
            });
          }
        })
        .catch(error => {
          // 异常处理
          clearInterval(scheduleSmartInterval);
          clearCache().then();
          this.buttonLoading = false;
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    fixDataDetails() {
      fixDataDetails(this.formInline)
        .then(res => {
          this.fixDataDetailsVisible = true;
          this.detailDatas = res;
          this.buttonLoading2 = false;
          if (res.success === true) {
            this.$notify({
              title: "提示",
              dangerouslyUseHTMLString: true,
              message: "处理完成"
            });
          }
        })
        .catch(error => {
          // 异常处理
          this.buttonLoading2 = false;
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    getCustomData() {
      getOnlineFinacial().then(res => {
        this.loading = false;
        this.datas = res;
        this.datas.forEach(row => {
          this.$set(row, "recLoading", false);
          this.$set(row, "recTipShow", false);
          this.$set(row, "btnClick", false);
          this.$set(row, "calLoading", false);
          if (row.cooperationMode === "self_help") {
            this.$set(row, "cooperationMode_replace", "自助");
          } else if (row.cooperationMode === "trusteeship") {
            this.$set(row, "cooperationMode_replace", "托管");
          }
        });
      });
    },
    openPartnerFixData() {
      this.fixPartnerVisible = true;
    },
    onePartnerFixData() {
      this.buttonLoading2 = true;
      let para = {
        partnerId: this.partnerId
      };
      getPartnerFixData(para).then(res => {
        this.buttonLoading2 = false;
        this.fixPartnerVisible = false;
        if (res.success === true) {
          this.$notify({
            title: "提示",
            message: "计算完成"
          });
        }
      });
    }
  },
  mounted() {
    this.getCustomData();
  },
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    next();
  }
};
</script>
<style lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .py-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.btn {
  float: left;
  margin: 10px;
  text-indent: -10px;
  line-height: 2px;
}
</style>
