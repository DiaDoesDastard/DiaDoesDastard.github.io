// objectTpye = enemy, tile, player

function gameObject(position = [0,0,0], vertices = [[2,2,2]], triangles = [[0]], objectType = "enemy"){
  this.position = position
  this.triangles = triangles
  this.vertices = vertices
  this.normals = []
  this.objectType = objectType;
  this.maxHealth = -1
  this.currentHealth = -1


   if(objectType = "enemy"){
      this.maxHealth = 10;
      this.currentHealth = 8;
   }
  
  
  
  this.generateNormals = function(){
    var ab = [0,0,0]
    var ac = [0,0,0]
    var tempNormal = [0,0,0]
    for(var triangleCounter = 0; triangleCounter<this.triangles.length; triangleCounter++){
      //console.log(triangleCounter)
      //console.log(triangles[triangleCounter][1])
      //console.log(vertices[triangles[triangleCounter][1]])
      ab[0] = vertices[triangles[triangleCounter][1]][0]-vertices[triangles[triangleCounter][0]][0]
      ab[1] = vertices[triangles[triangleCounter][1]][1]-vertices[triangles[triangleCounter][0]][1]
      ab[2] = vertices[triangles[triangleCounter][1]][2]-vertices[triangles[triangleCounter][0]][2]
      
      ac[0] = vertices[triangles[triangleCounter][2]][0]-vertices[triangles[triangleCounter][0]][0]
      ac[1] = vertices[triangles[triangleCounter][2]][1]-vertices[triangles[triangleCounter][0]][1]
      ac[2] = vertices[triangles[triangleCounter][2]][2]-vertices[triangles[triangleCounter][0]][2]

      //console.log(ab)
      //console.log(ac)
      
      tempNormal[0] = ab[1]*ac[2]-ab[2]*ac[1]
      tempNormal[1] = ab[0]*ac[2]-ab[2]*ac[0]
      tempNormal[2] = ab[0]*ac[1]-ab[1]*ac[0]

      //console.log(tempNormal)
      //console.log("weh")
      
      this.normals.push([ab[1]*ac[2]-ab[2]*ac[1],
                         -(ab[0]*ac[2]-ab[2]*ac[0]),
                         ab[0]*ac[1]-ab[1]*ac[0]])
    }
  }
  this.generateNormals()
  objectList.push(this)
}



  function DisplayObject(_gameObject){
    
      if(_gameObject.objectType == "enemy")
      {
          var healthText = "Health: " + _gameObject.currentHealth + "/" + _gameObject.maxHealth + "\n" + _gameObject.objectType;
          return healthText;
      }
  }

var enemyObject = new gameObject([0, 0, 0], [[2, 2, 2]], [[0]], "enemy");
DisplayObject(enemyObject);
