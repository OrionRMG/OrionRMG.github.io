let level = 0;
let speedScale = 2000;
let actions = ["bop-it", "click", "scroll-down", "scroll-up"];
let currentAction;
let timer;
let started = false;
let actionLock = false;
let highScore = 0;
let hit = new Audio("sounds/hit.mp3");
let failSound = new Audio("sounds/fail.mp3");
let music = new Audio("sounds/music.mp3");
music.volume = 0.2;

function nextAction(){
    actionLock = false;
    music.playbackRate = music.playbackRate + 0.05;
    $("#subtitle").text(level);
    $("#main-box").removeClass("box-blue");
    $("#content").removeClass("bg-blue")
    let randNum = Math.floor(Math.random() * 4);
    currentAction = actions[randNum];
    switch (currentAction) {
        case "bop-it":
            $("#icon").attr("src", "images/bop-it.png");
            $("h1").text("Bop it!");
            break;

        case "click":
            $("#icon").attr("src", "images/click.png");
            $("h1").text("Click it!");
            break;
    
        case "scroll-down":
            $("#icon").attr("src", "images/scroll-down.png");
            $("h1").text("Scroll down!");
            break;

        case "scroll-up":
            $("#icon").attr("src", "images/scroll-up.png");
            $("h1").text("Scroll up!");
            break;

        default:
            break;
    }



    startTimer();

    level++;
}

//Spacebar handler
$(document).on("keydown", (e) =>{
    if (e.key === " " && started === false){
        $("#main-box").removeClass("box-failed");
        $("#content").removeClass("bg-failed")
        level = 0;
        started = true;
        music.play();
        nextAction();
    } else if (e.key === " " && started === true && actionLock === false){
        checkAction("bop-it");
    }
    else if (e.key === "r"){
        level = 0;
        started = false;
        $("#main-box").removeClass("box-failed");
        $("#content").removeClass("bg-failed")
        $("#icon").attr("src", "images/bop-it.png");
        $("h1").text("Bop it to start!");
        $("#subtitle").text("(Hint: 'Bop it' is 'space'. 'R' to reset)");
        music.pause();
        music.currentTime = 0;
        music.playbackRate = 1;
        speedScale = 2000;
    }
});

//Click handler
$(document).on("click", () =>{
    if (started === true && actionLock === false){
        checkAction("click");
    }
});

//Scroll handler
$(document).on("mousewheel", (e) =>{
    if (started === true && actionLock === false){
        if (detectTrackPad(e)){
            console.log("trackpad");
            if (e.originalEvent.deltaY < -119){
                checkAction("scroll-up");
            } else  if (e.originalEvent.deltaY > 119){
                checkAction("scroll-down");
            }
        } else {
            console.log("wheel");
            if (e.originalEvent.deltaY < -99){
                checkAction("scroll-up");
            } else  if (e.originalEvent.deltaY > 99){
                checkAction("scroll-down");
            }
        }
    }
});

//Start the timer
function startTimer(){
    timer = setTimeout(() => {
        $("#main-box").addClass("box-failed");
        $("#content").addClass("bg-failed")
        $("h1").text(level);
        $("#icon").attr("src", "images/fail.png");
        playFailSound();
        speedScale = 2000;
        started = false;
        music.pause();
        music.currentTime = 0;
        music.playbackRate = 1;
        checkHighScore();
        console.log("Timeout fail");
    }, speedScale);
}

//Check an action
function checkAction(action){
    if (currentAction === action){
        clearTimeout(timer);
        actionLock = true;
        playHit();
        $("#main-box").addClass("box-blue");
        $("#content").addClass("bg-blue")
        setTimeout(() => {
            speedScale = speedScale * 0.925;
            nextAction();
        }, 500);
    } else {
        $("#main-box").addClass("box-failed");
        $("#content").addClass("bg-failed")
        $("h1").text(level);
        $("#icon").attr("src", "images/fail.png");
        $("#subtitle").text("(Hint: 'Bop it' is 'space'. 'R' to reset)");
        playFailSound();
        clearTimeout(timer);
        speedScale = 2000;
        started = false;
        music.pause();
        music.currentTime = 0;
        music.playbackRate = 1;
        checkHighScore();
        console.log("Action fail (" + action + ")");
    }
}

function checkHighScore(){
    if (level > highScore){
        highScore = level;
        $("#high-score").text("High score: " + highScore);
    }
}

//Play success sound
function playHit(){
    hit.volume = 0.2;
    hit.play();
}

function playFailSound(){
    failSound.volume = 0.2;
    failSound.play();
}

//Detect if trackpad
function detectTrackPad(e){
      if (e.originalEvent.wheelDeltaY === (e.originalEvent.deltaY * -3)){
        return true;
      } else {
        return false;
      }
}