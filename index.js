
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
