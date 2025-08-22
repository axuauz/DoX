
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 5000;

// Next.js 앱 설정
const app = next({ dev, hostname, port, dir: './creative-agency-portfolio' });
const handle = app.getRequestHandler();

// 진단 API 데이터
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

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // API 라우트 처리
      if (pathname === '/api/diagnose') {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const { symptoms, age, gender } = JSON.parse(body);
            
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
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              symptoms,
              age,
              gender,
              matchedSymptom,
              diagnosis
            }));
          });
        }
      } else {
        // Next.js 핸들러로 전달
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> DoX 서버가 http://${hostname}:${port}에서 실행 중입니다.`);
  });
});
