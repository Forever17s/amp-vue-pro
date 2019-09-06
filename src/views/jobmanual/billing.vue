<template>
  <py-row
    type="flex"
    justify="space-around"
    align="middle"
    style="min-height: 80vh;"
  >
    <py-col :span="16" style="min-width: 500px">
      <py-card>
        <py-col :span="18" :offset="3" class="colItem">
          <span>手工访问此地址，处理今天开始生效的费率</span>
          <py-button
            type="primary"
            @click="manualVisit"
            v-bind:disabled="manualVisitBtn"
            :loading="manualVisitBtn"
            >手工访问</py-button
          >
        </py-col>
        <py-col :span="18" :offset="3" class="colItem">
          <p>从OPM同步指定时间之后的广告主审核状态数据到amp</p>
          <py-date-picker
            v-model="auditSyncTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerDays"
          >
          </py-date-picker>
          <py-button
            type="primary"
            @click="auditSyncHandle"
            v-bind:disabled="auditSyncHandleBtn"
            :loading="auditSyncHandleBtn"
            >开始同步</py-button
          >
        </py-col>
        <py-col :span="18" :offset="3" class="colItem">
          <p>从OPM同步指定时间之后的创意审核（不带监测）数据到amp</p>
          <py-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20">
            <py-date-picker
              v-model="nocteasTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerDays"
            >
            </py-date-picker>
            <py-button
              type="primary"
              @click="nocteasHandle"
              v-bind:disabled="nocteasHandleBtn"
              :loading="nocteasHandleBtn"
              >开始同步
            </py-button>
          </py-col>
          <py-col :xs="24" :sm="4" :md="4" :lg="4" :xl="4" style="height: 2rem">
            <py-copy
              class="copyIcon"
              :content="getOperateUrl('nocteas')"
              tipWords="复制链接"
              iconClass="py-icon-share"
            ></py-copy>
          </py-col>
        </py-col>
        <py-col :span="18" :offset="3" class="colItem">
          <p>从OPM同步指定时间之后的创意审核（带监测）数据到amp</p>
          <py-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20">
            <py-date-picker
              v-model="cteasTime"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerDays"
            >
            </py-date-picker>
            <py-button
              type="primary"
              @click="cteasHandle"
              v-bind:disabled="cteasHandleBtn"
              :loading="cteasHandleBtn"
              >开始同步</py-button
            >
          </py-col>
          <py-col :xs="24" :sm="4" :md="4" :lg="4" :xl="4" style="height: 2rem">
            <py-copy
              class="copyIcon"
              :content="getOperateUrl('cteas')"
              tipWords="复制链接"
              iconClass="py-icon-share"
            ></py-copy>
          </py-col>
        </py-col>
        <py-col :span="18" :offset="3" class="colItem">
          <p>手动处理rpt_day_stats</p>
          <py-date-picker
            v-model="rptDayStatsTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerCycle"
          >
          </py-date-picker>
          <py-button
            type="primary"
            @click="rptDayStatsHandle"
            v-bind:disabled="rptDayStatsHandleBtn"
            :loading="rptDayStatsHandleBtn"
            >手动处理</py-button
          >
        </py-col>
        <py-col :span="18" :offset="3" class="colItem">
          <span>定时发送差异邮件</span>
          <py-button
            type="primary"
            @click="costcompareHandle"
            v-bind:disabled="costcompareHandleBtn"
            :loading="costcompareHandleBtn"
            >开始发送</py-button
          >
        </py-col>
        <py-col :span="18" :offset="3" class="colItem">
          <span>监控修复创意审核（无监测）数据</span>
          <py-button
            type="primary"
            @click="noTrackingHandle"
            v-bind:disabled="noTrackingHandleBtn"
            :loading="noTrackingHandleBtn"
            >开始修复</py-button
          >
        </py-col>
        <py-col :span="18" :offset="3" class="colItem">
          <span>监控修复创意审核（有监测）数据</span>
          <py-button
            type="primary"
            @click="hasTrackingHandle"
            v-bind:disabled="hasTrackingHandleBtn"
            :loading="hasTrackingHandleBtn"
            >开始修复</py-button
          >
        </py-col>
        <py-col :span="18" :offset="3" class="colItem colLast">
          <p>重新同步计划</p>
          <py-input
            style="width: 250px;"
            v-model="synLineItemIds"
            placeholder="输入计划Id 分号；分割"
          ></py-input>
          <py-button
            type="primary"
            @click="synLineItemHandle"
            v-bind:disabled="synLineItemHandleBtn"
            :loading="synLineItemHandleBtn"
            >开始同步</py-button
          >
        </py-col>
      </py-card>
    </py-col>
  </py-row>
</template>

<script>
  import {
    parameterProcess,
    setAuditSync,
    setNocteas,
    setCteas,
    setRptDayStats,
    setCostcompare,
    repairCreativeNoTracking,
    repairCreativeHasTracking,
    setSynLineItem
  } from 'api'
  export default {
    data() {
      return {
        pickerDays: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            },
            {
              text: '一周前',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            }
          ]
        },
        pickerCycle: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        },
        auditSyncTime: new Date(),
        rptDayStatsTime: [new Date(), new Date()],
        nocteasTime: new Date(),
        cteasTime: new Date(),
        synLineItemIds: null,
        manualVisitBtn: false,
        auditSyncHandleBtn: false,
        nocteasHandleBtn: false,
        cteasHandleBtn: false,
        rptDayStatsHandleBtn: false,
        costcompareHandleBtn: false,
        noTrackingHandleBtn: false,
        hasTrackingHandleBtn: false,
        synLineItemHandleBtn: false
      }
    },
    methods: {
      // 获取操作链接
      getOperateUrl(type) {
        let domain = window.location.host,
          param = ''
        switch (type) {
          case 'cteas':
            param = this.formatDate(this.cteasTime)
            return `${domain}/api/jobManual/cteas/?time=${param}`
          case 'nocteas':
            param = this.formatDate(this.nocteasTime)
            return `${domain}/api/jobManual/nocteas/?time=${param}`
          default:
            return null
        }
      },
      //手工访问
      manualVisit() {
        this.$set(this, 'manualVisitBtn', true)
        parameterProcess()
          .then(res => {
            this.$set(this, 'manualVisitBtn', false)
            this.$notify({
              title: '成功',
              message: '手工访问成功',
              type: 'success',
              duration: 0
            })
          })
          .catch(error => {
            this.$set(this, 'manualVisitBtn', false)
            this.$notify.error({
              title: '手工访问失败',
              message: error.message,
              duration: 0
            })
          })
      },
      //从OPM同步指定时间之后的广告主审核状态数据到amp
      auditSyncHandle() {
        this.$set(this, 'auditSyncHandleBtn', true)
        let para = this.formatDate(this.auditSyncTime)
        setAuditSync(para)
          .then(res => {
            this.$set(this, 'auditSyncHandleBtn', false)
            this.$notify({
              title: '成功',
              message: '同步广告主审核状态成功',
              type: 'success',
              duration: 0
            })
          })
          .catch(error => {
            this.$set(this, 'auditSyncHandleBtn', false)
            this.$notify.error({
              title: '同步广告主审核状态失败',
              message: error.message,
              duration: 0
            })
          })
      },
      //从OPM同步指定时间之后的创意审核（不带监测）数据到amp
      nocteasHandle() {
        this.$set(this, 'nocteasHandleBtn', true)
        let para = this.formatDate(this.nocteasTime)
        setNocteas(para)
          .then(res => {
            this.$set(this, 'nocteasHandleBtn', false)
            this.$notify({
              title: '成功',
              message: '同步创意审核（不带监测）成功',
              type: 'success',
              duration: 0
            })
          })
          .catch(error => {
            this.$set(this, 'nocteasHandleBtn', false)
            this.$notify.error({
              title: '同步创意审核（不带监测）失败',
              message: error.message,
              duration: 0
            })
          })
      },
      //从OPM同步指定时间之后的创意审核（带监测）数据到amp
      cteasHandle() {
        this.$set(this, 'cteasHandleBtn', true)
        let para = this.formatDate(this.cteasTime)
        setCteas(para)
          .then(res => {
            this.$set(this, 'cteasHandleBtn', false)
            this.$notify({
              title: '成功',
              message: '同步创意审核（带监测）成功',
              type: 'success',
              duration: 0
            })
          })
          .catch(error => {
            this.$set(this, 'cteasHandleBtn', false)
            this.$notify.error({
              title: '同步创意审核（带监测）失败',
              message: error.message,
              duration: 0
            })
          })
      },
      //手动处理rpt_day_stats
      rptDayStatsHandle() {
        this.$set(this, 'rptDayStatsHandleBtn', true)
        let para = {
          beginDate: this.formatRoughDate(this.rptDayStatsTime[0]),
          endDate: this.formatRoughDate(this.rptDayStatsTime[1])
        }
        setRptDayStats(para)
          .then(res => {
            this.$set(this, 'rptDayStatsHandleBtn', false)
            this.$notify({
              title: '成功',
              message: '手动处理成功',
              type: 'success',
              duration: 0
            })
          })
          .catch(error => {
            this.$set(this, 'rptDayStatsHandleBtn', false)
            this.$notify.error({
              title: '手动处理失败',
              message: error.message,
              duration: 0
            })
          })
      },
      // 定时发送差异邮件
      costcompareHandle() {
        this.$set(this, 'costcompareHandleBtn', true)
        setCostcompare()
          .then(res => {
            this.$set(this, 'costcompareHandleBtn', false)
            this.$notify({
              title: '成功',
              message: '定时发送差异邮件成功',
              type: 'success',
              duration: 0
            })
          })
          .catch(error => {
            this.$set(this, 'costcompareHandleBtn', false)
            this.$notify.error({
              title: '定时发送差异邮件失败',
              message: error.message,
              duration: 0
            })
          })
      },
      // 监控修复创意审核（无监测）数据
      noTrackingHandle() {
        this.$set(this, 'noTrackingHandleBtn', true)
        repairCreativeNoTracking()
          .then(res => {
            this.$set(this, 'noTrackingHandleBtn', false)
            this.$notify({
              title: '成功',
              message: '监控修复创意审核（无监测）数据成功',
              type: 'success',
              duration: 0
            })
          })
          .catch(error => {
            this.$set(this, 'noTrackingHandleBtn', false)
            this.$notify.error({
              title: '监控修复创意审核（无监测）数据失败',
              message: error.message,
              duration: 0
            })
          })
      },
      // 监控修复创意审核（有监测）数据
      hasTrackingHandle() {
        this.$set(this, 'hasTrackingHandleBtn', true)
        repairCreativeHasTracking()
          .then(res => {
            this.$set(this, 'hasTrackingHandleBtn', false)
            this.$notify({
              title: '成功',
              message: '监控修复创意审核（有监测）数据成功',
              type: 'success',
              duration: 0
            })
          })
          .catch(error => {
            this.$set(this, 'hasTrackingHandleBtn', false)
            this.$notify.error({
              title: '监控修复创意审核（有监测）数据失败',
              message: error.message,
              duration: 0
            })
          })
      },
      // 重新同步计划
      synLineItemHandle() {
        this.$set(this, 'synLineItemHandleBtn', true)
        let para = {
          lineIds: this.synLineItemIds.trim().split(/[;；]/)
        }
        setSynLineItem(para)
          .then(res => {
            this.$set(this, 'synLineItemHandleBtn', false)
            this.$notify({
              title: '成功',
              message: '重新同步计划成功',
              type: 'success',
              duration: 0
            })
          })
          .catch(error => {
            this.$set(this, 'synLineItemHandleBtn', false)
            this.$notify.error({
              title: '重新同步计划失败',
              message: error.message,
              duration: 0
            })
          })
      },
      //将标准时间转换为yyyy-MM-dd HH:mm:ss 格式
      formatDate(date) {
        let dateTime =
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate() +
          ' ' +
          date.getHours() +
          ':' +
          date.getMinutes() +
          ':' +
          date.getSeconds()
        return dateTime
      },
      //将标准时间转换为yyyy-MM-dd格式
      formatRoughDate(date) {
        let dateTime =
          date.getFullYear() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getDate()
        return dateTime
      }
    }
  }
</script>

<style scoped>
  .colItem {
    padding: 10px;
    /*margin-bottom: 10px;*/
    border-bottom: 1px lightgrey dashed;
    text-align: center;
  }
  .colLast {
    margin-bottom: 30px;
  }
  .copyIcon {
    font-size: 2rem;
    margin-left: 5px;
    opacity: 0.8;
  }
</style>
