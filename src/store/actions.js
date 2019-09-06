import * as types from './mutation-types'
//test
export const increment = ({commit}) => {
  commit(types.INCREMENT)
}
export const decrement = ({commit}) => {
  commit(types.DECREMENT)
}
export const setTopMenuActive = ({commit}, name) => {
  commit(types.TOP_MENU_ACTIVE, name)
}
export const setLeftMenuActive = ({commit}, name) => {
  commit(types.LEFT_MENU_ACTIVE, name)
}
export const setLeftMenus = ({commit}, leftMenus) => {
  commit(types.LEFT_MENUS, leftMenus)
}
export const setCollapsed = ({commit}, collapsed) => {
  commit(types.MENUCOLLAPSED, collapsed)
}
export const setBreadcrumbs = ({commit}, breadcrumbs) => {
  commit(types.BREADCRUMBS, breadcrumbs)
}
export const setPermission = ({commit}, permission) => {
  commit(types.PERMISSION, permission)
}
export const setRoutes = ({commit}, routes) => {
  commit(types.ROUTES, routes)
}
export const setDevice = ({commit}, device) => {
  commit(types.DEVICE, device)
}
export const setScreenWidth = ({commit}, screenWidth) => {
  commit(types.SCREEWIDTH, screenWidth)
}
