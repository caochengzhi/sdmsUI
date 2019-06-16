import { asyncRouterMap, constantRouterMap } from '@/router'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    menulist: [],//左侧菜单
    buttonGroups: []//按钮组，当前用户所拥有的此次可操作的按钮权限
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {//routers，动态路由，这个口留着，后期有能力了实现
      state.addRouters = asyncRouterMap
      state.routers = constantRouterMap.concat(asyncRouterMap)
    },
    SET_MENUS: (state, menus) => {
      state.menulist = menus
    },
    SET_BUTTON_GROUPS: (state, buttonGroups) => {
      state.buttonGroups = buttonGroups
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {//返回左侧菜单信息给前台，后期这边也可以返回动态路由信息
      return new Promise(resolve => {
        commit('SET_MENUS', data.userInfo.menulist)
        commit('SET_BUTTON_GROUPS', data.userInfo.buttonGroups)
        sessionStorage.setItem("buttonGroups", data.userInfo.buttonGroups);
        resolve()
      })
    }
  }
}

export default permission