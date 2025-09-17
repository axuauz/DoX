
const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

const hostname = '0.0.0.0';
const port = process.env.PORT || 5000;

// DoX 진단 API 목업 데이터
const symptomDatabase = {
  '두통': {
    diagnosis: '긴장성 두통',
    medication: ['타이레놀', '애드빌'],
    advice: '수분 섭취와 휴식을 취하세요. 목·어깨 마사지가 도움됩니다.',
    severity: 'low'
  },
  '기침': {
    diagnosis: '감기 또는 상기도염',
    medication: ['판콜', '베나린'],
    advice: '따뜻한 물을 많이 마시고 가습기를 사용하세요.',
    severity: 'low'
  },
  '복통': {
    diagnosis: '소화불량',
    medication: ['베아제', '겔포스'],
    advice: '기름진 음식은 피하고 소량씩 자주 드세요.',
    severity: 'medium'
  },
  '무릎통증': {
    diagnosis: '관절염 의심',
    medication: ['낙센', '셀레콕시브'],
    advice: '무리한 활동을 피하고 온찜질을 해보세요. 전문의 상담 권장.',
    severity: 'medium'
  },
  '가슴통증': {
    diagnosis: '응급상황 의심',
    medication: ['즉시 병원 방문'],
    advice: '즉시 응급실로 가세요. 119에 신고하세요.',
    severity: 'high'
  },
  '호흡곤란': {
    diagnosis: '응급상황 의심',
    medication: ['즉시 병원 방문'],
    advice: '즉시 응급실로 가세요. 119에 신고하세요.',
    severity: 'high'
  },
  '불면증': {
    diagnosis: '수면장애',
    medication: ['멜라토닌', '발레리안'],
    advice: '잠자리 2시간 전 스마트폰 사용 금지, 따뜻한 우유 권장.',
    severity: 'low'
  },
  '목통증': {
    diagnosis: '경추성 목통증',
    medication: ['근이완제', '소염진통제'],
    advice: '올바른 자세를 유지하고 목 스트레칭을 하세요. 베개 높이를 조절해보세요.',
    severity: 'medium'
  },
  '어깨통증': {
    diagnosis: '어깨 근육 긴장',
    medication: ['파스', '근이완제'],
    advice: '어깨 운동과 마사지를 하세요. 무거운 물건 들기를 피하세요.',
    severity: 'medium'
  },
  '허리통증': {
    diagnosis: '요추성 허리통증',
    medication: ['소염진통제', '근이완제'],
    advice: '바른 자세로 앉고 허리 스트레칭을 하세요. 딱딱한 의자 사용을 권장합니다.',
    severity: 'medium'
  },
  '굽은등': {
    diagnosis: '자세 불량 (거북목 증후군)',
    medication: ['근이완제', '비타민D'],
    advice: '모니터 높이를 조절하고 자세 교정 운동을 하세요. 1시간마다 스트레칭하세요.',
    severity: 'medium'
  }
};

// 자세별 건강 권장사항
const postureRecommendations = {
  '정상자세': {
    diagnosis: '양호한 자세',
    advice: '현재 자세가 좋습니다. 이 자세를 유지하세요.',
    exercises: ['목과 어깨 스트레칭을 꾸준히 하세요'],
    severity: 'good'
  },
  '앞으로숙임': {
    diagnosis: '전방머리자세 (거북목)',
    advice: '목과 어깨에 무리가 갈 수 있습니다. 자세 교정이 필요합니다.',
    exercises: ['턱 당기기 운동', '목 뒤쪽 근육 강화 운동', '가슴 펴기 스트레칭'],
    severity: 'warning'
  },
  '굽은어깨': {
    diagnosis: '어깨 말림 자세',
    advice: '어깨와 등 근육의 불균형으로 인한 자세입니다.',
    exercises: ['어깨 뒤로 돌리기', '가슴 근육 스트레칭', '등 근육 강화 운동'],
    severity: 'warning'
  },
  '굽은등': {
    diagnosis: '척추 후만증 의심',
    advice: '등이 많이 굽어져 있습니다. 전문의 상담을 권장합니다.',
    exercises: ['등 펴기 운동', '복부 근력 강화', '가슴 스트레칭'],
    severity: 'caution'
  }
};

const emergencyKeywords = ['가슴통증', '호흡곤란', '의식잃음', '심한복통', '고열', '경련'];

// MIME 타입 매핑
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// CORS 헬퍼
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 정적 파일 서빙 함수
function serveStaticFile(filePath, res) {
  const ext = path.extname(filePath);
  const mimeType = mimeTypes[ext] || 'text/plain';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

createServer((req, res) => {
  try {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Preflight
    if (req.method === 'OPTIONS') {
      setCors(res);
      res.writeHead(200);
      return res.end();
    }

    // API: /api/diagnose
    if (pathname === '/api/diagnose') {
      setCors(res);

      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      }

      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          const { symptoms = '', age = null, gender = null } = JSON.parse(body || '{}');

          let diagnosis = null;
          let matchedSymptom = null;
          let isEmergency = false;

          // 응급 키워드 매칭
          for (const k of emergencyKeywords) {
            if (String(symptoms).toLowerCase().includes(k)) {
              isEmergency = true;
              break;
            }
          }

          // 증상 DB 매칭
          for (const symptom of Object.keys(symptomDatabase)) {
            if (String(symptoms).toLowerCase().includes(symptom)) {
              diagnosis = symptomDatabase[symptom];
              matchedSymptom = symptom;
              if (diagnosis.severity === 'high') isEmergency = true;
              break;
            }
          }

          if (!diagnosis) {
            diagnosis = {
              diagnosis: '증상 분석 필요',
              medication: ['일반 종합비타민'],
              advice: '정확한 진단을 위해 병원 방문을 권장합니다.',
              severity: 'unknown',
            };
            matchedSymptom = '기타 증상';
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(
            JSON.stringify({
              symptoms,
              age,
              gender,
              matchedSymptom,
              diagnosis,
              isEmergency,
              timestamp: new Date().toISOString(),
            })
          );
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        }
      });
      return;
    }

    // API: /api/emergency
    if (pathname === '/api/emergency') {
      setCors(res);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          emergency: '119',
          hospitals: [
            { name: '서울대학교병원', phone: '02-2072-2114' },
            { name: '삼성서울병원', phone: '02-3410-2114' },
            { name: '서울아산병원', phone: '02-3010-3000' },
          ],
        })
      );
    }

    // API: /api/pose-analysis
    if (pathname === '/api/pose-analysis') {
      setCors(res);

      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      }

      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          const { predictions = [], age = null, gender = null } = JSON.parse(body || '{}');

          // 가장 높은 확률의 자세 클래스 찾기
          let detectedPosture = '정상자세';
          let maxProbability = 0;

          if (predictions && predictions.length > 0) {
            for (const prediction of predictions) {
              if (prediction.probability > maxProbability) {
                maxProbability = prediction.probability;
                detectedPosture = prediction.className;
              }
            }
          }

          // 자세별 권장사항 매핑
          let postureAdvice = postureRecommendations[detectedPosture] || postureRecommendations['정상자세'];
          
          // 확률이 낮으면 정상자세로 판정
          if (maxProbability < 0.7) {
            detectedPosture = '정상자세';
            postureAdvice = postureRecommendations['정상자세'];
          }

          // 자세 관련 증상 추천
          const relatedSymptoms = [];
          if (detectedPosture !== '정상자세') {
            if (detectedPosture.includes('앞으로숙임') || detectedPosture.includes('목')) {
              relatedSymptoms.push('목통증');
            }
            if (detectedPosture.includes('어깨') || detectedPosture.includes('굽은')) {
              relatedSymptoms.push('어깨통증');
            }
            if (detectedPosture.includes('굽은등') || detectedPosture.includes('등')) {
              relatedSymptoms.push('허리통증', '굽은등');
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(
            JSON.stringify({
              detectedPosture,
              probability: maxProbability,
              postureAdvice,
              relatedSymptoms,
              age,
              gender,
              timestamp: new Date().toISOString(),
            })
          );
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        }
      });
      return;
    }

    let filePath;
    if (pathname === '/') {
      filePath = path.join(__dirname, 'public', 'index.html');
    } else {
      filePath = path.join(__dirname, 'public', pathname);
    }

    const publicDir = path.join(__dirname, 'public');
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(publicDir)) {
      res.writeHead(403, { 'Content-Type': 'text/html' });
      return res.end('<h1>403 Forbidden</h1>');
    }

    serveStaticFile(filePath, res);

  } catch (err) {
    console.error('Error occurred handling', req.url, err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}).listen(port, hostname, () => {
  console.log(`> DoX 건강 진단 서비스가 http://${hostname}:${port}에서 실행 중입니다.`);
});
