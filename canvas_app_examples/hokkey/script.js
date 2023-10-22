const PUCK = 'puck';
const MALLET = 'mallet';

// Player 1 on the left, player 2 on the right
const PLAYER1 = 1;
const PLAYER2 = 2;

let numPucks, player1Score, player2Score;

const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

const mouseId = 'mouse';

// Keys are touch identifiers (or mouseID)
// Values are circle objects
const circlesBeingMoved = {};

const puckRadius = 20;
const malletRadius = 40;
const sidelineMargin = puckRadius * 2 + 5.5;

const goalWidth = 150;
const goalDepth = 10;

const dampeningFactor = 0.99;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let circles = [];
c.get_objectcs = () => circles;
function resetGame() {
    circles = [
        {
            type: PUCK,
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: puckRadius,
            velocity: { x:0, y:0 }
        },
        {
            type: MALLET,
            player: PLAYER1,
            x: canvas.width * 1 / 4,
            y: canvas.height / 2,
            radius: malletRadius,
            velocity: { x:0, y:0 }
        },
        {
            type: MALLET,
            player: PLAYER2,
            x: canvas.width * 3 / 4,
            y: canvas.height / 2,
            radius: malletRadius,
            velocity: { x:0, y:0 }
        }
    ];
    numPucks = 7;
    player1Score = 0;
    player2Score = 0;
}

function executeFrame() {
    requestAnimFrame(executeFrame);
    iterateSimulation();
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawCourt();
    drawCircles();
}

function drawCircleObject(circle) {
    drawCircle(circle.x, circle.y, circle.radius);
}

function drawCircle(x, y, radius) {
    c.beginPath();
    c.arc(x, y, radius, 0, 2 * Math.PI);
    c.fill();
}

function drawLine(x1, y1, x2, y2) {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
}

function drawCourt() {
    const y1 = sidelineMargin;
    const y2 = canvas.height - sidelineMargin;

    //points recorder line
    drawLine(0, y1, canvas.width, y1);

    //remaining pucks line
    drawLine(0, y2, canvas.width, y2);

    //middle line
    drawLine(centerX, y1, centerX, y2);

    //draw player 1 goal on the left side
    c.strokeRect(0, centerY - goalWidth / 2, goalDepth, goalWidth);

    //draw player 2 goal on the right side
    c.strokeRect(canvas.width - goalDepth, centerY - goalWidth / 2,
        goalDepth, goalWidth);
}

function drawCircles() {
    // Draw the mallets and the puck in play
    c.fillStyle = 'black';
    let i, circle;
    for(i = 0; i < circles.length; i++)
        drawCircleObject(circles[i]);

    let n, xOffset, span;
    const puckSpacing = 2;

    // Draw the remaining pucks at the bottom
    n = numPucks - 1 - player1Score - player2Score;
    span = (n - 1) * (puckRadius * 2 + 2);
    xOffset = canvas.width / 2 - span / 2;
    drawRowOfCircles(n, xOffset, span, canvas.height - sidelineMargin / 2);

    // Draw the pucks scored by player 1
    n = player1Score;
    span = (n - 1) * (puckRadius * 2 + puckSpacing);
    xOffset = puckRadius + puckSpacing;
    drawRowOfCircles(n, xOffset, span, sidelineMargin / 2);

    // Draw the pucks scored by player 2
    n = player2Score;
    span = (n - 1) * (puckRadius * 2 + puckSpacing);
    xOffset = canvas.width - span - puckRadius - puckSpacing;
    drawRowOfCircles(n, xOffset, span, sidelineMargin / 2);
}

function drawRowOfCircles(n, xOffset, span, y) {
    for(let i = 0; i < n; i++) {
        if(n == 1)
            x = xOffset;
        else
            x = xOffset + span * (i / (n - 1));
        drawCircle(x, y, puckRadius);
    }
}

function isBehindGoal(circle) {
    const behindLeftGoal = circle.x < - circle.radius;
    const behindRightGoal = circle.x > canvas.width + circle.radius;
    return behindLeftGoal || behindRightGoal;
}

function score(puck) {
    // Count the score
    if(puck.x < centerX)
        player2Score++;
    else
        player1Score++;

    // Center the puck
    puck.x = centerX;
    puck.y = centerY;
    puck.velocity.x = 0;
    puck.velocity.y = 0;

    // Reset the game if necessary
    const gameHasBeenWon = (numPucks - player1Score - player2Score === 0);
    if(gameHasBeenWon) {
        const winner = player1Score > player2Score ? 1 : 2;
        alert(`Congratulations player ${  winner  }!`);
        resetGame();
    }
}

function iterateSimulation() {
    let circle;
    const y1 = sidelineMargin;
    const y2 = canvas.height - sidelineMargin;

    for(i = 0; i < circles.length; i++) {
        circle = circles[i];

        // if the circle is inside a goal,
        // then put it in the center
        if(isBehindGoal(circle))
            score(circle);

        // slows things down
        circle.velocity.x *= dampeningFactor;
        circle.velocity.y *= dampeningFactor;

        // Add velocity to position
        if(circle.type == PUCK) {
            circle.x += circle.velocity.x;
            circle.y += circle.velocity.y;
        }


        // Make them bounce off the floor
        if(circle.y > y2 - circle.radius) {
            circle.y = y2 - circle.radius;
            circle.velocity.y = - Math.abs(circle.velocity.y);
        }
        // bounce off ceiling
        if(circle.y < circle.radius + y1) {
            circle.y = circle.radius + y1;
            circle.velocity.y = Math.abs(circle.velocity.y);
        }
        // bounce off right wall
        if(circle.x > canvas.width - circle.radius && isNotInGoal(circle)) {
            circle.x = canvas.width - circle.radius;
            circle.velocity.x = -Math.abs(circle.velocity.x);
        }
        // bounce off left wall
        if(circle.x < circle.radius && isNotInGoal(circle)) {
            circle.x = circle.radius;
            circle.velocity.x = Math.abs(circle.velocity.x);
        }

        // REPULSION between circles
        for(j = i + 1; j < circles.length; j++) {
            circle2 = circles[j];
            const dx = circle2.x - circle.x;
            const dy = circle2.y - circle.y;
            let d = Math.sqrt(dx * dx + dy * dy);

            if(d < circle.radius + circle2.radius) {
                if(d === 0)
                    d = 0.1;
                const unitX = dx / d;
                const unitY = dy / d;

                const force = -2;

                const forceX = unitX * force;
                const forceY = unitY * force;

                circle.velocity.x += forceX;
                circle.velocity.y += forceY;

                circle2.velocity.x -= forceX;
                circle2.velocity.y -= forceY;
            }
        }
    }
}

function isNotInGoal(circle) {
    const underGoalTop = circle.y - circle.radius > centerY - goalWidth / 2;
    const overGoalBottom = circle.y + circle.radius < centerY + goalWidth / 2;
    const isInGoal = underGoalTop && overGoalBottom;
    return !isInGoal;
}

function getCircleUnderPoint(x, y) {
    let i, circle, dx, dy, distance;
    for(i = 0; i < circles.length; i++) {
        circle = circles[i];
        dx = circle.x - x;
        dy = circle.y - y;
        distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < circle.radius)
            return circle;
    }
    return undefined;
}

function pointDown(x, y, id) {
    const circleUnderPoint = getCircleUnderPoint(x, y);
    if(circleUnderPoint && circleUnderPoint.type == MALLET)
        circlesBeingMoved[id] = circleUnderPoint;
}

canvas.addEventListener('mousedown', function(e) {
    pointDown(e.clientX, e.clientY, mouseId);
});

canvas.addEventListener('touchstart', function(e) {
    let i;
    for(i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        pointDown(touch.pageX, touch.pageY, touch.identifier);
    }
});

function pointUp(id) {
    if(circlesBeingMoved[id])
        delete circlesBeingMoved[id];
}

canvas.addEventListener('mouseup', function(e) {
    pointUp(mouseId);
});

canvas.addEventListener('mouseout', function(e) {
    pointUp(mouseId);
});

canvas.addEventListener('touchend', function(e) {
    let i;
    for(i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        pointUp(touch.identifier);
    }
});

function pointMove(x, y, id) {
    const circle = circlesBeingMoved[id];
    if(circle) {
        circle.x = x;
        circle.y = y;
        correctMalletPosition(circle);
    }
}

function correctMalletPosition(circle) {
    // Make sure mallets are on the correct side:
    // Player 1 on the left, player 2 on the right
    if(circle.type == MALLET) {
        if(circle.player == PLAYER1) {
            if(circle.x > centerX - malletRadius)
                circle.x = centerX - malletRadius;
        } else if(circle.player == PLAYER2) {
            if(circle.x < centerX + malletRadius)
                circle.x = centerX + malletRadius;
        }
    }
}

canvas.addEventListener('mousemove', function(e) {
    pointMove(e.clientX, e.clientY, mouseId);
});

canvas.addEventListener('touchmove', function(e) {
    let i;
    for(i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        pointMove(touch.pageX, touch.pageY, touch.identifier);
    }

    // This is to prevent the default scrolling behavior
    e.preventDefault();
});

resetGame();

// Start animation
executeFrame();
