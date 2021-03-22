const model_url =
  'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let mic;
let cnv;
let playing;
let freq = 0;
let threshold = 1;
let i=1;
let notes = [
    {
      note: 'E',
      freq: 82.41
    },
    {
      note: 'A',
      freq: 110.00
    },
    {
      note: 'D',
      freq: 146.83
    },
    {
      note: 'G',
      freq: 196.00
    },
    {
        note: 'H',
        freq: 246.94
      },
      {
        note: 'E',
        freq: 329.63 
      }
  ];
  
  function setup() {
    cnv=createCanvas(400, 400);
    audioContext = getAudioContext();
    mic = new p5.AudioIn();
    mic.start(listening);
    osc = new p5.Oscillator('sine');
    cnv.mouseClicked(toggleSound)
   
  }
  function toggleSound() {
    if(playing){
        osc.stop();
        playing = false;
    }
    else{
        osc.start();
        playing = true;
    }
  }
  function listening() {
    console.log('listening');
    pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
  }
  
  function draw() {
      
    background(0);
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(32);
    text(freq.toFixed(2), width / 2, height - 150);
  
    let closestNote = -1;
    let recordDiff = Infinity;
    for (let i = 0; i < notes.length; i++) {
      let diff = freq - notes[i].freq;
      if (abs(diff) < abs(recordDiff)) {
        closestNote = notes[i];
        recordDiff = diff;
        
      }
    }
  
    textSize(64);
    text(closestNote.note, width / 2, height - 50);
  
    let diff = recordDiff;
    // let amt = map(diff, -100, 100, 0, 1);
    // let r = color(255, 0, 0);
    // let g = color(0, 255, 0);
    // let col = lerpColor(g, r, amt);
  
    let alpha = map(abs(diff), 0, 120, 255, 0);
    rectMode(CENTER);
    fill(255, alpha);
    stroke(255);
    strokeWeight(1);

    if(diff>30){
        for(let i=1;i<=3;i++){
            fill(255, 0, 0);
            rect(150+i*50, 200, 50, 50);
        }
    }
    if(diff<30&&diff>10){
        for(let i=1;i<=2;i++){
            fill(255, 0, 0);
            rect(150+i*50, 200, 50, 50);
        }
    }
    if(diff<10&&diff>2){
        for(let i=1;i<=1;i++){
            fill(255, 0, 0);
            rect(150+i*50, 200, 50, 50);
        }
    }
    if(diff>-2&&diff<2){
            fill(0, 255, 0);
            rect(200, 200, 50, 50);
    }
    if(diff<-2&&diff>-10){
            fill(255, 0, 0);
            rect(200, 200, 50, 50);
    }
    if(diff<-10&&diff>-30){
        for(let i=1;i<=2;i++){
            fill(255, 0, 0);
            rect(250-(i*50), 200, 50, 50);
        }
}
    if(diff<-30){
        for(let i=1;i<=3;i++){
            fill(255, 0, 0);
            rect(250-(i*50), 200, 50, 50);
        }
    }
    
    if (abs(diff) < threshold) {
      fill(0, 255, 0);
      
    }
    
    rect(200, 100, 200, 50);
  
    stroke(255);
    strokeWeight(5);
    
  
    noStroke();
    fill(255, 0, 0);
    if (abs(diff) < threshold) {
      fill(0, 255, 0);
    }
    rect(200 + diff / 2, 100, 10, 75);
    if (playing) {
        osc.freq(closestNote.freq, 0.1);
        osc.amp(1, 1);
      }
      console.log(closestNote.freq);
  }
  
  function modelLoaded() {
    console.log('model loaded');
    pitch.getPitch(gotPitch);
  }
  
  function gotPitch(error, frequency) {

    if (error) {
      console.error(error);
    } else {

      if (frequency) {
        freq = frequency;
      }
      pitch.getPitch(gotPitch);
    }
  }