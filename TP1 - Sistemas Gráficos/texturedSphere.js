function TexturedSphere(latitude_bands, longitude_bands) {

    this.latitudeBands = latitude_bands;
    this.longitudeBands = longitude_bands;
    this.esTexturada = true;

    this.vertex_buffer = null;
    this.index_buffer = null;

    this.position_buffer = null;
    this.normal_buffer = null;
    this.texture_coord_buffer = null;
    this.index_buffer = null;

    this.webgl_position_buffer = null;
    this.webgl_normal_buffer = null;
    this.webgl_texture_coord_buffer = null;
    this.webgl_tangent_buffer = null;
    this.webgl_binormal_buffer = null;
    this.webgl_index_buffer = null;

    this.matrizModelado = mat4.create();
    this.texture = null;
    this.reflectionTexture=null;

    this.initTexture = function(texture_file){
        var texture = gl.createTexture();
        texture.image = new Image();

        texture.image.onload = function () {
               //onTextureLoaded()
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
    
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        texture.image.src = texture_file;
        this.texture = texture;
    }

    this.initReflectionTexture = function(texture_file){
        var aux_texture = gl.createTexture();
        this.reflectionTexture = aux_texture;
        this.reflectionTexture.image = new Image();

        this.reflectionTexture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, aux_texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, aux_texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.reflectionTexture.image.src = texture_file;
    }

    // Se generan los vertices para la esfera, calculando los datos para una esfera de radio 1
    // Y también la información de las normales y coordenadas de textura para cada vertice de la esfera
    // La esfera se renderizara utilizando triangulos, para ello se arma un buffer de índices 
    // a todos los triángulos de la esfera
    this.initBuffers = function(){

        this.position_buffer = [];
        this.normal_buffer = [];
        this.texture_coord_buffer = [];

        var latNumber;
        var longNumber;

        for (latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
            var theta =latNumber * Math.PI / (this.latitudeBands);
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);


            for (longNumber=0; longNumber <= this.longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / this.longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var r=64;                        

                var x = cosPhi * sinTheta*r;
                var y = cosTheta*r;
                var z = sinPhi * sinTheta*r;

                var u =  (longNumber / this.longitudeBands);
                var v = 1-(latNumber / this.latitudeBands);

                this.normal_buffer.push(x);
                this.normal_buffer.push(y);
                this.normal_buffer.push(z);

                this.texture_coord_buffer.push(u);
                this.texture_coord_buffer.push(v);
                
                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);
            }
        }
        this.index_buffer = [];
      
        for (latNumber=0; latNumber < this.latitudeBands; latNumber++) {
            for (longNumber=0; longNumber < this.longitudeBands; longNumber++) {

                var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
                var second = first + this.longitudeBands + 1;

                this.index_buffer.push(first);
                this.index_buffer.push(second);
                this.index_buffer.push(first + 1);

                this.index_buffer.push(second);
                this.index_buffer.push(second + 1);
                this.index_buffer.push(first + 1);
                
            }
        }


        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = this.position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;

    }

    this.actualizarMatrices = function() {

        this.matrizModelado = mat4.create();
        
        gl.uniformMatrix4fv(shaderProgramSky.mMatrixUniform, false, this.matrizModelado);

        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix,this.matrizModelado);

        // normalMatrix= (inversa(traspuesta(matrizModelado)));
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix,normalMatrix);

        gl.uniformMatrix3fv(shaderProgramSky.nMatrixUniform, false, normalMatrix);
    }

    this.dibujar = function(){
        // Se configuran los buffers que alimentarán el pipeline
        
        this.actualizarMatrices();
    
        // Se configuran los buffers que alimentaron el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramSky.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(shaderProgramSky.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramSky.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgramSky.samplerUniform, 0);
        gl.activeTexture(gl.TEXTURE0);
        //if (useReflection) {
            gl.uniform1f(shaderProgram.useReflectionUniform, 1.0);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.reflectionTexture);
            gl.uniform1i(shaderProgram.samplerUniformReflection, 1);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

        if (modo!="wireframe"){
            gl.uniform1i(shaderProgramSky.useLightingUniform,(lighting=="true"));                    
            gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
        
        if (modo!="smooth") {
            gl.uniform1i(shaderProgramSky.useLightingUniform,false);
            gl.drawElements(gl.LINE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

    }
    
}
