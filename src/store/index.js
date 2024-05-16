import { createStore } from 'vuex';
import mutations from './mutations';
import storage from '../utils/storage';
import api from '../api/index.js';

export default createStore({
  state: {
    userInfo: storage.getItem('userInfo') || {}, // 获取用户信息
    noticeCount: 0,
    menuList: storage.getItem('menuList') || []
  },
  mutations,
  actions: {
    async noticeCountGet({ commit }) {
      const data = await api.noticeCount();
      commit('setNoticeCount', data);
    }
  }
});
