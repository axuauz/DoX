
// DOM Elements
const diagnosisForm = document.getElementById('diagnosisForm');
const diagnosisResult = document.getElementById('diagnosisResult');
const resultContent = document.getElementById('resultContent');
const submitButton = diagnosisForm.querySelector('.submit-button');
const loadingSpinner = submitButton.querySelector('.loading-spinner');

// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Active navigation link
function updateActiveNavLink() {
    const sections = ['home', 'diagnosis', 'posture', 'emergency', 'about'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) observer.observe(section);
    });
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Diagnosis form handling
async function handleDiagnosisSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(diagnosisForm);
    const data = {
        symptoms: formData.get('symptoms'),
        age: formData.get('age'),
        gender: formData.get('gender')
    };

    // Validation
    if (!data.symptoms.trim() || !data.age || !data.gender) {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    // Show loading state
    setLoadingState(true);

    try {
        const response = await fetch('/api/diagnose', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('진단 요청에 실패했습니다.');
        }

        const result = await response.json();
        displayDiagnosisResult(result);
    } catch (error) {
        console.error('Diagnosis error:', error);
        alert('진단 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        setLoadingState(false);
    }
}

function setLoadingState(loading) {
    if (loading) {
        submitButton.disabled = true;
        submitButton.querySelector('span').textContent = '진단 중...';
        loadingSpinner.style.display = 'block';
    } else {
        submitButton.disabled = false;
        submitButton.querySelector('span').textContent = '진단 받기';
        loadingSpinner.style.display = 'none';
    }
}

function displayDiagnosisResult(result) {
    let html = '';

    // Emergency alert
    if (result.isEmergency) {
        html += `
            <div class="emergency-alert">
                <h4>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    응급상황 의심
                </h4>
                <p>즉시 병원에 방문하거나 119에 신고하세요!</p>
            </div>
        `;
    }

    // Matched symptom
    html += `
        <div class="result-item">
            <h4>감지된 증상</h4>
            <p>${result.matchedSymptom || '기타 증상'}</p>
        </div>
    `;

    // Diagnosis
    html += `
        <div class="result-item">
            <h4>예상 진단</h4>
            <p>${result.diagnosis.diagnosis}</p>
        </div>
    `;

    // Medication
    if (result.diagnosis.medication && result.diagnosis.medication.length > 0) {
        html += `
            <div class="result-item">
                <h4>권장 의약품</h4>
                <ul>
                    ${result.diagnosis.medication.map(med => `<li>${med}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Advice
    if (result.diagnosis.advice) {
        html += `
            <div class="result-item">
                <h4>건강 조언</h4>
                <p>${result.diagnosis.advice}</p>
            </div>
        `;
    }

    // Disclaimer
    html += `
        <div class="result-item">
            <h4>⚠️ 주의사항</h4>
            <p>이 진단은 참고용이며, 정확한 진단을 위해 전문의와 상담하시기 바랍니다.</p>
        </div>
    `;

    resultContent.innerHTML = html;
    diagnosisResult.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeResult() {
    diagnosisResult.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    diagnosisForm.reset();
}

// Animation on scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Animate sections
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Handle navigation clicks
function handleNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Emergency contact analytics (optional)
function trackEmergencyContact(type, number) {
    console.log(`Emergency contact clicked: ${type} - ${number}`);
    // Here you could send analytics data to your backend
}

// Add click tracking to emergency contacts
function setupEmergencyTracking() {
    const emergencyLinks = document.querySelectorAll('a[href^="tel:"]');
    emergencyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const number = link.getAttribute('href').replace('tel:', '');
            const type = number === '119' ? 'emergency' : 'hospital';
            trackEmergencyContact(type, number);
        });
    });
}

// Form validation enhancements
function enhanceFormValidation() {
    const symptomsTextarea = document.getElementById('symptoms');
    const ageSelect = document.getElementById('age');
    const genderSelect = document.getElementById('gender');

    // Real-time validation feedback
    function validateField(field, condition, message) {
        const isValid = condition();
        field.style.borderColor = isValid ? 'var(--border)' : '#ef4444';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message if invalid
        if (!isValid) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.5rem';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }

        return isValid;
    }

    symptomsTextarea.addEventListener('blur', () => {
        validateField(symptomsTextarea, 
            () => symptomsTextarea.value.trim().length >= 5,
            '증상을 5글자 이상 입력해주세요.'
        );
    });

    ageSelect.addEventListener('change', () => {
        validateField(ageSelect,
            () => ageSelect.value !== '',
            '연령대를 선택해주세요.'
        );
    });

    genderSelect.addEventListener('change', () => {
        validateField(genderSelect,
            () => genderSelect.value !== '',
            '성별을 선택해주세요.'
        );
    });
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape key to close result modal
        if (e.key === 'Escape') {
            if (diagnosisResult.style.display === 'flex') {
                closeResult();
            }
        }

        // Enter key to submit form when focused on form elements
        if (e.key === 'Enter' && e.target.closest('.diagnosis-form')) {
            if (e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                handleDiagnosisSubmit(e);
            }
        }
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    handleHeaderScroll();
    updateActiveNavLink();
    handleNavigation();
    
    // Form handling
    diagnosisForm.addEventListener('submit', handleDiagnosisSubmit);
    enhanceFormValidation();
    
    // UI enhancements
    animateOnScroll();
    setupEmergencyTracking();
    setupKeyboardShortcuts();
    
    // Close modal when clicking outside
    diagnosisResult.addEventListener('click', (e) => {
        if (e.target === diagnosisResult) {
            closeResult();
        }
    });

    console.log('DoX 건강 진단 서비스가 초기화되었습니다.');
});

// ===== POSE ANALYSIS FUNCTIONALITY =====

// Pose analysis variables
const POSE_MODEL_URL = "https://teachablemachine.withgoogle.com/models/AUIPhvift/";
let poseModel, webcam, poseCtx, labelContainer, maxPredictions;
let currentPredictions = [];
let isPostureAnalysisActive = false;

// Initialize pose analysis
async function initPostureAnalysis() {
    const ageSelect = document.getElementById('postureAge');
    const genderSelect = document.getElementById('postureGender');
    
    // Validation
    if (!ageSelect.value || !genderSelect.value) {
        alert('연령대와 성별을 먼저 선택해주세요.');
        return;
    }

    const startButton = document.getElementById('startPostureAnalysis');
    const status = document.getElementById('postureStatus');
    
    try {
        startButton.disabled = true;
        startButton.innerHTML = '<span>모델 로딩 중...</span>';
        status.textContent = 'AI 모델을 로딩하는 중입니다...';

        // Load the pose model
        const modelURL = POSE_MODEL_URL + "model.json";
        const metadataURL = POSE_MODEL_URL + "metadata.json";
        
        poseModel = await tmPose.load(modelURL, metadataURL);
        maxPredictions = poseModel.getTotalClasses();

        status.textContent = '카메라 접근 권한을 요청합니다...';

        // Setup webcam
        const size = 320;
        const flip = true;
        webcam = new tmPose.Webcam(size, size, flip);
        await webcam.setup();
        await webcam.play();

        // Setup canvas
        const canvas = document.getElementById('postureCanvas');
        canvas.width = size;
        canvas.height = size;
        canvas.style.display = 'block';
        poseCtx = canvas.getContext('2d');

        // Setup prediction labels
        labelContainer = document.getElementById('postureLabels');
        labelContainer.innerHTML = '';
        for (let i = 0; i < maxPredictions; i++) {
            const div = document.createElement('div');
            div.className = 'prediction-label';
            labelContainer.appendChild(div);
        }

        status.textContent = '자세 분석이 시작되었습니다!';
        startButton.innerHTML = '자세 분석 중지';
        startButton.onclick = stopPostureAnalysis;
        
        isPostureAnalysisActive = true;
        window.requestAnimationFrame(poseLoop);

    } catch (error) {
        console.error('Pose analysis initialization error:', error);
        status.textContent = '카메라 접근에 실패했습니다. 브라우저에서 카메라 권한을 허용해주세요.';
        startButton.disabled = false;
        startButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>자세 분석 시작';
    }
}

// Pose detection loop
async function poseLoop(timestamp) {
    if (!isPostureAnalysisActive) return;
    
    webcam.update();
    await predictPose();
    window.requestAnimationFrame(poseLoop);
}

// Predict pose
async function predictPose() {
    try {
        // Get pose estimation
        const { pose, posenetOutput } = await poseModel.estimatePose(webcam.canvas);
        
        // Get predictions from model
        const prediction = await poseModel.predict(posenetOutput);
        currentPredictions = prediction;

        // Display predictions
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
            
            // Add color coding based on probability
            const probability = prediction[i].probability;
            if (probability > 0.7) {
                labelContainer.childNodes[i].style.backgroundColor = '#fee2e2';
                labelContainer.childNodes[i].style.color = '#dc2626';
            } else if (probability > 0.3) {
                labelContainer.childNodes[i].style.backgroundColor = '#fef3c7';
                labelContainer.childNodes[i].style.color = '#f59e0b';
            } else {
                labelContainer.childNodes[i].style.backgroundColor = '#f0f9ff';
                labelContainer.childNodes[i].style.color = '#0369a1';
            }
        }

        // Draw pose
        drawPose(pose);

        // Show advice for high-confidence predictions
        showPostureAdvice(prediction);

    } catch (error) {
        console.error('Pose prediction error:', error);
    }
}

// Draw pose on canvas
function drawPose(pose) {
    if (webcam.canvas) {
        poseCtx.drawImage(webcam.canvas, 0, 0);
        
        // Draw keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, poseCtx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, poseCtx);
        }
    }
}

// Show posture advice based on predictions
function showPostureAdvice(predictions) {
    const adviceDiv = document.getElementById('postureAdvice');
    const adviceContent = document.getElementById('postureAdviceContent');
    
    // Find highest confidence prediction
    let maxProb = 0;
    let detectedPosture = '';
    
    for (const pred of predictions) {
        if (pred.probability > maxProb) {
            maxProb = pred.probability;
            detectedPosture = pred.className;
        }
    }

    // Show advice if confidence is high enough
    if (maxProb > 0.7) {
        adviceDiv.style.display = 'block';
        
        let adviceHtml = `
            <div class="detected-posture">
                <h5>감지된 자세: <span class="posture-name">${detectedPosture}</span></h5>
                <p class="confidence">신뢰도: ${(maxProb * 100).toFixed(1)}%</p>
            </div>
        `;
        
        // Add quick advice based on detected posture
        if (detectedPosture !== '정상자세') {
            adviceHtml += `
                <div class="quick-advice">
                    <p><strong>즉시 조치:</strong></p>
                    <ul>
                        <li>등을 곧게 펴세요</li>
                        <li>어깨를 뒤로 당기세요</li>
                        <li>턱을 살짝 당기세요</li>
                    </ul>
                </div>
            `;
        } else {
            adviceHtml += `
                <div class="good-posture">
                    <p>✅ 좋은 자세를 유지하고 계십니다!</p>
                </div>
            `;
        }
        
        adviceContent.innerHTML = adviceHtml;
    } else {
        adviceDiv.style.display = 'none';
    }
}

// Get detailed posture analysis from API
async function getDetailedPostureAnalysis() {
    const ageSelect = document.getElementById('postureAge');
    const genderSelect = document.getElementById('postureGender');
    
    if (!currentPredictions || currentPredictions.length === 0) {
        alert('먼저 자세 분석을 시작해주세요.');
        return;
    }

    try {
        const response = await fetch('/api/pose-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                predictions: currentPredictions,
                age: ageSelect.value,
                gender: genderSelect.value
            })
        });

        if (!response.ok) {
            throw new Error('자세 분석 요청에 실패했습니다.');
        }

        const result = await response.json();
        displayDetailedPostureAnalysis(result);
        
    } catch (error) {
        console.error('Detailed posture analysis error:', error);
        alert('자세 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// Display detailed posture analysis results
function displayDetailedPostureAnalysis(result) {
    const adviceContent = document.getElementById('postureAdviceContent');
    
    let html = `
        <div class="detailed-analysis">
            <div class="analysis-header">
                <h4>상세 자세 분석 결과</h4>
                <span class="timestamp">${new Date(result.timestamp).toLocaleString()}</span>
            </div>
            
            <div class="posture-diagnosis">
                <h5>진단: ${result.postureAdvice.diagnosis}</h5>
                <div class="severity-${result.postureAdvice.severity}">
                    심각도: ${getSeverityText(result.postureAdvice.severity)}
                </div>
            </div>
            
            <div class="health-advice">
                <h5>건강 조언</h5>
                <p>${result.postureAdvice.advice}</p>
            </div>
    `;
    
    if (result.postureAdvice.exercises && result.postureAdvice.exercises.length > 0) {
        html += `
            <div class="exercise-recommendations">
                <h5>추천 운동</h5>
                <ul>
                    ${result.postureAdvice.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (result.relatedSymptoms && result.relatedSymptoms.length > 0) {
        html += `
            <div class="related-symptoms">
                <h5>관련 증상</h5>
                <p>이러한 자세로 인해 발생할 수 있는 증상:</p>
                <div class="symptom-tags">
                    ${result.relatedSymptoms.map(symptom => 
                        `<span class="symptom-tag" onclick="searchSymptom('${symptom}')">${symptom}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    html += `
            <div class="disclaimer">
                <p><small>⚠️ 이 분석은 참고용이며, 지속적인 자세 문제가 있을 경우 전문의와 상담하시기 바랍니다.</small></p>
            </div>
        </div>
    `;
    
    adviceContent.innerHTML = html;
}

// Helper function to get severity text
function getSeverityText(severity) {
    switch (severity) {
        case 'good': return '양호';
        case 'warning': return '주의';
        case 'caution': return '개선 필요';
        default: return '보통';
    }
}

// Search for related symptoms
function searchSymptom(symptom) {
    const symptomsTextarea = document.getElementById('symptoms');
    symptomsTextarea.value = symptom + ' 증상이 있어요';
    scrollToSection('diagnosis');
}

// Stop posture analysis
function stopPostureAnalysis() {
    isPostureAnalysisActive = false;
    
    if (webcam) {
        webcam.stop();
    }
    
    const canvas = document.getElementById('postureCanvas');
    const status = document.getElementById('postureStatus');
    const startButton = document.getElementById('startPostureAnalysis');
    const adviceDiv = document.getElementById('postureAdvice');
    
    canvas.style.display = 'none';
    status.textContent = '자세 분석이 중지되었습니다.';
    adviceDiv.style.display = 'none';
    
    startButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>자세 분석 시작';
    startButton.onclick = initPostureAnalysis;
    startButton.disabled = false;
}

// Export functions for global use
window.scrollToSection = scrollToSection;
window.closeResult = closeResult;
window.initPostureAnalysis = initPostureAnalysis;
window.getDetailedPostureAnalysis = getDetailedPostureAnalysis;
