let renderWidth = 500;
let renderHeight = 500;
function setup() {
  createCanvas(renderWidth,renderHeight); //set window size
  pixelDensity(1); //pixel density matches display
}

const camera = [0,0,0,90,0];  // x,y,z, X-rotation(yaw), Y-rotation(pitch)
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
  //x rotation aka yaw (rotation around y axis, or rotation of the xz plane, very confusing)
  //positive rotates left
  function toRadians(angle) { //deg to rad
    return angle * (Math.PI / 180);
  }
  const yawTrig = [Math.sin(toRadians(camera[3])),Math.cos(toRadians(camera[3]))]; // sin,cos calculates sin and cos value for x rotation axis, doing this beforehand is marginally faster i think?
  const pitchTrig = [Math.sin(toRadians(camera[4])),Math.cos(toRadians(camera[4]))]; //sin,cos
  console.log(yawTrig,pitchTrig);
  for (corner in viewPlane){ //run through all corners calculate yaw
    viewPlane[corner][0] = ((viewPlane[corner][0]*yawTrig[1]) - (viewPlane[corner][2]*yawTrig[0])); //xcos(angle) - zsin(angle)
    viewPlane[corner][2] = ((viewPlane[corner][2]*yawTrig[1]) + (viewPlane[corner][0]*yawTrig[0])); //zcos(angle) + xsin(angle)
    console.log("yaw rotation for corner "+corner+":"+viewPlane[corner]);
  }

  //y rotation aka pitch (rotation around z axis) there is no roll because that is not needed
  //positive rotates up
  for (corner in viewPlane){ //run through all corners calculate pitch
    viewPlane[corner][0] = ((viewPlane[corner][0]*pitchTrig[1])-(viewPlane[corner][1]*pitchTrig[0])); //xcos(angle) - ysin(angle)
    viewPlane[corner][1] = ((viewPlane[corner][1]*pitchTrig[1])+(viewPlane[corner][0]*pitchTrig[0])); //ycos(angle) + xsin(angle)
    console.log("pitch rotation for corner "+corner+":"+String(viewPlane[corner]));
  }
  console.log("getView() complete");
  test = 0.01248124;
  console.log(test);
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