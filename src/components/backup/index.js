//=======store下面的文件
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

//定义属性
const state = {
    isLogin : false
}

//获取属性的状态
const getters = {
    getIsLogin(state) {//方法名随意,主要是来承载变化的isLogin的值
        return state.isLogin
    }
}
//设置属性的状态
const mutations = {
    setIsLogin(state, falg) {//自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
        state.isLogin = falg;
    }
}
//应用mutations
const actions = {
    setUserLogin(context,falg) {  //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
        context.commit('setIsLogin',falg);
    }
}
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})

export default store