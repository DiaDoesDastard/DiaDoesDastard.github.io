function displayObject(_gameObject){

    

    if(_gameObject == "enemy")
    {
            document.onkeypress = function(evt) {
            evt = evt || window.event;
            var charCode = evt.keyCode || evt.which;
            var charStr = String.fromCharCode(charCode);
            if(charStr == "x"){
                return _gameObject.objectType + "\n" + "Entity Hit Points " + _gameObject.currentHealth + "/" + _gameObject.maxHealth; 
            }
    }
    // else if()
    // {

    // }
    // else
    // {

    // }


    }
}