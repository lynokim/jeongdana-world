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
    const HEART_SNOW_INTERVAL_MS = 1500; // 하트 생성 간격을 1.5초로 늘려 양을 조절합니다.
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

    // "자세히 알아보기" 버튼 클릭 시 안내 팝업 띄우기
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', (e) => {
            e.preventDefault();
            alert('정다나에 대해 더 많은 정보는 준비 중이에요 💕\n곧 공개될 예정이니 기대해주세요!');
        });
    }


    // "궁금해요?" 버튼 클릭 시 동작 (추후 기능 추가 예정)
    viewAllButtons.forEach(button => {
        button.addEventListener('click', () => {
             alert('더 많은 소식이 준비 중입니다! 기대해주세요 😊');
        });
    });

    // 💖 검색창 하트 버튼 클릭 시 애니메이션
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const heartPop = searchButton.querySelector('.heart-pop');
            if (heartPop) {
                heartPop.classList.remove('animate'); // 애니메이션 재시작을 위해 클래스 제거
                void heartPop.offsetWidth; // Reflow를 강제하여 애니메이션 재시작
                heartPop.classList.add('animate'); // 애니메이션 추가

                // 💖 주변에 떠다니는 하트 생성
                for (let i = 0; i < FLOAT_HEART_COUNT; i++) {
                    const floatHeart = document.createElement('span');
                    floatHeart.classList.add('floating-heart');
                    floatHeart.innerText = '💖';
                    floatHeart.style.left = `${Math.random() * FLOAT_HEART_OFFSET_RANGE - (FLOAT_HEART_OFFSET_RANGE / 2)}px`;
                    floatHeart.style.top = `${Math.random() * FLOAT_HEART_OFFSET_RANGE - (FLOAT_HEART_OFFSET_RANGE / 2)}px`;
                    searchButton.appendChild(floatHeart);

                    floatHeart.addEventListener('animationend', () => {
                        floatHeart.remove();
                    });
                }
            }
            // "뿅!" 말풍선 생성
            const bubble = document.createElement('div');
            bubble.classList.add('floating-bubble');
            bubble.innerText = '기능 없지롱🤣';
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
        heart.style.animationDelay = `${Math.random() * duration}s`; // 애니메이션 시작 지연 무작위화

        container.appendChild(heart);

        // 애니메이션 종료 후 하트 제거
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    // 일정 간격으로 하트 눈송이 생성
    setInterval(createHeartSnow, HEART_SNOW_INTERVAL_MS);

    // 사다리 게임 로직
    const ladderCanvas = document.getElementById('ladderCanvas');
    const ladderCtx = ladderCanvas ? ladderCanvas.getContext('2d') : null;
    const startInputsContainer = document.getElementById('start-inputs');
    const outcomesContainer = document.getElementById('outcomes');
    const addInputBtn = document.getElementById('addInputBtn');
    const removeInputBtn = document.getElementById('removeInputBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const inputCountDisplay = document.getElementById('inputCount');

    let inputs = ['다나 1', '다나 2', '다나 3', '다나 4'];
    let outcomes = ['선물 1', '선물 2', '꽝', '당첨']; // 초기 결과값
    let shuffledOutcomes = []; // 결과를 섞을 배열 추가

    const MIN_INPUTS = 2;
    const MAX_INPUTS = 6;
    const CANVAS_HEIGHT = 400; // 캔버스 높이 고정 (모바일에서도 일정 높이 유지)
    const LADDER_TOP_MARGIN = 50; // 사다리 시작 지점 상단 여백
    const LADDER_BOTTOM_MARGIN = 50; // 사다리 끝 지점 하단 여백

    // 🍎 입력 및 결과 목록 업데이트 함수
    function updateList() {
        startInputsContainer.innerHTML = '';
        inputs.forEach((input, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<input type="text" value="${input}" data-index="${index}" class="start-input-field">`;
            startInputsContainer.appendChild(li);
        });

        outcomesContainer.innerHTML = '';
        outcomes.forEach((outcome, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<input type="text" value="${outcome}" data-index="${index}" class="outcome-input-field">`;
            outcomesContainer.appendChild(li);
        });

        inputCountDisplay.textContent = inputs.length;

        // 입력 필드 변경 이벤트 리스너
        document.querySelectorAll('.start-input-field').forEach(field => {
            field.addEventListener('change', (e) => {
                inputs[parseInt(e.target.dataset.index)] = e.target.value;
                // 입력 필드 변경 시에는 사다리를 다시 그리되, 결과는 다시 섞지 않음
                drawLadderGame(); 
            });
        });
        document.querySelectorAll('.outcome-input-field').forEach(field => {
            field.addEventListener('change', (e) => {
                outcomes[parseInt(e.target.dataset.index)] = e.target.value;
                // 입력 필드 변경 시에는 사다리를 다시 그리되, 결과는 다시 섞지 않음
                drawLadderGame();
            });
        });

        // 버튼 활성화/비활성화
        addInputBtn.disabled = inputs.length >= MAX_INPUTS;
        removeInputBtn.disabled = inputs.length <= MIN_INPUTS;
    }

    // 배열 섞기 (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 🎀 사다리 생성 및 그리기
    function generateLadder() {
        if (!ladderCtx) return;

        // 캔버스 너비를 동적으로 조정하되, 너무 작아지지 않도록 최소 너비 설정
        ladderCanvas.width = Math.max(inputs.length * 100, 300); // 최소 300px 또는 inputs.length * 100
        ladderCanvas.height = CANVAS_HEIGHT;

        const colCount = inputs.length;
        const rowCount = colCount * 3; // 행 개수를 입력 수에 비례하여 늘려 복잡성 증가
        const colGap = ladderCanvas.width / (colCount + 1); // 기둥 간격
        const rowGap = (ladderCanvas.height - LADDER_TOP_MARGIN - LADDER_BOTTOM_MARGIN) / rowCount;

        ladderCtx.clearRect(0, 0, ladderCanvas.width, ladderCanvas.height); // 캔버스 초기화

        // 사다리 기둥 그리기
        ladderCtx.strokeStyle = '#ff99cc'; // 예쁜 분홍색
        ladderCtx.lineWidth = 3;
        for (let i = 0; i < colCount; i++) {
            ladderCtx.beginPath();
            ladderCtx.moveTo((i + 1) * colGap, LADDER_TOP_MARGIN);
            ladderCtx.lineTo((i + 1) * colGap, ladderCanvas.height - LADDER_BOTTOM_MARGIN);
            ladderCtx.stroke();
        }

        // 사다리 발판 (다리) 생성 및 그리기
        const bridges = [];
        const maxBridgesPerRow = Math.floor(colCount / 2); // 한 행에 최대 발판 수
        for (let r = 0; r < rowCount; r++) {
            let bridgesInThisRow = 0;
            // 각 행에 0~maxBridgesPerRow개의 발판 생성 시도
            for (let c = 0; c < colCount - 1; c++) {
                // 발판 생성 확률 높이기, 그리고 한 행에 너무 많은 발판이 생기지 않도록 제한
                if (Math.random() < 0.6 && bridgesInThisRow < maxBridgesPerRow) { // 확률 60%
                    // 이전에 같은 높이에 발판이 없었는지 확인 (겹치지 않게)
                    const existingBridge = bridges.find(b => b.y === LADDER_TOP_MARGIN + r * rowGap && (b.col === c || b.col === c - 1));
                    if (!existingBridge) {
                        bridges.push({ col: c, y: LADDER_TOP_MARGIN + r * rowGap });
                        bridgesInThisRow++;
                    }
                }
            }
        }

        ladderCtx.lineWidth = 2; // 발판은 좀 더 얇게
        bridges.forEach(bridge => {
            ladderCtx.beginPath();
            ladderCtx.moveTo((bridge.col + 1) * colGap, bridge.y);
            ladderCtx.lineTo((bridge.col + 2) * colGap, bridge.y);
            ladderCtx.stroke();
        });

        return { colCount, rowCount, colGap, rowGap, bridges };
    }

    // 🐾 사다리 게임 그리기 (초기화 및 다시 그리기)
    function drawLadderGame() {
        if (!ladderCtx) return;
        const { colCount, rowCount, colGap, rowGap, bridges } = generateLadder(); // 사다리 구조 생성

        // 텍스트 그리기
        ladderCtx.font = '20px Cafe24 Ssurround'; // 기본 폰트 크기
        // 모바일 화면에서는 폰트 크기 조절 (CSS 미디어 쿼리 사용 권장하나, JS로도 가능)
        if (window.innerWidth < 600) {
            ladderCtx.font = '16px Cafe24 Ssurround';
        }

        ladderCtx.fillStyle = '#4a4a4a';
        ladderCtx.textAlign = 'center';
        ladderCtx.textBaseline = 'middle';

        // 시작점 텍스트
        inputs.forEach((input, index) => {
            ladderCtx.fillText(input, (index + 1) * colGap, LADDER_TOP_MARGIN / 2);
        });

        // 🌟 결과 텍스트 (무작위 배치)
        // startGameBtn 클릭 시에만 shuffledOutcomes를 섞고 그림
        shuffledOutcomes.forEach((outcome, index) => {
            ladderCtx.fillText(outcome, (index + 1) * colGap, ladderCanvas.height - (LADDER_BOTTOM_MARGIN / 2));
        });

        // 🎯 시작 버튼 생성 (클릭 가능한 영역)
        // 이전에 생성된 버튼들을 모두 제거
        document.querySelectorAll('.ladder-start-button').forEach(button => button.remove());
        
        // 캔버스 위치 정보 가져오기 (DOM 업데이트 시점에 다시 가져오기)
        const ladderCanvasRect = ladderCanvas.getBoundingClientRect();
        // 스크롤 위치를 포함하여 절대 위치 계산 (document.documentElement 사용)
        const currentScrollTop = document.documentElement.scrollTop;
        const currentScrollLeft = document.documentElement.scrollLeft;


        inputs.forEach((input, index) => {
            const startButton = document.createElement('button');
            startButton.classList.add('ladder-start-button');
            startButton.textContent = inputs[index]; // inputs 값으로 텍스트 설정
            // 버튼 위치를 뷰포트 기준으로 정확히 계산 (스크롤 위치 반영)
            // ladderCanvasRect는 뷰포트 기준이므로, 여기에 스크롤 값을 더해야 문서 전체 기준 위치가 됨.
            // 그리고 body에 position: absolute로 붙이므로, body의 0,0 기준이 됨.
            startButton.style.left = `${ladderCanvasRect.left + currentScrollLeft + (index + 1) * colGap - 50}px`; // 중앙 정렬 (버튼 너비 100px 가정)
            startButton.style.top = `${ladderCanvasRect.top + currentScrollTop + LADDER_TOP_MARGIN / 2 - 20}px`; // 시작점 텍스트 위치에 맞춤
            startButton.style.position = 'absolute'; // body에 직접 추가할 것이므로 absolute
            startButton.dataset.col = index; // 시작 컬럼 인덱스 저장
            document.body.appendChild(startButton); // 캔버스 부모 요소가 아닌 body에 추가

            // 버튼 클릭 이벤트 리스너
            startButton.addEventListener('click', () => {
                // 이전에 그려진 초록색 경로만 지우기 위해 사다리를 다시 그림
                // generateLadder()는 사다리 구조를 다시 그리고 캔버스를 클리어함
                // 다시 사다리와 텍스트를 그려줌으로써 초록색 경로만 지워짐
                generateLadder(); 
                inputs.forEach((input, idx) => {
                    ladderCtx.fillText(input, (idx + 1) * colGap, LADDER_TOP_MARGIN / 2);
                });
                shuffledOutcomes.forEach((outcome, idx) => {
                    ladderCtx.fillText(outcome, (idx + 1) * colGap, ladderCanvas.height - (LADDER_BOTTOM_MARGIN / 2));
                });
                
                // 클릭된 버튼 애니메이션
                startButton.classList.add('clicked-effect');
                setTimeout(() => {
                    startButton.classList.remove('clicked-effect');
                }, 300); // 0.3초 후 효과 제거

                // 사다리 부분 블라인드 해제
                ladderCanvas.classList.remove('blind'); 
                
                animatePath(ladderCtx, index, colGap, rowGap, rowCount, bridges, colCount, shuffledOutcomes); 
            });
        });
        ladderCanvas.classList.add('blind'); // 게임 시작 전 사다리 블라인드 처리
    }

    // ⚡ 경로 애니메이션
    function animatePath(ctx, startCol, colGap, rowGap, rows, bridges, count, shuffledOutcomes) {
        // 경로 초기화 및 시작점 설정
        const path = [{ x: (startCol + 1) * colGap, y: LADDER_TOP_MARGIN }];
        let currentCol = startCol;

        // 사다리 경로 추적
        for (let r = 0; r < rows; r++) {
            let y = LADDER_TOP_MARGIN + r * rowGap;
            let bridged = false;

            // 해당 높이에서 발판 확인
            for (let b of bridges) {
                if (b.y === y) {
                    if (b.col + 1 === currentCol) { // 현재 컬럼의 왼쪽으로 연결된 발판
                        currentCol = b.col;
                        path.push({ x: (currentCol + 1) * colGap, y });
                        bridged = true;
                        break;
                    } else if (b.col === currentCol) { // 현재 컬럼의 오른쪽으로 연결된 발판
                        currentCol = b.col + 1;
                        path.push({ x: (currentCol + 1) * colGap, y });
                        bridged = true;
                        break;
                    }
                }
            }
            // 발판이 없었거나, 발판을 건너뛴 후 다음 행으로 이동
            // 다음 행의 Y 좌표를 계산하여 경로에 추가 (마지막 행 제외)
            if (r < rows - 1) { 
                 path.push({ x: (currentCol + 1) * colGap, y: LADDER_TOP_MARGIN + (r + 1) * rowGap }); 
            }
        }
        
        // 최종 도착점 (실제 결과 매핑)
        const finalOutcomeIndex = currentCol; // 0부터 시작하는 컬럼 인덱스
        const finalOutcomeText = shuffledOutcomes[finalOutcomeIndex]; // 섞인 결과 배열에서 가져옴

        // 애니메이션 실행
        let i = 0;
        const interval = setInterval(() => {
            if (i >= path.length - 1) {
                clearInterval(interval);
                showLadderResult(finalOutcomeText); // 최종 결과 텍스트 전달
                ladderCanvas.classList.add('blind'); // 애니메이션 종료 후 다시 블라인드 처리
                return;
            }
            ctx.beginPath();
            ctx.moveTo(path[i].x, path[i].y);
            ctx.lineTo(path[i + 1].x, path[i + 1].y);
            ctx.strokeStyle = '#00cc00'; // 경로 색상 (초록색)
            ctx.lineWidth = 4;
            ctx.stroke();
            i++;
        }, 50); // 그리기 속도 조절
    }

    // 🏆 결과 표시 함수
    function showLadderResult(result) {
        const resultDisplay = document.getElementById('ladder-result');
        if (resultDisplay) {
            resultDisplay.textContent = `당신의 결과는... "${result}" 입니다! 🎉`;
            resultDisplay.style.opacity = 1; // 결과 표시
        }
    }

    // ➕ 입력 추가
    if (addInputBtn) {
        addInputBtn.addEventListener('click', () => {
            if (inputs.length < MAX_INPUTS) {
                inputs.push(`다나 ${inputs.length + 1}`);
                outcomes.push(`결과 ${outcomes.length + 1}`); // 결과도 함께 추가
                updateList();
                drawLadderGame();
            }
        });
    }

    // ➖ 입력 제거
    if (removeInputBtn) {
        removeInputBtn.addEventListener('click', () => {
            if (inputs.length > MIN_INPUTS) {
                inputs.pop();
                outcomes.pop(); // 결과도 함께 제거
                updateList();
                drawLadderGame();
            }
        });
    }

    // ▶️ 게임 시작 버튼
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            document.getElementById('ladder-result').textContent = ''; // 결과 초기화
            document.getElementById('ladder-result').style.opacity = 0; // 결과 숨기기
            shuffledOutcomes = [...outcomes];       // 복사
            shuffleArray(shuffledOutcomes);         // 한 번만 섞기!
            drawLadderGame();                       // 사다리 그리기 (블라인드 상태로)
            ladderCanvas.classList.add('blind'); // 게임 시작 버튼 누르면 다시 블라인드 처리
        });
    }
    
    // ↩️ 게임 리셋 버튼
    if (resetGameBtn) {
        resetGameBtn.addEventListener('click', () => {
            inputs = ['다나 1', '다나 2', '다나 3', '다나 4'];
            outcomes = ['선물 1', '선물 2', '꽝', '당첨'];
            shuffledOutcomes = []; // 리셋 시 섞인 결과도 초기화
            updateList();
            drawLadderGame();
            document.getElementById('ladder-result').textContent = '';
            document.getElementById('ladder-result').style.opacity = 0;
            ladderCanvas.classList.add('blind'); // 리셋 시 사다리 다시 블라인드 처리
        });
    }

    // 초기 로드 시 사다리 게임 설정
    updateList();
    if (ladderCanvas) {
        // 초기 로드 시에는 결과가 섞이지 않은 상태로 그림 (게임 시작 버튼을 눌러야 섞임)
        shuffledOutcomes = [...outcomes]; // 초기 상태에서는 섞이지 않은 outcomes를 사용
        drawLadderGame();
        ladderCanvas.classList.add('blind'); // 초기 로드 시 사다리 블라인드 처리
    }

    // 화면 크기 변경 시 사다리 다시 그리기 (반응형 대응)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            drawLadderGame();
        }, 200); // 200ms 지연 후 다시 그림
    });
});