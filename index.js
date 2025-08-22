
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 5000;

// creative-agency-portfolio 폴더를 Next.js 앱의 루트로 설정
const appDir = path.join(__dirname, 'creative-agency-portfolio');
const app = next({ 
  dev, 
  hostname, 
  port, 
  dir: appDir,
  conf: {
    experimental: {
      outputFileTracingRoot: __dirname,
    },
  }
});
const handle = app.getRequestHandler();

// 진단 API 데이터 (DoX 전용 기능)
const symptomDatabase = {
  '두통': {
    diagnosis: '긴장성 두통',
    medication: ['타이레놀', '애드빌'],
    advice: '충분한 수분 섭취와 휴식을 취하세요. 목과 어깨 마사지가 도움됩니다.',
    severity: 'low'
  },
  '기침': {
    diagnosis: '감기 또는 상기도염',
    medication: ['판콜', '베나린'],
    advice: '따뜻한 물을 많이 마시고, 가습기를 사용하세요.',
    severity: 'low'
  },
  '복통': {
    diagnosis: '소화불량',
    medication: ['베아제', '겔포스'],
    advice: '기름진 음식을 피하고 소량씩 자주 드세요.',
    severity: 'medium'
  },
  '무릎통증': {
    diagnosis: '관절염 의심',
    medication: ['낙센', '셀레콕시브'],
    advice: '무리한 활동을 피하고 온찜질을 해보세요. 전문의 상담을 권합니다.',
    severity: 'medium'
  },
  '가슴통증': {
    diagnosis: '응급상황 의심',
    medication: ['즉시 병원 방문'],
    advice: '즉시 응급실로 가세요. 119에 신고하시기 바랍니다.',
    severity: 'high'
  },
  '호흡곤란': {
    diagnosis: '응급상황 의심',
    medication: ['즉시 병원 방문'],
    advice: '즉시 응급실로 가세요. 119에 신고하시기 바랍니다.',
    severity: 'high'
  },
  '불면증': {
    diagnosis: '수면장애',
    medication: ['멜라토닌', '발레리안'],
    advice: '잠자리 2시간 전 스마트폰 사용을 피하고 따뜻한 우유를 드세요.',
    severity: 'low'
  }
};

// 응급상황 키워드 목록
const emergencyKeywords = ['가슴통증', '호흡곤란', '의식잃음', '심한복통', '고열', '경련'];

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // DoX 진단 API 라우트
      if (pathname === '/api/diagnose') {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { symptoms, age, gender } = JSON.parse(body);
              
              let diagnosis = null;
              let matchedSymptom = null;
              let isEmergency = false;
              
              // 응급상황 체크
              for (const keyword of emergencyKeywords) {
                if (symptoms.toLowerCase().includes(keyword)) {
                  isEmergency = true;
                  break;
                }
              }
              
              // 증상 매칭
              for (const symptom in symptomDatabase) {
                if (symptoms.toLowerCase().includes(symptom)) {
                  diagnosis = symptomDatabase[symptom];
                  matchedSymptom = symptom;
                  if (diagnosis.severity === 'high') {
                    isEmergency = true;
                  }
                  break;
                }
              }
              
              if (!diagnosis) {
                diagnosis = {
                  diagnosis: '증상 분석 필요',
                  medication: ['일반 종합비타민'],
                  advice: '정확한 진단을 위해 병원 방문을 권장합니다.',
                  severity: 'unknown'
                };
                matchedSymptom = '기타 증상';
              }
              
              res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
              });
              
              res.end(JSON.stringify({
                symptoms,
                age,
                gender,
                matchedSymptom,
                diagnosis,
                isEmergency,
                timestamp: new Date().toISOString()
              }));
            } catch (parseError) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid JSON format' }));
            }
          });
        } else if (req.method === 'OPTIONS') {
          // CORS preflight 처리
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
          res.end();
        }
      } 
      // 응급연락처 API
      else if (pathname === '/api/emergency') {
        res.writeHead(200, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          emergency: '119',
          hospitals: [
            { name: '서울대학교병원', phone: '02-2072-2114' },
            { name: '삼성서울병원', phone: '02-3410-2114' },
            { name: '서울아산병원', phone: '02-3010-3000' }
          ]
        }));
      }
      else {
        // 모든 다른 요청은 Next.js로 전달
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> DoX 건강 진단 서비스가 http://${hostname}:${port}에서 실행 중입니다.`);
    console.log(`> Creative Agency Portfolio가 Next.js로 실행됩니다.`);
  });
});
