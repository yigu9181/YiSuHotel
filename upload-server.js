const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// 确保图片存储目录存在
const uploadDir = path.join(__dirname, 'src', 'asset', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const ext = path.extname(file.originalname);
    // 确保type字段存在
    const type = req.body.type || 'image';
    const fileName = `${type}_${timestamp}_${randomStr}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// 处理CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 提供静态文件服务
app.use('/images', express.static(uploadDir));

// 上传图片的API
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // 返回图片路径
  const imagePath = `http://localhost:3001/images/${req.file.filename}`;
  res.json({ success: true, path: imagePath });
});

// 删除图片的API
app.post('/delete-image', (req, res) => {
  const { imageUrl } = req.body;
  
  if (!imageUrl) {
    return res.status(400).json({ error: 'No image URL provided' });
  }
  
  try {
    // 从URL中提取文件名
    const filename = imageUrl.split('/').pop();
    if (!filename) {
      return res.status(400).json({ error: 'Invalid image URL' });
    }
    
    // 构建图片文件路径
    const imagePath = path.join(uploadDir, filename);
    
    // 检查文件是否存在
    if (fs.existsSync(imagePath)) {
      // 删除文件
      fs.unlinkSync(imagePath);
      console.log('删除图片:', imagePath);
      res.json({ success: true, message: '图片删除成功' });
    } else {
      // 文件不存在，返回成功（因为目标已经达成）
      res.json({ success: true, message: '图片不存在，无需删除' });
    }
  } catch (error) {
    console.error('删除图片失败:', error);
    res.status(500).json({ error: '删除图片失败' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Upload server running on http://localhost:${port}`);
});
