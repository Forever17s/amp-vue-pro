<template>
  <py-row type="flex" justify="space-around">
    <py-col :xs="24" :sm="20" :md="16" :lg="16" :xl="16" style="min-width: 400px">
      <py-card>
        <py-steps :active="step" finish-status="success">
          <py-step title="添加名称"></py-step>
          <py-step title="上传排期"></py-step>
          <py-step title="生成分配规则"></py-step>
        </py-steps>
        <div class="main-content">
          <div v-if="step == 0">
            <py-form
              :model="form"
              :rules="rules"
              ref="form"
              label-width="100px"
              size="medium "
              class="step1-form"
            >
              <py-form-item label="名称" prop="name" class="form-name-item">
                <py-row>
                  <py-col :span="12">
                    <py-input v-model="form.name"></py-input>
                  </py-col>
                </py-row>
              </py-form-item>
            </py-form>
          </div>
          <div v-if="step == 1">
            <py-row>
              <py-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" >
                <py-card class="box-card">
                  <!--
                    action为upload的地址，我们在before里将文件上传，随便填一个就好
                  -->
                  <div class="upload-desc">
                    上传东风日产项目订单排期表
                    <py-upload
                      class="upload-demo"
                      drag
                      action="ipinyou"
                      multiple
                      :before-upload="uploadDealAlgoSplitKpi"
                    >
                      <i class="py-icon-upload"></i>
                      <div class="py-upload__text">
                        将文件拖到此处，或<em>点击上传</em>
                      </div>
                    </py-upload>
                    <div>
                      <py-tag class="file-upload-name">{{
                        file.dealAlgoSplitKpi
                      }}</py-tag>
                      <py-button type="text" @click="downLoadDealAlgoSplitKpi"
                        >下载查看</py-button
                      >
                    </div>
                  </div>
                </py-card>
              </py-col>
              <py-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" >
                <py-card class="box-card">
                  <!--
                    action为upload的地址，我们在before里将文件上传，随便填一个就好
                  -->
                  <div class="upload-desc">
                    上传东风日产参与分配Deal表
                    <py-upload
                      class="upload-demo"
                      drag
                      action="ipinyou"
                      multiple
                      :before-upload="uploadDealAlgoKpi"
                    >
                      <i class="py-icon-upload"></i>
                      <div class="py-upload__text">
                        将文件拖到此处，或<em>点击上传</em>
                      </div>
                    </py-upload>
                    <div>
                      <py-tag class="file-upload-name">{{
                        file.dealAlgoKpi
                      }}</py-tag>
                      <py-button type="text" @click="downLoadDealAlgoKpi"
                        >下载查看</py-button
                      >
                    </div>
                  </div>
                </py-card>
              </py-col>
            </py-row>
          </div>
          <div v-if="step == 2">
            <div v-if="table.showDealAlgoSplitKpiTable" style="width: 94%">
              <span class="table-name">东风日产项目订单排期表</span>
              <py-table
                :data="table.dealAlgoSplitKpiList"
                key="dealAlgoSplitKpiList"
                v-loading="table.loading"
                table-search
                table-pagination
                border
                stripe
                @sort-change="sortChange"
                empty-text="暂无数据"
                :default-sort="{ prop: 'id', order: 'descending' }"
                style="width: 100%;margin-top: -40px;float: left"
              >
                <py-table-column prop="id" label="" width="1" sortable="custom">
                  <template slot-scope="scope"> </template>
                </py-table-column>
                <py-table-column
                  prop="orderIds"
                  label="订单ID"
                  sortable="custom"
                  :show-overflow-tooltip="true"
                  min-width="100"
                >
                </py-table-column>
                <py-table-column
                  prop="lineItemIds"
                  label="计划ID"
                  sortable="custom"
                  :show-overflow-tooltip="true"
                  min-width="100"
                >
                </py-table-column>
                <py-table-column
                  prop="date"
                  label="日期"
                  sortable="custom"
                  :show-overflow-tooltip="true"
                  min-width="150"
                >
                </py-table-column>
                <py-table-column
                  prop="predictCost"
                  label="预估cost(元)"
                  sortable="custom"
                  :show-overflow-tooltip="true"
                  min-width="150"
                >
                </py-table-column>
                <py-table-column
                  prop="predictImp"
                  label="预估imp(千次)"
                  sortable="custom"
                  :show-overflow-tooltip="true"
                  min-width="150"
                >
                </py-table-column>
              </py-table>
            </div>
            <div v-if="!table.showDealAlgoSplitKpiTable" style="width: 94%">
              <span class="table-name">东风日产参与分配Deal表</span>
              <py-table
                :data="table.dealAlgoKpiList"
                key="dealAlgoKpiList"
                v-loading="table.loading"
                table-search
                table-pagination
                stripe
                border
                @sort-change="sortChange"
                empty-text="暂无数据"
                :default-sort="{ prop: 'id', order: 'descending' }"
                style="width: 100%;margin-top: -40px;float: left"
              >
                <py-table-column prop="id" label="" width="1" sortable="custom">
                  <template slot-scope="scope"> </template>
                </py-table-column>
                <py-table-column
                  prop="dealId"
                  label="dealId"
                  sortable="custom"
                  :show-overflow-tooltip="true"
                  min-width="100"
                >
                </py-table-column>
                <py-table-column
                  prop="exchangeDealId"
                  label="媒体DealID"
                  sortable="custom"
                  :show-overflow-tooltip="true"
                  min-width="100"
                >
                </py-table-column>
                <py-table-column
                  prop="predictCost"
                  label="预估cost(元)"
                  sortable="custom"
                  :show-overflow-tooltip="true"
                  min-width="150"
                >
                </py-table-column>
                <py-table-column
                  prop="predictImp"
                  label="预估imp(千次)"
                  sortable="custom"
                  :show-overflow-tooltip="true"
                  min-width="150"
                >
                </py-table-column>
                <py-table-column
                  prop="improveCtr"
                  label="是否优化CTR"
                  sortable="custom"
                  min-width="150"
                >
                  <template slot-scope="scope">
                    <py-switch
                      v-model="scope.row.improveCtr"
                      active-text="已优化"
                      inactive-text="未优化"
                      :width="80"
                      disabled
                    >
                    </py-switch>
                  </template>
                </py-table-column>
              </py-table>
            </div>
            <py-menu
              class="py-menu-vertical"
              @select="handleSelect"
              :collapse="true"
            >
              <py-menu-item index="1">
                <i class="fa fa-exchange"></i>
                <span slot="title">切换表格</span>
              </py-menu-item>
              <!-- <py-menu-item index="2"> -->
              <!-- <i class="py-icon-menu"></i> -->
              <!-- <span slot="title">生成分配规则</span> -->
              <!-- </py-menu-item> -->
            </py-menu>
          </div>
        </div>
        <div style="width: 100%;text-align: center">
          <py-button-group>
            <py-button v-if="step > 0" @click="lastStep">上一步</py-button>
            <py-button v-if="step <= 2" @click="nextStep">{{
              step == "2" ? "生成分配规则" : "下一步"
            }}</py-button>
          </py-button-group>
        </div>
      </py-card>
    </py-col>
  </py-row>
</template>

<script>
import {
  pdbAlgoRulegetRule,
  pdbAlgoRuleaddAndUpdateRule,
  pdbAlgoRuleUploadDealAlgoSplitKpi,
  pdbAlgoRuleUploadDealAlgoKpi,
  pdbAlgoRuleDownloadDealAlgoKpi,
  pdbAlgoRuleDownloadDealAlgoSplitKpi,
  pdbAlgoRulegetDealAlgoList,
  pdbAlgoRuleGenerateRules
} from "api";
import { downloadFile } from "../../../common/utils/download";
export default {
  data() {
    return {
      step: 0, // 进行步骤
      form: { name: "" }, // 初始化表格
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }, // 表格校验规则
      ruleId: 0, // 提交完名称后返回ruleId做后续操作使用
      file: {
        dealAlgoSplitKpi: "东风日产项目订单排期表.xlsx", // 东风日产项目订单排期表文件名
        dealAlgoKpi: "东风日产参与分配Deal表.xlsx" // 东风日产参与分配Deal表文件名
      },
      table: {
        showDealAlgoSplitKpiTable: true, // 默认展示东风日产项目订单排期表
        loading: true,
        dealAlgoSplitKpiList: [], // 东风日产项目订单排期表数据
        dealAlgoKpiList: [] // 东风日产参与分配Deal表数据
      }
    };
  },
  methods: {
    // step1 名称提交
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let param = new FormData();
          param.append("ruleId", this.ruleId);
          param.append("name", this.form.name);
          pdbAlgoRuleaddAndUpdateRule(param)
            .then(res => {
              // 提交完成，进行下一步操作
              // 创建初始化ruleId,更新重置ruleId，更新一般返回的id和本地存的、url传过来的id一致
              this.ruleId = res.id;
              this.step++;
            })
            .catch(error => {
              this.$notify.error({
                title: "错误",
                message: error.message
              });
            });
        } else {
          return false;
        }
      });
    },
    // step2 上传排期 和 下载查看
    uploadDealAlgoSplitKpi(file) {
      // 上传东风日产项目订单排期表
      let param = new FormData();
      param.append("ruleId", this.ruleId);
      param.append("dealAlgoSplitKpi", file); //传文件
      pdbAlgoRuleUploadDealAlgoSplitKpi(param)
        .then(res => {
          this.file.dealAlgoSplitKpi = file.name;
          this.$message({
            showClose: true,
            message: "上传成功",
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
      return false; // false后文件就不会通过action上传
    },
    uploadDealAlgoKpi(file) {
      // 上传东风日产参与分配Deal表
      let param = new FormData();
      param.append("ruleId", this.ruleId);
      param.append("dealAlgoKpi", file); //传文件
      pdbAlgoRuleUploadDealAlgoKpi(param)
        .then(res => {
          this.file.dealAlgoKpi = file.name;
          this.$message({
            showClose: true,
            message: "上传成功",
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
      return false; // false后文件就不会通过action上传
    },
    downLoadDealAlgoSplitKpi() {
      // 下载查看东风日产项目订单排期表
      const params = { ruleId: this.ruleId };
      pdbAlgoRuleDownloadDealAlgoSplitKpi(params)
        .then(res => {
          // 处理返回的文件流
          downloadFile(res, "东风日产项目订单排期表.xlsx");
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    downLoadDealAlgoKpi() {
      // 下载查看东风日产参与分配Deal表
      const params = { ruleId: this.ruleId };
      pdbAlgoRuleDownloadDealAlgoKpi(params)
        .then(res => {
          // 处理返回的文件流
          downloadFile(res, "东风日产参与分配Deal表.xlsx");
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    // step3 表格数据展示和生成分配规则
    getDealAlgoList() {
      // 初始化订单排期表和参与分配Deal表的列表
      const params = { ruleId: this.ruleId };
      pdbAlgoRulegetDealAlgoList(params)
        .then(res => {
          this.table.loading = false;
          this.table.dealAlgoKpiList = res.dealAlgoKpiList;
          this.table.dealAlgoSplitKpiList = res.dealAlgoSplitKpiList;
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    handleSelect(key, keyPath) {
      // 右侧工具按钮。切换表格、生成流量分配规则
      switch (key) {
        case "1": // 切换表格，初始为订单排期表
          this.table.showDealAlgoSplitKpiTable = !this.table
            .showDealAlgoSplitKpiTable;
          break;
        default:
      }
    },
    generateRules() {
      // 生成流量分配规则
      const params = { ruleId: this.ruleId };
      pdbAlgoRuleGenerateRules(params)
        .then(res => {
          this.$notify({
            title: "成功",
            dangerouslyUseHTMLString: true,
            message:
              '生成流量分配规则完成，<a style="color: orangered;" href="/#/business/kpialgorithm">点击</a>返回列表页',
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
    // 上一步
    lastStep() {
      this.step--;
    },
    // 下一步
    nextStep() {
      switch (this.step) {
        case 0:
          this.submitForm();
          break;
        case 1:
          this.getDealAlgoList();
          this.step++;
          break;
        case 2:
          this.generateRules();
          break;
        default:
          break;
      }
    },
    // 表格排序
    sortChange(column) {
      this.table.dealAlgoKpiList.sort(
        this.getDataSort(column.order, column.prop)
      );
      this.table.dealAlgoSplitKpiList.sort(
        this.getDataSort(column.order, column.prop)
      );
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
    // 初始化表单信息
    const itemId = this.$route.params.id;
    // id为0，则为创建，不为0为修改获取当前id下的数据
    if (!parseInt(itemId)) return;
    this.ruleId = itemId;
    const para = { ruleId: itemId };
    pdbAlgoRulegetRule(para)
      .then(res => {
        this.form.name = res.name;
      })
      .catch(error => {
        this.$notify.error({
          title: "查看错误",
          message: error.message
        });
      });
  }
};
</script>

<style scoped>
.main-content {
  width: 100%;
  margin: 10px 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: Center;
  min-height: calc(85vh - 200px);
}
.upload-desc {
  text-align: center;
  font-size: 18px;
  color: #b87474;
}

.file-upload-name {
  margin-top: 8px;
}

.upload-demo {
  margin-top: 10px;
}

.form-name-item {
  width: 50rem;
  max-width: 400px;
}

.step-teble {
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-name {
  font-size: 1.4rem;
  display: inline-block;
  width: 100%;
  text-align: center;
  margin-bottom: 15px;
}

.py-menu-vertical {
  width: 6%;
  float: right;
  right: -21px;
  /*top: 20vh;*/
}
</style>
