
# DoX - 노인 건강 진단 서비스

DoX는 노인을 위한 AI 기반 자동 진단 웹 애플리케이션입니다. 
## 실행 방법

### 개발 환경

1. 의존성 설치:
```bash
npm install
```

2. 서버 실행:
```bash
npm start
```

3. 브라우저에서 `http://localhost:5000` 접속

### 프로덕션 환경

```bash
NODE_ENV=production npm start
```

## 프로젝트 구조

```
├── creative-agency-portfolio/    # Next.js 앱
│   ├── app/
│   │   ├── components/          # React 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── DiagnosisForm.tsx
│   │   │   ├── EmergencySection.tsx
│   │   │   └── ...
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/ui/           # UI 컴포넌트 라이브러리
├── index.js                    # 메인 서버 파일
└── package.json
```

## API 엔드포인트

### POST /api/diagnose

증상 기반 진단 결과를 반환합니다.

**요청 본문:**
```json
{
  "symptoms": "두통이 있어요",
  "age": "60-65",
  "gender": "남성"
}
```

**응답:**
```json
{
  "symptoms": "두통이 있어요",
  "age": "60-65",
  "gender": "남성",
  "matchedSymptom": "두통",
  "diagnosis": {
    "diagnosis": "긴장성 두통",
    "medication": ["타이레놀", "애드빌"],
    "advice": "충분한 수분 섭취와 휴식을 취하세요."
  }
}
```

## 지원 증상
- 두통
- 기침
- 복통
- 무릎통증
- 불면증
