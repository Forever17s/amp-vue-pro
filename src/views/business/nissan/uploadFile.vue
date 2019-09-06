<template>
  <py-row>
    <py-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
      <py-card class="box-card">
        <!-- action为upload的地址，我们在before里将文件上传，随便填一个就好 -->
        <div class="upload-desc">
          上传东风日产项目deal和admaster广告位关联表
          <py-upload
            class="upload-demo"
            drag
            action="ipinyou"
            multiple
            :before-upload="dealAndAdmasterRelFileUpload"
          >
            <i class="py-icon-upload"></i>
            <div class="py-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <py-tag
              v-if="uploadFile.dealAndAdmasterRelFile"
              class="file-upload-name"
              >{{ uploadFile.dealAndAdmasterRelFile }}</py-tag
            >
          </py-upload>
          <div style="margin-bottom: -40px">
            <py-button
              type="primary"
              @click="$router.push('/business/uploadfile/DAlist');"
              >查看关联表</py-button
            >
          </div>
        </div>
      </py-card>
    </py-col>
    <py-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
      <py-card class="box-card">
        <div class="upload-desc">
          下载东风日产项目日报
          <div class="upload-demo">
            <py-date-picker
              v-model="NissanDay"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="NissanDaySelectOptions"
            >
            </py-date-picker>
            <py-button
              type="primary"
              @click="downloadNissanReport"
              style="margin: 10px"
              >下载</py-button
            >
          </div>
        </div>
        <div class="upload-desc">
          东风日产项目生成创意排期
          <div class="upload-demo">
            <py-date-picker
              v-model="generateScheduleDay"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="generateScheduleDaySelectOptions"
            >
            </py-date-picker>
            <py-button
              type="primary"
              @click="generateSchedule"
              style="margin: 10px"
              >生成排期</py-button
            >
          </div>
        </div>
      </py-card>
    </py-col>
    <py-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
      <py-card class="box-card">
        <!-- action为upload的地址，我们在before里将文件上传，随便填一个就好 -->
        <div class="upload-desc">
          上传东风日产项目admaster日报表
          <py-upload
            class="upload-demo"
            drag
            action="ipinyou"
            multiple
            :before-upload="admasterDayReportUpload"
          >
            <i class="py-icon-upload"></i>
            <div class="py-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <py-tag
              v-if="uploadFile.admasterDayReport"
              class="file-upload-name"
              >{{ uploadFile.admasterDayReport }}</py-tag
            >
          </py-upload>
        </div>
      </py-card>
    </py-col>
  </py-row>
</template>

<script>
import {
  uploadDealAndAdmasterRel,
  uploadAdmasterDayReport,
  downloadNissanDayReport,
  generateSchedule
} from "api";
import util from "../../../common/js/util";
import { downloadFile } from "../../../common/utils/download";
export default {
  data() {
    return {
      uploadFile: {
        dealAndAdmasterRelFile: null, // 东风日产项目订单排期表文件名
        admasterDayReport: null // 东风日产参与分配Deal表文件名
      },
      NissanDay: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()], // 下载东风日产项目日报日期
      NissanDaySelectOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "提前一天",
            onClick(picker) {
              const start = picker.$children[0].date;
              const end = picker.$children[1].date;
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "提前三天",
            onClick(picker) {
              const start = picker.$children[0].date;
              const end = picker.$children[1].date;
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "提前一周",
            onClick(picker) {
              const start = picker.$children[0].date;
              const end = picker.$children[1].date;
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }, // 下载东风日产项目日报日期选项
      generateScheduleDay: [
        new Date(),
        new Date(new Date().getTime() + 3600 * 1000 * 24 * 10)
      ], // 下载东风日产项目日报日期
      generateScheduleDaySelectOptions: {
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
      } // 下载东风日产项目日报日期选项
    };
  },
  methods: {
    // 上传东风日产项目deal和admaster广告位关联表
    dealAndAdmasterRelFileUpload(file) {
      let param = new FormData();
      param.append("dealAndAdmasterRelFile", file); //传文件
      uploadDealAndAdmasterRel(param)
        .then(res => {
          this.uploadFile.dealAndAdmasterRelFile = file.name;
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
    // 上传东风日产项目admaster日报表
    admasterDayReportUpload(file) {
      let param = new FormData();
      param.append("admasterDayReport", file); //传文件
      uploadAdmasterDayReport(param)
        .then(res => {
          this.uploadFile.admasterDayReport = file.name;
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
    // 下载东风日产项目日报
    downloadNissanReport() {
      const param = {
        begin_date: util.formatDate.format(this.NissanDay[0], "yyyy/MM/dd"),
        end_date: util.formatDate.format(this.NissanDay[1], "yyyy/MM/dd")
      };
      downloadNissanDayReport(param)
        .then(res => {
          // 处理返回的文件流
          downloadFile(res, "东风日产项目日报.xlsx");
        })
        .catch(error => {
          this.$notify.error({
            title: "错误",
            message: error.message,
            duration: 0
          });
        });
    },
    // 东风日产项目生成创意排期
    generateSchedule() {
      const param = {
        begin_date: util.formatDate.format(
          this.generateScheduleDay[0],
          "yyyy-MM-dd"
        ),
        end_date: util.formatDate.format(
          this.generateScheduleDay[1],
          "yyyy-MM-dd"
        )
      };
      this.$confirm(
        "操作将生成" +
          param.begin_date +
          "至" +
          param.end_date +
          "的排期, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        generateSchedule(param)
          .then(res => {
            // 处理返回的文件流
            this.$message({
              showClose: true,
              message: "东风日产项目生成创意排期成功",
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
      });
    }
  }
};
</script>

<style scoped>
.box-card {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-width: 400px;
  min-height: 400px;
  height: 33vw;
}

.upload-desc {
  padding: 30px;
  font-size: 18px;
  color: #b87474;
}

.file-upload-name {
  margin-top: 8px;
}

.upload-demo {
  margin-top: 10px;
}

.upload-date-picker {
  margin: 5px;
}
</style>
