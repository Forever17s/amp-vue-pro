<template>
  <div style="padding:10px 0;">
    <py-row :gutter="20">
      <py-col :span="22" :offset="1">
        <py-card>
          <py-button
            v-permission="permission_operate"
            type="primary"
            @click="createDealWhiteItem"
            style="position: relative;z-index: 999;float: left;"
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
            <py-table-column prop="id" label="" width="1" sortable="custom">
              <template slot-scope="scope"> </template>
            </py-table-column>
            <py-table-column
              prop="dealName"
              label="deal名称"
              sortable="custom"
              :show-overflow-tooltip="true"
              min-width="200"
            >
            </py-table-column>
            <py-table-column
              prop="beginTime"
              label="开始时间"
              sortable="custom"
              min-width="100"
            >
            </py-table-column>
            <py-table-column
              prop="endTime"
              label="结束时间"
              sortable="custom"
              min-width="100"
            >
            </py-table-column>
            <py-table-column label="操作" width="180">
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
                        @click="updateDealWhiteItem(scope.row);"
                        ><i class="py-icon-edit"></i></py-button
                    ></py-tooltip>
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
                          @click="deleteDealWhite(scope.row);"
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
        </py-card>
        <py-dialog :visible.sync="dialogOpreateVisible">
          <py-scrollbar wrap-class="dialog-content-scrollbar">
            <py-card>
              <py-form
                :model="dealForm"
                :rules="dealRules"
                ref="dealForm"
                label-width="100px"
                label-position="right"
                class="demo-ruleForm"
              >
                <py-form-item label="白名单列表" prop="whiteDeals">
                  <py-col :span="20">
                    <py-tag
                      :key="item.id"
                      v-for="item in dealForm.whiteDeals"
                      closable
                      :disable-transitions="false"
                      @close="removeDealItem(item);"
                    >
                      {{ item.name }}
                    </py-tag>
                    <py-select
                      v-if="selectVisible"
                      v-model="selectValue"
                      multiple
                      filterable
                      remote
                      reserve-keyword
                      ref="saveTagSelect"
                      placeholder="请输入关键词"
                      :remote-method="remoteMethod"
                      @change="selectDealItem"
                      :loading="searchLoading"
                    >
                      <py-option
                        v-if="searchOverLengthTip"
                        disabled
                        :label="searchOverLengthTip"
                        :value="searchOverLengthTip"
                      >
                      </py-option>
                      <py-option
                        v-for="item in dealForm.dealData"
                        :key="item.id"
                        :disabled="isSelected(item)"
                        :label="item.name"
                        :value="item.apiId"
                      >
                      </py-option>
                    </py-select>
                    <py-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput"
                      >+ New Deal</py-button
                    >
                  </py-col>
                </py-form-item>
                <py-form-item label="监控时间" prop="configureDate">
                  <py-col :span="11">
                    <py-date-picker
                      v-model="dealForm.configureDate"
                      type="datetimerange"
                      :picker-options="pickerOptions"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="right"
                    >
                    </py-date-picker>
                  </py-col>
                </py-form-item>
                <py-form-item>
                  <py-col :span="12" :offset="6">
                    <py-button
                      type="primary"
                      @click="createDealWhite('dealForm');"
                      v-if="isCreate"
                      >创建</py-button
                    >
                    <py-button
                      type="primary"
                      @click="updateDealWhite('dealForm');"
                      v-if="!isCreate"
                      >更新</py-button
                    >
                    <py-button @click="cancelOpreate('dealForm');"
                      >取消</py-button
                    >
                  </py-col>
                </py-form-item>
              </py-form>
            </py-card>
          </py-scrollbar>
        </py-dialog>
      </py-col>
    </py-row>
  </div>
</template>

<script>
import {
  getDealWhiteList,
  deleteDealWhite,
  getDealWhiteListItem,
  getDealByKeyword,
  createDealWhite,
  updateDealWhite
} from "api";
export default {
  data() {
    return {
      datas: [],
      loading: true,
      dialogOpreateVisible: false, // 配置操作dialog显示
      selectValue: [], // 搜索下拉选中项
      selectVisible: false, // 搜索下拉显示
      setTimeOutRemoteRequest: null, // 延时请求搜索，减少请求积淀
      searchLoading: false, // 远程搜索进度
      searchOverLengthTip: "", // 搜索项超出展示范围100条提醒
      dealForm: {
        whiteDeals: [], // 勾选内容
        dealData: [], // 下拉列表
        configureDate: [
          new Date(),
          new Date(new Date().getTime() + 3600 * 1000 * 24 * 10)
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "未来一周",
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "未来一个月",
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "未来三个月",
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "延后一天",
            onClick(picker) {
              const start = picker.$children[0].date;
              const end = picker.$children[1].date;
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "延后三天",
            onClick(picker) {
              const start = picker.$children[0].date;
              const end = picker.$children[1].date;
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "延后一周",
            onClick(picker) {
              const start = picker.$children[0].date;
              const end = picker.$children[1].date;
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dealRules: {
        whiteDeals: [
          { required: true, message: "请添加要监控的Deal", trigger: "change" }
        ],
        configureDate: [
          { required: true, message: "请选择监控日期", trigger: "change" }
        ]
      },
      monitorDealId: null,
      isCreate: false,
      permission_operate: "configure:whiteOperate"
    };
  },
  methods: {
    // 初始化监控条目
    getDealWhiteData() {
      getDealWhiteList()
        .then(res => {
          this.loading = false;
          res.map(item => {
            const explain =
              item.dealVos && item.dealVos.length > 1
                ? "等" + item.dealVos.length + "项"
                : "";
            let dealNames = [];
            item.dealVos.map(deal => {
              dealNames.push(deal.name);
            });
            item.dealName = dealNames ? dealNames.join("、") + explain : "暂无";
          });
          this.datas = res;
          const column = { order: "descending", prop: "id" };
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
    // 删除某项监控
    deleteDealWhite(row) {
      let para = { id: row.id };
      this.$set(row, "delLoading", true);
      this.$set(row, "delTipShow", false);
      deleteDealWhite(para)
        .then(res => {
          this.$set(row, "delLoading", false);
          this.getDealWhiteData();
          this.$notify({
            title: "成功",
            message: "删除白名单完成",
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
    // 创建监控按钮
    createDealWhiteItem() {
      this.isCreate = true;
      this.dialogOpreateVisible = true;
    },
    // 更新监控按钮
    updateDealWhiteItem(row) {
      this.isCreate = false;
      this.dialogOpreateVisible = true;
      this.monitorDealId = row.id;
      const para = { id: this.monitorDealId };
      getDealWhiteListItem(para)
        .then(res => {
          this.dealForm.whiteDeals = res.dealVos;
          this.dealForm.configureDate = [
            new Date(res.beginTime),
            new Date(res.endTime)
          ];
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
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
    },
    // 移除一项Deal
    removeDealItem(item) {
      this.dealForm.whiteDeals.splice(
        this.dealForm.whiteDeals.indexOf(item),
        1
      );
    },
    // 远程搜索
    remoteMethod(query) {
      this.searchOverLengthTip = "";
      if (query !== "") {
        this.searchLoading = true;
        window.clearTimeout(this.setTimeOutRemoteRequest);
        this.setTimeOutRemoteRequest = window.setTimeout(() => {
          const para = { keyword: query };
          getDealByKeyword(para)
            .then(res => {
              if (res.length > 100)
                this.searchOverLengthTip =
                  "共计" + res.length + "条搜索结果，展示前100条";
              this.dealForm.dealData = res.slice(0, 99);
              this.searchLoading = false;
            })
            .catch(error => {
              this.$notify.error({
                title: "错误",
                message: error.message,
                duration: 0
              });
              this.searchLoading = false;
            });
        }, 500); // 500ms内无操作发送延时请求
      }
    },
    // 搜索列中是否已经添加过
    isSelected(item) {
      return (
        JSON.stringify(this.dealForm.whiteDeals).indexOf(JSON.stringify(item)) >
        -1
      );
    },
    // 选择下拉列中某一项添加
    selectDealItem(val) {
      const addDealData = this.dealForm.dealData.filter(item => {
        return item.apiId == val;
      });
      this.dealForm.whiteDeals.push(addDealData[0]);
      this.selectVisible = false;
    },
    // 显示搜索进行添加，初始化搜索框和下拉列
    showInput() {
      this.dealForm.dealData = [];
      this.selectValue = [];
      this.searchOverLengthTip = "";
      this.selectVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagSelect.$refs.input.focus();
      });
    },
    // 将要创建或更新的对象数组中某一项提取成数组完成传参
    getDataOneKeyToArr(data, key) {
      return data.map(item => {
        return item[key];
      });
    },
    // 创建白名单
    createDealWhite(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            dealIds: this.getDataOneKeyToArr(this.dealForm.whiteDeals, "id"),
            apiDealIds: this.getDataOneKeyToArr(
              this.dealForm.whiteDeals,
              "apiId"
            ),
            id: this.$route.params.id,
            beginTime: this.formatDate(this.dealForm.configureDate[0]),
            endTime: this.formatDate(this.dealForm.configureDate[1])
          };
          createDealWhite(para)
            .then(res => {
              this.$notify({
                title: "成功",
                message: "创建白名单完成",
                type: "success"
              });
              this.dialogOpreateVisible = false;
              this.getDealWhiteData();
            })
            .catch(error => {
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
    // 更新白名单
    updateDealWhite(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            dealIds: this.getDataOneKeyToArr(this.dealForm.whiteDeals, "id"),
            apiDealIds: this.getDataOneKeyToArr(
              this.dealForm.whiteDeals,
              "apiId"
            ),
            id: this.$route.params.id,
            beginTime: this.formatDate(this.dealForm.configureDate[0]),
            endTime: this.formatDate(this.dealForm.configureDate[1])
          };
          updateDealWhite(para)
            .then(res => {
              this.$notify({
                title: "成功",
                message: "更新白名单完成",
                type: "success"
              });
              this.dialogOpreateVisible = false;
              this.getDealWhiteData();
            })
            .catch(error => {
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
    // 将标准时间转换为格式yyyy/MM/dd HH:mm:ss
    formatDate(date) {
      let dateTime =
        date.getFullYear() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      return dateTime;
    },
    // 关闭操作框
    cancelOpreate(formName) {
      this.dialogOpreateVisible = false;
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.getDealWhiteData();
  }
};
</script>

<style scoped></style>
