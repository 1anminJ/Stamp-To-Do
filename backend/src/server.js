const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { syncDatabase } = require('./models');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const stampRoutes = require('./routes/stamps');
const hallOfFameRoutes = require('./routes/hallOfFame');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.' } });

app.use('/auth', authLimiter, authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/stamps', stampRoutes);
app.use('/api/hall-of-fame', hallOfFameRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

syncDatabase().then(() => {
  app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));
});
