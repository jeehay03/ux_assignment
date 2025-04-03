let c, w = 5;
let centerX, centerY, radius = 300;
let resetBtn;
let shapeBtns = [], currentShape = null;
let palette = [];


class Button {
  constructor(x, y, w, h, fillColor, label = "", strokeColor = color(0)) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.fillColor = fillColor; 
    this.strokeColor = strokeColor; 
    this.label = label;         
    this.callback = null;
    this.isClicked = false;
  }

  display() {
    let c = this.fillColor;
    if (this.isClicked) c = this.colorModify(-20);
    else if (this.isHovered()) c = this.colorModify(40);

    // 버튼
    fill(c);
    stroke(this.strokeColor); 
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 8);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  colorModify(delta) {
    let h = hue(this.fillColor);
    let s = saturation(this.fillColor);
    let b = brightness(this.fillColor);
    return color(h, s, constrain(b + delta, 0, 100));
  }

  isHovered() {
    return mouseX > this.x && mouseX < this.x + this.w &&
           mouseY > this.y && mouseY < this.y + this.h;
  }

  handleMousePressed() {
    if (this.isHovered()) this.isClicked = true;
  }

  handleMouseReleased() {
    if (this.isHovered() && this.isClicked && this.callback)
      this.callback();
    this.isClicked = false;
  }

  onClick(callback) {
    this.callback = callback;
  }
}






function setup() {
  createCanvas(1600, 1600);
  colorMode(HSB);
  angleMode(DEGREES);
  background(255); 

  centerX = width / 2;
  centerY = height * 0.45;
  c = color(0, 0, 0); //검정

  // 컬러 휠휠
  for (let angle = 0; angle < 360; angle += 30) {
    noStroke();
    let col = color(angle, 85, 90);
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    palette.push({ x, y, color: col });
  }

  // Reset 버튼
  resetBtn = new Button(25, 870, 150, 50, color(64, 0, 85), "Reset");
  resetBtn.onClick(() => {
    background(255);
  });

  // 도형 버튼
  let shapeLabels = ["Circle", "Rectangle", "Triangle", "Line"];
  for (let i = 0; i < shapeLabels.length; i++) {
    let btn = new Button(25, 550 + i * 80, 150, 50, color(64, 0, 85), shapeLabels[i]);
    btn.onClick(() => currentShape = shapeLabels[i]);
    shapeBtns.push(btn);
  }
}





function draw() {
  // 왼쪽 박스
  fill(0, 0, 100);
  stroke(64, 0, 85);
  strokeWeight(2);
  rect(0, 0, 200, height);

  // 컬러휠
  for (let p of palette) {
    fill(p.color);
    noStroke();
    circle(p.x, p.y, 60);

    // 클릭할때 색깔 바꾸기기
    if (mouseIsPressed && dist(mouseX, mouseY, p.x, p.y) < 25) {
      c = p.color;
    }
  }

  // 그리는 범위위
  noFill();
  stroke(64, 0, 85);
  strokeWeight(2);
  ellipse(centerX, centerY, radius * 1.6, radius * 1.6);

  // 선 굵기
  stroke(0); strokeWeight(6); noFill();
  line(100, 100, 100, 400); 
  fill(0);
  let handleY = map(w, 0.5, 30, 400, 100); 
  rect(50, handleY - 5, 100, 30);

  if (mouseIsPressed &&mouseX > 50 && mouseX < 150 && mouseY > 100 && mouseY < 400) {
    w = (400 - mouseY) / 10;
  }


  resetBtn.display();
  for (let btn of shapeBtns) btn.display();
}



function mouseDragged() {
  if (currentShape === "Line") {
    let d1 = dist(mouseX, mouseY, centerX, centerY);
    let d2 = dist(pmouseX, pmouseY, centerX, centerY);
    if (d1 < radius * 0.77 && d2 < radius * 0.77) {
      stroke(c);
      strokeWeight(w);
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
  }
}
function mousePressed() {
  resetBtn.handleMousePressed();
  for (let btn of shapeBtns) btn.handleMousePressed();
}

function mouseReleased() {
  resetBtn.handleMouseReleased();
  for (let btn of shapeBtns) btn.handleMouseReleased();



  let d = dist(mouseX, mouseY, centerX, centerY);
  if (currentShape && currentShape !== "Line" && d < radius * 0.7) {
    stroke(c);
    strokeWeight(w);
    fill(c);

    // 도형 그리기
    if (currentShape === "Circle") {
      ellipse(mouseX, mouseY, 20, 20);
    } else if (currentShape === "Rectangle") {
      rect(mouseX - 10, mouseY - 10, 20, 20);
    } else if (currentShape === "Triangle") {
      triangle( mouseX, mouseY - 7, 
        mouseX - 7, mouseY + 7,
         mouseX + 7, mouseY + 7
      );
    }
  }
}
