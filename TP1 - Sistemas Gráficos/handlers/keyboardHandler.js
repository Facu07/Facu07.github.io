onkeydown = function(evento){
    evento = evento || window.event;
    var teclaAscii = evento.keyCode;
    var tecla = evento.key;

    //Manejo del Zoom
    // Zoom '+'
    if ((teclaAscii == '107') || (teclaAscii == '171')) {
        aumento = aumento + 0.01;
    }
    // Zoom '-'
    else if ((teclaAscii == '173') || (teclaAscii == '109')) {
        aumento = aumento - 0.01;
    }
}
