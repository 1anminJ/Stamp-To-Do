// ── 키 상수 ──────────────────────────────────────────
const KEY = {
  USER: 'stamp_user',
  TODOS: 'stamp_todos',
  STAMP: 'stamp_data',
  HISTORY: 'stamp_history',
  HOF: 'stamp_hof',
};

// ── 공통 헬퍼 ─────────────────────────────────────────
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const today = () => new Date().toISOString().split('T')[0];

// ── User ─────────────────────────────────────────────
export const userService = {
  get: () => load(KEY.USER, null),
  set: (user) => save(KEY.USER, user),
  clear: () => localStorage.removeItem(KEY.USER),
};

// ── Todo ──────────────────────────────────────────────
export const todoService = {
  getAll: (params = {}) => {
    let todos = load(KEY.TODOS, []);
    if (params.date)   todos = todos.filter(t => t.dueDate === params.date);
    if (params.filter === 'completed') todos = todos.filter(t => t.isCompleted);
    if (params.filter === 'pending')   todos = todos.filter(t => !t.isCompleted);
    if (params.sort === 'priority') {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      todos = [...todos].sort((a, b) => order[a.priority] - order[b.priority]);
    } else {
      todos = [...todos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return todos;
  },

  create: (data) => {
    const todos = load(KEY.TODOS, []);
    const newTodo = {
      id: uid(),
      title: data.title.trim(),
      description: data.description?.trim() || null,
      priority: ['HIGH', 'MEDIUM', 'LOW'].includes(data.priority) ? data.priority : 'MEDIUM',
      dueDate: data.dueDate || today(),
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    save(KEY.TODOS, [newTodo, ...todos]);
    return newTodo;
  },

  update: (id, data) => {
    const todos = load(KEY.TODOS, []);
    const updated = todos.map(t => t.id === id
      ? { ...t, ...data, updatedAt: new Date().toISOString() }
      : t
    );
    save(KEY.TODOS, updated);
    return updated.find(t => t.id === id);
  },

  delete: (id) => {
    const todos = load(KEY.TODOS, []);
    save(KEY.TODOS, todos.filter(t => t.id !== id));
  },

  toggle: (id) => {
    const todos = load(KEY.TODOS, []);
    let toggled = null;
    const updated = todos.map(t => {
      if (t.id !== id) return t;
      toggled = {
        ...t,
        isCompleted: !t.isCompleted,
        completedAt: !t.isCompleted ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      };
      return toggled;
    });
    save(KEY.TODOS, updated);
    return toggled;
  },
};

// ── Stamp ─────────────────────────────────────────────
export const stampService = {
  get: () => load(KEY.STAMP, { stampCount: 0, lastAchievedDate: null }),

  // 완료 토글 후 스탬프 체크 — stampResult 반환
  checkAndEarn: (dueDate) => {
    const allTodos = load(KEY.TODOS, []);
    const dayTodos = allTodos.filter(t => t.dueDate === dueDate);
    if (dayTodos.length === 0 || !dayTodos.every(t => t.isCompleted)) return null;

    const history = load(KEY.HISTORY, []);
    if (history.some(h => h.stampDate === dueDate)) return null; // 이미 획득

    // 히스토리 추가
    const newHistory = [{ id: uid(), stampDate: dueDate, createdAt: new Date().toISOString() }, ...history];
    save(KEY.HISTORY, newHistory);

    // 스탬프 카운트 증가
    const stamp = load(KEY.STAMP, { stampCount: 0, lastAchievedDate: null });
    const newCount = stamp.stampCount + 1;

    if (newCount >= 10) {
      // 명예의 전당 등록
      const hof = load(KEY.HOF, []);
      const user = load(KEY.USER, null);
      const newEntry = {
        id: uid(),
        displayName: user?.displayName || '익명',
        achievementCount: (hof[0]?.achievementCount || 0) + 1,
        achievedAt: dueDate,
        createdAt: new Date().toISOString(),
      };
      save(KEY.HOF, [newEntry, ...hof]);
      save(KEY.STAMP, { stampCount: 0, lastAchievedDate: dueDate });
      return { earned: true, hallOfFame: true, message: '🎉 10개의 스탬프를 모두 모으셨어요!' };
    }

    save(KEY.STAMP, { stampCount: newCount, lastAchievedDate: dueDate });
    return { earned: true, hallOfFame: false, count: newCount, message: `스탬프 1개를 얻었습니다! (${newCount}/10)` };
  },

  getHistory: () => load(KEY.HISTORY, []),
};

// ── Hall of Fame ───────────────────────────────────────
export const hofService = {
  getAll: () => load(KEY.HOF, []),
};
