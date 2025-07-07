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
            alert('궁금하면 500원 !');
        });
    });

    // '더 알아보기' 버튼 클릭 이벤트
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', () => {
            alert('사랑해 ❤️'); // 메시지 변경
        });
    }

    console.log('웹사이트가 성공적으로 로드되었습니다!');
});