var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var xSize = canvas.width;
var ySize = canvas.height;
var zoom = 0

var rotationMatrix = new Array(3,3)
var objectList = []

var mainGamma = 0
var mainPhi = 0
var cameraVector = [0,0,0]

const screenArray = new Uint8ClampedArray(xSize*ySize*4)
const occlusionMask = new Array(xSize*ySize*4)


function prepareRender(){
  
}

function callRender(){
  rotationMatrix = generateRotationalMatrix(mainGamma,mainPhi)
  for(var objectID = 0; objectID<objectList.length; objectID++){
    renderTriangles(objectList[objectID],objectID)
  }
}





function generateRotationalMatrix(gamma,phi){
  var rotationalMatrix = new Array(3,3);

  gamma = gamma*Math.PI/180
  phi = phi*Math.PI/180

  rotationalMatrix = [
    [Math.cos(gamma), 0, -Math.sin(gamma)],
    [-Math.sin(gamma)*Math.sin(phi), Math.cos(phi), -Math.cos(gamma)*Math.sin(phi)],
    [Math.sin(gamma)*Math.cos(phi), Math.phi(phi), Math.cos(gamma)*Math.cos(phi)]
  ]
  return rotationalMatrix
}

function rotateVertices(rotationalMatrix, position, offsets){
  var finalPosition = [0,0,0]
  position = [position[0]-offsets[0],
             position[1]-offsets[1],
             position[2]-offsets[2]]
  finalPosition[0] = rotationalMatrix[0][0]*position[0]+
    rotationalMatrix[0][1]*position[1]+
    rotationalMatrix[0][2]*position[2]
  finalPosition[1] = rotationalMatrix[1][0]*position[0]+
  rotationalMatrix[1][1]*position[1]+
  rotationalMatrix[1][2]*position[2]
  finalPosition[2] = rotationalMatrix[2][0]*position[0]+
  rotationalMatrix[2][1]*position[1]+
  rotationalMatrix[2][2]*position[2]
  return finalPosition
}

function renderTriangles(hostObject,objectID){
  var tempVertices = []
  var ab = [0,0,0]
  var ac = [0,0,0]
  for(var vertCount = 0; vertCount<hostObject.vertices.length; vertCount++){
    tempVertices.append(rotateVertices(rotationMatrix,hostObject.vertices[],cameraOffset))
  }  
  for(var triCount = 0; triCount<hostObject.vertices.length; triCount++){
    if((hostObject.normals[0]*cameraVector[0] > 0)||
      (hostObject.normals[1]*cameraVector[1] > 0)||
      (hostObject.normals[2]*cameraVector[2] > 0)||){
      
    }
  }
}