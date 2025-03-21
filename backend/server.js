
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || '0ea214cd61b2ae8bd9c0fd33eb561fc0e8bf1911a4d638766028c2800bc9379da3bd406d2baa24a6bb7824d1b47c202999620ffcb6c8b926388c1d77db85b77e';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: '',      
  database: 'learning_platform'  // Tên database của bạn
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes

// Đăng ký người dùng (không mã hóa mật khẩu)
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Kiểm tra nếu email đã tồn tại
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Error checking existing user:', err);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ error: 'Email đã được sử dụng' });
      }
      
      // Thêm người dùng vào cơ sở dữ liệu không mã hóa mật khẩu
      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password], // Lưu mật khẩu gốc không mã hóa
        (err, result) => {
          if (err) {
            console.error('Error registering user:', err);
            return res.status(500).json({ error: 'Lỗi khi đăng ký người dùng' });
          }
          
          // Tạo JWT token
          const userId = result.insertId;
          const token = jwt.sign(
            { userId: userId, username, email },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          res.status(201).json({
            message: 'Đăng ký thành công',
            token
          });
        }
      );
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Đăng nhập (sử dụng mật khẩu gốc)
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Tìm người dùng trong cơ sở dữ liệu
    db.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, results) => {
        if (err) {
          console.error('Error finding user:', err);
          return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        
        if (results.length === 0) {
          return res.status(401).json({ error: 'Thông tin đăng nhập không chính xác' });
        }
        
        const user = results[0];
        
        // So sánh mật khẩu trực tiếp
        if (password !== user.password) {
          return res.status(401).json({ error: 'Thông tin đăng nhập không chính xác' });
        }
        
        // Tạo JWT token
        const token = jwt.sign(
          { 
            userId: user.user_id, 
            username: user.username, 
            email: user.email 
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Không có token xác thực' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    req.user = user;
    next();
  });
};

// Các API khóa học
app.get('/api/courses', (req, res) => {
  db.query('SELECT * FROM courses', (err, results) => {
    if (err) {
      console.error('Error fetching courses:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy danh sách khóa học' });
    }
    res.json(results);
  });
});

app.get('/api/courses/:id', (req, res) => {
  const courseId = req.params.id;
  db.query('SELECT * FROM courses WHERE course_id = ?', [courseId], (err, results) => {
    if (err) {
      console.error('Error fetching course:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy thông tin khóa học' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khóa học' });
    }
    
    res.json(results[0]);
  });
});

// API resources
app.get('/api/resources', (req, res) => {
  db.query('SELECT * FROM resources', (err, results) => {
    if (err) {
      console.error('Error fetching resources:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy danh sách tài nguyên' });
    }
    res.json(results);
  });
});

app.get('/api/resources/:id', (req, res) => {
  const resourceId = req.params.id;
  db.query('SELECT * FROM resources WHERE resource_id = ?', [resourceId], (err, results) => {
    if (err) {
      console.error('Error fetching resource:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy thông tin tài nguyên' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy tài nguyên' });
    }
    
    res.json(results[0]);
  });
});

// API blog posts
app.get('/api/blog', (req, res) => {
  db.query(
    'SELECT b.*, u.username FROM blogposts b LEFT JOIN users u ON b.user_id = u.user_id ORDER BY b.created_at DESC',
    (err, results) => {
      if (err) {
        console.error('Error fetching blog posts:', err);
        return res.status(500).json({ error: 'Lỗi khi lấy danh sách bài viết' });
      }
      res.json(results);
    }
  );
});

app.get('/api/blog/:id', (req, res) => {
  const postId = req.params.id;
  db.query(
    'SELECT b.*, u.username FROM blogposts b LEFT JOIN users u ON b.user_id = u.user_id WHERE b.post_id = ?',
    [postId],
    (err, results) => {
      if (err) {
        console.error('Error fetching blog post:', err);
        return res.status(500).json({ error: 'Lỗi khi lấy thông tin bài viết' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy bài viết' });
      }
      
      res.json(results[0]);
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
