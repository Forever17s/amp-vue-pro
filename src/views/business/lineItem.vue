<template>
  <div style="padding:10px 0;">
    <py-row :gutter="20">
      <py-col :span="18" :offset="3">
        <py-form
          :inline="true"
          :model="formInline"
          :rules="rules"
          ref="formInline"
          class="demo-form-inline"
        >
          <py-form-item label="客户" class="form-item-input" prop="partner">
            <py-select
              v-model="formInline.partner"
              multiple
              filterable
              @change="changeChildSelect('advertiser', $event);"
              style="width: 300px"
              placeholder="选择客户"
            >
              <py-option
                v-for="item in selectedData.partnerData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </py-option>
            </py-select>
          </py-form-item>
          <py-form-item
            label="广告主"
            class="form-item-input"
            prop="advertiser"
          >
            <py-select
              v-model="formInline.advertiser"
              multiple
              filterable
              @change="changeChildSelect('order', $event);"
              style="width: 300px"
              placeholder="选择广告主"
            >
              <py-option
                v-for="item in selectedData.advertiserData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </py-option>
            </py-select>
          </py-form-item>
          <py-form-item label="模式">
            <div style="">
              <py-radio-group v-model="formInline.mode" size="small">
                <py-radio
                  v-for="item in selectedData.modeData"
                  :key="item.value"
                  :label="item.label"
                  border
                >
                </py-radio>
              </py-radio-group>
            </div>
          </py-form-item>
          <py-form-item
            label="订单"
            class="form-item-input"
            style="margin-left: 10px"
          >
            <py-select
              v-model="formInline.order"
              multiple
              filterable
              @change="changeChildSelect('lineitem', $event);"
              style="width: 300px"
              :disabled="!selectedData.orderData.length"
              placeholder="选择订单"
            >
              <py-option
                v-for="item in selectedData.orderData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </py-option>
            </py-select>
          </py-form-item>
          <py-form-item
            label="计划"
            class="form-item-input"
            style="margin-left: 4px"
          >
            <py-select
              v-model="formInline.lineitem"
              multiple
              filterable
              :disabled="!selectedData.lineitemData.length"
              style="width: 300px"
              placeholder="选择计划"
            >
              <py-option
                v-for="item in selectedData.lineitemData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </py-option>
            </py-select>
          </py-form-item>
          <py-form-item>
            <py-button type="primary" @click="onSubmit('formInline');"
              >查询</py-button
            >
          </py-form-item>
        </py-form>
      </py-col>
    </py-row>
    <div style="padding: 10px">
      <div
        class="grid-content bg-purple"
        style="float: right;width: 200px;margin: -50px 10px 0 0;"
        v-show="fullDatas.length > 0"
      >
        <py-input
          placeholder="输入关键字搜索"
          suffix-icon="py-icon-search"
          v-model="tableItem.searchKey"
          clearable
          v-on:input="searchlineItem"
          style="z-index: 1;"
        ></py-input>
      </div>
      <py-table
        ref="multipleTable"
        :data="datas"
        border
        stripe
        @sort-change="sortChange"
        tooltip-effect="dark"
        v-loading="loading"
        style="width: 100%"
      >
        <py-table-column
          v-for="item in tableHeaderData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          sortable="custom"
          fit
          v-if="item.prop !== 'width' && item.prop !== 'height'"
          empty-text="暂无数据"
          :resizable="tableItem.largeWidth.indexOf(item.label) > -1"
          :min-width="
            tableItem.largeWidth.indexOf(item.label) > -1 ? '180' : '100'
          "
        >
        </py-table-column>
        <py-table-column
          v-for="item in tableHeaderData"
          :key="item.prop"
          v-if="item.prop === 'width'"
          sortable="custom"
          empty-text="暂无数据"
          label="宽×高"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.width }}×{{ scope.row.height }}
          </template>
        </py-table-column>
      </py-table>
      <py-pagination
        v-show="tableItem.total > tableItem.pageSize"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 40, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :page-size="tableItem.pageSize"
        :total="tableItem.total"
        style="text-align: center"
      >
      </py-pagination>
    </div>
  </div>
</template>

<script>
import { getSelectItem, getLineItemList, getLineItemDownload } from "api";
import util from "../../common/js/util";
import { downloadFile } from "../../common/utils/download";
export default {
  data() {
    return {
      tableHeaderData: [],
      tableItem: {
        searchKey: "",
        total: 0,
        page: 1,
        pageSize: 10,
        // 表列需要加宽可拉伸的
        largeWidth: ["订单名称", "父计划名称", "计划名称", "原生创意模板名称"]
      },
      // 原始数据
      fullDatas: [],
      // 表格数据
      datas: [],
      // 表单提交数据
      formInline: {
        partner: [], // 客户
        advertiser: [], // 广告主
        order: [], // 订单
        lineitem: [], // 计划
        mode: "创意" // 查询方式
      },
      // 表单选项数据
      selectedData: {
        partnerData: [],
        advertiserData: [],
        orderData: [],
        lineitemData: [],
        modeData: [
          {
            value: "creative",
            label: "创意"
          },
          {
            value: "deal",
            label: "deal"
          }
        ]
      },
      // 表格校验规则
      rules: {
        partner: [
          { required: true, message: "填写客户后查询", trigger: "blur" }
        ],
        advertiser: [
          { required: false, message: "填写广告主后查询", trigger: "blur" }
        ]
      },
      // 表格查询loading
      loading: false,
      // 数据是否缓存过了，keepalive是否获取数据还是读取本地数据
      setData: false
    };
  },
  methods: {
    // 搜索改变下级条件
    changeChildSelect(item, val) {
      let selectedData = this.selectedData;
      let inputData = this.formInline;
      // 清空下级数据
      switch (item) {
        case "advertiser":
          this.$set(selectedData, "advertiserData", []);
          this.$set(inputData, "advertiser", []);
        case "order":
          this.$set(selectedData, "orderData", []);
          this.$set(inputData, "order", []);
        case "lineitem":
          this.$set(selectedData, "lineitemData", []);
          this.$set(inputData, "lineitem", []);
          break;
        default:
      }
      // 重新获得下级数据
      this.getSelectData(item, val);
    },
    // 获取搜索条件
    getSelectData(selectType, ids) {
      const params = {
        type: selectType,
        whereIds: ids
      };
      getSelectItem(params)
        .then(data => {
          let resetData = [];
          data.forEach(item => {
            const rItem = {};
            rItem.value = item.id;
            rItem.label = item.name;
            resetData.push(rItem);
          });
          let selectedData = this.selectedData;
          switch (selectType) {
            case "partner":
              this.$set(selectedData, "partnerData", resetData);
              break;
            case "advertiser":
              this.$set(selectedData, "advertiserData", resetData);
              break;
            case "order":
              this.$set(selectedData, "orderData", resetData);
              break;
            case "lineitem":
              this.$set(selectedData, "lineitemData", resetData);
              break;
            default:
          }
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    // 进行搜索
    onSubmit(formInline) {
      this.$refs[formInline].validate(valid => {
        if (valid) {
          const params = {
            partnerIds: this.formInline.partner,
            advIds: this.formInline.advertiser,
            orderIds: this.formInline.order,
            itemIds: this.formInline.lineitem,
            checkType: this.formInline.mode === "创意" ? "creative" : "deal"
          };
          this.$set(this, "loading", true);
          getLineItemList(params)
            .then(res => {
              this.$set(this, "loading", false);
              if (res.beyond) {
                this.$confirm("查询结果过多, 是否下载查看?", "提示", {
                  confirmButtonText: "下载",
                  cancelButtonText: "取消",
                  type: "warning",
                  center: true
                })
                  .then(() => {
                    this.downloadLineItem();
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "取消下载，暂无数据"
                    });
                  });
              } else {
                this.tableHeaderData = res.columns;
                this.fullDatas = res.data;
                this.searchlineItem();
              }
            })
            .catch(error => {
              this.$set(this, "loading", false);
              this.$notify.error({
                title: "错误",
                message: error.message,
                duration: 0
              });
            });
        } else {
          return false;
        }
      });
    },
    downloadLineItem() {
      const params = {
        partnerIds: this.formInline.partner,
        advIds: this.formInline.advertiser,
        orderIds: this.formInline.order,
        itemIds: this.formInline.lineitem,
        checkType: this.formInline.mode === "创意" ? "creative" : "deal"
      };
      getLineItemDownload(params)
        .then(res => {
          // 处理返回的文件流
          downloadFile(res, "hackathon.xlsx");
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    searchlineItem() {
      const searchkey = this.trim(this.tableItem.searchKey);
      let searchRes = this.fullDatas.filter(item => {
        if (!searchkey) return true;
        for (let k in item) {
          if (item[k] !== null && item[k].toString().indexOf(searchkey) !== -1)
            return true;
        }
      });
      this.tableItem.total = searchRes.length;
      searchRes = searchRes.filter(
        (item, index) =>
          index < this.tableItem.pageSize * this.tableItem.page &&
          index >= this.tableItem.pageSize * (this.tableItem.page - 1)
      );
      this.datas = searchRes;
    },
    handleCurrentChange(val) {
      this.tableItem.page = val;
      this.searchlineItem();
    },
    handleSizeChange(val) {
      this.tableItem.pageSize = val;
      this.searchlineItem();
    },
    // 首尾去空格
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    // 表格排序
    sortChange(column) {
      this.fullDatas.sort(this.getDataSort(column.order, column.prop));
      this.searchlineItem();
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
  activated() {
    if (!this.setData) this.getSelectData("partner", []);
    else {
      this.setData = false;
    }
  }
};
</script>

<style scoped>
.form-item-input {
  width: 26em;
}
</style>
