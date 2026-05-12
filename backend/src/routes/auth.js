const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User, Stamp, PasswordReset } = require('../models');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !emailRegex.test(email)) return res.status(400).json({ message: '유효한 이메일을 입력하세요.' });
    if (!password || !passwordRegex.test(password)) return res.status(400).json({ message: '비밀번호는 최소 8자, 대소문자/숫자/특수문자를 포함해야 합니다.' });
    if (!displayName || displayName.trim().length === 0) return res.status(400).json({ message: '이름을 입력하세요.' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: '이미 사용 중인 이메일입니다.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, displayName: displayName.trim() });
    await Stamp.create({ userId: user.id, stampCount: 0 });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ userId: user.id, email: user.email, displayName: user.displayName, token });
  } catch (err) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, userId: user.id, email: user.email, displayName: user.displayName });
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: '로그아웃 되었습니다.' });
});

router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    res.json({ userId: user.id, email: user.email, displayName: user.displayName });
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.json({ message: '해당 이메일로 재설정 링크를 발송했습니다.' });

    await PasswordReset.destroy({ where: { userId: user.id } });
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await PasswordReset.create({ userId: user.id, token, expiresAt });

    console.log(`[비밀번호 재설정] 토큰: ${token} (개발용 콘솔 출력)`);
    res.json({ message: '해당 이메일로 재설정 링크를 발송했습니다.', devToken: token });
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token) return res.status(400).json({ message: '유효하지 않은 토큰입니다.' });
    if (!newPassword || !passwordRegex.test(newPassword)) return res.status(400).json({ message: '비밀번호는 최소 8자, 대소문자/숫자/특수문자를 포함해야 합니다.' });

    const reset = await PasswordReset.findOne({ where: { token } });
    if (!reset || new Date() > reset.expiresAt) return res.status(400).json({ message: '만료되었거나 유효하지 않은 토큰입니다.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashed }, { where: { id: reset.userId } });
    await reset.destroy();
    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
