// DOM이 완전히 로드되면 실행됩니다.
document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 기존 기능 (인트로, 헤더 애니메이션 등)
    // =================================================================
    const introTitle = document.getElementById('intro-title');
    const titleSpans = introTitle ? introTitle.querySelectorAll('span') : [];
    const learnMoreButton = document.getElementById('learn-more-button');
    const viewAllButtons = document.querySelectorAll('.view-all-button');
    const searchButton = document.querySelector('.search-bar button');

    const HEART_POP_DELAY = 100;
    const FLOAT_HEART_COUNT = 3;
    const FLOAT_HEART_OFFSET_RANGE = 40;
    const FLOAT_BUBBLE_LIFETIME_MS = 1200;
    const HEART_SNOW_INTERVAL_MS = 1500;

    if (titleSpans.length > 0) {
        titleSpans.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add('appear');
            }, HEART_POP_DELAY * index);
        });
    }

    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', (e) => {
            e.preventDefault();
            alert('정다나에 대해 더 많은 정보는 준비 중이에요 💕\n곧 공개될 예정이니 기대해주세요!');
        });
    }

    viewAllButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('더 많은 소식이 준비 중입니다! 기대해주세요 😊');
        });
    });

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const heartPop = searchButton.querySelector('.heart-pop');
            if (heartPop) {
                heartPop.classList.remove('animate');
                void heartPop.offsetWidth;
                heartPop.classList.add('animate');

                for (let i = 0; i < FLOAT_HEART_COUNT; i++) {
                    const floatHeart = document.createElement('span');
                    floatHeart.classList.add('floating-heart');
                    floatHeart.innerText = '💖';
                    floatHeart.style.left = `${Math.random() * FLOAT_HEART_OFFSET_RANGE - (FLOAT_HEART_OFFSET_RANGE / 2)}px`;
                    floatHeart.style.top = `${Math.random() * FLOAT_HEART_OFFSET_RANGE - (FLOAT_HEART_OFFSET_RANGE / 2)}px`;
                    searchButton.appendChild(floatHeart);
                    floatHeart.addEventListener('animationend', () => floatHeart.remove());
                }
            }
            const bubble = document.createElement('div');
            bubble.classList.add('floating-bubble');
            bubble.innerText = '기능 없지롱🤣';
            bubble.setAttribute('aria-hidden', 'true');
            const buttonRect = searchButton.getBoundingClientRect();
            bubble.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
            bubble.style.top = `${buttonRect.top}px`;
            bubble.style.position = 'fixed';
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), FLOAT_BUBBLE_LIFETIME_MS);
        });
    }

    function createHeartSnow() {
        const container = document.querySelector('.heart-snow-container');
        if (!container) return;
        const heart = document.createElement('div');
        heart.classList.add('heart-snow');
        heart.innerText = '💖';
        heart.setAttribute('aria-hidden', 'true');
        const size = Math.random() * 1.2 + 0.6;
        const left = Math.random() * 100;
        const duration = Math.random() * 4 + 4;
        heart.style.left = `${left}%`;
        heart.style.fontSize = `${size}rem`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${Math.random() * duration}s`;
        container.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove());
    }
    setInterval(createHeartSnow, HEART_SNOW_INTERVAL_MS);

    // =================================================================
    // 사다리 게임 로직 (네이버 스타일로 재구성)
    // =================================================================

    // DOM 요소
    const playerCountInput = document.getElementById('playerCountInput');
    const startGameBtn = document.getElementById('startGameBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const showAllBtn = document.getElementById('showAllBtn');
    
    const playerInputsContainer = document.getElementById('player-inputs');
    const outcomeInputsContainer = document.getElementById('outcome-inputs');
    const outcomeResultsContainer = document.getElementById('outcome-results');
    
    const ladderCanvas = document.getElementById('ladderCanvas');
    const ladderCtx = ladderCanvas.getContext('2d');
    const animationCanvas = document.getElementById('animationCanvas');
    const animationCtx = animationCanvas.getContext('2d');

    // 게임 상태 변수
    let playerCount = 4;
    let players = [];
    let outcomes = [];
    let shuffledOutcomes = [];
    let bridges = [];
    let gameStarted = false;
    let resultsRevealed = []; // 각 플레이어의 결과 공개 여부 추적

    // 상수
    const LADDER_TOP_MARGIN = 30;
    const LADDER_BOTTOM_MARGIN = 30;
    const LADDER_VERTICAL_LINE_COLOR = '#ff99cc';
    const LADDER_BRIDGE_COLOR = '#ff69b4';
    const PATH_ANIMATION_COLOR = '#d81b60'; // 진한 핑크

    // --- 초기화 및 UI 생성 ---

    function initializeGame() {
        gameStarted = false;
        playerCount = parseInt(playerCountInput.value);
        resultsRevealed = new Array(playerCount).fill(false);

        // 버튼 상태 업데이트
        startGameBtn.disabled = false;
        showAllBtn.style.display = 'none';

        // 입력 필드 생성
        createInputFields(playerCount);
        
        // 캔버스 초기화
        clearAllCanvas();
        setupCanvas();
    }
    
    function createInputFields(count) {
        playerInputsContainer.innerHTML = '';
        outcomeInputsContainer.innerHTML = '';
        outcomeResultsContainer.innerHTML = '';

        for (let i = 0; i < count; i++) {
            // 참가자 입력 필드
            const playerWrapper = document.createElement('div');
            playerWrapper.className = 'input-wrapper';
            const playerInput = document.createElement('input');
            playerInput.type = 'text';
            playerInput.value = `참가자 ${i + 1}`;
            playerInput.dataset.index = i;
            playerInput.className = 'player-input';
            playerInput.readOnly = true; // 게임 시작 전에는 수정 불가, 클릭 이벤트로 핸들링
            playerInput.addEventListener('click', () => handlePlayerClick(i));
            playerWrapper.appendChild(playerInput);
            playerInputsContainer.appendChild(playerWrapper);

            // 결과 입력 필드
            const outcomeWrapper = document.createElement('div');
            outcomeWrapper.className = 'input-wrapper';
            const outcomeInput = document.createElement('input');
            outcomeInput.type = 'text';
            outcomeInput.value = `결과 ${i + 1}`;
            outcomeInput.dataset.index = i;
            outcomeInput.className = 'outcome-input';
            outcomeWrapper.appendChild(outcomeInput);
            outcomeInputsContainer.appendChild(outcomeWrapper);
            
            // 결과 표시 영역
            const resultWrapper = document.createElement('div');
            resultWrapper.className = 'input-wrapper';
            const resultDisplay = document.createElement('div');
            resultDisplay.className = 'result-display';
            resultDisplay.dataset.index = i;
            resultWrapper.appendChild(resultDisplay);
            outcomeResultsContainer.appendChild(resultWrapper);
        }
    }
    
    // --- 캔버스 설정 및 그리기 ---

    function setupCanvas() {
        const containerWidth = ladderCanvas.parentElement.clientWidth;
        const dpr = window.devicePixelRatio || 1;

        // Ladder Canvas
        ladderCanvas.width = containerWidth * dpr;
        ladderCanvas.height = 450 * dpr;
        ladderCanvas.style.width = `${containerWidth}px`;
        ladderCanvas.style.height = `450px`;
        ladderCtx.scale(dpr, dpr);
        
        // Animation Canvas
        animationCanvas.width = containerWidth * dpr;
        animationCanvas.height = 450 * dpr;
        animationCanvas.style.width = `${containerWidth}px`;
        animationCanvas.style.height = `450px`;
        animationCtx.scale(dpr, dpr);
    }
    
    function clearAllCanvas() {
        ladderCtx.clearRect(0, 0, ladderCanvas.width, ladderCanvas.height);
        animationCtx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
    }

    function drawLadder() {
        clearAllCanvas();
        const canvasWidth = ladderCanvas.clientWidth;
        const canvasHeight = ladderCanvas.clientHeight;
        const colGap = canvasWidth / (playerCount + 1);

        // 세로줄 그리기
        ladderCtx.strokeStyle = LADDER_VERTICAL_LINE_COLOR;
        ladderCtx.lineWidth = 4;
        ladderCtx.lineCap = 'round';

        for (let i = 0; i < playerCount; i++) {
            const x = (i + 1) * colGap;
            ladderCtx.beginPath();
            ladderCtx.moveTo(x, LADDER_TOP_MARGIN);
            ladderCtx.lineTo(x, canvasHeight - LADDER_BOTTOM_MARGIN);
            ladderCtx.stroke();
        }

        // 가로줄(다리) 그리기
        ladderCtx.strokeStyle = LADDER_BRIDGE_COLOR;
        ladderCtx.lineWidth = 5;
        bridges.forEach(bridge => {
            const x1 = (bridge.c1 + 1) * colGap;
            const x2 = (bridge.c2 + 1) * colGap;
            ladderCtx.beginPath();
            ladderCtx.moveTo(x1, bridge.y);
            ladderCtx.lineTo(x2, bridge.y);
            ladderCtx.stroke();
        });
    }

    // --- 게임 로직 ---

    function startGame() {
        gameStarted = true;
        startGameBtn.disabled = true;
        showAllBtn.style.display = 'inline-block';
        
        // 참가자 및 결과값 저장
        players = Array.from(document.querySelectorAll('.player-input')).map(input => input.value);
        outcomes = Array.from(document.querySelectorAll('.outcome-input')).map(input => input.value);
        
        // 결과 섞기
        shuffledOutcomes = [...outcomes];
        shuffleArray(shuffledOutcomes);
        
        // 사다리 다리 생성
        generateBridges();
        
        // 사다리 그리기
        drawLadder();
    }

    function generateBridges() {
        bridges = [];
        const canvasHeight = ladderCanvas.clientHeight;
        const availableHeight = canvasHeight - LADDER_TOP_MARGIN - LADDER_BOTTOM_MARGIN;
        const numRows = playerCount * 2; // 가로줄 밀도
        
        const rowHeight = availableHeight / numRows;

        for (let r = 0; r < numRows; r++) {
            const y = LADDER_TOP_MARGIN + r * rowHeight + (Math.random() * rowHeight / 2);
            
            // 겹치지 않는 가로줄을 놓을 수 있는 위치 찾기
            const availableCols = [...Array(playerCount - 1).keys()];
            shuffleArray(availableCols);
            
            for (const c of availableCols) {
                // 현재 행에 이미 연결된 다리가 있는지 확인
                const isOccupied = bridges.some(b => b.y === y && (b.c1 === c || b.c2 === c || b.c1 === c -1 || b.c2 === c + 1));
                if (!isOccupied && Math.random() < 0.5) { // 50% 확률로 다리 놓기
                    bridges.push({ c1: c, c2: c + 1, y: y });
                }
            }
        }
        bridges.sort((a, b) => a.y - b.y);
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function calculatePath(startIndex) {
        const canvasWidth = ladderCanvas.clientWidth;
        const canvasHeight = ladderCanvas.clientHeight;
        const colGap = canvasWidth / (playerCount + 1);
        
        let currentCol = startIndex;
        let currentY = LADDER_TOP_MARGIN;
        
        const pathPoints = [{ x: (startIndex + 1) * colGap, y: 0 }];
        pathPoints.push({ x: (startIndex + 1) * colGap, y: LADDER_TOP_MARGIN });

        const relevantBridges = bridges.filter(b => b.c1 === currentCol || b.c2 === currentCol);

        for(const bridge of bridges) {
            if (bridge.y < currentY) continue;
            
            if (bridge.c1 === currentCol) { // 오른쪽으로 이동
                pathPoints.push({ x: (currentCol + 1) * colGap, y: bridge.y });
                pathPoints.push({ x: (currentCol + 2) * colGap, y: bridge.y });
                currentCol++;
                currentY = bridge.y;
            } else if (bridge.c2 === currentCol) { // 왼쪽으로 이동
                pathPoints.push({ x: (currentCol + 1) * colGap, y: bridge.y });
                pathPoints.push({ x: (currentCol) * colGap, y: bridge.y });
                currentCol--;
                currentY = bridge.y;
            }
        }
        
        pathPoints.push({ x: (currentCol + 1) * colGap, y: canvasHeight - LADDER_BOTTOM_MARGIN });
        pathPoints.push({ x: (currentCol + 1) * colGap, y: canvasHeight });
        
        return { path: pathPoints, finalIndex: currentCol };
    }
    
    function animatePath(path, onComplete) {
        let currentPoint = 0;
        let progress = 0;
        const speed = 5; // 애니메이션 속도

        function animate() {
            if (currentPoint >= path.length - 1) {
                if (onComplete) onComplete();
                return;
            }

            const start = path[currentPoint];
            const end = path[currentPoint + 1];
            
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                progress += speed;
                const ratio = Math.min(progress / distance, 1);
                
                const currentX = start.x + dx * ratio;
                const currentY = start.y + dy * ratio;

                animationCtx.strokeStyle = PATH_ANIMATION_COLOR;
                animationCtx.lineWidth = 5;
                animationCtx.lineCap = 'round';
                animationCtx.beginPath();
                animationCtx.moveTo(start.x, start.y);
                animationCtx.lineTo(currentX, currentY);
                animationCtx.stroke();
                
                if (ratio >= 1) {
                    currentPoint++;
                    progress = 0;
                }
            } else {
                 currentPoint++;
            }

            requestAnimationFrame(animate);
        }
        animate();
    }
    
    function showResult(playerIndex, finalIndex) {
        if(resultsRevealed[playerIndex]) return; // 이미 공개된 결과는 무시

        resultsRevealed[playerIndex] = true;
        
        const resultDisplays = document.querySelectorAll('.result-display');
        const playerInputs = document.querySelectorAll('.player-input');
        
        resultDisplays[finalIndex].textContent = shuffledOutcomes[finalIndex];
        resultDisplays[finalIndex].classList.add('visible');
        
        // 연결된 플레이어와 결과 하이라이트
        playerInputs[playerIndex].style.backgroundColor = '#ffecf2';
        document.querySelectorAll('.outcome-input')[finalIndex].style.backgroundColor = '#ffecf2';

        // 모든 결과가 공개되었는지 확인
        if (resultsRevealed.every(r => r === true)) {
            showAllBtn.disabled = true;
        }
    }


    // --- 이벤트 핸들러 ---

    function handlePlayerClick(index) {
        if (!gameStarted) {
            alert('먼저 "사다리 시작" 버튼을 눌러주세요! 😊');
            return;
        }
        if (resultsRevealed[index]) return; // 이미 경로를 확인한 경우

        const { path, finalIndex } = calculatePath(index);
        animatePath(path, () => showResult(index, finalIndex));
    }
    
    playerCountInput.addEventListener('change', initializeGame);

    startGameBtn.addEventListener('click', startGame);

    resetGameBtn.addEventListener('click', () => {
        // 입력 필드 초기화 (사용자가 입력한 값 유지하지 않음)
        playerCountInput.value = 4;
        initializeGame();
    });

    showAllBtn.addEventListener('click', () => {
        if (!gameStarted) return;
        animationCtx.clearRect(0, 0, animationCanvas.width, animationCanvas.height); // 기존 애니메이션 클리어
        
        for (let i = 0; i < playerCount; i++) {
            const { path, finalIndex } = calculatePath(i);
            
            animationCtx.strokeStyle = PATH_ANIMATION_COLOR;
            animationCtx.globalAlpha = 0.7; // 전체 결과는 약간 투명하게
            animationCtx.lineWidth = 5;
            animationCtx.lineCap = 'round';
            
            animationCtx.beginPath();
            animationCtx.moveTo(path[0].x, path[0].y);
            for (let p = 1; p < path.length; p++) {
                animationCtx.lineTo(path[p].x, path[p].y);
            }
            animationCtx.stroke();
            
            showResult(i, finalIndex);
        }
        animationCtx.globalAlpha = 1.0;
        showAllBtn.disabled = true;
    });

    window.addEventListener('resize', () => {
        setupCanvas();
        if(gameStarted) {
            drawLadder();
        }
    });

    // --- 초기 실행 ---
    initializeGame();
});