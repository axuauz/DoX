
// DOM 요소들
const diagnosisForm = document.getElementById('diagnosisForm');
const diagnosisResult = document.getElementById('diagnosisResult');
const resultDetails = document.getElementById('resultDetails');

// 스크롤 함수
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 진단 폼 제출 처리
diagnosisForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    // 로딩 상태
    submitButton.innerHTML = '<span class="loading"></span> 진단 중...';
    submitButton.disabled = true;
    
    // 폼 데이터 수집
    const formData = new FormData(diagnosisForm);
    const data = {
        symptoms: formData.get('symptoms'),
        age: formData.get('age'),
        gender: formData.get('gender')
    };
    
    try {
        // API 호출
        const response = await fetch('/api/diagnose', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('네트워크 오류가 발생했습니다.');
        }
        
        const result = await response.json();
        
        // 결과 표시
        displayDiagnosisResult(result);
        
        // 결과 섹션으로 스크롤
        diagnosisResult.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
    } catch (error) {
        console.error('Error:', error);
        resultDetails.innerHTML = `
            <div class="error-message">
                <p><strong>오류:</strong> 진단 중 문제가 발생했습니다. 다시 시도해주세요.</p>
            </div>
        `;
        diagnosisResult.style.display = 'block';
    } finally {
        // 버튼 상태 복원
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// 진단 결과 표시 함수
function displayDiagnosisResult(result) {
    const { symptoms, age, gender, matchedSymptom, diagnosis, isEmergency } = result;
    
    // 응급상황인 경우 클래스 추가
    diagnosisResult.className = `diagnosis-result ${isEmergency ? 'emergency' : ''}`;
    
    let resultHTML = '';
    
    // 응급상황 알림
    if (isEmergency) {
        resultHTML += `
            <div class="emergency-alert">
                🚨 응급상황이 의심됩니다! 즉시 119에 신고하거나 병원을 방문하세요!
            </div>
        `;
    }
    
    // 진단 정보
    resultHTML += `
        <div class="result-item">
            <strong>입력된 증상:</strong> ${symptoms}
        </div>
        <div class="result-item">
            <strong>연령대/성별:</strong> ${age} / ${gender}
        </div>
        <div class="result-item">
            <strong>매칭된 증상:</strong> ${matchedSymptom}
        </div>
        <div class="result-item">
            <strong>진단명:</strong> ${diagnosis.diagnosis}
        </div>
        <div class="result-item">
            <strong>추천 약물:</strong> ${diagnosis.medication.join(', ')}
        </div>
        <div class="result-item">
            <strong>조언:</strong> ${diagnosis.advice}
        </div>
    `;
    
    // 응급상황인 경우 추가 정보
    if (isEmergency) {
        resultHTML += `
            <div class="result-item">
                <strong style="color: #dc3545;">⚠️ 주의사항:</strong>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>즉시 119에 전화하세요</li>
                    <li>가까운 응급실로 이동하세요</li>
                    <li>혼자 있지 마시고 누군가에게 도움을 요청하세요</li>
                </ul>
            </div>
        `;
    }
    
    resultDetails.innerHTML = resultHTML;
    diagnosisResult.style.display = 'block';
}

// 네비게이션 스크롤 효과
document.addEventListener('DOMContentLoaded', () => {
    // 네비게이션 링크들에 클릭 이벤트 추가
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const sectionId = href.substring(1); // # 제거
            scrollToSection(sectionId);
        });
    });
    
    // 스크롤에 따른 헤더 스타일 변경
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 스크롤 다운
            header.style.transform = 'translateY(-100%)';
        } else {
            // 스크롤 업
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 부드러운 스크롤 설정
    document.documentElement.style.scrollBehavior = 'smooth';
});

// 폼 유효성 검사
function validateForm() {
    const symptoms = document.getElementById('symptoms').value.trim();
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    
    if (!symptoms) {
        alert('증상을 입력해주세요.');
        return false;
    }
    
    if (!age) {
        alert('연령대를 선택해주세요.');
        return false;
    }
    
    if (!gender) {
        alert('성별을 선택해주세요.');
        return false;
    }
    
    return true;
}

// 진단 폼에 유효성 검사 추가
diagnosisForm.addEventListener('submit', (e) => {
    if (!validateForm()) {
        e.preventDefault();
        return false;
    }
});

// 입력 필드 실시간 유효성 검사
document.getElementById('symptoms').addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (value.length > 500) {
        e.target.style.borderColor = '#dc3545';
        // 경고 메시지 표시 (선택사항)
    } else {
        e.target.style.borderColor = '#e9ecef';
    }
});

// 접근성 개선: 키보드 네비게이션
document.addEventListener('keydown', (e) => {
    // ESC 키로 결과 숨기기
    if (e.key === 'Escape' && diagnosisResult.style.display === 'block') {
        diagnosisResult.style.display = 'none';
    }
    
    // Enter 키로 진단 시작 버튼 클릭
    if (e.key === 'Enter' && e.target.classList.contains('cta-button')) {
        e.target.click();
    }
});

// 터치 디바이스 최적화
if ('ontouchstart' in window) {
    // 터치 디바이스용 호버 효과 제거
    document.body.classList.add('touch-device');
}

// 성능 최적화: 이미지 레이지 로딩 (필요시)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    // 레이지 로딩 이미지가 있다면 적용
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
