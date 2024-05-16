const env = import.meta.env.MODE || 'prod';

const EnvConfig = {
  dev: {
    baseApi: '/api',
    // mockApi: 'https://www.fastmock.site/mock/9496d91c0cdc682b59c51ac1399cd655/api'
    mockApi: 'https://mock.apifox.com/m1/4068509-0-default/api'
  },
  test: {
    baseApi: '/fucture/api',
    mockApi: ''
  },
  prod: {
    baseApi: '/fucture/api',
    mockApi: ''
  }
};

export default {
  env,
  namespace: 'manager',
  // mock: true,
  ...EnvConfig[env]
};
