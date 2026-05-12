const express = require('express');
const { HallOfFame } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const list = await HallOfFame.findAll({ order: [['achievementCount', 'DESC'], ['lastAchievedDate', 'DESC']] });
    res.json(list);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const record = await HallOfFame.findOne({ where: { userId: req.userId } });
    res.json(record || null);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
