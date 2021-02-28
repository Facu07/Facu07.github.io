onmousedown = function(){
    mouseDown = true;
}

onmouseup = function(){
    mouseDown = false;
}

onmousemove = function(e){
    var x = e.clientX;
    var y = e.clientY;

    // Con esto roto la camara si tengo el mouse apretado, divido por 5 para que gire mas despacio
    if(mouseDown){
        if (camera == 1) {
            rotarCamaraY = rotarCamaraY + (x - mouseX) / 5;
            rotarCamaraX = rotarCamaraX - (mouseY - y) / 5;
            //console.log("rotarCamaraX", rotarCamaraX);
        }
    }
 
    mouseX = x;
    mouseY = y;
}
