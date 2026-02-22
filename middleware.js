// 自定义中间件
const fs = require('fs');
const path = require('path');

// 读取db.json文件
function getDb() {
  const dbPath = path.join(__dirname, 'db.json');
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

// 写入db.json文件
function writeDb(db) {
  const dbPath = path.join(__dirname, 'db.json');
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

module.exports = (req, res, next) => {
  // 处理登录请求
  if (req.url === '/api/login' && req.method === 'POST') {
    const { username, password } = req.body;
    const db = getDb();
    
    const user = db.users.find(u => u.username === username && u.password === password);
    
    if (user) {
      res.status(200).json({
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock-token-' + Date.now(),
          userInfo: {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            nickname: user.nickname
          }
        }
      });
    } else {
      res.status(400).json({
        code: 400,
        message: '用户名或密码错误'
      });
    }
    return;
  }
  
  // 处理登出请求
  if (req.url === '/api/logout' && req.method === 'POST') {
    res.status(200).json({
      code: 200,
      message: '登出成功'
    });
    return;
  }
  
  // 处理获取用户信息请求
  if (req.url === '/api/user/info' && req.method === 'GET') {
    const db = getDb();
    if (db.users.length > 0) {
      res.status(200).json({
        code: 200,
        message: '获取成功',
        data: db.users[0]
      });
    } else {
      res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }
    return;
  }
  
  // 处理搜索酒店请求
  if (req.url.startsWith('/api/hotel/search') && req.method === 'GET') {
    const db = getDb();
    const keyword = new URLSearchParams(req.url.split('?')[1]).get('keyword') || '';
    
    const hotels = keyword 
      ? db.hotels.filter(h => h.name.includes(keyword) || h.address.includes(keyword))
      : db.hotels;
    
    res.status(200).json({
      code: 200,
      message: '搜索成功',
      data: {
        list: hotels,
        total: hotels.length
      }
    });
    return;
  }
  
  // 处理获取酒店详情请求
  if (req.url.match(/\/api\/hotel\/detail\/\d+/) && req.method === 'GET') {
    const db = getDb();
    const id = parseInt(req.url.split('/').pop());
    const hotel = db.hotels.find(h => h.id === id);
    
    if (hotel) {
      // 扩展酒店详情信息
      const hotelDetail = {
        ...hotel,
        images: [
          hotel.image,
          `https://picsum.photos/600/400?random=${hotel.id + 1}`,
          `https://picsum.photos/600/400?random=${hotel.id + 2}`
        ],
        facilities: ['WiFi', '空调', '电视', '冰箱', '洗衣机'],
        description: '这是一家豪华酒店，提供优质的服务和舒适的住宿环境。',
        rooms: [
          {
            id: 1,
            name: '标准间',
            price: hotel.price - 200,
            size: 25,
            bedType: '双床',
            window: true
          },
          {
            id: 2,
            name: '大床房',
            price: hotel.price - 100,
            size: 30,
            bedType: '大床',
            window: true
          },
          {
            id: 3,
            name: '套房',
            price: hotel.price + 200,
            size: 50,
            bedType: '大床',
            window: true
          }
        ]
      };
      
      res.status(200).json({
        code: 200,
        message: '获取成功',
        data: hotelDetail
      });
    } else {
      res.status(404).json({
        code: 404,
        message: '酒店不存在'
      });
    }
    return;
  }
  
  // 处理获取订单列表请求
  if (req.url === '/api/user/orders' && req.method === 'GET') {
    const db = getDb();
    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: {
        list: db.orders,
        total: db.orders.length,
        page: 1,
        pageSize: 10
      }
    });
    return;
  }
  
  // 处理获取收藏列表请求
  if (req.url === '/api/user/favorites' && req.method === 'GET') {
    const db = getDb();
    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: {
        list: db.favorites,
        total: db.favorites.length
      }
    });
    return;
  }
  
  // 处理添加收藏请求
  if (req.url === '/api/user/favorite/add' && req.method === 'POST') {
    const { hotelId } = req.body;
    const db = getDb();
    
    const hotel = db.hotels.find(h => h.id === hotelId);
    if (!hotel) {
      res.status(404).json({
        code: 404,
        message: '酒店不存在'
      });
      return;
    }
    
    // 检查是否已收藏
    const existingFavorite = db.favorites.find(f => f.hotelId === hotelId);
    if (existingFavorite) {
      res.status(400).json({
        code: 400,
        message: '已经收藏过该酒店'
      });
      return;
    }
    
    // 从请求头获取token，这里简化处理，实际应该验证token并获取用户信息
    const token = req.headers.authorization?.split(' ')[1];
    // 这里简化处理，假设用户ID为1，实际应该从token中解析
    const userId = 1;
    
    const newFavorite = {
      id: db.favorites.length > 0 ? Math.max(...db.favorites.map(f => f.id)) + 1 : 1,
      hotelId: hotel.id,
      hotelName: hotel.name,
      address: hotel.address,
      price: hotel.price,
      score: hotel.score,
      image: hotel.image,
      collectTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      userId: userId
    };
    
    db.favorites.push(newFavorite);
    writeDb(db);
    
    res.status(200).json({
      code: 200,
      message: '收藏成功',
      data: newFavorite
    });
    return;
  }
  
  // 处理取消收藏请求
  if (req.url === '/api/user/favorite/remove' && req.method === 'POST') {
    const { hotelId } = req.body;
    const db = getDb();
    
    const index = db.favorites.findIndex(f => f.hotelId === hotelId);
    if (index === -1) {
      res.status(404).json({
        code: 404,
        message: '未找到收藏记录'
      });
      return;
    }
    
    db.favorites.splice(index, 1);
    writeDb(db);
    
    res.status(200).json({
      code: 200,
      message: '取消收藏成功'
    });
    return;
  }
  
  // 处理获取地址列表请求
  if (req.url === '/api/user/addresses' && req.method === 'GET') {
    const db = getDb();
    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: {
        list: db.addresses
      }
    });
    return;
  }
  
  // 处理其他API请求，使用json-server的默认处理
  next();
};