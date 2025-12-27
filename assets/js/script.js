// ===================================
// 글자수 세기 도구 JavaScript
// jQuery를 사용한 실시간 텍스트 분석
// ===================================

$(document).ready(function() {
    
    // ===================================
    // 텍스트 입력 이벤트 핸들러
    // ===================================
    $('#text-input').on('input', function() {
        const text = $(this).val();
        updateStats(text);
    });

    // ===================================
    // 텍스트 지우기 버튼 이벤트
    // ===================================
    $('#clear-btn').on('click', function() {
        $('#text-input').val('');
        updateStats('');
        $('#text-input').focus();
        
        // 버튼 클릭 효과
        $(this).addClass('clicked');
        setTimeout(() => {
            $(this).removeClass('clicked');
        }, 200);
    });

    // ===================================
    // 통계 업데이트 함수
    // ===================================
    function updateStats(text) {
        // 1. 공백 포함 글자수
        const charCount = text.length;
        
        // 2. 공백 제외 글자수
        const charCountNoSpace = text.replace(/\s/g, '').length;
        
        // 3. 단어 수 (한글, 영문 구분)
        const wordCount = calculateWordCount(text);
        
        // 4. 줄 수
        const lineCount = text ? text.split(/\r\n|\r|\n/).length : 0;
        
        // 5. 한글 글자수
        const koreanCount = (text.match(/[가-힣]/g) || []).length;
        
        // 6. 영문 글자수
        const englishCount = (text.match(/[a-zA-Z]/g) || []).length;
        
        // 7. 숫자 개수
        const numberCount = (text.match(/[0-9]/g) || []).length;
        
        // 8. 예상 읽기 시간 (분당 200자 기준)
        const readingTime = calculateReadingTime(charCount);

        // UI 업데이트 (애니메이션 효과)
        animateValue('char-count', charCount);
        animateValue('char-count-no-space', charCountNoSpace);
        animateValue('word-count', wordCount);
        animateValue('line-count', lineCount);
        animateValue('korean-count', koreanCount);
        animateValue('english-count', englishCount);
        animateValue('number-count', numberCount);
        $('#reading-time').text(readingTime);
    }

    // ===================================
    // 단어 수 계산 함수
    // ===================================
    function calculateWordCount(text) {
        if (!text.trim()) return 0;
        
        // 한글과 영문을 구분하여 계산
        // 한글: 공백으로 구분
        // 영문: 공백으로 구분
        const words = text.trim().split(/\s+/);
        return words.length;
    }

    // ===================================
    // 읽기 시간 계산 함수
    // ===================================
    function calculateReadingTime(charCount) {
        if (charCount === 0) return '0';
        
        // 분당 약 200자를 읽는다고 가정
        const minutes = Math.ceil(charCount / 200);
        
        if (minutes < 1) {
            return '1분 미만';
        } else if (minutes === 1) {
            return '약 1';
        } else {
            return `약 ${minutes}`;
        }
    }

    // ===================================
    // 숫자 애니메이션 효과
    // ===================================
    function animateValue(elementId, newValue) {
        const element = $('#' + elementId);
        const currentValue = parseInt(element.text()) || 0;
        
        // 값이 같으면 애니메이션 생략
        if (currentValue === newValue) return;
        
        // 숫자가 커지면 강조 효과
        if (newValue > currentValue) {
            element.addClass('highlight');
            setTimeout(() => {
                element.removeClass('highlight');
            }, 300);
        }
        
        element.text(newValue);
    }

    // ===================================
    // 키보드 단축키
    // ===================================
    $(document).on('keydown', function(e) {
        // Ctrl + L 또는 Cmd + L: 텍스트 지우기
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            $('#clear-btn').click();
        }
    });

    // ===================================
    // 페이지 로드 시 초기화
    // ===================================
    updateStats('');
    
    // 텍스트 입력란에 포커스
    $('#text-input').focus();

    // ===================================
    // 스크롤 애니메이션 효과
    // ===================================
    $(window).on('scroll', function() {
        $('.stat-card').each(function() {
            const cardTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            
            if (cardTop < windowBottom - 50) {
                $(this).addClass('visible');
            }
        });
    });

    // ===================================
    // localStorage를 이용한 자동 저장 (선택사항)
    // ===================================
    // 텍스트 자동 저장
    $('#text-input').on('input', function() {
        const text = $(this).val();
        localStorage.setItem('savedText', text);
    });

    // 페이지 로드 시 저장된 텍스트 불러오기
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
        $('#text-input').val(savedText);
        updateStats(savedText);
    }

    // ===================================
    // 복사하기 기능 (추가)
    // ===================================
    $('#text-input').on('dblclick', function() {
        if ($(this).val()) {
            $(this).select();
        }
    });

});

// ===================================
// CSS 강조 효과를 위한 스타일 추가
// ===================================
const style = document.createElement('style');
style.textContent = `
    .stat-value.highlight {
        color: #254038;
        transform: scale(1.1);
        transition: all 0.3s ease;
    }
    
    .clear-button.clicked {
        transform: scale(0.95);
    }
    
    .stat-card.visible {
        animation: slideIn 0.5s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

