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
 * 获取指定字典的明细ID键值对 
 * @reutrn list<SysDictDatas>
 */
export function getDictDatasByDictId(dictId) {
    return request({
        url: "/baseSearch/getDictDatasByDictId",
        method: "get",
        params: { dictId: dictId }
    })
}

/*
 * 获取字典明细code键值对
 */
export function getDictDatasByDictCode(dictCode) {
    return request({
        url: "/baseSearch/getDictDatasByDictCode",
        method: "get",
        params: { dictCode: dictCode }
    })
}

/*
 * 获取客户列表
 */
export function getCustomerList(customerName) {
    return request({
        url: "/baseSearch/getCustomerList",
        method: "get",
        params: { customerName: customerName }
    })
}

/*
 * 获取供应商列表
 */
export function getVendorList(vendorName) {
    return request({
        url: "/baseSearch/getVendorList",
        method: "get",
        params: { vendorName: vendorName }
    })
}

/*
 * 获取供应商列表
 */
export function getVendorist() {
    return request({
        url: "/baseSearch/getVendorist",
        method: "get"
    })
}

export function getOrderStatus() {
    return request({
        url: "/baseSearch/getOrderStatus",
        method: "get"
    })
}

/*
 * 获取订单字段列表
 */
export function getOrderFieldList() {
    return request({
        url: "/baseSearch/getOrderFieldList",
        method: "get"
    })
}

export function getItems() {
    return request({
        url: "/baseSearch/getItems",
        method: "get"
    })
}

/**
 * 通过PO头查询对应的PO行数据
 */
export function getPoLinesByHeadId(headerId) {
    return request({
        url: "/poManager/getPoLinesByHeadId",
        method: "get",
        params: { headerId: headerId }
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