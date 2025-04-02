// 전역 변수 선언
let c; // 현재 선택된 색상
let w = 5; // 브러시(선) 굵기
let palette = []; // 색상 원 정보들을 저장할 배열
let radius = 300; // 색상 휠의 반지름
let centerX, centerY; // 색상 휠과 제한 그리기 영역의 중심 좌표

function setup() {
  createCanvas(1600, 900);
  background(255);
  colorMode(HSB);
  angleMode(DEGREES);
  noStroke();

  // 색상 휠 중심 좌표 설정 (화면 중앙보다 약간 아래로)
  centerX = width / 2;
  centerY = height * 0.45;

  // 색상 원 12개를 각도 30도 간격으로 배치
  for (let angle = 0; angle < 360; angle += 30) {
    // HSB 색상 값 생성 (Hue만 변경)
    let col = color(angle, 85, 90);

    // 삼각함수로 색상 원의 x, y 위치 계산
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;

    // 원 그리기
    fill(col);
    circle(x, y, 50); // 지름 50px

    // 색상 원 정보를 배열에 저장 (클릭 판정용)
    palette.push({ x: x, y: y, color: col });
  }

  // 초기 선택 색상: 검정
  c = color(0, 0, 0);
}

function draw() {
    fill(104,198,246)
    noStroke()
    rect(0,0,200,height)
  
  // 마우스를 클릭하면 색상 원을 선택할 수 있음
  if (mouseIsPressed && mouseButton === LEFT) {
    for (let i = 0; i < palette.length; i++) {
      let p = palette[i];
      let d = dist(mouseX, mouseY, p.x, p.y); // 마우스와 색상 원 중심 거리
      if (d < 25) { // 원 반지름보다 작으면 클릭으로 판단
        c = p.color; // 색상 선택
      }
    }
  }

  
  


  // 브러시 굵기 조절 슬라이더 영역 (좌표 제한)
  if (mouseIsPressed && mouseX > 800 && mouseX < 1000 && mouseY < 100) {
    // 마우스 위치를 0.5~20 사이의 선 굵기로 매핑
    w = map(mouseX, 800, 1000, 0.5, 20);
  }


  
   if(mouseIsPressed&&mouseX>800&&mouseX<1000&&mouseY<100)
        w = (mouseX-800)/10
   stroke(0)
   strokeWeight(5)
   line(800,50,1000,50)
    rect(800+w*10,10,25,80)
    

  
  
  
  

  // 🌀 원형 그리기 제한 영역을 시각적으로 표시
  noFill();
  stroke(64,0,78);
  strokeWeight(2);
  ellipse(centerX, centerY, radius * 1.5, radius * 1.5); // 원 테두리

  // 🎨 원 안에서만 그림 그릴 수 있도록 조건 설정
  if (mouseIsPressed && mouseButton === LEFT) {
    
    // 현재 위치와 이전 마우스 위치가 모두 원 안에 있는지 확인
    let d1 = dist(mouseX, mouseY, centerX, centerY);
    let d2 = dist(pmouseX, pmouseY, centerX, centerY);

    if (d1 < radius * 0.7 && d2 < radius * 0.7) {
      strokeWeight(w);
      stroke(c);
      line(mouseX, mouseY, pmouseX, pmouseY); // 자유 곡선 그리기
    }
  }
}
