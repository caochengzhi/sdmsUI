import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
export const constantRouterMap = [{
    path: '/',
    redirect: '/dashboard'
},
{
    path: '/',
    component: resolve => require(['../components/common/Home.vue'], resolve),
    meta: {
        title: '自述文件'
    },
    children: [{
        path: '/dashboard',
        component: resolve => require(['../components/page/Dashboard.vue'], resolve),
        meta: {
            title: '系统首页'
        }
    },
    {
        path: '/roleManagement',
        component: resolve => require(['../components/page/RoleSearch.vue'], resolve),
        meta: {
            title: '角色管理'
        }
    },
    {
        path: '/userManagement',
        component: resolve => require(['../components/page/SysUserSearch.vue'], resolve),
        meta: {
            title: '用户管理'
        }
    },
    {
        path: '/dictManagement',
        component: resolve => require(['../components/page/DictSearch.vue'], resolve),
        meta: {
            title: '字典管理'
        }
    },
    {
        path: '/logManagement',
        component: resolve => require(['../components/page/SysLogSearch.vue'], resolve),
        meta: {
            title: '日志查询'
        }
    },
    {
        path: '/modifyDictData',
        component: resolve => require(['../components/page/ModifyDictData.vue'], resolve),
        meta: {
            title: '编辑字典明细'
        }
    },
    {
        path: '/itemManagement',
        component: resolve => require(['../components/page/ItemSearch.vue'], resolve),
        meta: {
            title: '产品资料管理'
        }
    },
    {
        path: '/customerManagement',
        component: resolve => require(['../components/page/CustomersSearch.vue'], resolve),
        meta: {
            title: '客户资料管理'
        }
    },
    {
        path: '/vendorManagement',
        component: resolve => require(['../components/page/VendorsSearch.vue'], resolve),
        meta: {
            title: '供应商资料管理'
        }
    },
    {
        path: '/expressCustomerConfigManagement',
        component: resolve => require(['../components/page/ExpressCustomerSearch.vue'], resolve),
        meta: {
            title: '电子面单客户号配置'
        }
    },
    {
        path: '/modifyItem',
        component: resolve => require(['../components/page/ModifyItem.vue'], resolve),
        meta: {
            title: '编辑产品'
        }
    },
    {
        path: '/modifyUser',
        component: resolve => require(['../components/page/ModifyUser.vue'], resolve),
        meta: {
            title: '编辑用户'
        }
    },
    {
        path: '/modifyRole',
        component: resolve => require(['../components/page/ModifyRole.vue'], resolve),
        meta: {
            title: '编辑角色'
        }
    },
    {
        path: '/modifyCustomer',
        component: resolve => require(['../components/page/ModifyCustomer.vue'], resolve),
        meta: {
            title: '编辑客户'
        }
    },
    {
        path: '/modifyVendor',
        component: resolve => require(['../components/page/ModifyVendor.vue'], resolve),
        meta: {
            title: '编辑供应商'
        }
    },
    {
        path: '/transactionManagement',
        component: resolve => require(['../components/page/MaterialTransSearch.vue'], resolve),
        meta: {
            title: '交易信息管理'
        }
    },
    {
        path: '/storageManagement',
        component: resolve => require(['../components/page/MaterialStoreageSearch.vue'], resolve),
        meta: {
            title: '库存信息管理'
        }
    },
    {
        path: '/productPlanManagement',
        component: resolve => require(['../components/page/ProductPlanSearch.vue'], resolve),
        meta: {
            title: '生产计划管理'
        }
    },
    {
        path: '/poManagement',
        component: resolve => require(['../components/page/PoSearch.vue'], resolve),
        meta: {
            title: 'PO信息管理'
        }
    },
    {
        path: '/addPoInfo',
        component: resolve => require(['../components/page/AddPoInfo.vue'], resolve),
        meta: {
            title: 'PO信息录入'
        }
    },
    {
        path: '/addTransinfo',
        component: resolve => require(['../components/page/AddTransInfo.vue'], resolve),
        meta: {
            title: '创建发车信息'
        }
    },
    {
        path: '/orderManagement',
        component: resolve => require(['../components/page/OrderSearch.vue'], resolve),
        meta: {
            title: '原始订单查询'
        }
    },
    {
        path: '/orderReviewManagement',
        component: resolve => require(['../components/page/OrderReviewSearch.vue'], resolve),
        meta: {
            title: '订单审核管理'
        }
    },
    {
        path: '/orderReviewManagement',
        component: resolve => require(['../components/page/OrderOutStockearch.vue'], resolve),
        meta: {
            title: '订单出库管理'
        }
    },
    {
        path: '/expressManagement',
        component: resolve => require(['../components/page/OrderExpressSearch.vue'], resolve),
        meta: {
            title: '物流信息查询'
        }
    },





    {
        path: '/icon',
        component: resolve => require(['../components/page/Icon.vue'], resolve),
        meta: {
            title: '自定义图标'
        }
    },
    {
        path: '/roleManagement',
        component: resolve => require(['../components/page/BaseTable.vue'], resolve),
        meta: {
            title: '基础表格'
        }
    },
    {
        path: '/tabs',
        component: resolve => require(['../components/page/Tabs.vue'], resolve),
        meta: {
            title: 'tab选项卡'
        }
    },
    {
        path: '/form',
        component: resolve => require(['../components/page/BaseForm.vue'], resolve),
        meta: {
            title: '基本表单'
        }
    },
    {
        // 富文本编辑器组件
        path: '/editor',
        component: resolve => require(['../components/page/VueEditor.vue'], resolve),
        meta: {
            title: '富文本编辑器'
        }
    },
    {
        // markdown组件
        path: '/markdown',
        component: resolve => require(['../components/page/Markdown.vue'], resolve),
        meta: {
            title: 'markdown编辑器'
        }
    },
    {
        // 图片上传组件
        path: '/upload',
        component: resolve => require(['../components/page/Upload.vue'], resolve),
        meta: {
            title: '文件上传'
        }
    },
    {
        // vue-schart组件
        path: '/charts',
        component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
        meta: {
            title: 'schart图表'
        }
    },
    {
        // 拖拽列表组件
        path: '/drag',
        component: resolve => require(['../components/page/DragList.vue'], resolve),
        meta: {
            title: '拖拽列表'
        }
    },
    {
        // 拖拽Dialog组件
        path: '/dialog',
        component: resolve => require(['../components/page/DragDialog.vue'], resolve),
        meta: {
            title: '拖拽弹框'
        }
    },
    {
        // 权限页面
        path: '/permission',
        component: resolve => require(['../components/page/Permission.vue'], resolve),
        meta: {
            title: '权限测试',
            permission: true
        }
    },
    {
        path: '/404',
        component: resolve => require(['../components/page/404.vue'], resolve),
        meta: {
            title: '404'
        }
    },
    {
        path: '/403',
        component: resolve => require(['../components/page/403.vue'], resolve),
        meta: {
            title: '403'
        }
    }
    ]
},
{
    path: '/login',
    component: resolve => require(['../components/page/Login.vue'], resolve)
},
{
    path: '*',
    redirect: '/404'
}
]

/*异步挂载路由，动态设置需要根据权限加载的路由表 */
export const asyncRouterMap = []

export default new Router({
    routes: constantRouterMap
})