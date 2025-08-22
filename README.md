
# DoX - 노인 건강 진단 서비스

DoX는 노인을 위한 AI 기반 자동 진단 웹 애플리케이션입니다. 사용자 친화적인 인터페이스를 통해 증상을 입력하면 맞춤형 건강 조언과 약물 추천을 제공합니다.

## 주요 기능

- 🏥 **AI 자동 진단**: 증상 기반 건강 상태 분석
- 💊 **맞춤형 약물 추천**: 개인별 맞춤 의약품 안내
- 🚨 **응급상황 대응**: 응급시 즉시 연락 가능한 번호 제공
- 👥 **노인 친화적 UI**: 큰 글씨와 간단한 인터페이스
- 📱 **반응형 디자인**: 모든 기기에서 접근 가능

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express API
- **UI Components**: Radix UI, Lucide React

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

## 주의사항

⚠️ **면책조항**: 이 애플리케이션은 의료 정보 제공 목적으로만 사용되며, 전문 의료진의 진료를 대체할 수 없습니다. 심각한 증상이 있을 경우 반드시 병원을 방문하시기 바랍니다.

## 기여하기

1. Fork this repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

© 2025 DoX. 건강한 미래를 함께합니다.
