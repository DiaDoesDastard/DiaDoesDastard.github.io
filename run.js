start()
setInterval(play,1000/60); 
//play()

function start(){
  //loadFromTilemap(0)
  
  for(h=-5;h<5;h++){
    for(g=-5;g<5;g++){
      generatePrimative("plane",[2*h,0,2*g]);      
    }
  }
  

}

function play(){
  rotationMatrix = generateRotationMatrix(mainRho,mainPhi);
  toCameraVector = [Math.sin(Math.PI * mainRho / 180),
                    Math.sin(Math.PI * mainPhi / 180),
                    Math.cos(Math.PI * mainRho / 180)]

  for(e = 0; e<objectList.length; e++){
    bufferObject(objectList[e], e, rotationMatrix, occlusionMask, offset);
  }  
  renderScreen()
  let imageData = new ImageData(imageArrays,xSize)
  ctx.putImageData(imageData,0,0)
  occlusionMask.fill(-1)
  clearScreen()
}

document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    if(charStr == "a"){
      offset[0] = offset[0]-scaling*Math.sin(Math.PI * mainRho / 180 + Math.PI/2);
      offset[2] = offset[2]-scaling*Math.cos(Math.PI * mainRho / 180 + Math.PI/2);
    }
    if(charStr == "d"){
      offset[0] = offset[0]+scaling*Math.sin(Math.PI * mainRho / 180 + Math.PI/2);
      offset[2] = offset[2]+scaling*Math.cos(Math.PI * mainRho / 180 + Math.PI/2);
    }
    if(charStr == "w"){
      offset[0] = offset[0]+scaling*Math.sin(Math.PI * mainRho / 180);
      offset[2] = offset[2]+scaling*Math.cos(Math.PI * mainRho / 180);
    }
    if(charStr == "s"){
      offset[0] = offset[0]-scaling*Math.sin(Math.PI * mainRho / 180);
      offset[2] = offset[2]-scaling*Math.cos(Math.PI * mainRho / 180);
    }
    if(charStr == "e"){
      mainRho += 1;
    }
    if(charStr == "q"){
      mainRho -= 1;
    }
    if(charStr == "r"){
      mainPhi += 1;
    }
    if(charStr == "f"){
      mainPhi -= 1;
    }
};