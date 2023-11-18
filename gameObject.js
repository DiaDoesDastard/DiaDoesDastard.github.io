
function gameObject(textureURL = "", uvCoordanates = [[0,0]],  vertices=[[0,0,0]], triangles=[[0]],
                    position=[0,0,0],rotation=[0,0,0]){
  this.position = position;
  this.rotation = rotation;
  this.vertices = vertices; 
  this.triangles = triangles; 
  this.normals = [[0,0,0]]; 
  this.uvCoordanates = uvCoordanates; 
  this.textureMap = [255,255,255,255];
  this.imageToTexture = function(imageSource){
    const image = new Image;

    image.src = imageSource;
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      this.textureMap = ctx.getImageData(0, 0, 80, 80).data
    }
  }
  this.imageToTexture(textureURL)
  generateNormals(this)
  objectList.push(this);
}

