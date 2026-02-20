import Taro from '@tarojs/taro';

// API基础路径
// 注意：微信小程序需要使用本机IP地址，不能使用localhost
const BASE_URL = 'http://127.0.0.1:3000';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: any;
  timeout?: number;
}

interface ResponseData<T = any> {
  code: number;
  message: string;
  data?: T;
}
export interface User {
  id: string;
  username: string;
  password: string;
  ID: string; // 角色：管理员/用户等
}

export interface LoginRes {
  code: number;
  message: string;
  data: {
    id: string;
    username: string;
    role: string;
    token: string;
  };
}


// Taro 请求成功回调类型
export interface TaroResponse<T = any> {
  statusCode: number;
  data: T;
  header?: Record<string, string>;
  cookies?: string[];
}

// 通用请求方法
export default async function request<T = any>(options: RequestOptions): Promise<ResponseData<T>> {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    timeout = 10000
  } = options;

  try {
    const res = await Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      timeout
    });

    if (res.statusCode === 200 || res.statusCode === 201) {
      // 对于直接返回数据的API，包装成统一的响应格式
      if (!res.data.code) {
        return {
          code: 200,
          message: '操作成功',
          data: res.data
        };
      }
      return res.data as ResponseData<T>;
    } else {
      throw new Error(`请求失败: ${res.statusCode}`);
    }
  } catch (error: any) {
    console.error('网络请求错误:', error);
    Taro.showToast({
      title: error.message || '网络请求失败',
      icon: 'none',
      duration: 2000
    });
    throw error;
  }
}

// 封装常用请求方法
export const get = <T = any>(url: string, data?: any, header?: any) => {
  return request<T>({
    url,
    method: 'GET',
    data,
    header
  });
};

export const post = <T = any>(url: string, data?: any, header?: any) => {
  return request<T>({
    url,
    method: 'POST',
    data,
    header
  });
};

export const put = <T = any>(url: string, data?: any, header?: any) => {
  return request<T>({
    url,
    method: 'PUT',
    data,
    header
  });
};

export const del = <T = any>(url: string, data?: any, header?: any) => {
  return request<T>({
    url,
    method: 'DELETE',
    data,
    header
  });
};

export const loginRequest = (options) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        // 登录接口不需要 token，其他接口需要
        'Authorization': options.needToken ? Taro.getStorageSync('token') || '' : ''
      },
      success: (res) => {
        // json-server 直接返回数组或对象，没有 code 字段
        if (res.statusCode === 200) {
          // 如果是登录接口，检查是否有匹配用户
          if (options.url.includes('/login') || options.isLogin) {
            const users = Array.isArray(res.data) ? res.data : [res.data]
            if (users.length > 0) {
              resolve({ code: 200, data: users[0], message: '登录成功' })
            } else {
              Taro.showToast({ title: '用户名或密码错误', icon: 'none' })
              reject({ code: 401, message: '用户名或密码错误' })
            }
          } else {
            // 其他接口
            resolve({ code: 200, data: res.data, message: 'success' })
          }
        } else {
          Taro.showToast({ title: '请求失败', icon: 'none' })
          reject(res.data)
        }
      },
      fail: (err) => {
        Taro.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}
