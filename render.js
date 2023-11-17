var rotationMatrix = new Array(3,3)

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

