// DOM이 완전히 로드되면 실행됩니다.
document.addEventListener('DOMContentLoaded', () => {
    const introTitle = document.getElementById('intro-title');
    const titleSpans = introTitle ? introTitle.querySelectorAll('span') : [];
    const learnMoreButton = document.getElementById('learn-more-button');
    const viewAllButtons = document.querySelectorAll('.view-all-button');
    const searchButton = document.querySelector('.search-bar button');

    // 상수 정의 (매직 넘버 개선)
    const HEART_POP_DELAY = 100;
    const FLOAT_HEART_COUNT = 3;
    const FLOAT_HEART_OFFSET_RANGE = 40;
    const FLOAT_HEART_LIFETIME_MS = 1000;
    const FLOAT_BUBBLE_LIFETIME_MS = 1200;
    const HEART_SNOW_INTERVAL_MS = 300;
    const HEART_SNOW_DURATION_MIN = 4;
    const HEART_SNOW_DURATION_MAX = 8;
    const HEART_SNOW_SIZE_MIN = 0.6;
    const HEART_SNOW_SIZE_MAX = 1.2;

    // "다나의 세상" 글자 애니메이션
    if (titleSpans.length > 0) {
        titleSpans.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add('appear');
            }, HEART_POP_DELAY * index);
        });
    }

    // '궁금해요?' 버튼 클릭 이벤트 (모든 .view-all-button에 적용)
    viewAllButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('뭐! 안알려줄거다 !');
            alert('궁금해 하지마라.');
        });
    });

    // '뭐 !! 아몰라 !' 버튼 클릭 이벤트
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', () => {
            alert('사랑해 ❤️');
            alert('꺼질줄 알았지?');
        });
    }

    // 검색 바 버튼 클릭 이벤트 통합
    if (searchButton) {
        const popSound = new Audio('pop.mp3'); // 오디오 객체 미리 생성

        searchButton.addEventListener('click', () => {
            // 하트 뿅 애니메이션
            const heartPopElement = searchButton.querySelector('.heart-pop');
            if (heartPopElement) {
                heartPopElement.classList.remove('show');
                void heartPopElement.offsetWidth; // 강제 리렌더링
                heartPopElement.classList.add('show');
            }

            // 뿅 소리 재생
            popSound.currentTime = 0; // 재생 위치 초기화 (연속 클릭 시)
            popSound.play().catch(e => console.error("Audio play failed:", e)); // 에러 처리 추가

            // 💖 하트 여러 개 띄우기
            for (let i = 0; i < FLOAT_HEART_COUNT; i++) {
                const heart = document.createElement('span');
                heart.classList.add('floating-heart');
                heart.innerText = '💖';
                heart.setAttribute('aria-hidden', 'true'); // 스크린 리더 숨김

                const offset = (Math.random() - 0.5) * FLOAT_HEART_OFFSET_RANGE;
                heart.style.left = `${50 + offset}%`;

                searchButton.appendChild(heart);
                setTimeout(() => heart.remove(), FLOAT_HEART_LIFETIME_MS);
            }

            // 💬 "다나 사랑해요" 말풍선 띄우기
            const bubble = document.createElement('span');
            bubble.classList.add('floating-bubble');
            bubble.innerText = '다나 사랑해요 💗';
            bubble.setAttribute('aria-hidden', 'true'); // 스크린 리더 숨김

            // 버튼 위치 기준 좌표 계산하여 말풍선 위치 고정
            const buttonRect = searchButton.getBoundingClientRect();
            bubble.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
            bubble.style.top = `${buttonRect.top}px`;
            bubble.style.position = 'fixed'; // body 위치 기준으로 고정

            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), FLOAT_BUBBLE_LIFETIME_MS);
        });
    }

    // 💖 하트 눈송이 애니메이션 생성 함수
    function createHeartSnow() {
        const container = document.querySelector('.heart-snow-container');
        if (!container) return; // 컨테이너 없으면 실행 중단

        const heart = document.createElement('div');
        heart.classList.add('heart-snow');
        heart.innerText = '💖';
        heart.setAttribute('aria-hidden', 'true'); // 스크린 리더 숨김

        const size = Math.random() * HEART_SNOW_SIZE_MAX + HEART_SNOW_SIZE_MIN;
        const left = Math.random() * 100; // % 위치
        const duration = Math.random() * HEART_SNOW_DURATION_MIN + HEART_SNOW_DURATION_MAX;

        heart.style.left = `${left}%`;
        heart.style.fontSize = `${size}rem`;
        heart.style.animationDuration = `${duration}s`;

        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // 💖 하트 눈송이 계속 생성
    setInterval(createHeartSnow, HEART_SNOW_INTERVAL_MS);

    console.log('웹사이트가 성공적으로 로드되었습니다!');
});