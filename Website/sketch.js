let renderWidth = 500;
let renderHeight = 500;
function setup() {
  createCanvas(renderWidth,renderHeight); //set window size
  pixelDensity(1); //pixel density matches display

}

const camera = [0,0,0,0,0];  // x,y,z, X-rotation, Y-rotation
const viewPlane = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]]; //top left, top right, bottom left, bottom right // [x,y,z] 
function getView(){
  console.log("getView() start");
  //widith = render; //FIX!!!! get aspect ratio, use float value for aspect ratio
  //top left
  viewPlane[0][0] = camera[0]+1; // x
  viewPlane[0][1] = camera[1]+1; // y
  viewPlane[0][2] = camera[2]+1; // z
  console.log("top left set to: "+ viewPlane[0]);
  //top right
  viewPlane[1][0] = camera[0]+1; // x
  viewPlane[1][1] = camera[1]+1; // y
  viewPlane[1][2] = camera[2]-1; // z
  console.log("top right set to: "+ viewPlane[1]);
  //bottom left
  viewPlane[2][0] = camera[0]+1; // x
  viewPlane[2][1] = camera[1]-1; // y
  viewPlane[2][2] = camera[2]+1; // z
  console.log("bottom left set to: "+ viewPlane[2]);
  //bottom right
  viewPlane[3][0] = camera[0]+1; // x
  viewPlane[3][1] = camera[1]-1; // y
  viewPlane[3][2] = camera[2]-1; // z
  console.log("bottom left set to: "+ viewPlane[3]);

  //x rotation
  for (corner in viewPlane){ //run through all corners
    
  }

  //y rotation
  for (corner in viewPlane){ //run through all corners

  }
  console.log("getView() complete");
}

function draw() {
  background(220);

  let img = createImage(renderWidth, renderHeight);
  img.loadPixels();
  for (let i = 0; i < img.width; i++){
    for (let j = 0; j < img.height; j++) {
      img.set(i, j, color(0, 90, 102));
    }
  }
  img.updatePixels();
  image(img, 0, 0);
  console.log("function.draw(): 'draw completed'")
}


getView();