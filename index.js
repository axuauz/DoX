
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();

// Next.js 개발 서버 프록시 설정
const nextProxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
});

// Next.js 앱으로 프록시
app.use('/', nextProxy);

// 진단 API 엔드포인트
app.use(express.json());

// 증상 데이터베이스
const symptomDatabase = {
  '두통': {
    diagnosis: '긴장성 두통',
    medication: ['타이레놀', '애드빌'],
    advice: '충분한 수분 섭취와 휴식을 취하세요. 목과 어깨 마사지가 도움됩니다.'
  },
  '기침': {
    diagnosis: '감기 또는 상기도염',
    medication: ['판콜', '베나린'],
    advice: '따뜻한 물을 많이 마시고, 가습기를 사용하세요.'
  },
  '복통': {
    diagnosis: '소화불량',
    medication: ['베아제', '겔포스'],
    advice: '기름진 음식을 피하고 소량씩 자주 드세요.'
  },
  '무릎통증': {
    diagnosis: '관절염 의심',
    medication: ['낙센', '셀레콕시브'],
    advice: '무리한 활동을 피하고 온찜질을 해보세요. 전문의 상담을 권합니다.'
  },
  '불면증': {
    diagnosis: '수면장애',
    medication: ['멜라토닌', '발레리안'],
    advice: '잠자리 2시간 전 스마트폰 사용을 피하고 따뜻한 우유를 드세요.'
  }
};

// API 라우트
app.post('/api/diagnose', (req, res) => {
  const { symptoms, age, gender } = req.body;
  
  let diagnosis = null;
  let matchedSymptom = null;
  
  for (const symptom in symptomDatabase) {
    if (symptoms.toLowerCase().includes(symptom)) {
      diagnosis = symptomDatabase[symptom];
      matchedSymptom = symptom;
      break;
    }
  }
  
  if (!diagnosis) {
    diagnosis = {
      diagnosis: '증상 분석 필요',
      medication: ['일반 종합비타민'],
      advice: '정확한 진단을 위해 병원 방문을 권장합니다.'
    };
    matchedSymptom = '기타 증상';
  }
  
  res.json({
    symptoms,
    age,
    gender,
    matchedSymptom,
    diagnosis
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`DoX 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
