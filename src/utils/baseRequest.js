import request from '@/utils/request'

/*
 * 获取指定角色对应的用户列表
 * 用法参考：modifyRole.vue页面
 */
export function getUsersByRoleId(roleId) {
    return request({
        url: "/baseSearch/getUsersByRoleId",
        method: "get",
        params: { roleId: roleId }
    })
}

/*
 * 获取指定角色对应的资源列表
 * 用法参考：modifyRole.vue页面
 */
export function getResourcesByRoleId(roleId) {
    return request({
        url: "/baseSearch/getResourcesByRoleId",
        method: "get",
        params: { roleId: roleId }
    })
}