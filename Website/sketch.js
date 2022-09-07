function setup() {
  createCanvas(500,500); //set window size
  pixelDensity(1); //pixel density matches display

}

function draw() {
  background(220);
  let img = createImage(400,400);
  img.loadPixles();
  for (let i = 0; i < img.width; i++){
    for (let j = 0; i < img.height; j++){
      img.set(i,j,color(0,90,102));
    }
  }
  img.updatePixles();
  Image(img,0,0)
}