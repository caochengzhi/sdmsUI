import request from '@/utils/request'

/*
 * 获取指定角色对应的用户列表
 * 用法参考：modifyRole.vue页面
 * @return APIResponse<JSONObject>
 */
export function getUsersByRoleId(roleId) {
    if (roleId != null) {
        return request({
            url: "/baseSearch/getUsersByRoleId",
            method: "get",
            params: { roleId: roleId }
        })
    }
}

/*
 * 获取指定角色对应的资源列表
 * 用法参考：modifyRole.vue页面
 * @return APIResponse<JSONObject>
 */
export function getResourcesByRoleId(roleId) {
    if (roleId != null) {
        return request({
            url: "/baseSearch/getResourcesByRoleId",
            method: "get",
            params: { roleId: roleId }
        })
    }
}

/*
 * 获取指定字典的明细ID键值对 
 * @reutrn list<SysDictDatas>
 */
export function getDictDatasByDictId(dictId) {
    if (dictId != null) {
        return request({
            url: "/baseSearch/getDictDatasByDictId",
            method: "get",
            params: { dictId: dictId }
        })
    }
}

/*
 * 获取字典明细code键值对
 */
export function getDictDatasByDictCode(dictCode) {
    if (dictCode != null) {
        return request({
            url: "/baseSearch/getDictDatasByDictCode",
            method: "get",
            params: { dictCode: dictCode }
        })
    }
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
* 获取客户产品规格列表
*/
export function getDistinctCustomerSpecific() {
    return request({
        url: "/baseSearch/getDistinctCustomerSpecific",
        method: "get"
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
    if (headerId != null) {
        return request({
            url: "/poManager/getPoLinesByHeadId",
            method: "get",
            params: { headerId: headerId }
        })
    }
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

/*
 * 获取客户规格信息
 */
export function getCustomerArchivesByCustomerId(customerId) {
    if (customerId != null) {
        return request({
            url: "/customersManager/getCustomerArchivesByCustomerId",
            method: "get",
            params: { customerId: customerId }
        })
    }
}

/*
 * 获取对应的供应商仓库信息
 */
export function getVendorArchiveListByHouseId(vendorId, vendorWarehouseId) {
    if (vendorId != null && vendorWarehouseId != null) {
        return request({
            url: "/vendorsManager/getVendorArchiveListByHouseId",
            method: "get",
            params: { vendorId: vendorId, vendorWarehouseId: vendorWarehouseId }
        })
    }
}

/*
 * 获取对应的供应商规格信息
 */
export function getVendorArchiveListByVendorId(vendorId) {
    if (vendorId != null) {
        return request({
            url: "/vendorsManager/getVendorArchiveListByVendorId",
            method: "get",
            params: { vendorId: vendorId }
        })
    }
}

/*
 * 获取供应商对应的仓库信息列表
 */
export function getVendorWarehouseListByVendorId(vendorId) {
    if (vendorId != null) {
        return request({
            url: "/vendorsManager/getVendorWarehouseListByVendorId",
            method: "get",
            params: { vendorId: vendorId }
        })
    }
}

/*
 * 获取产品规格信息
 */
export function getItemSpecificByItemId(itemId) {
    if (itemId != null) {
        return request({
            url: "/itemManagement/getItemSpecificByItemId",
            method: "get",
            params: { itemId: itemId }
        })
    }
}