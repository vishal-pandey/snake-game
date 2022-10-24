window.onload = ()=>{

    var isMobile = window.innerWidth < window.innerHeight;

    let board = document.querySelector(".board")
    let info = document.querySelector(".info")
    let gameover = document.querySelector(".gameover")
    let thescore = document.querySelector(".thescore")
    let highScore = document.querySelector(".highScore")
    let scoreDiv = document.querySelector(".score")
    var width = 35;
    var height = 50;
    const speed = 1;
    var length = 2;
    
    if(isMobile) {
        width = parseInt((window.innerWidth - 30)/ 10)
        height = parseInt((window.innerHeight/2)/ 10)
        document.querySelector(".info h2").innerHTML = "Click here to start"
        info.addEventListener('click', ()=>{
            // console.log("Clicked")
            start()
        })
    }

    var theHighScore = window.localStorage.getItem('highScore') || '0';
    theHighScore = parseInt(theHighScore);
    highScore.innerHTML = theHighScore
    var snakeArr = [];

    board.style.width = width*10+"px"
    scoreDiv.style.width = width*10+"px"
    board.style.height = height*10+"px"


    function fillBoard() {
        board.innerHTML = ""
        // Adding cells to game , board setup
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {   
                let cell = document.createElement("div")
                cell.classList.add("cell")
                cell.setAttribute("data-y", i)
                cell.setAttribute("data-x", j)
                board.appendChild(cell)
            }
        }
    }

    const directions = {
        "right": 0,
        "down": 1,
        "left": 2,
        "up": 3
    }

    let food = {
        x: null,
        y: null
    }

    var currentDirection = directions.right;
    var duration = 3;
    var coordinate = {
        x:  randomIntFromInterval(0, width-1),
        y:  randomIntFromInterval(0, height-1)
    }

    var isGameOver = false;
    var isStarted = false;


    function setup() {
        fillBoard()
        duration = 3;
        length = 2;
        isStarted = true;
        isGameOver = false;
        setFood();
        setScore();
    }

    // start();
    
    setScore();
    var loop
    function start() {
        info.style.display = 'none';
        body = document.querySelector("body")
		openFullscreen(body)
        setup();
        loop = setInterval(()=>{
            // console.log("Loop")
            toLoop()
            
        }, 100*speed)
    }


    function toLoop() {
        updateLocation()
        paintCell(coordinate.x, coordinate.y)
        setColor(food.x, food.y)
        checkFood()
    }
    
    document.onkeydown = ((e)=>{

        if(e.key === 'ArrowRight') {
            right()
        }

        if(e.key === 'ArrowDown') {
            down();
        }

        if(e.key === 'ArrowLeft') {
            left();
        }

        if(e.key === 'ArrowUp') {
            up();
        }

        if(!isStarted) {
            start();
        }

    })

    function left() {
        if(currentDirection != directions.right && currentDirection != directions.left){
            currentDirection = directions.left
            toLoop()
        }
    }

    function right() {
        if(currentDirection != directions.left && currentDirection != directions.right){
            currentDirection = directions.right
            toLoop()
        }
    }

    function up() {
        if(currentDirection != directions.down && currentDirection != directions.up){
            currentDirection = directions.up
            toLoop()
        }
    }

    function down() {
        if(currentDirection != directions.up && currentDirection != directions.down){
            currentDirection = directions.down
            toLoop()
        }
    }

    

    function getCell(x, y) {
        return document.querySelector('[data-x="'+x+'"][data-y="'+y+'"]')
    }

    function setColor(x, y, white=true) {
        if(isGameOver) {
            return
        }
        try {
            let cell = getCell(x, y)
            if (white)
                cell.style.backgroundColor='white'
            else
                cell.style.backgroundColor=''
        } catch (error) {
            console.log(error)
            console.log(x, y)
            gameOver();
        }
    }

    function paintCell(x, y, d=null) {
        let dur = d ? d : length;

        checkLoop()
        if(!isPartOfSname(x, y))
            snakeArr.push({x, y})

        setColor(x, y, true)
        setTimeout(()=>{
            setColor(x, y, false);
            popFromSnakeArr(x, y)
        }, 100*speed*dur)
    }

    function updateLocation() {
        switch (currentDirection) {
            case directions.right:
                coordinate.x = coordinate.x+1
                break;

            case directions.down:
                coordinate.y = coordinate.y+1
                break;

            case directions.left:
                coordinate.x = coordinate.x-1
                break;
    
            case directions.up:
                coordinate.y = coordinate.y-1
                break;
        
            default:
                break;
        }
        if(coordinate.x > width-1) {
            coordinate.x = 0
        }
        if(coordinate.x < 0) {
            coordinate.x = width-1
        }
        if(coordinate.y > height-1) {
            coordinate.y = 0
        }
        if(coordinate.y < 0) {
            coordinate.y = height-1
        }
    }

    function setFood(){
        let x = randomIntFromInterval(0, width-1);
        let y = randomIntFromInterval(0, height-1);
        food.x = x;
        food.y = y;
        setColor(food.x, food.y);
    }

    function checkFood() {
        if(coordinate.x == food.x && coordinate.y == food.y) {
            length++;
            setScore();
            setFood();
            if(length-2 % 5) {
                // speed = speed - 0.2
            }
        }
    }

    function gameOver() {
        isGameOver = true;
        isStarted = false;
        clearInterval(loop)
        snakeArr = []
        info.style.display = 'flex';
        gameover.style.display = 'block';
    }

    function checkLoop() {
        if(isPartOfSname(coordinate.x, coordinate.y)) {
            gameOver();
        }
    }

    function isPartOfSname(x, y) {
        let part = false;
        snakeArr.forEach((cord, i)=>{
            if(cord.x == x && cord.y == y && i!=0) {
                // console.log(i)
                part = true
            }
        })
        return part
    }

    function popFromSnakeArr(x, y) {
        snakeArr.forEach((cord, index)=>{
            if(cord.x == x && cord.y == y) {
                snakeArr.splice(index, 1)
            }
        })
    }

    function setScore() {
        let score = length - 2;
        thescore.innerHTML = score;
        if(score > theHighScore) {
            theHighScore = score;
            window.localStorage.setItem('highScore', theHighScore);
            highScore.innerHTML = theHighScore;
        }
    }



    // Mobile Controls
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDownP = null;                                                        
    var yDownP = null;

    var xDown = null;                                                        
    var yDown = null;

    function getTouches(evt) {
    return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }                                                     
                                                                            
    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];
        xDownP = xDown;
        yDownP = yDown;                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                            
    function handleTouchMove(evt) {
        handleTouchStart(evt)
        if ( ! xDownP || ! yDownP ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDownP - xUp;
        var yDiff = yDownP - yUp;
                                                                            
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                /* left */ 
                // console.log("Swipe Left")
                left();
            } else {
                /* right */
                // console.log("Swipe Right")
                right()
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* up */ 
                // console.log("Swipe Up")
                up()
            } else { 
                /* down */
                // console.log("Swipe Down")
                down()
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };



}





function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }



function openFullscreen(elem) {
	console.log(elem)
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}