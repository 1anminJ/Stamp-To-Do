# 🏅 Stamp To-Do

> 할 일을 완료할 때마다 스탬프를 모으고, 10개를 달성하면 **명예의 전당**에 등록되는 게이미피케이션 기반 To-Do 리스트 앱

---

## 📌 프로젝트 소개

**Stamp To-Do**는 단순한 할 일 관리를 넘어, 매일의 목표 달성에 **동기부여**를 더해주는 앱입니다.

오늘의 할 일을 모두 완료하면 스탬프 1개를 획득하고, 스탬프 10개를 모으면 축하 메시지와 함께 **명예의 전당**에 이름이 등록됩니다. 반복적인 성취 경험을 통해 꾸준한 습관 형성을 돕는 것이 핵심 목표입니다.

| 대상 | 학생, 직장인 등 일상적인 할 일 관리와 동기부여가 필요한 누구나 |
|---|---|
| 핵심 가치 | 완료의 즐거움 → 스탬프 적립 → 명예의 전당 등록 |

---

## ✨ 주요 기능

### 1. 📋 To-Do 리스트 관리
- **생성** — 제목(필수), 설명, 우선순위(높음/보통/낮음), 날짜 입력
- **수정** — 기존 값이 채워진 인라인 수정 폼
- **삭제** — 확인 다이얼로그 후 삭제
- **완료 토글** — 체크 버튼 클릭 시 완료 처리 (취소선 + 회색 스타일 적용)
- **필터링** — 전체 / 완료 / 미완료 필터
- **정렬** — 최신순 / 우선순위순
- **날짜 선택** — 날짜 피커로 특정 날짜의 할 일 조회

### 2. ⭐ 일일 스탬프 자동 적립
- 특정 날짜의 **모든 할 일이 완료**되면 해당 날짜 스탬프 자동 적립
- 날짜당 **1회만** 적립 (중복 방지)
- 스탬프 진행 현황을 시각적으로 표시 (슬롯 10개 + 진행 바 + 백분율)

### 3. 🎉 스탬프 10개 달성 축하
- 스탬프 10개 달성 시 **축하 팝업** 자동 표시
- FadeIn(300ms) → "고마워!" 클릭 → FadeOut(200ms) 애니메이션
- 팝업 닫힘과 동시에 스탬프 카운트 **0으로 초기화** → 재도전 가능

### 4. 🏆 명예의 전당
- 스탬프 10개 달성 시 **자동으로 명예의 전당 등록**
- 달성 횟수(achievementCount) **내림차순 순위표**
- 달성 횟수만큼 ⭐ 표시 + 마지막 달성일 표기
- 나의 기록 별도 하이라이트 카드 표시
- 재달성 시 achievementCount 자동 누적

### 5. 🔐 사용자 계정 관리
- **회원가입** — 이메일 중복 확인, 비밀번호 강도 인디케이터, 실시간 유효성 검증
- **로그인** — JWT 토큰 발급 (30일 유효)
- **자동 로그인** — 앱 재방문 시 토큰 자동 검증
- **비밀번호 재설정** — 이메일 입력 → 재설정 링크 발송 → 새 비밀번호 설정

---

## 🛠 기술 스택

### Frontend
| 항목 | 기술 |
|---|---|
| 프레임워크 | React 19 |
| 라우팅 | React Router v7 |
| 상태관리 | Context API (AuthContext, ToastContext) |
| 스타일링 | Tailwind CSS v3 |
| HTTP 클라이언트 | Axios |

### Backend
| 항목 | 기술 |
|---|---|
| 런타임 | Node.js |
| 프레임워크 | Express.js |
| 데이터베이스 | SQLite |
| ORM | Sequelize |
| 인증 | JWT + bcrypt |
| 보안 | express-rate-limit, CORS |

---

## 📁 프로젝트 구조

```
stamp-todo/
├── backend/
│   └── src/
│       ├── config/        # DB 설정 (SQLite)
│       ├── middleware/    # JWT 인증 미들웨어
│       ├── models/        # User, Todo, Stamp, StampHistory, HallOfFame, PasswordReset
│       ├── routes/        # auth, todos, stamps, hall-of-fame
│       └── server.js
├── src/
│   ├── components/
│   │   ├── layout/        # Navbar
│   │   ├── todo/          # TodoForm, TodoItem
│   │   └── stamps/        # StampProgress, CelebrationModal
│   ├── context/           # AuthContext, ToastContext
│   ├── pages/             # Login, Register, Dashboard, HallOfFame, ...
│   ├── services/          # api.js (axios 인스턴스 + API 함수)
│   └── App.js
└── package.json
```

---

## 🚀 실행 방법

### 사전 준비
- Node.js 18 이상
- npm 8 이상

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/stamp-todo.git
cd stamp-todo

# 2. 프론트엔드 패키지 설치
npm install

# 3. 백엔드 패키지 설치
cd backend && npm install && cd ..

# 4. 개발 서버 실행 (프론트 + 백엔드 동시)
npm run dev
```

| 서버 | 주소 |
|---|---|
| 프론트엔드 | http://localhost:3000 |
| 백엔드 API | http://localhost:5001 |

> **SQLite DB**는 최초 실행 시 `backend/database.sqlite` 파일로 자동 생성됩니다.

---

## 📡 API 엔드포인트

### 인증
```
POST  /auth/register          회원가입
POST  /auth/login             로그인
POST  /auth/logout            로그아웃
GET   /auth/verify            토큰 검증
POST  /auth/forgot-password   비밀번호 재설정 요청
POST  /auth/reset-password    비밀번호 재설정 확인
```

### To-Do
```
GET    /api/todos              목록 조회 (?date, ?filter, ?sort)
POST   /api/todos              할 일 생성
GET    /api/todos/:id          단건 조회
PUT    /api/todos/:id          수정
DELETE /api/todos/:id          삭제
PATCH  /api/todos/:id/complete 완료 상태 토글 + 스탬프 체크
```

### 스탬프 & 명예의 전당
```
GET  /api/stamps/current      현재 스탬프 정보
GET  /api/stamps/history      스탬프 적립 내역
GET  /api/hall-of-fame        전체 명예의 전당 목록
GET  /api/hall-of-fame/me     나의 명예의 전당 기록
```

---

## 🎨 디자인 시스템

| 역할 | 색상 | 코드 |
|---|---|---|
| Primary | 인디고 | `#4F46E5` |
| Success | 에메랄드 | `#10B981` |
| Warning | 앰버 | `#F59E0B` |
| Danger | 레드 | `#EF4444` |
| Star (스탬프) | 골드 | `#FFD700` |

---

## 🔒 보안

- 비밀번호: bcrypt 해시 (saltRounds: 10)
- JWT 서버 시크릿 키 서명
- Rate Limiting: 인증 엔드포인트 15분당 20회 제한
- CORS: 프론트엔드 도메인(localhost:3000)만 허용
- 소유권 검증: 모든 Todo API에서 userId 일치 여부 확인
- 비밀번호 재설정 토큰: UUID + 1시간 만료

---

## 📦 배포

| 영역 | 추천 서비스 |
|---|---|
| Frontend | Vercel, Netlify |
| Backend | Railway, Render, Heroku |
| Database | PostgreSQL (Neon, AWS RDS) |
