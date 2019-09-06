import { ampMonitor, apmConsole } from '../common/utils/request'

const qs = require('qs')

// proxyTable将其代理为target指向
const monitorBase = '/mon'
const consoleBase = '/api'

// 登录登出
export const getLogin = params => ampMonitor.get(`${monitorBase}/login`, params)
export const postLogin = params =>
  ampMonitor.post(`${monitorBase}/login`, params)
export const logout = params =>
  ampMonitor.get(`${monitorBase}/logout`, { params })
export const getWeChatRelation = params =>
  ampMonitor.get(`${monitorBase}/login/isRelation`, { params })
export const cancelWeChatRelation = params =>
  ampMonitor.get(`${monitorBase}/login/cancelRelation`, { params })
export const postBindWeChat = params =>
  ampMonitor.post(`${monitorBase}/login/relation`, params)

// 获取用户信息、权限
export const getUserInfo = params =>
  ampMonitor.get(`${monitorBase}/user/info`, params)
export const getUserPermissions = params =>
  ampMonitor.get(`${monitorBase}/user/permissions`, params)

// 优驰监控
export const getMonitorList = params =>
  ampMonitor.get(`${monitorBase}/monitor/list`, { params })
export const setDelete = params =>
  ampMonitor.delete(`${monitorBase}/monitor/delete/${params.id}`)
export const setPause = params =>
  ampMonitor.put(`${monitorBase}/monitor/pause/${params.id}`)
export const setReschedule = params =>
  ampMonitor.put(`${monitorBase}/monitor/reschedule`, params)
export const setResume = params =>
  ampMonitor.put(`${monitorBase}/monitor/resume/${params.id}`)
export const setUpdate = params =>
  ampMonitor.put(`${monitorBase}/monitor/update`, params)
export const getGroupEnums = params =>
  ampMonitor.get(`${monitorBase}/monitor/getGroupEnums`)
export const getOneMonitor = params =>
  ampMonitor.get(`${monitorBase}/monitor/${params.id}`)
export const createMonitor = params =>
  ampMonitor.post(`${monitorBase}/monitor/create`, params)
export const testScript = params =>
  ampMonitor.post(`${monitorBase}/monitor/testScript`, params)
export const getExecute = params =>
  ampMonitor.get(`${monitorBase}/monitor/execute/${params.id}`)
export const subscribeMonitor = params =>
  ampMonitor.get(`${monitorBase}/monitor/subscribe/${params.id}`, params)
export const unsubscribeMonitor = params =>
  ampMonitor.get(`${monitorBase}/monitor/unsubscribe/${params.id}`, params)

// 监控Deal白名单配置
export const getDealWhiteList = params =>
  ampMonitor.get(`${monitorBase}/monitorDealWhite/list`, { params })
export const getDealWhiteListItem = params =>
  ampMonitor.get(`${monitorBase}/monitorDealWhite/${params.id}`, params)
export const getDealByKeyword = params =>
  ampMonitor.get(`${monitorBase}/monitorDealWhite/findDealByKeyword`, {
    params
  })
export const createDealWhite = params =>
  ampMonitor.post(`${monitorBase}/monitorDealWhite/create`, params)
export const updateDealWhite = params =>
  ampMonitor.put(`${monitorBase}/monitorDealWhite/update`, params)
export const deleteDealWhite = params =>
  ampMonitor.delete(
    `${monitorBase}/monitorDealWhite/removed/${params.id}`,
    params
  )
// 相关通知人配置
export const findAllAdvertiser = params =>
  ampMonitor.get(`${monitorBase}/notifierConfig/findAllAdvertiser`, { params })
export const subscibeAdvertiser = params =>
  ampMonitor.get(
    `${monitorBase}/notifierConfig/subscibe/${params.advertiserId}`,
    params
  )
export const unSubscibeAdvertiser = params =>
  ampMonitor.get(
    `${monitorBase}/notifierConfig/unsubscribe/${params.advertiserId}`,
    params
  )
export const findOneByAdvertiser = params =>
  ampMonitor.get(
    `${monitorBase}/notifierConfig/findOneByAdvertiser/${params.advertiserId}`,
    params
  )
export const updateNotifierConfig = params =>
  ampMonitor.put(`${monitorBase}/notifierConfig/update`, params)

// 报警记录
export const getAlarmLogList = params =>
  ampMonitor.get(`${monitorBase}/alarm/list`, { params })
export const getAlarmContent = params =>
  ampMonitor.get(`${monitorBase}/alarm/showMonitorContent/${params.id}`, params)
export const alarmChangeState = params =>
  ampMonitor.put(`${monitorBase}/alarm/updateStatus`, params)
export const deleteAlarm = params =>
  ampMonitor.delete(`${monitorBase}/alarm/removed/${params.id}`, params)
export const getUnresolvedNum = params =>
  ampMonitor.get(`${monitorBase}/alarm/unresolvedNum`, { params })

// 业务查询接口Hackathon
export const getSelectItem = params =>
  ampMonitor.post(`${monitorBase}/hackathon/findAllByWhere`, params)
export const getLineItemList = params =>
  ampMonitor.post(`${monitorBase}/hackathon/findAllItemCreative`, params)
export const getLineItemDownload = params =>
  ampMonitor.get(`${monitorBase}/hackathon/download`, {
    params: params,
    paramsSerializer(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
    responseType: 'blob'
  }) // get方式传送array类型，header添加返回结果为文件流的处理

// 日产相关
export const uploadAdmasterDayReport = params =>
  ampMonitor.post(`${monitorBase}/nissan/uploadAdmasterDayReport`, params, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const uploadDealAndAdmasterRel = params =>
  ampMonitor.post(`${monitorBase}/nissan/uploadDealAndAdmasterRel`, params, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const nissanListDealAndAdmasterRel = params =>
  ampMonitor.get(`${monitorBase}/nissan/listDealAndAdmasterRel`, { params })
export const nissanDeleteDealAndAdmasterRel = params =>
  ampMonitor.delete(
    `${monitorBase}/nissan/deleteDealAndAdmasterRel/${params.id}`
  )
// 日报下载和生成排期
export const downloadNissanDayReport = params =>
  ampMonitor.get(`${monitorBase}/nissan/downloadNissanDayReport`, {
    params: params,
    responseType: 'blob'
  })
export const generateSchedule = params =>
  ampMonitor.get(`${monitorBase}/nissan/generateSchedule`, { params })
// 日产PDB多目标算法
export const pdbAlgoRuleGetRuleList = params =>
  ampMonitor.get(`${monitorBase}/pdbAlgoRule/getRuleList`, { params })
export const pdbAlgoRuleActiveRule = params =>
  ampMonitor.get(`${monitorBase}/pdbAlgoRule/activeRule`, { params })
export const pdbAlgoRulegetRule = params =>
  ampMonitor.get(`${monitorBase}/pdbAlgoRule/getRule`, { params })
export const pdbAlgoRuleDeactiveRule = params =>
  ampMonitor.get(`${monitorBase}/pdbAlgoRule/deactiveRule`, { params })
export const pdbAlgoRuleDeleteRule = params =>
  ampMonitor.get(`${monitorBase}/pdbAlgoRule/deleteRule`, { params })
export const pdbAlgoRuleaddAndUpdateRule = params =>
  ampMonitor.post(`${monitorBase}/pdbAlgoRule/addAndUpdateRule`, params)
export const pdbAlgoRuleUploadDealAlgoKpi = params =>
  ampMonitor.post(`${monitorBase}/pdbAlgoRule/uploadDealAlgoKpi`, params, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const pdbAlgoRuleUploadDealAlgoSplitKpi = params =>
  ampMonitor.post(`${monitorBase}/pdbAlgoRule/uploadDealAlgoSplitKpi`, params, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const pdbAlgoRuleDownloadDealAlgoKpi = params =>
  ampMonitor.get(`${monitorBase}/pdbAlgoRule/downloadDealAlgoKpi`, {
    params: params,
    responseType: 'blob'
  })
export const pdbAlgoRuleDownloadDealAlgoSplitKpi = params =>
  ampMonitor.get(`${monitorBase}/pdbAlgoRule/downloadDealAlgoSplitKpi`, {
    params: params,
    responseType: 'blob'
  })
export const pdbAlgoRulegetDealAlgoList = params =>
  ampMonitor.get(`${monitorBase}/pdbAlgoRule/getDealAlgoList`, { params })
export const pdbAlgoRuleGenerateRules = params =>
  ampMonitor.get(`${monitorBase}/pdbAlgoRule/generateRules`, { params })

// 外接请求
export const alarmConfirmEmail = params =>
  ampMonitor.get(`${monitorBase}/alarm/confirmEmail`, { params })

// `~~~~~~~~~~~~~~~~~~~~~~~~~~~console后台~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

// 登录console
export const consoleLogin = params =>
  apmConsole.post(`${consoleBase}/api/login`, params)

// 预算修复
export const getOnlineFinacial = params =>
  apmConsole.get(`${consoleBase}/api/billfix/partner`, { params })
export const insertAdvertiserBill = params =>
  apmConsole.get(`${consoleBase}/api/billfix/insertAdvertiserBill`, { params })
export const insertOrderBill = params =>
  apmConsole.get(`${consoleBase}/api/billfix/insertOrderBill`, { params })
export const insertLineItemBill = params =>
  apmConsole.get(`${consoleBase}/api/billfix/insertLineItemBill`, { params })
export const insertVirtualLineItemBill = params =>
  apmConsole.get(`${consoleBase}/api/billfix/insertVirtualLineItemBill`, {
    params
  })
export const operateAll = params =>
  apmConsole.get(`${consoleBase}/api/billfix/operateAll`, { params })
export const operatePartenerOne = params =>
  apmConsole.get(
    `${consoleBase}/api/billfix/operate?relateId=${params.id}&type=${
      params.type
    }`
  )
export const operateItemOne = params =>
  apmConsole.get(
    `${consoleBase}/api/billfix/operate?relateId=${params.id}&type=${
      params.type
    }`
  )
export const getAdvertiserItems = params =>
  apmConsole.get(`${consoleBase}/api/billfix/advertiser?partnerId=${params.id}`)
export const getOrderItems = params =>
  apmConsole.get(`${consoleBase}/api/billfix/order?partnerId=${params.id}`)
export const getLineItems = params =>
  apmConsole.get(`${consoleBase}/api/billfix/lineItem?partnerId=${params.id}`)
export const getVirtualItems = params =>
  apmConsole.get(
    `${consoleBase}/api/billfix/virtualLineItem?partnerId=${params.id}`
  )
export const getFinacialRecalcu = params =>
  apmConsole.get(
    `${consoleBase}/api/billfix/insertOne?relateId=${params.id}&type=${
      params.type
    }`
  )
export const getPartnerFixData = params =>
  apmConsole.get(
    `${consoleBase}/api/billfix/getPartnerFixData?partnerId=${params.partnerId}`
  )
export const emptyBillFix = params =>
  apmConsole.get(`${consoleBase}/api/billfix/emptyBillFix`)
export const scheduleBillFix = params =>
  apmConsole.get(
    `${consoleBase}/api/billfix/getFixedProgress?relateId=${params.id}&type=${
      params.type
    }`
  )
export const costcompare = params =>
  apmConsole.get(`${consoleBase}/api/billfix/costcompare`, { params })
export const smartGetBillFixData = params =>
  apmConsole.get(
    `${consoleBase}/api/billfix/smartGetBillFixData?advertisers=${
      params.advertisers
    }&orders=${params.orders}`
  )
export const smartBillFix = params =>
  apmConsole.get(
    `${consoleBase}/api/billfix/smartBillFix?advertisers=${
      params.advertisers
    }&orders=${params.orders}`
  )
export const fixDataDetails = params =>
  apmConsole.get(
    `${consoleBase}/api/billfix/fixDataDetails?advertisers=${
      params.advertisers
    }&orders=${params.orders}`
  )
export const getSmartFixedProgress = params =>
  apmConsole.get(`${consoleBase}/api/billfix/getSmartFixedProgress`, {
    params
  })
export const clearCache = params =>
  apmConsole.get(`${consoleBase}/api/billfix/clearCache`, { params })
// 定时任务
export const parameterProcess = params =>
  apmConsole.get(`${consoleBase}/billing/parameter/process/`, { params })
export const setAuditSync = params =>
  apmConsole.get(`${consoleBase}/jobManual/advertiserAuditSync/?time=${params}`)
export const setNocteas = params =>
  apmConsole.get(`${consoleBase}/jobManual/nocteas/?time=${params}`)
export const setCteas = params =>
  apmConsole.get(`${consoleBase}/jobManual/cteas/?time=${params}`)
export const setRptDayStats = params =>
  apmConsole.get(
    `${consoleBase}/jobManual/rptDayStats/?beginDate=${
      params.beginDate
    }&endDate=${params.endDate}`
  )
export const setCostcompare = params =>
  apmConsole.get(`${consoleBase}/jobManual/costcompare`)
export const repairCreativeNoTracking = params =>
  ampMonitor.get(`${monitorBase}/monitorRepairCreative/noTracking`)
export const repairCreativeHasTracking = params =>
  ampMonitor.get(`${monitorBase}/monitorRepairCreative/hasTracking`)
export const setSynLineItem = params =>
  apmConsole.get(
    `${consoleBase}/jobManual/synLineItem/?lineIds=${params.lineIds}`
  )

// 用户
export const modifyUserPayPassword = params =>
  apmConsole.post(`${consoleBase}/api/user/modifyUserPayPassword`, params)
