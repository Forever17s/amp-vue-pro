<template>
  <py-row>
    <py-tabs
      v-model="selectedFilterTab"
      type="border-card"
      @tab-click="changeFilterTab"
    >
      <py-tab-pane
        v-for="(item, index) in filterTabs"
        :key="index"
        :label="item.label"
        :name="item.name"
      >
        <py-card :body-style="{ padding: '0px', height: 'calc(90vh - 150px)' }">
          <py-input
            placeholder="输入关键字搜索"
            suffix-icon="py-icon-search"
            v-model.trim="tabItem.searchKey"
            v-on:input="filterAdvsItem"
            clearable
            class="search-input"
            v-show="fullDatas.length > 20"
          ></py-input>
          <py-scrollbar wrap-class="confirm-list-scrollbar">
            <div v-for="(item, index) in advertiserDatas" :key="index">
              <py-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
                <py-card style="padding: 1em;height: 8em;">
                  <py-tooltip
                    effect="dark"
                    :content="item.name"
                    placement="top"
                  >
                    <span
                      :style="{ color: item.subscibe ? '#67C23A' : '#878D99' }"
                      class="dialog-content-name"
                      >{{ item.name }}</span
                    >
                  </py-tooltip>
                  <div class="bottom clearfix">
                    <py-button
                      type="text"
                      class="button"
                      @click="showOneAdv(item);"
                      >查看</py-button
                    >
                    <py-button
                      type="text"
                      class="button"
                      v-if="!item.subscibe"
                      @click="subscibeAdv(item);"
                      >订阅</py-button
                    >
                    <py-button
                      type="text"
                      class="button"
                      v-if="item.subscibe"
                      @click="unSubscibeAdv(item);"
                      >退订</py-button
                    >
                  </div>
                </py-card>
              </py-col>
            </div>
            <div v-show="!fullDatas.length" class="tagLoading">
              <i class="py-icon-loading"></i>
              <p class="py-loading-text">拼命加载中</p>
            </div>
            <div
              v-show="fullDatas.length && !tabDatas.length"
              class="tagNoneData"
            >
              <p class="py-loading-text">暂无</p>
            </div>
          </py-scrollbar>
        </py-card>
      </py-tab-pane>
      <py-pagination
        v-show="tabItem.total > tabItem.pageSize"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :current-page.sync="tabItem.page"
        :page-size="tabItem.pageSize"
        :total="tabItem.total"
        style="text-align: center;margin: 1em 0 -1em 0"
      ></py-pagination>
    </py-tabs>
    <py-dialog :visible.sync="dialogContentVisible">
      <py-scrollbar wrap-class="dialog-content-scrollbar">
        <py-card class="box-card">
          <div v-if="dialogContent">
            <p>
              广告主： <span>{{ dialogContent.name }}</span>
            </p>
            <p>
              所属公司： <span>{{ dialogContent.companyName }}</span>
            </p>
            <p>
              创建人： <span>{{ dialogContent.creator.account }}</span>
            </p>
            <p>
              通知人：
              <span v-permission="'!' + permission_edit">
                {{ dialogContent.notifiers ? dialogContent.notifiers : "暂无" }}
              </span>
              <span v-permission="permission_edit">(修改请用分号';'分割)</span>
              <span v-permission="permission_edit">
                <py-input
                  v-model="dialogContent.notifiers"
                  placeholder="请添加通知人"
                >
                  <py-button slot="append" @click="updateNotifiers"
                    >更新</py-button
                  >
                </py-input>
              </span>
            </p>
            <p>
              所属客户： <span>{{ dialogContent.partnerVo.name }}</span>
            </p>
            <p>
              包含订单： <span>{{ dialogContent.orderList }}</span>
            </p>
          </div>
        </py-card>
      </py-scrollbar>
    </py-dialog>
  </py-row>
</template>

<script>
import {
  findAllAdvertiser,
  subscibeAdvertiser,
  unSubscibeAdvertiser,
  findOneByAdvertiser,
  updateNotifierConfig
} from "api";
export default {
  data() {
    return {
      selectedFilterTab: "subscribe",
      filterTabs: [
        {
          label: "我订阅的广告主",
          name: "subscribe"
        },
        {
          label: "未订阅的广告主",
          name: "unSubscribe"
        },
        {
          label: "所有广告主",
          name: "all"
        }
      ],
      fullDatas: [], // 原始数据
      tabDatas: [], // tab过滤数据
      advertiserDatas: [], // 当前页显示数据
      tabItem: {
        searchKey: "",
        total: 0,
        page: 1,
        pageSize: 96 // 每页96条数据，96/4=24行
      },
      dialogContentVisible: false,
      dialogContent: null,
      permission_edit: "configure:editNotifiers" // 编辑权限
    };
  },
  methods: {
    // 获取数据信息
    getAllAdvertiser() {
      findAllAdvertiser()
        .then(res => {
          this.fullDatas = res;
          this.tabDatas = res.filter(item => {
            return item.subscibe;
          }); // 初始化tab为我订阅的广告主
          this.filterAdvsItem();
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    // 根据数据分页
    filterAdvsItem() {
      const searchkey = this.tabItem.searchKey;
      let searchRes = this.tabDatas.filter(item => {
        if (!searchkey) return true;
        if (
          (item.name && item.name.toString().indexOf(searchkey) !== -1) ||
          item.advertiserId.toString() === searchkey
        ) {
          return true;
        }
      });
      this.tabItem.total = searchRes.length;
      this.advertiserDatas = searchRes.filter(
        (item, index) =>
          index < this.tabItem.pageSize * this.tabItem.page &&
          index >= this.tabItem.pageSize * (this.tabItem.page - 1)
      );
    },
    // 是否显示搜索框
    showSearchInput() {
      return this.fullDatas.length > 20; // 当数据大于20条时显示可搜索
    },
    // 切换页码
    handleCurrentChange(val) {
      this.tabItem.page = val;
      this.filterAdvsItem();
    },
    // 进行tab过滤
    changeFilterTab(tab, event) {
      // 初始页码，重新分页
      this.tabItem.page = 1;
      this.tabItem.searchKey = "";
      // 记录当前筛选项，进行数据重写
      this.selectedFilterTab = tab.name;
      this.filterDataByTab(tab.name);
    },
    filterDataByTab(val) {
      switch (val) {
        case "subscribe":
          this.tabDatas = this.fullDatas.filter(item => {
            return item.subscibe;
          });
          break;
        case "unSubscribe":
          this.tabDatas = this.fullDatas.filter(item => {
            return !item.subscibe;
          });
          break;
        case "all":
          this.tabDatas = this.fullDatas;
          break;
        default:
      }
      this.filterAdvsItem();
    },
    // 订阅广告主
    subscibeAdv(item) {
      const param = { advertiserId: item.advertiserId };
      subscibeAdvertiser(param)
        .then(res => {
          this.$set(item, "subscibe", true);
          this.filterDataByTab(this.selectedFilterTab);
          this.$notify({
            title: "成功",
            message: "订阅广告主成功",
            type: "success"
          });
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    // 退订广告主
    unSubscibeAdv(item) {
      const param = { advertiserId: item.advertiserId };
      unSubscibeAdvertiser(param)
        .then(res => {
          this.$set(item, "subscibe", false);
          this.filterDataByTab(this.selectedFilterTab);
          this.$notify({
            title: "成功",
            message: "退订广告主成功",
            type: "success"
          });
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    // 查看单个广告主
    showOneAdv(item) {
      const param = { advertiserId: item.advertiserId };
      this.dialogContent = null;
      findOneByAdvertiser(param)
        .then(res => {
          this.dialogContent = res;
          // 订单拼接
          let orderList = [];
          res.orderListVos &&
            res.orderListVos.forEach(item => {
              orderList.push(item.name);
            });
          this.dialogContent.orderList = orderList.length
            ? orderList.join("、")
            : "暂无";
          this.$set(this, "dialogContentVisible", true);
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    // 修改广告主通知人
    updateNotifiers() {
      // 添加通知人邮箱校验
      let reg = new RegExp(
        "^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$"
      ); //邮箱正则表达式
      let notifiData = this.dialogContent.notifiers.split(";");
      let notifiRight = true;
      notifiData.filter(item => {
        if (!item || reg.test(item)) return;
        else {
          notifiRight = false;
        }
      });
      if (!notifiRight) {
        this.$message({
          showClose: true,
          message: "邮箱填写有误",
          type: "error"
        });
        return;
      }

      const param = {
        advertiserId: this.dialogContent.advertiserId,
        notifiers: this.dialogContent.notifiers
      };
      updateNotifierConfig(param)
        .then(res => {
          this.$notify({
            title: "成功",
            message: "修改通知人成功",
            type: "success"
          });
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    }
  },
  mounted() {
    this.getAllAdvertiser();
  }
};
</script>

<style scoped>
.bottom {
  margin-bottom: 13px;
  line-height: 12px;
}

.button {
  padding: 0.5em;
  margin-top: 3em;
  margin-left: 1em;
  float: right;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.tagLoading {
  width: 100%;
  line-height: 6em;
  text-align: center;
  font-size: 30px;
  color: #6c92b9;
}

.tagNoneData {
  width: 100%;
  line-height: 15em;
  text-align: center;
  font-size: 30px;
  color: #6c92b9;
}

.dialog-content-name {
  display: inline-block;
  overflow: hidden;
  max-width: 100%;
  height: 1.2em;
}

.search-input {
  position: absolute;
  float: right;
  right: 1em;
  width: 12em;
  z-index: 99;
}
</style>

<style lang="scss">
.confirm-list-scrollbar {
  height: calc(90vh - 150px);
}
</style>
