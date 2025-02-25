const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const qr = require('qr-image');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/final_project';
const JWT_SECRET = 'minminmin';
const upload = multer({ storage: multer.memoryStorage() });

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
  } catch (err) {
      res.status(400).json({ message: 'Invalid token.' });
  }
};

const weatherRoutes = require('./weather');
app.use('/api', weatherRoutes); 

const blogRoutes = require("./crud");
app.use("/api", blogRoutes);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/dashboard', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/bmi', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'bmi.html')));
app.get('/email', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'email.html')));
app.get('/qr', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'qr.html')));
app.get('/weather', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'weather.html')));
app.get('/crud', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, 'public', 'crud.html')));


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { 
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
      res.status(500).json({ message: 'Server error' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ username, password });
    await user.save();

    res.redirect('/login');
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/calculate-bmi', (req, res) => {
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height) / 100;

  if (!weight || !height || weight <= 0 || height <= 0) {
    return res.status(400).json({ message: 'Invalid input. Please enter positive numbers.' });
  }

  const bmi = weight / (height * height);
  let category = '';

  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 24.9) category = 'Normal';
  else if (bmi < 29.9) category = 'Overweight';
  else category = 'Obese';

  res.json({ bmi: bmi.toFixed(2), category });
});
  
app.post('/send-email', upload.single('attachment'), async (req, res) => {
  const { recipient, subject, message } = req.body;
  const attachment = req.file;

  const transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
          user: '231140@astanait.edu.kz',
          pass: 'MinYoung2402!',
      },
  });

  const mailOptions = {
      from: '231140@astanait.edu.kz',
      to: recipient,
      subject: subject,
      text: message,
  };

  if (attachment) {
      mailOptions.attachments = [{
          filename: attachment.originalname,
          content: attachment.buffer,
      }];
  }

  try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Email sent successfully!' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error sending email' });
  }
});

app.post('/generate-qr', (req, res) => {
  const { url } = req.body;
  const qrCode = qr.image(url, { type: 'png' });
  res.setHeader('Content-Type', 'image/png');
  qrCode.pipe(res);
});
  
app.get('/api/dashboard', authMiddleware, (req, res) => {
    res.json({ message: "Welcome to the dashboard!", user: req.user });
});

  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));