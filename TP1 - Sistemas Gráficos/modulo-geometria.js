
var mat4=glMatrix.mat4;
var mat3=glMatrix.mat3;
var vec4=glMatrix.vec4;
var vec3=glMatrix.vec3;
var textured = false;
var vertexBuffer = null;

var superficie3D;


function crearGeometria(SUPERFICIE, filas, columnas, esTexturada){

    superficie3D=SUPERFICIE;
    textured = esTexturada;
    return generarSuperficie(superficie3D,filas,columnas);;
}

function dibujarGeometria(mallaDeTriangulos, textura, isTextured){

    dibujarMalla(mallaDeTriangulos, textura, isTextured);

}

function SuperficieBarrido(forma, matricesModelado, matricesNormales, niveles, vertices, conTapa) {

    this.getPosicion=function(u,v){
        var vectorModelado = matricesModelado[Math.round(v*niveles)];

        if ((conTapa && v==0) || (conTapa && v == 1)) {  
            return vectorModelado;         
        }

        var matrizNormal = matricesNormales[Math.round(v*niveles)];
        var vertice = forma[Math.round(u*vertices)];

        var nuevoVertice = vec3.create();
        mat3.multiply(nuevoVertice, matrizNormal, vertice);
        vec3.add(nuevoVertice, nuevoVertice, vectorModelado);

        return nuevoVertice;
    }

    this.getNormal=function(u,v){
        return [1,0,1];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
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


function Esfera(radio) {

    this.getPosicion=function(u,v) {
        var x = radio*Math.cos(2*Math.PI*u)*Math.sin(Math.PI*v);
        var z = radio*Math.sin(2*Math.PI*u)*Math.sin(Math.PI*v);
        var y = radio*Math.cos(Math.PI*v);
        return [x,y,z];
    }

    this.getNormal=function(u,v) {
        var coords = this.getPosicion(u,v);
        var x = coords[0];
        var y = coords[1];
        var z = coords[2];
        var norm = Math.sqrt([x,y,z].flatMap(x=>Math.pow(x,2)).reduce((a,b) => a+b, 0));
        return [x/norm, y/norm, z/norm];
    }

    this.getCoordenadasTextura=function(u,v) {
        return [u,v];
    }
}


function Dona(radio, trayecto) {

    this.getPosicion=function(u,v) {
        var x = Math.cos(2*Math.PI*u)*(trayecto + radio*Math.sin(Math.PI*v));
        var z = Math.sin(2*Math.PI*u)*(trayecto + radio*Math.sin(Math.PI*v));
        var y = radio*Math.cos(Math.PI*v);
        return [x,y,z];
    }

    this.getNormal=function(u,v) {
        var coords = this.getPosicion(u,v);
        var x = coords[0];
        var y = coords[1];
        var z = coords[2];
        var norm = Math.sqrt([x,y,z].flatMap(x=>Math.pow(x,2)).reduce((a,b) => a+b, 0));
        return [x/norm, y/norm, z/norm];
    }

    this.getCoordenadasTextura=function(u,v) {
        return [u,v];
    }
}


function TuboSenoidal(amplitud_onda, long_onda, radio, altura, conTapa) {

    this.getPosicion=function(u,v) {

        /*if ((conTapa && v==0) || (conTapa && v == 1)) {  
            return [0,0,0];         
        }*/

        var delta = amplitud_onda*Math.cos(v*2*Math.PI/long_onda);
        var x = (radio + delta)*Math.cos(2*Math.PI*u);
        var z = (radio + delta)*Math.sin(2*Math.PI*u);
        var y = altura/2*(v-0.5);
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

    var filasReales = filas+1;
    var columnasReales = columnas + 1;
    
    indexBuffer=[];
    
    for (i=0; i < filas; i++) {
        for (j=0; j < columnas; j++) {
            indexBuffer.push(i*columnasReales + j);
            indexBuffer.push((i+1)*columnasReales + j);
        }
        
        // agrego los ultimos dos vertices de la ultima columna
        indexBuffer.push(i*columnasReales + j);
        indexBuffer.push((i+1)*columnasReales + j);
        
        // agrego el ultimo vertice y el siguiente para generar el triangulo degenerado
        // solo si no llegue al ultimo quad
        if (i != filas - 1) {
            indexBuffer.push((i+1)*columnasReales + j);
            indexBuffer.push(i*columnasReales + j + 1);
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

function dibujarMalla(mallaDeTriangulos, textura, isTextured){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    if(isTextured){
        //console.log(textura)
        gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textura);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);

    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}

