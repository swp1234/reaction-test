# 반응속도 테스트 (Reaction Time Test)

당신의 신경 반응 속도를 측정하고 상위 몇 %인지 확인하는 바이럴 테스트 게임입니다.

## 게임 컨셉

- **화면이 변하면 탭**: 빨간 배경에서 대기하다가 초록색으로 변하면 최대한 빨리 탭
- **5회 측정**: 5번의 반응시간을 측정하여 평균값 계산
- **등급 시스템**: 평균 반응속도에 따라 5단계 등급 부여
- **AI 분석**: 프리미엄 기능으로 신경 반응 타입 분석
- **바이럴 요소**: 결과 공유 기능으로 SNS 확산

## 등급 기준

| 등급 | 시간 | 상위 | 아이콘 |
|------|------|------|--------|
| 초인적 | ~150ms | 1% | ⚡ |
| 매우 빠름 | 150~200ms | 10% | 🏆 |
| 빠름 | 200~250ms | 30% | ✨ |
| 보통 | 250~350ms | 50% | 👍 |
| 느림 | 350ms+ | 70%+ | 🐢 |

## 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PWA**: Progressive Web App 지원
- **다국어**: 12개 언어 지원 (i18n)
- **분석**: Google Analytics 4 연동
- **광고**: Google AdSense, AdMob 준비

## 파일 구조

```
reaction-test/
├── index.html              # 메인 HTML
├── manifest.json           # PWA 설정
├── icon-192.svg           # 192x192 아이콘
├── icon-512.svg           # 512x512 아이콘
├── .gitignore
├── README.md
├── css/
│   └── style.css          # 스타일 (glassmorphism, dark mode)
└── js/
    ├── app.js             # 게임 로직 (ReactionTest 클래스)
    ├── i18n.js            # 다국어 로더
    └── locales/           # 번역 파일 (12개 언어)
        ├── ko.json
        ├── en.json
        ├── zh.json
        ├── hi.json
        ├── ru.json
        ├── ja.json
        ├── es.json
        ├── pt.json
        ├── id.json
        ├── tr.json
        ├── de.json
        └── fr.json
```

## 주요 기능

### 1. 게임 플레이
- 대기 상태 (빨간 배경)
- 신호 상태 (초록 배경)
- 반응시간 측정 (ms 단위)
- 5회 반복 및 평균 계산

### 2. 결과 화면
- 평균 반응속도 표시
- 등급 및 상위 백분위 표시
- 측정 기록 시각화
- 프리미엤 분석 버튼

### 3. 프리미엥 분석 (광고 후)
- 반응 타입 분석
- 성격 특성 해석
- 추천 직업
- 데이터 기반 개선 제안

### 4. 바이럴 기능
- Web Share API를 통한 결과 공유
- 친구 초대 메시지
- SNS 최적화된 Open Graph 태그

### 5. 크로스 프로모션
- 8개 DopaBrain 앱 추천 (하단 카드형)
- 앱 간 유입 유도

## 설치 및 실행

### 로컬 테스트
```bash
# 프로젝트 디렉토리로 이동
cd reaction-test

# 간단한 HTTP 서버 실행 (Python)
python -m http.server 8000

# 브라우저에서 접속
# http://localhost:8000
```

### PWA 설치
- Chrome/Edge: 주소창 옆 "설치" 버튼
- iOS Safari: 공유 → 홈 화면에 추가

## 다국어 지원

총 12개 언어를 지원합니다:
- 한국어, English, 简体中文, हिन्दी, Русский
- 日本語, Español, Português, Bahasa Indonesia, Türkçe, Deutsch, Français

사용자의 브라우저 언어 자동 감지 + localStorage 저장

## 광고 전략

### AdSense 배치
- 상단 배너 (320x50)
- 하단 배너 (320x50)
- 결과 화면 광고 영역

### 프리미엄 분석 전환
- AI 분석 전에 전면 광고 (5초 카운트다운)
- 사용자가 광고를 본 후 분석 콘텐츠 제공
- 높은 eCPM 기대 가능

## GA4 이벤트

```javascript
// 테스트 완료
gtag('event', 'reaction_test_completed', {
  'average_time': 200,
  'grade': 'fast',
  'round_times': '205,198,192,210,187'
});

// 언어 변경
gtag('event', 'language_changed', {
  'language': 'en'
});

// 결과 공유
gtag('event', 'share', {
  'method': 'web_share'
});

// 프리미엄 분석 보기
gtag('event', 'view_item', {
  'content_name': 'premium_analysis'
});
```

## SEO 최적화

- Schema.org JSON-LD (Quiz 타입)
- Open Graph 메타태그
- 키워드: 반응속도, 신경 반응, 테스트, 게임, 심리테스트
- Canonical URL 설정

## 성능 최적화

- 전체 화면 터치 영역 (터치 지연 최소화)
- 글래스모피즘 스타일 (성능 최적화)
- 간단한 애니메이션 (prefers-reduced-motion 지원)
- 번들 크기 최소화 (의존성 없음)

## 접근성

- ARIA 레이블
- 키보드 네비게이션 (스페이스바로 탭)
- 충분한 색상 대비 (WCAG AA 준수)
- 44px+ 터치 타겟

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## 라이선스

MIT License

---

**개발**: DopaBrain
**배포**: Google Play, Web (PWA)
**수익화**: AdMob + AdSense + 프리미엄 분석
