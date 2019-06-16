const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  loginName: state => state.user.loginName,
  userId: state => state.user.userId,
  menulist: state => state.permission.menulist,
  buttonGroups: state => state.permission.buttonGroups,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters