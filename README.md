# 🏅 Stamp To-Do

> 할 일을 완료할 때마다 스탬프를 모으고, 10개를 달성하면 **명예의 전당**에 등록되는 게이미피케이션 기반 To-Do 리스트 앱

---

## 🎬 시연 영상

### GitHub CI/CD 시연
[![Stamp To-Do GitHub CI/CD 시연영상](https://img.youtube.com/vi/KwDXM7c3H-Q/0.jpg)](https://youtu.be/KwDXM7c3H-Q)

### AWS Amplify 서비스 활용 시연
[![Stamp To-Do AWS Amplify 서비스 활용 시연 영상](https://img.youtube.com/vi/Mao5izLVZw4/0.jpg)](https://youtu.be/Mao5izLVZw4)

---

## 📌 프로젝트 소개

**Stamp To-Do**는 단순한 할 일 관리를 넘어, 매일의 목표 달성에 **동기부여**를 더해주는 앱입니다.

오늘의 할 일을 모두 완료하면 스탬프 1개를 획득하고, 스탬프 10개를 모으면 축하 메시지와 함께 **명예의 전당**에 이름이 등록됩니다. 반복적인 성취 경험을 통해 꾸준한 습관 형성을 돕는 것이 핵심 목표입니다.

| 대상 | 학생, 직장인 등 일상적인 할 일 관리와 동기부여가 필요한 누구나 |
|---|---|
| 핵심 가치 | 완료의 즐거움 → 스탬프 적립 → 명예의 전당 등록 |
| 데이터 저장 | 브라우저 localStorage (서버 불필요) |
| 배포 | AWS S3 정적 웹 호스팅 + GitHub Actions 자동 배포 |

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
- 나의 달성 히스토리를 날짜별로 기록
- 달성 횟수 및 달성일 표기
- 재달성 시 횟수 자동 누적

### 5. 👤 사용자 설정
- **닉네임 입력** — 별도 회원가입 없이 닉네임만 입력하면 바로 시작
- **자동 유지** — 브라우저를 닫아도 localStorage에 저장되어 재방문 시 유지

---

## 🛠 기술 스택

### Frontend
| 항목 | 기술 |
|---|---|
| 프레임워크 | React 19 |
| 라우팅 | React Router v7 |
| 상태관리 | Context API (AuthContext, ToastContext) |
| 스타일링 | Tailwind CSS v3 |
| 데이터 저장 | localStorage |

### 인프라 & 배포
| 항목 | 기술 |
|---|---|
| 호스팅 | AWS S3 정적 웹 호스팅 |
| CI/CD | GitHub Actions |
| 배포 트리거 | `main` 브랜치 push |

---

## 📁 프로젝트 구조

```
stamp-todo/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions S3 자동 배포
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar
│   │   ├── todo/            # TodoForm, TodoItem
│   │   └── stamps/          # StampProgress, CelebrationModal
│   ├── context/             # AuthContext, ToastContext
│   ├── pages/               # LoginPage, DashboardPage, HallOfFamePage
│   ├── services/
│   │   └── storage.js       # localStorage 기반 데이터 서비스
│   └── App.js
└── package.json
```

---

## 🚀 로컬 실행 방법

### 사전 준비
- Node.js 18 이상
- npm 8 이상

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/stamp-todo.git
cd stamp-todo

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm start
```

브라우저에서 `http://localhost:3000` 접속 후 닉네임을 입력하면 바로 사용할 수 있습니다.

---

## ☁️ 배포 (AWS S3 + GitHub Actions)

### 배포 흐름

```
main 브랜치에 push
  → GitHub Actions 자동 실행
  → npm install & npm run build
  → AWS 자격증명 설정 (GitHub Secrets)
  → aws s3 sync ./build → s3://mybucket-20263606 --delete
```

### GitHub Secrets 설정

배포를 위해 GitHub 리포지토리의 **Settings → Secrets**에 아래 항목을 등록해야 합니다.

| Secret 이름 | 설명 |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM 액세스 키 ID |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM 시크릿 액세스 키 |
| `AWS_SESSION_TOKEN` | AWS Academy 환경 세션 토큰 |

### S3 버킷 설정 요구사항

| 항목 | 설정값 |
|---|---|
| 정적 웹 호스팅 | 활성화 |
| 인덱스 문서 | `index.html` |
| 오류 문서 | `index.html` (React Router 대응) |
| 퍼블릭 액세스 차단 | 모두 해제 |
| 버킷 정책 | `s3:GetObject` 공개 허용 |

### 배포 URL 확인

```
AWS 콘솔 → S3 → mybucket-20263606
  → [속성] 탭 → 정적 웹 사이트 호스팅
  → 버킷 웹 사이트 엔드포인트 확인
```

---

## 💾 데이터 저장 구조

모든 데이터는 서버 없이 **브라우저 localStorage**에 저장됩니다.

| 키 | 저장 내용 |
|---|---|
| `stamp_user` | 닉네임 등 사용자 정보 |
| `stamp_todos` | 전체 할 일 목록 |
| `stamp_data` | 현재 스탬프 카운트 및 마지막 달성일 |
| `stamp_history` | 날짜별 스탬프 적립 히스토리 |
| `stamp_hof` | 명예의 전당 달성 기록 |

> ⚠️ 브라우저 캐시/데이터를 삭제하면 저장된 데이터가 초기화됩니다.

---

## 🎨 디자인 시스템

| 역할 | 색상 | 코드 |
|---|---|---|
| Primary | 인디고 | `#4F46E5` |
| Success | 에메랄드 | `#10B981` |
| Warning | 앰버 | `#F59E0B` |
| Danger | 레드 | `#EF4444` |
| Star (스탬프) | 골드 | `#FFD700` |
