import Taro from '@tarojs/taro';
import request, { get, post, put, del, loginRequest } from './request';

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
export const authApi = {
  // 登录
  login: async (username: string, password: string) => {
    try {
      // json-server 查询语法：用 GET + 参数过滤
      const res = await loginRequest({
        url: `/users?username=${username}&password=${password}`,
        method: 'GET',
        isLogin: true  // 标记这是登录请求
      })

      console.log('登录成功:', res.data)

      // 保存用户信息（注意是大写的 ID 表示角色）
      const userInfo = {
        id: res.data.id,           // "1"
        username: res.data.username, // "admin"
        role: res.data.ID,          // "管理员"（大写 ID）
        token: `fake_token_${res.data.id}_${Date.now()}`
      }

      Taro.setStorageSync('token', userInfo.token)
      Taro.setStorageSync('userInfo', userInfo)

      Taro.showToast({ title: '登录成功', icon: 'success' })

      // 根据角色跳转到不同页面
      if (userInfo.role === '管理员') {
        Taro.switchTab({ url: '/pages/h5-manager/index' })
      } else {
        Taro.switchTab({ url: '/pages/h5-user/index' })
      }

      return userInfo;
    } catch (err) {
      console.log('登录失败:', err)
      throw err;
    }
  },

  // 注册
  register: async (username: string, password: string, role: string) => {
    try {
      // 检查用户名是否已存在
      const existingUsers = await request({
        url: `/users?username=${username}`,
        method: 'GET'
      });

      if (existingUsers.data && existingUsers.data.length > 0) {
        Taro.showToast({ title: '用户名已存在', icon: 'none' });
        throw new Error('用户名已存在');
      }

      // 获取最大用户ID
      const allUsers = await request({
        url: '/users',
        method: 'GET'
      });

      const maxId = Math.max(...allUsers.data.map((user: any) => parseInt(user.id)), 0);
      const newId = (maxId + 1).toString();

      // 创建新用户
      const newUser = {
        id: newId,
        username,
        password,
        ID: role
      };

      const res = await request({
        url: '/users',
        method: 'POST',
        data: newUser
      });

      Taro.showToast({ title: '注册成功', icon: 'success' });
      return res.data;
    } catch (err) {
      console.log('注册失败:', err);
      throw err;
    }
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

