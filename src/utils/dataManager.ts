import fs from 'fs';
import path from 'path';

// 数据文件路径
const DATA_PATH = path.resolve(__dirname, '../data');

// 读取JSON文件
function readJsonFile(filename: string): any {
  try {
    const filePath = path.join(DATA_PATH, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取文件失败: ${filename}`, error);
    return null;
  }
}

// 写入JSON文件
function writeJsonFile(filename: string, data: any): boolean {
  try {
    const filePath = path.join(DATA_PATH, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`写入文件失败: ${filename}`, error);
    return false;
  }
}

// 用户数据管理
export const userManager = {
  // 获取所有用户
  getUsers: () => {
    const data = readJsonFile('users.json');
    return data?.users || [];
  },
  
  // 根据ID获取用户
  getUserById: (id: number) => {
    const users = userManager.getUsers();
    return users.find((user: any) => user.id === id);
  },
  
  // 根据用户名获取用户
  getUserByUsername: (username: string) => {
    const users = userManager.getUsers();
    return users.find((user: any) => user.username === username);
  },
  
  // 添加用户
  addUser: (user: any) => {
    const data = readJsonFile('users.json');
    if (!data) return null;
    
    const newId = Math.max(...data.users.map((u: any) => u.id), 0) + 1;
    const newUser = { id: newId, ...user };
    
    data.users.push(newUser);
    if (writeJsonFile('users.json', data)) {
      return newUser;
    }
    return null;
  },
  
  // 更新用户
  updateUser: (id: number, userData: any) => {
    const data = readJsonFile('users.json');
    if (!data) return null;
    
    const index = data.users.findIndex((user: any) => user.id === id);
    if (index === -1) return null;
    
    data.users[index] = { ...data.users[index], ...userData };
    if (writeJsonFile('users.json', data)) {
      return data.users[index];
    }
    return null;
  },
  
  // 删除用户
  deleteUser: (id: number) => {
    const data = readJsonFile('users.json');
    if (!data) return false;
    
    const index = data.users.findIndex((user: any) => user.id === id);
    if (index === -1) return false;
    
    data.users.splice(index, 1);
    return writeJsonFile('users.json', data);
  }
};

// 酒店数据管理
export const hotelManager = {
  // 获取所有酒店
  getHotels: () => {
    const data = readJsonFile('hotels.json');
    return data?.hotels || [];
  },
  
  // 根据ID获取酒店
  getHotelById: (id: number) => {
    const hotels = hotelManager.getHotels();
    return hotels.find((hotel: any) => hotel.id === id);
  },
  
  // 搜索酒店
  searchHotels: (keyword: string) => {
    const hotels = hotelManager.getHotels();
    return hotels.filter((hotel: any) => 
      hotel.name.includes(keyword) || hotel.address.includes(keyword)
    );
  },
  
  // 添加酒店
  addHotel: (hotel: any) => {
    const data = readJsonFile('hotels.json');
    if (!data) return null;
    
    const newId = Math.max(...data.hotels.map((h: any) => h.id), 0) + 1;
    const newHotel = { id: newId, ...hotel };
    
    data.hotels.push(newHotel);
    if (writeJsonFile('hotels.json', data)) {
      return newHotel;
    }
    return null;
  },
  
  // 更新酒店
  updateHotel: (id: number, hotelData: any) => {
    const data = readJsonFile('hotels.json');
    if (!data) return null;
    
    const index = data.hotels.findIndex((hotel: any) => hotel.id === id);
    if (index === -1) return null;
    
    data.hotels[index] = { ...data.hotels[index], ...hotelData };
    if (writeJsonFile('hotels.json', data)) {
      return data.hotels[index];
    }
    return null;
  },
  
  // 删除酒店
  deleteHotel: (id: number) => {
    const data = readJsonFile('hotels.json');
    if (!data) return false;
    
    const index = data.hotels.findIndex((hotel: any) => hotel.id === id);
    if (index === -1) return false;
    
    data.hotels.splice(index, 1);
    return writeJsonFile('hotels.json', data);
  }
};

// 订单数据管理
export const orderManager = {
  // 获取所有订单
  getOrders: () => {
    const data = readJsonFile('orders.json');
    return data?.orders || [];
  },
  
  // 根据用户ID获取订单
  getOrdersByUserId: (userId: number) => {
    const orders = orderManager.getOrders();
    return orders.filter((order: any) => order.userId === userId);
  },
  
  // 根据ID获取订单
  getOrderById: (id: number) => {
    const orders = orderManager.getOrders();
    return orders.find((order: any) => order.id === id);
  },
  
  // 添加订单
  addOrder: (order: any) => {
    const data = readJsonFile('orders.json');
    if (!data) return null;
    
    const newId = Math.max(...data.orders.map((o: any) => o.id), 0) + 1;
    const newOrder = { id: newId, ...order };
    
    data.orders.push(newOrder);
    if (writeJsonFile('orders.json', data)) {
      return newOrder;
    }
    return null;
  },
  
  // 更新订单
  updateOrder: (id: number, orderData: any) => {
    const data = readJsonFile('orders.json');
    if (!data) return null;
    
    const index = data.orders.findIndex((order: any) => order.id === id);
    if (index === -1) return null;
    
    data.orders[index] = { ...data.orders[index], ...orderData };
    if (writeJsonFile('orders.json', data)) {
      return data.orders[index];
    }
    return null;
  },
  
  // 删除订单
  deleteOrder: (id: number) => {
    const data = readJsonFile('orders.json');
    if (!data) return false;
    
    const index = data.orders.findIndex((order: any) => order.id === id);
    if (index === -1) return false;
    
    data.orders.splice(index, 1);
    return writeJsonFile('orders.json', data);
  }
};