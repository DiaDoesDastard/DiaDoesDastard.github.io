function displayObject(_gameObject){

    

    if(_gameObject.objectType == "enemy")
    {
           // if(charStr == "x"){
            return "Entity Hit Points " + _gameObject.currentHealth + "/" + _gameObject.maxHealth; 
            //}
    }
    else if(_gameObject.objectType == "tile")
    {
            return "Tile " + _gameObject;
    }
    else
    {
            return "nothing is selected"
    }
}