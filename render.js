const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const xSize = canvas.width;
const ySize = canvas.height;
var rotationMatrix = new Array(3,3);

var offset = [0,0,0];
var scaling = 60;
var mainRho = 45;
var mainPhi = 20;

var sunRho  = 0;
var sunPhi = 0;
var ambientLight = 60;
var sunVector = [0,0,0]
var sunColor = [255,255,255]

const occlusionMask = new Array((xSize*ySize*4));
occlusionMask.fill(-1);

var objectList = [];
var toCameraVector = new Array(3);

const imageArrays = new Uint8ClampedArray(xSize*ySize*4);
var resolution = 1.2;




function generateNormals(hostObject){
  //Generates the normal for the plane, this is used for backface culling
  hostObject.normals = [];
  var vertices = hostObject.vertices;
  var triangles = hostObject.triangles;
  var sideVectors = [[0,0,0],[0,0,0]];
  for(i=0;i<hostObject.triangles.length;i++){
    sideVectors[0][0] = vertices[triangles[i][1]][0]-vertices[triangles[i][0]][0];
    sideVectors[0][1] = vertices[triangles[i][1]][1]-vertices[triangles[i][0]][1];
    sideVectors[0][2] = vertices[triangles[i][1]][2]-vertices[triangles[i][0]][2];

    sideVectors[1][0] = vertices[triangles[i][1]][0]-vertices[triangles[i][2]][0];
    sideVectors[1][1] = vertices[triangles[i][1]][1]-vertices[triangles[i][2]][1];
    sideVectors[1][2] = vertices[triangles[i][1]][2]-vertices[triangles[i][2]][2];


    hostObject.normals.push([
      sideVectors[0][1]*sideVectors[1][2]-sideVectors[0][2]*sideVectors[1][1],
      -1*(sideVectors[0][0]*sideVectors[1][2]-sideVectors[0][2]*sideVectors[1][0]),
      sideVectors[0][0]*sideVectors[1][1]-sideVectors[0][1]*sideVectors[1][0]]);
  }
}

function generateRotationMatrix(rho, phi){
  var rotationalMatrix = new Array(3,3)
  //Converting to radians
  rho = Math.PI * rho / 180;
  phi = Math.PI * phi / 180;

  //Processing the rotational matrix
  rotationalMatrix[0] = 
    [Math.cos(rho),0,-Math.sin(rho)];
    rotationalMatrix[1] = 
    [-Math.sin(rho)*Math.sin(phi),Math.cos(phi),-Math.cos(rho)*Math.sin(phi)];
    rotationalMatrix[2] = 
    [Math.sin(rho)*Math.cos(phi),Math.sin(phi),Math.cos(rho)*Math.cos(phi)];
  return rotationalMatrix
}

function rotatePoints(position,rotationalMatrix, offsets = [0,0,0]){
  //Applying the offsets to the scene
  position = [position[0]-offsets[0],position[1]-offsets[1],position[2]-offsets[2]]
  var finalPosition = new Array(3);

  //Applying rotational matrix 
  finalPosition[0] = 
    position[0]*rotationalMatrix[0][0] + 
    position[1]*rotationalMatrix[0][1] + 
    position[2]*rotationalMatrix[0][2]; 
  finalPosition[1] = 
    position[0]*rotationalMatrix[1][0] + 
    position[1]*rotationalMatrix[1][1] + 
    position[2]*rotationalMatrix[1][2]; 
  finalPosition[2] = 
    position[0]*rotationalMatrix[2][0] + 
    position[1]*rotationalMatrix[2][1] + 
    position[2]*rotationalMatrix[2][2]; 
  return finalPosition;
}



function bufferObject(hostObject, objectID, rotationalMatrix, chosenMask, offsets = [0,0,0]){
  var tempVertices = new Array(hostObject.vertices.length);
  var lightLevels = [0,0,0]
  var sunCos = 0
  for(i=0; i<tempVertices.length; i++){
    tempVertices[i] = 
      rotatePoints([hostObject.vertices[i][0]*scaling*hostObject.scale[0]+hostObject.position[0]*scaling,
                    hostObject.vertices[i][1]*scaling*hostObject.scale[1]+hostObject.position[1]*scaling,
                    hostObject.vertices[i][2]*scaling*hostObject.scale[2]+hostObject.position[2]*scaling],
                  rotationalMatrix,
                  offsets);
  }
  for(i=0; i<hostObject.triangles.length; i++){
    if((hostObject.normals[i][2] * toCameraVector[2] > 0) || 
      (hostObject.normals[i][1] * toCameraVector[1] > 0) ||
      (hostObject.normals[i][0] * toCameraVector[0] > 0)){
      if((hostObject.normals[i][2] * sunVector[2] > 0) || 
        (hostObject.normals[i][1] * sunVector[1] > 0) ||
        (hostObject.normals[i][0] * sunVector[0] > 0)){
        
        lightLevels = [sunColor[0]/255,sunColor[1]/255,sunColor[2]/255]
      }else{
        lightLevels = [ambientLight/255,ambientLight/255,ambientLight/255]
      }
      drawTriangle(tempVertices[hostObject.triangles[i][0]],
                  tempVertices[hostObject.triangles[i][1]],
                  tempVertices[hostObject.triangles[i][2]], 
                  objectID,
                  i,
                  chosenMask,
                  lightLevels);      
    }    
  }
}



function renderScreen(){
  var uCoord = 0
  var vCoord = 0
  var textureCoord = 0
  var targetObject = 0
  var targetIJ = 0
  var uvCoords = 0
  var triangleID = 0
  var lightLevels = [0,0,0]
  for(i=0; i<imageArrays.length;i += 4){
    var xPos = i%xSize
    var yPos = Math.floor((i-xPos)/xSize)
    if(occlusionMask[i + 1] >= 0){
      targetObject = objectList[occlusionMask[i + 1]]
      targetIJ = occlusionMask[i + 0]
      uvCoords = targetObject.uvCoordanates[occlusionMask[i + 2]]
      lightLevels = occlusionMask[i + 3]
      if(occlusionMask[i + 2]%2==0){
        targetIJ = [1-targetIJ[0],1-targetIJ[1]]
      }
      uCoord = roundNumber((uvCoords[1][0]*targetIJ[0]+uvCoords[2][0]*targetIJ[1]))

      vCoord = roundNumber((uvCoords[1][1]*targetIJ[0]+uvCoords[2][1]*targetIJ[1]))
      textureCoord = (vCoord*objectList[occlusionMask[i + 1]].textureSize+uCoord)*4
      imageArrays[i + 0] = lightLevels[0]*targetObject.textureMap[textureCoord + 0]; // R value
      imageArrays[i + 1] = lightLevels[1]*targetObject.textureMap[textureCoord + 1]; // G value
      imageArrays[i + 2] = lightLevels[2]*targetObject.textureMap[textureCoord + 2]; // B value
      imageArrays[i + 3] = 255; // A value
    }
  }
}

function generatePrimative(type, position, imageURL = "lavender.png", scale=[1,1,1]){
  if(imageURL == ""){
    imageURL = "lavender.png"
  }
  if(type.toLowerCase() == "cube"){
    return new gameObject(imageURL,
        [[[0,0],[39,0],[39,39]],[[0,0],[0,39],[39,39]],
         [[0,0],[39,0],[39,39]],[[0,0],[0,39],[39,39]],
         [[0,0],[39,0],[39,39]],[[0,0],[0,39],[39,39]],
         [[0,0],[39,0],[39,39]],[[0,0],[0,39],[39,39]],
         [[0,0],[39,0],[39,39]],[[0,0],[0,39],[39,39]],
         [[0,0],[39,0],[39,39]],[[0,0],[0,39],[39,39]]],                
                          [[.5,-.5,.5],[-.5,-.5,.5],[-.5,-.5,-.5],[.5,-.5,-.5],
                             [.5,.5,.5],[-.5,.5,.5],[-.5,.5,-.5],[.5,.5,-.5]],
        [[0,1,2],[2,3,0],[6,5,4],[4,7,6],[0,4,5],[5,1,0],
         [2,6,7],[7,3,2],[1,5,6],[6,2,1],[7,4,0],[0,3,7]],
        position,scale);
  }
  if(type.toLowerCase() == "plane"){
    return new gameObject(imageURL,
                          [[[0,0],[79,0],[79,79]],[[0,0],[79,0],[79,79]]],
                          [[1,-1,1],[-1,-1,1],[-1,-1,-1],[1,-1,-1]],
                          [[0,1,2],[2,3,0]],
                          position,scale);
  }
  if(type.toLowerCase() == "wall1"){
    return new gameObject(imageURL,
        [[[0,0],[39,0],[39,39]],[[0,0],[39,0],[39,39]]],                
        [[1,-1,1],[-1,-1,1],[-.5,-.5,-.5],[.5,-.5,-.5],
         [1,1,1],[-1,1,1],[-.5,.5,-.5],[.5,.5,-.5]],
        [[4,5,1],[1,0,4]],
        position,scale);
  }
  if(type.toLowerCase() == "wall2"){
    return new gameObject(imageURL,
        [[[0,0],[39,0],[39,39]],[[0,0],[39,0],[39,39]]],                
        [[.5,-.5,.5],[-.5,-.5,.5],[-1,-1,-1],[1,-1,-1],
         [.5,.5,.5],[-.5,.5,.5],[-1,1,-1],[1,1,-1]],
        [[6,7,3],[3,2,6]],
        position,scale);
  }
  if(type.toLowerCase() == "wall3"){
    return new gameObject(imageURL,
                          [[[0,0],[39,0],[39,39]],[[0,0],[39,0],[39,39]]],                
        [[.5,-.5,.5],[-1,-1,1],[-1,-1,-1],[.5,-.5,-.5],
         [.5,.5,.5],[-1,1,1],[-1,1,-1],[.5,.5,-.5]],
        [[5,6,2],[2,1,5]],
        position,scale);
  }
  if(type.toLowerCase() == "wall4"){
    return new gameObject(imageURL,
                          [[[0,0],[39,0],[39,39]],[[0,0],[39,0],[39,39]]],                
        [[1,-1,1],[-1,-1,1],[-1,-1,-1],[1,-1,-1],
         [1,1,1],[-1,1,1],[-1,1,-1],[1,1,-1]],
        [[7,4,0],[0,3,7]],
        position,scale);
  }
}

function drawTriangle(pointA,pointB,pointC,objectID,triangleID,targetMask, lightLevel){
  var depth = 0

  var abVector = [pointB[0]-pointA[0],pointB[1]-pointA[1],pointB[2]-pointA[2]];
  var abDistance = Math.sqrt((pointB[0]-pointA[0])**2+(pointB[1]-pointA[1])**2)


  var acVector = [pointC[0]-pointA[0],pointC[1]-pointA[1],pointC[2]-pointA[2]];
  var acDistance = Math.sqrt((pointC[0]-pointA[0])**2+(pointC[1]-pointA[1])**2)

  var targetPoint = [0,0]

  var imageIndices = 0

  pointA = [pointA[0]+xSize/2,pointA[1]+ySize/2,pointA[2]]
  
  for(abScalar = 0; abScalar<=1; abScalar += (1/Math.floor(abDistance*resolution))){
    for(acScalar = 0; acScalar+abScalar<=1; acScalar += (1/Math.floor(acDistance*resolution))){

      targetPoint = [Math.floor((pointA[0]+abScalar*abVector[0]+acScalar*acVector[0])),
                     Math.floor((pointA[1]+abScalar*abVector[1]+acScalar*acVector[1]))]


      if(0<targetPoint[0]&&targetPoint[0]<xSize&&0<targetPoint[1]&&targetPoint[1]<ySize){
        //for(jk = 0; jk<4)
        depth = pointA[2]+abScalar*abVector[2]+acScalar*acVector[2]
        imageIndices = (targetPoint[1]*xSize+targetPoint[0])*4
        if(targetMask[imageIndices + 0][2] > depth || targetMask[imageIndices + 1] == -1){
            targetMask[imageIndices + 0] = [abScalar,acScalar,depth];
            targetMask[imageIndices + 1] = objectID;
            targetMask[imageIndices + 2] = triangleID;
            targetMask[imageIndices + 3] = lightLevel;
        }
      }
    }
  }
}

function roundNumber(number){
  if(number-Math.floor(number)>=.5){
    return Math.ceil(number);
  }else{
    return Math.floor(number);
  }
}

function clearScreen(){
  imageArrays.fill(0)
  for (i = 0; i < imageArrays.length; i+=4) {
    imageArrays[i + 3] = 255;
  }
}
