import { get, post, put, del } from './request';

// API接口模板
// 示例：
// export const exampleApi = {
//   // 获取列表
//   getList: (params?: any) => {
//     return get('/example', params);
//   },
//   // 获取详情
//   getDetail: (id: number) => {
//     return get(`/example/${id}`);
//   },
//   // 添加
//   add: (data: any) => {
//     return post('/example', data);
//   },
//   // 更新
//   update: (id: number, data: any) => {
//     return put(`/example/${id}`, data);
//   },
//   // 删除
//   delete: (id: number) => {
//     return del(`/example/${id}`);
//   }
// };

// 登录相关API
export const loginApi = {
  // 登录
  login: (data: { username: string; password: string }) => {
    return post('/login', data);
  },
  // 登出
  logout: () => {
    return post('/logout');
  },
  // 获取用户信息
  getUserInfo: () => {
    return get('/user/info');
  }
};

// 酒店相关API
export const hotelApi = {
  // 获取酒店列表
  getHotelList: (params?: any) => {
    return get('/hotels', params);
  },
  // 获取酒店详情
  getHotelDetail: (id: number) => {
    return get(`/hotels/${id}`);
  }
};

// 用户相关API
export const userApi = {
  // 获取订单列表
  getOrderList: (params?: any) => {
    return get('/orders', params);
  },
  // 获取收藏列表
  getFavoriteList: () => {
    return get('/favorites');
  }
};
