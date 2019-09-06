<template>
  <py-card>
    <py-row type="flex" justify="center">
      <py-col :xs="24" :sm="12">
        <py-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="100px"
          size="medium "
        >
          <py-form-item v-if="form.id" label="任务ID">
            <py-input
              style="width: 200px"
              v-model="form.id"
              :disabled="true"
            ></py-input>
          </py-form-item>
          <py-form-item label="任务名称" prop="name">
            <py-input style="width: 200px" v-model="form.name"></py-input>
          </py-form-item>
          <py-form-item label="监听状态" prop="active">
            <py-switch
              v-model="form.active"
              active-text="开启"
              inactive-text="关闭"
            >
            </py-switch>
          </py-form-item>
          <py-form-item label="任务分组" prop="groupName">
            <py-select
              v-model="form.groupName"
              @change="changeGroup"
              placeholder="请选择任务分组"
            >
              <py-option
                v-for="item in form.groupNameEnums"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </py-option>
            </py-select>
          </py-form-item>
          <py-form-item label="时间表达式" prop="cronExpression">
            <py-select
              v-model="form.cronExpression"
              filterable
              allow-create
              size="large"
              :disabled="form.auxiliaryState"
              placeholder="选择、手动和辅助输入"
            >
              <py-option
                v-for="item in form.cronExpressionGroup"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </py-option>
            </py-select>
            <py-button
              type="text"
              style="margin-left: 40px"
              @click="changeAuxiliaryState"
              >{{ form.auxiliaryState ? '关闭辅助' : '打开辅助' }}</py-button
            >
          </py-form-item>
          <py-form-item
            label=""
            prop="cronAuxiliary"
            v-show="form.auxiliaryState"
          >
            <py-input-number
              v-model="form.cronAuxiliary.second"
              controls-position="right"
              :min="0"
              :max="59"
              size="small"
              @change="auxiliaryChange('second', $event);"
            ></py-input-number
            >&nbsp;秒&nbsp;
            <py-input-number
              v-model="form.cronAuxiliary.mStart"
              controls-position="right"
              :min="0"
              :max="59"
              size="small"
              @change="auxiliaryChange('mStart', $event);"
            ></py-input-number
            >&nbsp;分钟开始,每&nbsp;
            <py-input-number
              v-model="form.cronAuxiliary.mEnd"
              controls-position="right"
              :min="1"
              :max="59"
              size="small"
              @change="auxiliaryChange('mEnd', $event);"
            ></py-input-number
            >&nbsp;分钟执行一次
          </py-form-item>
          <py-form-item label="监控类型" prop="type">
            <py-select v-model="form.type" placeholder="请选择监控类型">
              <py-option
                v-for="item in form.monitorTypeEnums"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </py-option>
            </py-select>
          </py-form-item>
          <py-form-item label="监控脚本" prop="queryScript">
            <py-col :xs="24" :sm="20"
              ><py-input type="textarea" v-model="form.queryScript"></py-input
            ></py-col>
            <py-col :xs="24" :sm="4" style="text-align: center"
              ><py-button type="text" @click="sqlTest"
                >执行测试</py-button
              ></py-col
            >
          </py-form-item>
          <py-form-item label="严重程度" prop="level">
            <py-select v-model="form.level" placeholder="请选择严重程度">
              <py-option
                v-for="item in form.levelEnums"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </py-option>
            </py-select>
          </py-form-item>
          <py-form-item label="问题的原因" prop="reason">
            <py-row>
              <py-col :span="24">
                <py-input type="textarea" v-model="form.reason"></py-input>
              </py-col>
            </py-row>
          </py-form-item>
          <py-form-item label="线索" prop="leads">
            <py-row>
              <py-col :span="24">
                <py-input type="textarea" v-model="form.leads"></py-input>
              </py-col>
            </py-row>
          </py-form-item>
          <py-form-item label="处理建议" prop="suggest">
            <py-row>
              <py-col :span="24">
                <py-input type="textarea" v-model="form.suggest"></py-input>
              </py-col>
            </py-row>
          </py-form-item>
          <py-form-item label="立即报警" prop="immediate">
            <py-switch
              v-model="form.immediate"
              active-text="开启"
              inactive-text="关闭"
            >
            </py-switch>
            <py-tooltip
              effect="light"
              content="立即报警：第一次触发立即报警通知。非立即报警，第二次触发才进行报警通知"
              placement="right"
            >
              <i class="py-icon-bell noticeWarning"></i>
            </py-tooltip>
          </py-form-item>
          <py-form-item label="处理方式" prop="operationMode">
            <py-radio-group v-model="form.operationMode">
              <py-radio
                v-for="item in form.operationModeEnums"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </py-radio>
            </py-radio-group>
          </py-form-item>
          <py-form-item label="通知方式" prop="notice">
            <py-radio-group v-model="form.notice">
              <py-radio
                v-for="item in form.noticeEnums"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </py-radio>
            </py-radio-group>
          </py-form-item>
          <py-form-item label="通知人" prop="notifications">
            <py-row type="flex" justify="space-between">
              <py-col :span="24">
                <py-input
                  type="textarea"
                  v-model="form.notifications"
                  placeholder="通知人邮箱，多个请用分号分割"
                  @input="EnterPress"
                ></py-input>
              </py-col>
            </py-row>
          </py-form-item>
          <div style="width: 300px;margin: 0 auto;">
            <py-row type="flex" justify="space-around">
              <py-col :span="8" style="text-align: center"
                ><py-button @click="returnHome();">返回</py-button></py-col
              >
              <py-col :span="8" style="text-align: center"
                ><py-button @click="resetForm('form');">重置</py-button></py-col
              >
              <py-col :span="8" style="text-align: center"
                ><py-button type="primary" @click="submitForm('form');">
                  {{ isEdit ? '更新' : '创建' }}
                </py-button></py-col
              >
            </py-row>
          </div>
        </py-form>
      </py-col>
    </py-row>
  </py-card>
</template>

<script>
  import {
    getGroupEnums,
    getOneMonitor,
    createMonitor,
    setUpdate,
    testScript
  } from 'api';
  const defaultForm = {
    id: null,
    name: '',
    groupNameEnums: [],
    groupName: '',
    cronExpression: '',
    auxiliaryState: false,
    cronAuxiliary: {
      second: 30,
      mStart: 30,
      mEnd: 30
    },
    cronExpressionGroup: [
      //            {
      //              value: '0/10 * * * * ?',
      //              label: '10秒执行一次(0/10 * * * * ?)'
      //            },{
      //              value: '0/30 * * * * ?',
      //              label: '30秒执行一次(0/30 * * * * ?)'
      //            },
      {
        value: '0 0/1 * * * ?',
        label: '1分钟执行一次(0 0/1 * * * ?)'
      },
      {
        value: '0 0/5 * * * ?',
        label: '5分钟执行一次(0 0/5 * * * ?)'
      },
      {
        value: '0 0/15 * * * ?',
        label: '15分钟执行一次(0 0/15 * * * ?)'
      },
      {
        value: '0 0/30 * * * ?',
        label: '30分钟执行一次(0 0/30 * * * ?)'
      },
      {
        value: '0 0 0/1 * * ?',
        label: '1小时执行一次(0 0 0/1 * * ?)'
      },
      {
        value: '0 0 0-6 * * ?',
        label: '6小时执行一次(0 0 0-6 * * ?)'
      },
      {
        value: '0 0 0-12 * * ?',
        label: '12小时执行一次(0 0 0-12 * * ?)'
      },
      {
        value: '0 0 0 1/1 * ?',
        label: '1天执行一次(0 0 0 1/1 * ?)'
      }
    ],
    monitorTypeEnums: [
      {
        value: '投放状态',
        label: '投放状态'
      },
      {
        value: '审核',
        label: '审核'
      },
      {
        value: '和钱有关',
        label: '和钱有关'
      },
      {
        value: '定向不一致',
        label: '定向不一致'
      },
      {
        value: '登录失败情况',
        label: '登录失败情况'
      },
      {
        value: '定时任务',
        label: '定时任务'
      },
      {
        value: '报表相关',
        label: '报表相关'
      },
      {
        value: 'presto相关',
        label: 'presto相关'
      },
      {
        value: '其它',
        label: '其它'
      }
    ],
    type: '投放状态',
    queryScript: '',
    levelEnums: [
      {
        value: 'info',
        label: '通知（info）'
      },
      {
        value: 'warn',
        label: '警告（warn）'
      },
      {
        value: 'error',
        label: '错误（error）'
      },
      {
        value: 'serious',
        label: '严重（serious）'
      }
    ],
    level: 'info',
    reason: '',
    leads: '',
    suggest: '',
    operationModeEnums: [
      {
        value: 'manual',
        label: '手动'
      },
      {
        value: 'auto',
        label: '自动'
      }
    ],
    operationMode: 'auto',
    noticeEnums: [
      {
        value: 'mail',
        label: '邮件'
      },
      {
        value: 'wechat',
        label: '微信'
      },
      {
        value: 'all',
        label: '以上所有'
      }
    ],
    notice: 'mail',
    notifications: '',
    active: true,
    immediate: true
  };
  export default {
    name: 'MonitorDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        //初始化表格
        form: Object.assign({}, defaultForm),
        //表格校验规则
        rules: {
          name: [
            { required: true, message: '请输入监控名称', trigger: 'blur' }
          ],
          groupName: [
            { required: true, message: '请输入任务所属分组', trigger: 'blur' }
          ],
          cronExpression: [
            {
              required: true,
              message: '请输入任务时间设置表达式',
              trigger: 'blur'
            }
          ],
          type: [
            { required: true, message: '请输入监控类型', trigger: 'blur' }
          ],
          queryScript: [
            { required: true, message: '请输入监控脚本', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '请输入严重程度', trigger: 'blur' }
          ],
          reason: [
            {
              required: false,
              message: '请输入问题可能的原因',
              trigger: 'blur'
            }
          ],
          leads: [{ required: false, message: '请输入线索', trigger: 'blur' }],
          suggest: [
            { required: false, message: '请输入处理建议', trigger: 'blur' }
          ],
          operationMode: [
            { required: false, message: '请输入处理方式', trigger: 'blur' }
          ],
          notice: [
            { required: false, message: '请输入通知方式', trigger: 'blur' }
          ],
          notifications: [
            { required: true, message: '请输入通知信息', trigger: 'blur' },
            {
              type: 'string',
              message: '请输入正确的通知信息',
              trigger: 'blur,change'
            }
          ],
          active: [
            { required: false, message: '请输入监控状态', trigger: 'blur' }
          ]
        }
      };
    },
    computed: {},
    methods: {
      // 获取列表详情
      getFormDetail() {
        let para = {
          id: this.getId()
        };
        getOneMonitor(para)
          .then(res => {
            for (let item in res) {
              this.form[item] = res[item];
            }
            this.changeGroup(this.form.groupName);
          })
          .catch(error => {
            this.$notify.error({
              title: '查看错误',
              message: error.message
            });
          });
      },
      //通过改变分组状态改变检测脚本是否必填
      changeGroup(val) {
        let req = this.rules.queryScript[0];
        this.$set(req, 'required', val === 'sqlCheck');
      },
      //辅助功能开关
      changeAuxiliaryState() {
        let cronString = this.form.cronExpression;
        let cronData = cronString.split(' ');
        cronData.map((item, key) => {
          if (key === 0 && (item.indexOf('/') === -1 && item !== '*')) {
            this.form.cronAuxiliary.second = item;
          } else if (key === 1 && item.indexOf('/') !== -1) {
            this.form.cronAuxiliary.mStart = item.split('/')[0];
            this.form.cronAuxiliary.mEnd = item.split('/')[1];
          }
        });
        this.form.auxiliaryState = !this.form.auxiliaryState;
      },
      //改变时间表达式辅助功能
      auxiliaryChange(item, val) {
        this.form.cronAuxiliary[item] = val;
        this.changeCronExpression();
      },
      changeCronExpression() {
        let second = this.form.cronAuxiliary.second;
        let mStart = this.form.cronAuxiliary.mStart;
        let mEnd = this.form.cronAuxiliary.mEnd;
        this.form.cronExpression =
          second + ' ' + mStart + '/' + mEnd + ' * * * ?';
      },
      //监控测试
      sqlTest() {
        const { queryScript, type } = this.form;
        if (this.isNull(queryScript)) {
          this.$message({
            showClose: true,
            message: '请输入监控脚本',
            type: 'warning'
          });
        } else {
          const para = {
            queryScript,
            type
          };
          testScript(para)
            .then(res => {
              this.$message({
                showClose: true,
                message: '测试通过',
                type: 'success'
              });
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: error.message,
                type: 'error'
              });
            });
        }
      },
      //测试元素为空脚本
      isNull(str) {
        if (str === '') return true;
        let regu = '^[ ]+$';
        let re = new RegExp(regu);
        return re.test(str);
      },
      //修改监控提交
      submitForm(form) {
        let para = {
          active: this.form.active,
          immediate: this.form.immediate,
          cronExpression: this.form.cronExpression,
          groupName: this.form.groupName,
          leads: this.form.leads,
          level: this.form.level,
          name: this.form.name,
          notice: this.form.notice,
          notifications: this.form.notifications,
          operationMode: this.form.operationMode,
          queryScript: this.form.queryScript,
          reason: this.form.reason,
          suggest: this.form.suggest,
          type: this.form.type
        };
        this.$refs[form].validate(valid => {
          if (valid) {
            if (this.isEdit) {
              para.id = this.getId();
              setUpdate(para)
                .then(res => {
                  this.$notify({
                    title: '成功',
                    message: '监控更新成功',
                    type: 'success'
                  });
                  this.$router.push('/monitor');
                })
                .catch(error => {
                  this.$notify.error({
                    title: '监控更新错误',
                    message: error.message
                  });
                });
            } else {
              createMonitor(para)
                .then(res => {
                  this.$notify({
                    title: '成功',
                    message: '监控创建成功',
                    type: 'success'
                  });
                  this.$router.push('/monitor');
                })
                .catch(error => {
                  this.$notify.error({
                    title: '监控创建错误',
                    message: error.message
                  });
                });
            }
          } else {
            this.$notify.error({
              title: 'ERROR',
              message: '表格填充错误'
            });
            return false;
          }
        });
      },
      //重置表格
      resetForm(formName) {
        this.$refs[formName].resetFields();
        if (this.isEdit) this.getFormDetail();
      },
      //返回列表
      returnHome() {
        this.$router.push('/monitor');
      },
      //获取路由ID
      getId() {
        return this.$route.params && this.$route.params.id;
      },
      //添加多个通知人，输入监测
      EnterPress() {
        let reg = new RegExp(
          '^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$'
        ); //邮箱正则表达式
        let notifiData = this.form.notifications.split(';');
        let notifiRight = true;
        notifiData.filter(item => {
          if (!item || reg.test(item)) return;
          else {
            notifiRight = false;
          }
        });
        if (!notifiRight) this.rules.notifications[1].type = 'email';
        else {
          this.rules.notifications[1].type = 'string';
        }
      }
    },
    created() {
      // 获取任务分组选项
      getGroupEnums()
        .then(res => {
          const nameEnums = [];
          res.map(item => {
            nameEnums.push({
              label: item.describe,
              value: item.name
            });
          });
          this.form.groupNameEnums = nameEnums;
          if (this.form.groupNameEnums.length)
            this.form.groupName = this.form.groupNameEnums[0].value;
        })
        .catch(error => {
          this.$notify.error({
            title: '获取任务分组错误',
            message: error.message
          });
        });
      if (this.isEdit) {
        //初始化表单信息
        this.getFormDetail();
      }
    }
  };
</script>

<style scoped>
  .noticeWarning {
    font-size: 1rem;
    margin-left: 10px;
    cursor: pointer;
    opacity: 0.8;
    vertical-align: middle;
  }
</style>
