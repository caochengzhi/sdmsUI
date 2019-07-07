import request from '@/utils/request'

/*
 * 获取指定角色对应的用户列表
 * 用法参考：modifyRole.vue页面
 * @return APIResponse<JSONObject>
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
 * @return APIResponse<JSONObject>
 */
export function getResourcesByRoleId(roleId) {
    return request({
        url: "/baseSearch/getResourcesByRoleId",
        method: "get",
        params: { roleId: roleId }
    })
}

/*
 * 获取指定字典的明细键值对 
 * @reutrn list<SysDictDatas>
 */
export function getDictDatasByDictId(dictId) {
    return request({
        url: "/baseSearch/getDictDatasByDictId",
        method: "get",
        params: { dictId: dictId }
    })
}

export function getDictDatasByDictCode(dictCode) {
    return request({
        url: "/baseSearch/getDictDatasByDictCode",
        method: "get",
        params: { dictCode: dictCode }
    })
}

/*
 * 获取当前账套的用户列表
 */
export function getUserList() {
    return request({
        url: "/baseSearch/getUserList",
        method: "get"
    })
}