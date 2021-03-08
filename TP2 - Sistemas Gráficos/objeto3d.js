class Objeto3D{
	
	constructor(malla, shaderProgram){

		var vertexBuffer=null;
		var indexBuffer=null;

		this.malla = malla;
		this.matrizModelado = mat4.create();
		this.matrizNormal = mat3.create();
		this.posicion=vec3.create();
		this.rotacion=vec3.create();
		this.escala=vec3.fromValues(1,1,1);
		this.hijos=[];
		this.rgb = [2,2,2];
		this.texture = null;
		this.reflectionTexture = null;
		this.shaderProgram = shaderProgram;
	}

	actualizarMatrices(matPadre, temp){

		this.matrizModelado = mat4.create();

		mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion);

		mat4.rotateY(this.matrizModelado, this.matrizModelado, this.rotacion[1]);
		mat4.rotateZ(this.matrizModelado, this.matrizModelado, this.rotacion[2]);
		mat4.rotateX(this.matrizModelado, this.matrizModelado, this.rotacion[0]);

		mat4.scale(this.matrizModelado, this.matrizModelado, this.escala)

		mat4.multiply(temp, matPadre, this.matrizModelado);

		mat3.fromMat4(this.matrizNormal, temp);

        //matrizNormal= (inversa(traspuesta(matrizModelado)));
        mat3.invert(this.matrizNormal, this.matrizNormal);
        mat3.transpose(this.matrizNormal, this.matrizNormal);

		gl.uniform3fv(shaderProgramHeli.color, this.rgb);

		gl.uniformMatrix4fv(shaderProgramHeli.mMatrixUniform, false, temp);
		gl.uniformMatrix3fv(shaderProgramHeli.nMatrixUniform, false, this.matrizNormal);


		
	}
	
	getMalla = function(){

		return this.malla;
	}

	getTexture = function(){

		return this.texture;
	}

	initTexture = function(texture_file){
            
        gl.uniform1i(shaderProgramHeli.useLightingUniform,(lighting=="true"));
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

    initReflectionTexture = function(texture_file){
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

	dibujar = function(matPadre, isTextured){

		var temp = mat4.create();
		this.actualizarMatrices(matPadre, temp);
		dibujarGeometria(this.malla, this.texture, this.reflectionTexture, shaderProgramHeli);
		for(var i = 0; i < this.hijos.length; i++){
			this.hijos[i].dibujar(temp);
		}

	}

	setRotacion = function(rx, ry, rz){

		this.rotacion[0] = [rx];
		this.rotacion[1] = [ry];
		this.rotacion[2] = [rz];
		
	}

	setPosicion = function(x, y, z){

		this.posicion[0] = [x];
		this.posicion[1] = [y];
		this.posicion[2] = [z];
		
	}

	setEscala = function(x,y,z){

		this.escala[0] = [x];
		this.escala[1] = [y];
		this.escala[2] = [z];
	}

	setRotar = function(x,y,z){

		this.rotacion[0] += [x];
		this.rotacion[1] += [y];
		this.rotacion[2] += [z];
	}

	getPosicion = function(){

		return this.posicion;
		
	}

	getRotacion = function(){

		return this.rotacion;
		
	}

	getMatrizModelado = function(){

		return this.matrizModelado;
		
	}

	setMatrizModelado = function(mat){

		this.matrizModelado = mat;
		
	}

	getMatrizNormal = function(){

		return this.matrizNormal;
		
	}

	setMatrizNormal = function(mat){

		this.matrizNormal = mat;
		
	}

	//this.setGeometria(vertexBuffer,indexBuffer);
	agregarHijo = function(h) {

		this.hijos.push(h);

	}

	setColor = function(x,y,z) {

		this.rgb[0] = x;
		this.rgb[1] = y;
		this.rgb[2] = z;

	}
	//this.quitarHijo=function(h) { … }*/

}