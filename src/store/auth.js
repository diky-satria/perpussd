import axios from 'axios'
import router from '@/router'

export default({
    namespaced: true,

    state:{
        authenticated: false, 
        user: null
    },
    getters: {
        authenticated(state){
            return state.authenticated
        },
        user(state){
            return state.user
        }
    },
    mutations: {
        SET_AUTHENTICATED(state, value){ state.authenticated = value },
        SET_USER(state, value){ state.user = value } 
    },
    actions: {
        async login({dispatch}, form){
            await axios.get('sanctum/csrf-cookie')
            await axios.post('login', form)
            dispatch('me')
        },
        async me({commit}){
            try{
                let response = await axios.get('api/me')
                commit("SET_AUTHENTICATED", true)
                commit("SET_USER", response.data)
                if(response.data.role === 'super admin'){
                  router.replace('/super-admin')
                }else{
                  router.replace('/admin')
                }
            }catch{
                commit("SET_AUTHENTICATED", false)
                commit("SET_USER", null)
            }
        },
        async logout({ commit }){
            await axios.post('logout')
            commit("SET_AUTHENTICATED", false)
            commit("SET_USER", null)
        }
    }

})