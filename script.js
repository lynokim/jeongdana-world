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
    // 사다리 게임 로직
    // =================================================================

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

    let playerCount = 4;
    let players = [];
    let outcomes = [];
    let shuffledOutcomes = [];
    let bridges = [];
    let gameStarted = false;
    let resultsRevealed = []; 
    let finalDestinations = {}; // { startIndex: finalIndex }

    const LADDER_TOP_MARGIN = 30;
    const LADDER_BOTTOM_MARGIN = 30;
    const LADDER_VERTICAL_LINE_COLOR = '#ff99cc';
    const LADDER_BRIDGE_COLOR = '#ff69b4';
    const PATH_ANIMATION_COLOR = '#d81b60';

    function initializeGame() {
        gameStarted = false;
        playerCount = parseInt(playerCountInput.value);
        resultsRevealed = new Array(playerCount).fill(false);
        finalDestinations = {};

        startGameBtn.disabled = false;
        showAllBtn.style.display = 'none';
        showAllBtn.disabled = false; // 버튼 다시 활성화

        createInputFields(playerCount);
        
        clearAllCanvas();
        setupCanvas();
    }
    
    function createInputFields(count) {
        playerInputsContainer.innerHTML = '';
        outcomeInputsContainer.innerHTML = '';
        outcomeResultsContainer.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const playerWrapper = document.createElement('div');
            playerWrapper.className = 'input-wrapper';
            const playerInput = document.createElement('input');
            playerInput.type = 'text';
            playerInput.value = `참가자 ${i + 1}`;
            playerInput.dataset.index = i;
            playerInput.className = 'player-input';
            playerInput.addEventListener('click', () => handlePlayerClick(i));
            playerInput.addEventListener('focus', () => playerInput.select());
            playerWrapper.appendChild(playerInput);
            playerInputsContainer.appendChild(playerWrapper);

            const outcomeWrapper = document.createElement('div');
            outcomeWrapper.className = 'input-wrapper';
            const outcomeInput = document.createElement('input');
            outcomeInput.type = 'text';
            outcomeInput.value = `결과 ${i + 1}`;
            outcomeInput.dataset.index = i;
            outcomeInput.className = 'outcome-input';
            outcomeInput.addEventListener('focus', () => outcomeInput.select());
            outcomeWrapper.appendChild(outcomeInput);
            outcomeInputsContainer.appendChild(outcomeWrapper);
            
            const resultWrapper = document.createElement('div');
            resultWrapper.className = 'input-wrapper';
            const resultDisplay = document.createElement('div');
            resultDisplay.className = 'result-display';
            resultDisplay.dataset.index = i;
            resultWrapper.appendChild(resultDisplay);
            outcomeResultsContainer.appendChild(resultWrapper);
        }
    }
    
    function setupCanvas() {
        const containerWidth = ladderCanvas.parentElement.clientWidth;
        const dpr = window.devicePixelRatio || 1;

        [ladderCanvas, animationCanvas].forEach(canvas => {
            canvas.width = containerWidth * dpr;
            canvas.height = 450 * dpr;
            canvas.style.width = `${containerWidth}px`;
            canvas.style.height = `450px`;
            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
        });
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

    function startGame() {
        gameStarted = true;
        startGameBtn.disabled = true;
        showAllBtn.style.display = 'inline-block';
        
        // 참가자와 결과값 저장 및 readonly 처리
        const playerInputElements = document.querySelectorAll('.player-input');
        const outcomeInputElements = document.querySelectorAll('.outcome-input');
        
        players = Array.from(playerInputElements).map(input => {
            input.readOnly = true;
            return input.value;
        });
        outcomes = Array.from(outcomeInputElements).map(input => {
            input.readOnly = true;
            return input.value;
        });
        
        shuffledOutcomes = [...outcomes];
        shuffleArray(shuffledOutcomes);
        
        generateBridges();
        drawLadder();

        // 모든 경로 미리 계산
        for (let i = 0; i < playerCount; i++) {
            finalDestinations[i] = calculatePath(i).finalIndex;
        }
    }

    function generateBridges() {
        bridges = [];
        const canvasHeight = ladderCanvas.clientHeight;
        const availableHeight = canvasHeight - LADDER_TOP_MARGIN - LADDER_BOTTOM_MARGIN;
        const numRows = playerCount * 2;
        const rowHeight = availableHeight / numRows;

        for (let r = 0; r < numRows; r++) {
            const placedInRow = [];
            for (let c = 0; c < playerCount - 1; c++) {
                if (placedInRow.includes(c)) continue;
                if (Math.random() < 0.5) {
                    const y = LADDER_TOP_MARGIN + r * rowHeight + (Math.random() * rowHeight * 0.6 + rowHeight * 0.2);
                    bridges.push({ c1: c, c2: c + 1, y: y });
                    placedInRow.push(c, c + 1); // 인접한 라인에는 다리 놓지 않음
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
        let currentY = 0;
        
        const pathPoints = [{ x: (startIndex + 1) * colGap, y: currentY }];
        
        const relevantBridges = bridges.filter(b => b.y > currentY);

        for(const bridge of relevantBridges) {
            if (bridge.c1 === currentCol || bridge.c2 === currentCol) {
                pathPoints.push({ x: (currentCol + 1) * colGap, y: bridge.y });
                if(bridge.c1 === currentCol){
                    currentCol++;
                } else {
                    currentCol--;
                }
                pathPoints.push({ x: (currentCol + 1) * colGap, y: bridge.y });
            }
        }
        
        pathPoints.push({ x: (currentCol + 1) * colGap, y: canvasHeight });
        
        return { path: pathPoints, finalIndex: currentCol };
    }
    
    function animatePath(path, onComplete) {
        let currentPoint = 0;
        let progress = 0;
        const speed = 8;

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
        if(resultsRevealed[playerIndex]) return;

        resultsRevealed[playerIndex] = true;
        
        const resultDisplays = document.querySelectorAll('.result-display');
        const playerInputs = document.querySelectorAll('.player-input');
        const outcomeInputs = document.querySelectorAll('.outcome-input');
        
        resultDisplays[finalIndex].textContent = shuffledOutcomes[finalIndex];
        resultDisplays[finalIndex].classList.add('visible');
        
        playerInputs[playerIndex].classList.add('highlight');
        outcomeInputs[finalIndex].classList.add('highlight');
    }

    function handlePlayerClick(index) {
        if (!gameStarted) {
            alert('먼저 "사다리 시작" 버튼을 눌러주세요! 😊');
            return;
        }
        if (resultsRevealed[index]) return;

        const { path, finalIndex } = calculatePath(index);
        animatePath(path, () => showResult(index, finalIndex));
    }
    
    playerCountInput.addEventListener('change', initializeGame);
    startGameBtn.addEventListener('click', startGame);
    resetGameBtn.addEventListener('click', initializeGame);

    showAllBtn.addEventListener('click', () => {
        if (!gameStarted) return;

        const popupWidth = 400;
        const popupHeight = 450;
        const left = (screen.width / 2) - (popupWidth / 2);
        const top = (screen.height / 2) - (popupHeight / 2);

        const resultPopup = window.open('', 'resultPopup', `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=yes`);
        
        let popupContent = `
            <html>
            <head>
                <title>💖 전체 결과 💖</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@400;500&display=swap');
                    body { 
                        font-family: 'Noto Sans KR', sans-serif; 
                        background: linear-gradient(135deg, #fff0f5 0%, #ffdde1 100%); 
                        padding: 20px; 
                        text-align: center; 
                        color: #4a4a4a;
                    }
                    h3 { 
                        font-family: 'Jua', sans-serif; 
                        color: #d81b60; 
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    ul { 
                        list-style: none; 
                        padding: 0;
                        margin: 0;
                    }
                    li { 
                        background: rgba(255, 255, 255, 0.7);
                        margin-bottom: 10px; 
                        padding: 12px; 
                        border-radius: 12px; 
                        font-size: 16px; 
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 15px;
                    }
                    strong { color: #d81b60; }
                    span { font-weight: 500; color: #ff69b4; }
                </style>
            </head>
            <body>
                <h3>💖 전체 결과 💖</h3>
                <ul>
        `;

        for (let i = 0; i < playerCount; i++) {
            const finalIndex = finalDestinations[i];
            const playerName = players[i];
            const resultName = shuffledOutcomes[finalIndex];
            popupContent += `<li><strong>${playerName}</strong> &Rightarrow; <span>${resultName}</span></li>`;
        }

        popupContent += `
                </ul>
            </body>
            </html>
        `;

        resultPopup.document.open();
        resultPopup.document.write(popupContent);
        resultPopup.document.close();
    });

    window.addEventListener('resize', () => {
        setupCanvas();
        if(gameStarted) {
            drawLadder();
        }
    });

    initializeGame();
});