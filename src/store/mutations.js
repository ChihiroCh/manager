import storage from '../utils/storage';

export default {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo;
    storage.setItem('userInfo', userInfo);
  },
  setNoticeCount(state, val) {
    state.noticeCount = val;
  },
  saveMenuList(state, menuList) {
    state.menuList = menuList;
    storage.setItem('menuList', menuList);
  },
  saveActionList(state, actionList) {
    state.actionList = actionList;
    storage.setItem('actionList', actionList);
  }
};
