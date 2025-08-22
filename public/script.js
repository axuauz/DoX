
// 페이지 로드시 애니메이션
document.addEventListener('DOMContentLoaded', function() {
    // 폼 요소들에 포커스 애니메이션 추가
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // 증상 입력시 자동 완성 힌트
    const symptomsTextarea = document.getElementById('symptoms');
    if (symptomsTextarea) {
        const commonSymptoms = ['두통', '기침', '복통', '무릎통증', '불면증', '어지러움', '가슴답답함'];
        
        symptomsTextarea.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value.length > 1) {
                // 간단한 자동완성 로직 (실제로는 더 정교한 구현 필요)
                console.log('입력된 증상:', value);
            }
        });
    }
    
    // 폰트 크기 조절 기능
    let fontSize = 18;
    const adjustFontSize = (increase) => {
        fontSize += increase ? 2 : -2;
        fontSize = Math.max(14, Math.min(24, fontSize));
        document.body.style.fontSize = fontSize + 'px';
    };
    
    // 키보드 단축키 (접근성)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === '=') {
            e.preventDefault();
            adjustFontSize(true);
        } else if (e.ctrlKey && e.key === '-') {
            e.preventDefault();
            adjustFontSize(false);
        }
    });
    
    // 음성 안내 기능 (브라우저 지원시)
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            utterance.rate = 0.8; // 천천히 읽기
            speechSynthesis.speak(utterance);
        }
    };
    
    // 진단 결과 읽어주기 버튼
    const resultSection = document.querySelector('.diagnosis-card');
    if (resultSection) {
        const speakButton = document.createElement('button');
        speakButton.textContent = '🔊 결과 읽어주기';
        speakButton.className = 'btn-secondary';
        speakButton.style.marginTop = '20px';
        speakButton.onclick = () => {
            const diagnosis = document.querySelector('.diagnosis-name').textContent;
            const advice = document.querySelector('.advice-text').textContent;
            speakText(`진단 결과는 ${diagnosis}입니다. ${advice}`);
        };
        resultSection.appendChild(speakButton);
    }
});

// 폼 제출시 로딩 표시
const form = document.querySelector('.diagnosis-form');
if (form) {
    form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('.btn-primary');
        submitBtn.textContent = '진단 중...';
        submitBtn.style.background = '#ccc';
        submitBtn.disabled = true;
    });
}

// 응급 전화 확인 다이얼로그
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-emergency-call')) {
        const phoneNumber = e.target.href.replace('tel:', '');
        if (!confirm(`${phoneNumber}으로 전화를 거시겠습니까?`)) {
            e.preventDefault();
        }
    }
});
