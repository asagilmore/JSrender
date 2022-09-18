let renderWidth = 200;
let renderHeight = 200;
function setup() {
  createCanvas(renderWidth,renderHeight); //set window size
  pixelDensity(1); //pixel density matches display
  let img = createImage(renderWidth, renderHeight);
  img.loadPixels();
  for (let i = 0; i < img.width; i++){
    for (let j = 0; j < img.height; j++) {
      let intersect = calcIntersects(castRay(i,j));
      //console.log("calc intersect pixel "+i+", "+j+" == "+intersect);
      if (intersect  == false){
        img.set(i,j,color(200,200,200));
      }else{
        img.set(i,j,color(255,0,0));
      }
    }
  } 
  img.updatePixels();
  image(img, 0, 0);
}

const cameraPos = [0,0,0,0,0];  // x,y,z, X-rotation(yaw), Y-rotation(pitch)
const viewPlane = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]]; //Not needed delete later //top left, top right, bottom left, bottom right // [x,y,z] 
var spheres = [[10,0,0,1]]; // defines spheres in scene as [x,y,z,radius]
function getView(){ //i dont need this anymore, delete later
  console.log("getView() start");
  //widith = render; //FIX!!!! get aspect ratio, use float value for aspect ratio
  //top left
  viewPlane[0][0] = cameraPos[0]+1; // x
  viewPlane[0][1] = cameraPos[1]+1; // y
  viewPlane[0][2] = cameraPos[2]+1; // z
  console.log("top left set to: "+ viewPlane[0]); 
  //top right
  viewPlane[1][0] = cameraPos[0]+1; // x
  viewPlane[1][1] = cameraPos[1]+1; // y
  viewPlane[1][2] = cameraPos[2]-1; // z
  console.log("top right set to: "+ viewPlane[1]);
  //bottom left 
  viewPlane[2][0] = cameraPos[0]+1; // x
  viewPlane[2][1] = cameraPos[1]-1; // y
  viewPlane[2][2] = cameraPos[2]+1; // z
  console.log("bottom left set to: "+ viewPlane[2]);
  //bottom right
  viewPlane[3][0] = cameraPos[0]+1; // x
  viewPlane[3][1] = cameraPos[1]-1; // y
  viewPlane[3][2] = cameraPos[2]-1; // z
  console.log("bottom left set to: "+ viewPlane[3]);
  //x rotation aka yaw (rotation around y axis, or rotation of the xz plane, very confusing)
  //positive rotates left
  function toRadians(angle) { //deg to rad
    return angle * (Math.PI / 180);
  }
  const yawTrig = [Math.sin(toRadians(cameraPos[3])),Math.cos(toRadians(cameraPos[3]))]; // sin,cos calculates sin and cos value for x rotation axis, doing this beforehand is marginally faster i think?
  const pitchTrig = [Math.sin(toRadians(cameraPos[4])),Math.cos(toRadians(cameraPos[4]))]; //sin,cos
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
}

function castRay(Xpixel,Ypixel){ //input =/= 0 // outputs [[x,y,z],[x,y,z]] that defines the ray  //do I need width and height as input? I dont think so but using global might cause problems later?? fix if needed.  
  const ray = [[0,0,0],[0,0,0]]; // first point, seccond point: [x,y,z]
  ray[1][0] = ray[1][0] + 1; // second point x set to 1 unit infront of origin
  ray[1][1] = ray[1][1] + (  (renderHeight/renderWidth) - ( ((renderHeight/renderWidth)*2) * (Ypixel/renderWidth) )  ); // second point y set by Ypixel 
  ray[1][2] = ray[1][2] + (  (renderWidth/renderHeight) - ( ((renderWidth/renderHeight)*2) * (Xpixel/renderHeight) )  ); // second point z set by Xpixel 

   //do yaw rotation of second point around origin
  function toRadians(angle) { //deg to rad
    return angle * (Math.PI / 180);
  }
  const yawTrig = [Math.sin(toRadians(cameraPos[3])),Math.cos(toRadians(cameraPos[3]))]; // sin,cos calculates sin and cos value for x rotation axis, doing this beforehand is marginally faster i think?
  const pitchTrig = [Math.sin(toRadians(cameraPos[4])),Math.cos(toRadians(cameraPos[4]))]; //sin,cos

  ray[1][0] = ((ray[1][0]*yawTrig[1]) - (ray[1][2]*yawTrig[0])); //xcos(angle) - zsin(angle)
  ray[1][2] = ((ray[1][2]*yawTrig[1]) + (ray[1][0]*yawTrig[0])); //zcos(angle) + xsin(angle)

  ray[1][0] = ((ray[1][0]*pitchTrig[1])-(ray[1][1]*pitchTrig[0])); //xcos(angle) - ysin(angle)
  ray[1][1] = ((ray[1][1]*pitchTrig[1])+(ray[1][0]*pitchTrig[0]));
  
  for (rayPoint = 0; rayPoint < 2; rayPoint++){ // displace by camera position
    for (i = 0; i < 3; i++){
      ray[rayPoint][i] = ray[rayPoint][i] + cameraPos[i]; //get point and x,y,or z value and add corresponding camera xyorz value
    }
  }

  return ray;
}

function calcIntersects(ray){ // input as array [[x,y,z],[x,y,z]]
  const intersections = [];
  console.log(ray);
  for (intsphere in spheres){ //change later to accept other shapes, make array of objects and calculate all by distance.
    let vx = (ray[1][0]-ray[0][0]);
    let vy = (ray[1][1]-ray[0][1]);
    let vz = (ray[1][2]-ray[0][2]);
    let A = (vx*vx + vy*vy + vz*vz);
    let B = 2*( ((ray[0][0]-spheres[intsphere][0])*vx) + ((ray[0][1]-spheres[intsphere][1])*vy) +((ray[0][2]-spheres[intsphere][2])*vz));
    let C = ray[1][0]*ray[1][0] - 2*ray[1][0]*spheres[intsphere][0] + spheres[intsphere][0]*spheres[intsphere][0] + ray[1][1]*ray[1][1] - 2*ray[1][1]*spheres[intsphere][1] + spheres[intsphere][1]*spheres[intsphere][1] + ray[1][2]*ray[1][2] - 2*ray[1][2]*spheres[intsphere][2] + spheres[intsphere][2]*spheres[intsphere][2] - spheres[intsphere][3]*spheres[intsphere][3];
    let D = B*B - 4*(A*C);
    let t = 0;
    console.log("A = "+A+" B = "+B+" C = " + C +" discriminant = "+D);
    if (D >= 0){
      let t1 = (-B - Math.sqrt(D)) / (2*A);
      let t2 = (-B + Math.sqrt(D)) / (2*A);
      if (t1 > t2){
        return t1;
      }else{
        return t2;
      }
    }else{
      return false;
    }
  } 
}

console.log(castRay(50,50));
console.log("test" + calcIntersects([[0,0,0],[0,-20,0]]));
console.log((renderHeight/renderWidth));
console.log("castRay:"+castRay(100,100));

render();