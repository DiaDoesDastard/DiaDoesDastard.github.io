var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var xSize = canvas.width;
var ySize = canvas.height;
var zoom = 0

var rotationMatrix = new Array(3,3)
var objectList = []

var mainGamma = 45
var mainPhi = 20
var cameraVector = [0,0,0]

const screenArray = new Uint8ClampedArray(xSize*ySize*4)
const occlusionMask = new Array(xSize*ySize*4)

const cube = gameObject([0,0,0],
                       [[1,1,1],[-1,1,1],[-1,-1,1],[1,-1,1],
                        [1,1,-1],[-1,1,-1],[-1,-1,-1],[1,-1,-1]],
                       [[0,1,2],[2,3,0],[4,5,6],[6,7,4],
                       [0,4,5],[5,1,0],[2,6,7],[7,3,2],
                       [3,7,4],[4,0,3],[1,5,6],[6,2,1]])

callRender()

function prepareRender(){
  
}

function callRender(){
  screenArray.fill(0)
  occlusionMask.fill(-1)
  cameraVector = [Math.cos(mainGamma*Math.PI/180), 
                  Math.sin(mainGamma*Math.PI/180),
                  Math.cos(mainPhi*Math.PI/180)]
  rotationMatrix = generateRotationalMatrix(mainGamma,mainPhi)
  for(var objectID = 0; objectID<objectList.length; objectID++){
    renderTriangles(objectList[objectID],objectID)
  }
  renderScreen()
  let imageData = new ImageData(screenArray, xSize);
  ctx.putImageData(imageData,0,0)
}

function renderScreen(){
  for(var index = 0; index<screenArray.length;index+=4){
    if(occlusionMask[index + 1][0] != 1){
      screenArray[index + 0] =  occlusionMask[index + 0]
      screenArray[index + 1] =  occlusionMask[index + 0]
      screenArray[index + 2] =  occlusionMask[index + 0]
      screenArray[index + 3] =  255
    }
    
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

function renderObject(hostObject,objectID){
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
      renderTriangle(tempVertices[triangles[triCount][0]],
                    tempVertices[triangles[triCount][1]],
                    tempVertices[triangles[triCount][2]],
                    objectID,
                    triCount)
      
    }
  }
}

function renderTriangles(pointA, pointB, pointC,objectID,triangleID){
  var abVector = [pointB[0]-pointA[0],pointB[1]-pointA[1],pointB[2]-pointA[2]]
  var abDistance = Math.sqrt((abVector[0])**2+(abVector[1])**2+(abVector[2])**2)
  var acVector = [pointC[0]-pointA[0],pointC[1]-pointA[1],pointC[2]-pointA[2]]
  var acDistance = Math.sqrt((acVector[0])**2+(acVector[1])**2+(acVector[2])**2)
  var targetCoord = 0
  pointA = [pointA[0]+xSize/2,pointA[1]+ySize/2,pointA[2]]
  var targetPoint = [0,0,0] 
  for(iScalar = 0; iScalar<1; iScalar += (1/abDistance)){
    for(jScalar = 0; jScalar+iScalar<=1; jScalar += (1/acDistance)){
      targetPoint = [pointA[0]+iScalar*abVector[0]+jScalar*acVector[0],
                    pointA[1]+iScalar*abVector[1]+jScalar*acVector[1]]
      if(targetPoint[0]<0&&xSize<targetPoint[0]&&targetPoint[1]<0&&ySize<targetPoint[1]){
        targetPoint[2] = pointA[2]+iScalar*abVector[2]+jScalar*acVector[2]
        targetCoord = (xSize*ySize*4)
        if(occlusionMask[targetCoord + 0] > targetPoint[2] || occlusionMask[targetCoord + 1][0] == -1){
          occlusionMask[targetCoord + 0] = targetPoint[2]
          occlusionMask[targetCoord + 1] = [objectID,triangleID]
          occlusionMask[targetCoord + 2] = [iScalar,jScalar]          
        }
      }
    }
  }
}