const express = require('express');
const { Stamp, StampHistory } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/current', async (req, res) => {
  try {
    let stamp = await Stamp.findOne({ where: { userId: req.userId } });
    if (!stamp) stamp = await Stamp.create({ userId: req.userId, stampCount: 0 });
    res.json(stamp);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await StampHistory.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(history);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
