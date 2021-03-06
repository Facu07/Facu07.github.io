

/*

    Tareas:
    ------

    1) Modificar a función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas
    YA ESTA

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"
    YA ESTA

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio
        YA ESTA

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)
        YA ESTA
        
    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
    
*/

var superficie3D;
var mallaDeTriangulos;
var PI = 3.14159265359;


function crearGeometria(){

    if (primitiva == 1){
        superficie3D=new Plano(3,3);
    }else if (primitiva == 2){
        superficie3D=new Esfera(radio);
        if (filas < 20 || columnas < 20){
            filas = columnas = 20;
        }
    }else if (primitiva == 3){
        for (var i = 0; i < 2; i++) {
            superficie3D=new TuboSenoidal(amplitud, longitud, 1, 0.1, 0.5, false);
            if (filas < 30 || columnas < 30){
                filas = columnas = 30;
            }
            radio = 1;
        }
    }
    
    mallaDeTriangulos=generarSuperficie(superficie3D,filas,columnas);
    //superficie3D=new TuboSenoidal(amplitud, longitud, 1, 0.1, 0.5, true);
    //mallaDeTriangulos=generarSuperficie(superficie3D,filas,columnas);
    
}

function dibujarGeometria(){

    dibujarMalla(mallaDeTriangulos);

}

function Plano(ancho,largo){

    this.getPosicion=function(u,v){

        var x=(u-0.5)*ancho;
        var z=(v-0.5)*largo;
        return [x,0,z];
    }

    this.getNormal=function(u,v){
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Esfera(radio){

    this.getPosicion=function(u,v){

        var x=(radio*(Math.cos(u*PI*2))*Math.sin(v*PI));
        var y=(radio*Math.cos(v*PI))-0.5;
        var z=(radio*(Math.sin(u*PI*2))*Math.sin(v*PI));
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        return [2*radio*(Math.cos(u))*Math.sin(v),2*radio*Math.cos(v),2*radio*(Math.sin(u))*Math.sin(v)];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function TuboSenoidal(amplitud_onda, long_onda, radio, radio2, altura, inverso) {

    this.getPosicion=function(u,v) {

        var x = (radio - radio2*Math.pow(Math.cos(Math.PI*u*2),1))*Math.pow(Math.cos(Math.PI*v*2),1);
        var z = (radio - radio2*Math.pow(Math.cos(Math.PI*u*2),1))*Math.pow(Math.sin(Math.PI*v*2),1);
        var y = Math.sqrt(radio*Math.pow(Math.sin(Math.PI*u*2),0.2))/2.0;

        if ((inverso)) {  
            x = -(radio - radio2*Math.pow(Math.cos(Math.PI*u*2),1))*Math.pow(Math.cos(Math.PI*v*2),1);
            z = -(radio - radio2*Math.pow(Math.cos(Math.PI*u*2),1))*Math.pow(Math.sin(Math.PI*v*2),1);
            y = -Math.sqrt(radio*Math.pow(Math.sin(Math.PI*u*2),0.2));         
        }

        return [x,y,z];
    }

    this.restaVec=function(vecA, vecB) {
        return [vecA[0] - vecB[0], vecA[1] - vecB[1], vecA[2] - vecB[2]];
    }

    this.prodVectorial = function(vecA, vecB) {
        var x = vecA[1] * vecB[2] - vecA[2] * vecB[1];
        var y = vecA[2] * vecB[0] - vecA[0] * vecB[2];
        var z = vecA[0] * vecB[1] - vecA[1] * vecB[0];
        return [x,y,z];
    }

    this.getNormal=function(u,v) {

        var orig = this.getPosicion(u,v);
        var delta1 = this.getPosicion(u+.01,v);
        var delta2 = this.getPosicion(u,v+.01);

        var sup1 = this.restaVec(delta1, orig);
        var sup2 = this.restaVec(delta2, orig);

        var normal = this.prodVectorial(sup1, sup2);

        return normal;
    }

    this.getCoordenadasTextura=function(u,v) {
        u = 1.0 - (filas / (columnas - 1));
        v = 1.0 - altura;
        return [u,v];
    }
}

function generarSuperficie(superficie,filas,columnas){
    
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    // Buffer de indices de los triángulos    
    indexBuffer=[];  
    for (r=0; r < filas; r++) {
        for (c=0; c <= columnas; c++) {
            indexBuffer.push(c + r + r*columnas);
            indexBuffer.push(c + r + (r+1)*columnas+1);
        }
    }

    // Creación e Inicialización de los buffers

    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
       
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
        /*
            Aqui es necesario modificar la primitiva por triangle_strip
        */
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}

