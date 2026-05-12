const express = require('express');
const { Op } = require('sequelize');
const { Todo, Stamp, StampHistory, HallOfFame, User } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { date, filter, sort } = req.query;
    const where = { userId: req.userId };

    if (date) where.dueDate = date;
    if (filter === 'completed') where.isCompleted = true;
    else if (filter === 'pending') where.isCompleted = false;

    const order = sort === 'priority'
      ? [['priority', 'ASC']]
      : [['createdAt', 'DESC']];

    const todos = await Todo.findAll({ where, order });
    res.json(todos);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title || title.trim().length === 0) return res.status(400).json({ message: '제목을 입력하세요.' });
    if (title.length > 100) return res.status(400).json({ message: '제목은 100자 이내로 입력하세요.' });
    if (description && description.length > 500) return res.status(400).json({ message: '설명은 500자 이내로 입력하세요.' });

    const today = new Date().toISOString().split('T')[0];
    const todo = await Todo.create({
      userId: req.userId,
      title: title.trim(),
      description: description ? description.trim() : null,
      priority: ['HIGH', 'MEDIUM', 'LOW'].includes(priority) ? priority : 'MEDIUM',
      dueDate: dueDate || today,
    });
    res.status(201).json(todo);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!todo) return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    res.json(todo);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!todo) return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });

    const { title, description, priority, dueDate } = req.body;
    if (title !== undefined) {
      if (!title || title.trim().length === 0) return res.status(400).json({ message: '제목을 입력하세요.' });
      if (title.length > 100) return res.status(400).json({ message: '제목은 100자 이내로 입력하세요.' });
      todo.title = title.trim();
    }
    if (description !== undefined) {
      if (description && description.length > 500) return res.status(400).json({ message: '설명은 500자 이내로 입력하세요.' });
      todo.description = description ? description.trim() : null;
    }
    if (priority && ['HIGH', 'MEDIUM', 'LOW'].includes(priority)) todo.priority = priority;
    if (dueDate) todo.dueDate = dueDate;

    await todo.save();
    res.json(todo);
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!todo) return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    await todo.destroy();
    res.json({ message: '삭제되었습니다.' });
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

router.patch('/:id/complete', async (req, res) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!todo) return res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });

    todo.isCompleted = !todo.isCompleted;
    todo.completedAt = todo.isCompleted ? new Date() : null;
    await todo.save();

    let stampResult = null;

    if (todo.isCompleted) {
      const targetDate = todo.dueDate;
      const allTodos = await Todo.findAll({ where: { userId: req.userId, dueDate: targetDate } });

      if (allTodos.length > 0 && allTodos.every(t => t.isCompleted)) {
        const alreadyStamped = await StampHistory.findOne({ where: { userId: req.userId, stampDate: targetDate } });

        if (!alreadyStamped) {
          await StampHistory.create({ userId: req.userId, stampDate: targetDate });

          let stamp = await Stamp.findOne({ where: { userId: req.userId } });
          if (!stamp) stamp = await Stamp.create({ userId: req.userId, stampCount: 0 });

          stamp.stampCount += 1;
          stamp.lastAchievedDate = targetDate;

          if (stamp.stampCount >= 10) {
            const user = await User.findByPk(req.userId);
            const existing = await HallOfFame.findOne({ where: { userId: req.userId } });
            if (existing) {
              existing.achievementCount += 1;
              existing.lastAchievedDate = targetDate;
              await existing.save();
            } else {
              await HallOfFame.create({
                userId: req.userId,
                displayName: user.displayName,
                achievementCount: 1,
                lastAchievedDate: targetDate,
              });
            }
            stamp.stampCount = 0;
            stampResult = { earned: true, hallOfFame: true, message: '🎉 10개의 스탬프를 모두 모으셨어요! 명예의 전당에 등록되었습니다!' };
          } else {
            stampResult = { earned: true, hallOfFame: false, count: stamp.stampCount, message: `스탬프 1개를 얻었습니다! (${stamp.stampCount}/10)` };
          }

          await stamp.save();
        }
      }
    }

    res.json({ todo, stampResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
