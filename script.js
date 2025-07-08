// DOM이 완전히 로드되면 실행됩니다.
document.addEventListener('DOMContentLoaded', () => {
    const introTitle = document.getElementById('intro-title');
    const titleSpans = introTitle ? introTitle.querySelectorAll('span') : [];
    // '더 알아보기' 버튼의 ID를 사용하여 가져옵니다.
    const learnMoreButton = document.getElementById('learn-more-button');


    // "새로운 시작" 글자 애니메이션
    if (titleSpans.length > 0) {
        titleSpans.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add('appear');
            }, 100 * index); // 각 글자마다 100ms씩 딜레이를 줍니다.
        });
    }

    // 모든 '모든 소식 보기' 버튼에 이벤트 리스너 추가 (새로 추가된 버튼)
    const viewAllButtons = document.querySelectorAll('.view-all-button');
    viewAllButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('뭐! 안알려줄거다 !');
            alert('궁금해 하지마라.');
        });
    });

    // '더 알아보기' 버튼 클릭 이벤트
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', () => {
            alert('사랑해 ❤️'); // 메시지 변경
            alert('꺼질줄 알았지?'); // 메시지 변경
        });
    }

    console.log('웹사이트가 성공적으로 로드되었습니다!');
});
// 하트 뿅 애니메이션
document.querySelectorAll('.search-bar button').forEach(button => {
    button.addEventListener('click', () => {
        const heart = button.querySelector('.heart-pop');
        if (heart) {
            heart.classList.remove('show'); // 초기화
            void heart.offsetWidth; // 강제 리렌더링 (애니 재시작용)
            heart.classList.add('show');
        }
    });
});
// 버튼 클릭 시 하트 여러 개 + 뿅 소리
document.querySelectorAll('.search-bar button').forEach(button => {
    button.addEventListener('click', () => {
        // 소리 재생
        const sound = new Audio('pop.mp3');
        sound.play();

        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('span');
            heart.classList.add('floating-heart');
            heart.innerText = '💖';

            // 버튼 위치 기준 랜덤 위치 지정
            const offset = (Math.random() - 0.5) * 40;
            heart.style.left = `${50 + offset}%`;

            button.appendChild(heart);

            // 하트 애니 끝나면 제거
            setTimeout(() => heart.remove(), 1000);
        }
    });
});
document.querySelectorAll('.search-bar button').forEach(button => {
    button.addEventListener('click', () => {
        // 💥 소리
        const sound = new Audio('pop.mp3');
        sound.play();

        // 💖 하트 3개
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('span');
            heart.classList.add('floating-heart');
            heart.innerText = '💖';

            const offset = (Math.random() - 0.5) * 40;
            heart.style.left = `${50 + offset}%`;

            button.appendChild(heart);
            setTimeout(() => heart.remove(), 1000);
        }

        // 💬 "다나 사랑해요" 말풍선 (버튼 밖에 띄우기)
        const bubble = document.createElement('span');
        bubble.classList.add('floating-bubble');
        bubble.innerText = '다나 사랑해요 💗';

        // 버튼의 위치 기준 좌표 계산
        const buttonRect = button.getBoundingClientRect();
        bubble.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
        bubble.style.top = `${buttonRect.top}px`;
        bubble.style.position = 'fixed'; // body 위치 기준으로 고정

        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 1200);
    });
});
function createHeartSnow() {
    const container = document.querySelector('.heart-snow-container');
    const heart = document.createElement('div');
    heart.classList.add('heart-snow');
    heart.innerText = '💖';

    const size = Math.random() * 1.2 + 0.6; // 0.6~1.8 rem
    const left = Math.random() * 100; // % 위치
    const duration = Math.random() * 4 + 4; // 4~8초

    heart.style.left = `${left}%`;
    heart.style.fontSize = `${size}rem`;
    heart.style.animationDuration = `${duration}s`;

    container.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// 💖 하트 계속 생성
setInterval(createHeartSnow, 300); // 0.3초마다 생성
