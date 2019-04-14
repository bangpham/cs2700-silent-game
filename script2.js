var $colorPalette = $(".select-color ul");
var mouseDown = false;
var canvasClicked = false;

var holdingStage;
var stage;
var SIZE = 20;
function init(turn){
  var canvas = document.getElementsByTagName(turn)[0];
  holdingStage = new createjs.Stage("hold");
  stage = new createjs.Stage(turn);
  holdingStage.name = "holdingStage";
  stage.name = "stage";


  addCircle(canvas.width/3.5 - (SIZE * 2.5), canvas.height/6, SIZE, "#000000", holdingStage);
  addRoundedSquare(canvas.width/3.5 + (SIZE * 2.5), canvas.height/6, SIZE * 2, 5, "#000000", holdingStage);
  addTriangle(canvas.width/3.5, canvas.height/6, SIZE,"#000000", holdingStage);
  addStar(canvas.width/3.5 + (SIZE * 5), canvas.height/6, SIZE, "#000000", holdingStage);

  holdingStage.update();
}

/*****************begin shapes**************************/

//star
function addStar(x, y, r, fill, stage){
  var star = new createjs.Shape();
  star.graphics.beginFill(fill).drawPolyStar(0, 0, r, 5, 0.6, -90);
  star.x = x;
  star.y = y;
  star.name = "star";
  star.on("pressmove",drag);
  if (stage.name == "holdingStage") {
    star.on("click", addStarToCanvas);
  }

  if (stage.name == "stage") {

    star.on("dblclick", function(evt){
      stage.removeChild(star);
      stage.update();
    });
  }
  stage.addChild(star);
}

//circle
function addCircle(x, y, r, fill, stage) {
  var circle = new createjs.Shape();
  circle.graphics.beginFill(fill).drawCircle(0, 0, r);
  circle.x = x;
  circle.y = y;
  circle.name = "circle";
  circle.on("pressmove",drag);
  if (stage.name == "holdingStage") {
    circle.on("click", addCircleToCanvas);
  }

  if (stage.name == "stage") {

    circle.on("dblclick", function(evt){
      stage.removeChild(circle);
      stage.update();
    });
  }

  stage.addChild(circle);
}

//triangle
function addTriangle(x, y, h, fill, stage){
  var triangle = new createjs.Shape();
  triangle.graphics.beginFill(fill).moveTo(0,-h).lineTo(-h, h).lineTo(h, h);
  triangle.x = x;
  triangle.y = y;
  triangle.on("pressmove", drag);
  if (stage.name == "holdingStage") {
    triangle.on("click", addTriangleToCanvas);
  }
  if (stage.name == "stage") {
    triangle.on("click", function(evt){
      triangle.rotation = triangle.rotation + 45;
      stage.update();
    });

    triangle.on("dblclick", function(evt){
      stage.removeChild(triangle);
      stage.update();
    });
  }
  
  stage.addChild(triangle);
}


//round square
function addRoundedSquare(x, y, s, r, fill, stage) {
  var square = new createjs.Shape();
  square.graphics.beginFill(fill).drawRoundRect(0, 0, s, s, r);
  square.x = x - s/2;
  square.y = y - s/2;
  square.name = "square";
  square.on("pressmove",drag);
  
  if (stage.name == "holdingStage") {
    square.on("click", addSquareToCanvas);
  }

  if (stage.name == "stage") {

    square.on("dblclick", function(evt){
      stage.removeChild(square);
      stage.update();
    });
  }

  stage.addChild(square);
}


function addSquareToCanvas(evt){
  var canvas = document.getElementsByTagName('canvas')[1];
  addRoundedSquare(canvas.width/2 + (SIZE * 2.5), canvas.height/2, SIZE * 2, 5, "#000000", stage);
  stage.update();
}

function addTriangleToCanvas(evt){
  var canvas = document.getElementsByTagName('canvas')[1];
  addTriangle(canvas.width/2, canvas.height/2, SIZE,"#000000", stage);
  stage.update();
  
}

function addCircleToCanvas(evt){
  var canvas = document.getElementsByTagName('canvas')[1];
  addCircle(canvas.width/2 - (SIZE * 2.5), canvas.height/2, SIZE, "#000000", stage);
  stage.update();
}

function addStarToCanvas(evt){
  var canvas = document.getElementsByTagName('canvas')[1];
  addStar(canvas.width/2 + (SIZE * 5), canvas.height/2, SIZE, "#000000", stage);
  stage.update();
}


function drag(evt) {
  // target will be the container that the event listener was added to
  if(evt.target.name == "square") {
    evt.target.x = evt.stageX - SIZE;
    evt.target.y = evt.stageY - SIZE;
  }
  else  {
    evt.target.x = evt.stageX;
    evt.target.y = evt.stageY;
  }

  // make sure to redraw the stage to show the change
  stage.update();   
}

/*****************end shapes**************************/

/*******************save picture*********************************/

function savePicture() {

    window.open(stage.toDataURL()); // convert to image and open a window
}

/******************end save picture*******************************/


// Adds selected class to chosen color
$colorPalette.on("click", "li", function() {
  selectColor($(this));
});

var cv1 = "canvas";
var cv2 = "canvas2";
var cv3 = "canvas3";



function changeTurn() {
  alert("Player 2 starts");
  init("canvas1");
}


// Removes class from siblings, adds class to chosen
function selectColor(e) {
  e.siblings().removeClass("selected");
  e.addClass("selected");
}

// Toggles and animates hidden panel
$(".new-color-btn").click("click", function() {
  togglePanel();
});

// Allows animation to toggle
function togglePanel() {
  renewElement($(".anim-wrap"));
  var $animated = $(".anim-wrap");
  var shown = $animated.hasClass('on');
  $animated.toggleClass('on', !shown).toggleClass('off', shown);
}

// Allows animation to play more than once
function renewElement(e) {
  var newElement = e.clone(true);
  e.remove();
  $(".new-color").append(newElement);
}

// Changes the color preview to the user defined color
$(".rgb-sliders input").change(function() {
  $(".color-preview").css("background", currentColor());
})

// Returns the RGB from the defined slider values
function currentColor() {
  var r = $("#red").val();
  var g = $("#green").val();
  var b = $("#blue").val();
  var color = "rgb(" + r + "," + g + "," + b + ")";

  return color;
}

// Appends new color onto color selection menu
$(".add-color-btn").on("click", function() {
  var $newColor = $("<li></li>").hide();
  $newColor.css("background", currentColor());
  $colorPalette.append($newColor);
  selectColor($newColor);
  $newColor.animate({ width: 'toggle' }, 200);
  togglePanel();
});

