// 색상, 선 굵기, 도형 버튼, 중심 위치 등 전역 변수 선언
let c, w = 5;
let centerX, centerY, radius = 300;
let resetBtn;
let shapeBtns = [], currentShape = null;
let palette = [];

// ──────────────────────────────────────
// 버튼 클래스 정의
// ──────────────────────────────────────
class Button {
  constructor(x, y, w, h, fillColor, label = "", strokeColor = color(0)) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.fillColor = fillColor; // 버튼 배경 색
    this.strokeColor = strokeColor; // 테두리 색
    this.label = label;         // 버튼 텍스트
    this.callback = null;
    this.isClicked = false;
  }

  display() {
    // 클릭 상태/hover 상태에 따라 밝기 조정
    let c = this.fillColor;
    if (this.isClicked) c = this.colorModify(-20);
    else if (this.isHovered()) c = this.colorModify(40);

    // 버튼 그리기
    fill(c);
    stroke(this.strokeColor); 
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 8);

    // 버튼 라벨
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  // 색상 밝기 조정
  colorModify(delta) {
    let h = hue(this.fillColor);
    let s = saturation(this.fillColor);
    let b = brightness(this.fillColor);
    return color(h, s, constrain(b + delta, 0, 100));
  }

  // 마우스가 버튼 위에 있는지 확인
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

// ──────────────────────────────────────
// 초기 설정
// ──────────────────────────────────────
function setup() {
  createCanvas(1600, 1600);
  colorMode(HSB);
  angleMode(DEGREES);
  background(255); // 캔버스 초기화

  centerX = width / 2;
  centerY = height * 0.45;
  c = color(0, 0, 0); // 기본 색상: 검정

  // 색상 선택 원 생성
  for (let angle = 0; angle < 360; angle += 30) {
    noStroke();
    let col = color(angle, 85, 90);
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    palette.push({ x, y, color: col });
  }

  // Reset 버튼 생성
  resetBtn = new Button(25, 870, 150, 50, color(64, 0, 85), "Reset");
  resetBtn.onClick(() => {
    background(255); // 캔버스 전체 초기화
  });

  // 도형 버튼 생성
  let shapeLabels = ["Circle", "Rectangle", "Triangle", "Line"];
  for (let i = 0; i < shapeLabels.length; i++) {
    let btn = new Button(25, 550 + i * 80, 150, 50, color(64, 0, 85), shapeLabels[i]);
    btn.onClick(() => currentShape = shapeLabels[i]);
    shapeBtns.push(btn);
  }
}

// ──────────────────────────────────────
// 매 프레임 UI 그리기
// ──────────────────────────────────────
function draw() {
  // 왼쪽 UI 패널
  fill(0, 0, 100);
  stroke(64, 0, 85);
  strokeWeight(2);
  rect(0, 0, 200, height);

  // 색상 선택 원
  for (let p of palette) {
    fill(p.color);
    noStroke();
    circle(p.x, p.y, 60);

    // 클릭 시 색상 변경
    if (mouseIsPressed && dist(mouseX, mouseY, p.x, p.y) < 25) {
      c = p.color;
    }
  }

  // 원형 그리기 영역 테두리
  noFill();
  stroke(64, 0, 85);
  strokeWeight(2);
  ellipse(centerX, centerY, radius * 1.6, radius * 1.6);

  // 선 굵기 슬라이더 UI
  stroke(0); strokeWeight(6); noFill();
  line(100, 100, 100, 400); // 슬라이더 막대
  fill(0);
  let handleY = map(w, 0.5, 30, 400, 100); // 굵기에 따른 핸들 위치
  rect(50, handleY - 5, 100, 30);

  // 슬라이더 드래그 시 굵기 조절
  if (mouseIsPressed &&mouseX > 50 && mouseX < 150 && mouseY > 100 && mouseY < 400) {
    w = (400 - mouseY) / 10;
  }

  // 버튼 그리기
  resetBtn.display();
  for (let btn of shapeBtns) btn.display();
}

// ──────────────────────────────────────
// 자유선 그리기
// ──────────────────────────────────────
function mouseDragged() {
  if (currentShape === "Line") {
    let d1 = dist(mouseX, mouseY, centerX, centerY);
    let d2 = dist(pmouseX, pmouseY, centerX, centerY);
    if (d1 < radius * 0.8 && d2 < radius * 0.8) {
      stroke(c);
      strokeWeight(w);
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
  }
}

// ──────────────────────────────────────
// 마우스 눌렀을 때
// ──────────────────────────────────────
function mousePressed() {
  resetBtn.handleMousePressed();
  for (let btn of shapeBtns) btn.handleMousePressed();
}

// ──────────────────────────────────────
// 마우스 뗐을 때
// ──────────────────────────────────────
function mouseReleased() {
  resetBtn.handleMouseReleased();
  for (let btn of shapeBtns) btn.handleMouseReleased();

  // 자유선은 제외
  let d = dist(mouseX, mouseY, centerX, centerY);
  if (currentShape && currentShape !== "Line" && d < radius * 0.8) {
    stroke(c);
    strokeWeight(w);
    fill(c);

    // 도형 그리기
    if (currentShape === "Circle") {
      ellipse(mouseX, mouseY, 80, 80);
    } else if (currentShape === "Rectangle") {
      rect(mouseX - 40, mouseY - 40, 80, 80);
    } else if (currentShape === "Triangle") {
      triangle(
        mouseX, mouseY - 50,
        mouseX - 40, mouseY + 40,
        mouseX + 40, mouseY + 40
      );
    }
  }
}
