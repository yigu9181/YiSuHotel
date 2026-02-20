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

    if (res.statusCode === 200) {
      // 对于直接返回数据的API，包装成统一的响应格式
      if (!res.data.code) {
        return {
          code: 200,
          message: '获取成功',
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