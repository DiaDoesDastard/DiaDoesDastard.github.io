function gameObject(position = [0,0,0], vertices = [[2,2,2]], triangles[[0]]){
  this.position = position
  this.triangles = triangles
  this.vertices = vertices
  this.normals = []
  
  this.generateNormals = function(){
    var ab = [0,0,0]
    var ac = [0,0,0]
    var tempNormal = [0,0,0]
    for(var triangleCounter = 0; triangleCounter<this.triangles.length; triangleCounter++){
      ab[0] = vertices[triangles[triangleCounter][1]][0]-vertices[triangles[triangleCounter][0]][0]
      ab[1] = vertices[triangles[triangleCounter][1]][1]-vertices[triangles[triangleCounter][0]][1]
      ab[2] = vertices[triangles[triangleCounter][1]][2]-vertices[triangles[triangleCounter][0]][2]
      
      ac[0] = vertices[triangles[triangleCounter][2]][0]-vertices[triangles[triangleCounter][0]][0]
      ac[1] = vertices[triangles[triangleCounter][2]][1]-vertices[triangles[triangleCounter][0]][1]
      ac[2] = vertices[triangles[triangleCounter][2]][2]-vertices[triangles[triangleCounter][0]][2]

      tempNormal[0] = ab[2]*ac[3]-ab[3]*ac[2]
      tempNormal[1] = ab[1]*ac[3]-ab[3]*ac[1]
      tempNormal[2] = ab[1]*ac[2]-ab[2]*ac[1]
      
      this.normals.append(tempNormal)
    }
  }
  generateNormals()
  objectList.append(this)
}