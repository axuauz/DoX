
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
    const sections = ['home', 'diagnosis', 'emergency', 'about'];
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

// Export functions for global use
window.scrollToSection = scrollToSection;
window.closeResult = closeResult;
