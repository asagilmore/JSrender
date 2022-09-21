
let renderWidth = 100;
let renderHeight = 100;

function setup() {
  createCanvas(renderWidth,renderHeight); //set window size
}

const cameraPos = [0,0,0,0,0];  // x,y,z, X-rotation(yaw), Y-rotation(pitch)
const viewPlane = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]]; //Not needed delete later //top left, top right, bottom left, bottom right // [x,y,z] 
var spheres = [[10,0,0,1],[20,5,5,2],[25,-5,-4,0.5]]; // defines spheres in scene as [x,y,z,radius]
camFov = 1;
camFov2 = 180;

fov.oninput = function(){
  camFov = this.value;
  camFov2 = this.value;
}

resolution.oninput = function(){
  if (this.value >= 1){
    renderHeight = this.value;
    renderWidth = this.value;
  }else{
    renderHeight = 10;
    renderWidth = 10;
  }
}

function draw() {
  createCanvas(renderWidth,renderHeight);
  let img = createImage(renderWidth, renderHeight);
  img.loadPixels();
  for (let i = 0; i < img.width; i++){
    for (let j = 0; j < img.height; j++) {
      let intersect = calcIntersects(castRay(i,j));
      if (intersect  == false){
        img.set(i,j,color(200,200,200));
      }else{
        img.set(i,j,color(255-intersect[3]*10,0,255-intersect[3]*6));
      }
    }
  } 
  img.updatePixels(); 
  image(img, 0, 0);
  console.log("render complete"); 
}

function toRadians(angle) { //deg to rad
  return angle * (Math.PI / 180);
}

function castRay(Xpixel,Ypixel){ //input =/= 0 // outputs [[x,y,z],[x,y,z]] that defines the ray  //do I need width and height as input? I dont think so but using global might cause problems later?? fix if needed.  
  const ray = [[0,0,0],[0,0,0]]; // first point, seccond point: [x,y,z]
  ray[1][0] = camFov; // second point x set to 1 unit infront of origin
  ray[1][1] = (  (renderHeight/renderWidth) - ( ((renderHeight/renderWidth)*2) * (Ypixel/renderWidth) )  ); // second point y set by Ypixel 
  ray[1][2] = (  (renderWidth/renderHeight) - ( ((renderWidth/renderHeight)*2) * (Xpixel/renderHeight) )  ); // second point z set by Xpixel 

   //do yaw rotation of second point around origin

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

function castRay2(Xpixel,Ypixel){
  const ray = [[0,0,0],[1,0,0]];
  var yawTrig = [Math.sin(toRadians((((Xpixel/renderWidth)*camFov2)-camFov2/2) + cameraPos[3] )) , Math.cos(toRadians( (((Xpixel/renderWidth)*camFov2)-camFov2/2) + cameraPos[3] ))];
  var pitchTrig = [Math.sin(toRadians((((Ypixel/renderHeight)*camFov2)-camFov2/2) + (cameraPos[4])) ) , Math.cos(toRadians( (((Ypixel/renderHeight)*camFov2)-camFov2/2) + cameraPos[4]) )] ;

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
  //console.log(ray);
  for (intsphere in spheres){ //change later to accept other shapes, make array of objects and calculate all by distance.
    let vx = (ray[1][0]-ray[0][0]);
    let vy = (ray[1][1]-ray[0][1]);
    let vz = (ray[1][2]-ray[0][2]);
    let A = (vx*vx + vy*vy + vz*vz); // a b and c of (-b +/- sqrt(b^2 - 4ac))/2a
    let B = 2*( ((ray[0][0]-spheres[intsphere][0])*vx) + ((ray[0][1]-spheres[intsphere][1])*vy) +((ray[0][2]-spheres[intsphere][2])*vz));
    let C = ray[1][0]*ray[1][0] - 2*ray[1][0]*spheres[intsphere][0] + spheres[intsphere][0]*spheres[intsphere][0] + ray[1][1]*ray[1][1] - 2*ray[1][1]*spheres[intsphere][1] + spheres[intsphere][1]*spheres[intsphere][1] + ray[1][2]*ray[1][2] - 2*ray[1][2]*spheres[intsphere][2] + spheres[intsphere][2]*spheres[intsphere][2] - spheres[intsphere][3]*spheres[intsphere][3];
    let D = B*B - 4*(A*C);
    let t = 0;
    if (D >= 0){
      let t1 = (-B - Math.sqrt(D)) / (2*A); // calculate t of both intersects
      let t2 = (-B + Math.sqrt(D)) / (2*A);
      const x1 =  ray[0][0]+t1*(vx);//calculate xyz of both intersects
      const y1 =  ray[0][1]+t1*(vy);
      const z1 =  ray[0][2]+t1*(vz);
      const x2 =  ray[0][0]+t2*(vx);
      const y2 =  ray[0][1]+t2*(vy);
      const z2 =  ray[0][2]+t2*(vz);

      const dist1 = Math.sqrt( ((cameraPos[0]-x1)**2) + ((cameraPos[1]-y1)**2) + ((cameraPos[2]-z1)**2) ); //calculate distance of both intersects
      const dist2 = Math.sqrt( ((cameraPos[0]-x2)**2) + ((cameraPos[1]-y2)**2) + ((cameraPos[2]-z2)**2) );
      if (dist1 < dist2){
        return [x1,y1,z1,dist1];
      }else{
        return [x2,y2,z2,dist2];
      }

    }
  }
  return false;
}

var cameraX = document.getElementById("cameraX");
var cameraY = document.getElementById("cameraY");
var cameraZ = document.getElementById("cameraZ");
var cameraYaw = document.getElementById("cameraYaw");
var cameraPitch = document.getElementById("cameraPitch");

cameraX.oninput = function(){
  cameraPos[0]= this.value*0.1;
}
cameraY.oninput = function(){
  cameraPos[1]= this.value*0.1;
}
cameraZ.oninput = function(){
  cameraPos[2]= this.value*0.1;
}
cameraYaw.oninput = function(){
  cameraPos[3]= this.value*0.25;
}
cameraPitch.oninput = function(){
  cameraPos[4]= this.value*0.25;
}


calcIntersects([0,0,0],[1,1,1]);