class Objeto3D{
	
	constructor(malla){

		var vertexBuffer=null;
		var indexBuffer=null;

		this.malla = malla;
		this.matrizModelado = mat4.create();
		this.matrizNormal = mat3.create();
		this.posicion=vec3.create();
		this.rotacion=vec3.create();
		this.escala=vec3.fromValues(1,1,1);
		this.hijos=[];
		this.rgb = [0,0,0];
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

		gl.uniform3fv(shaderProgram.color, this.rgb);

		gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, temp);
		gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, this.matrizNormal);


		
	}
	
	getMalla = function(){

		return this.malla;
	}

	dibujar = function(matPadre){

		var temp = mat4.create();
		this.actualizarMatrices(matPadre, temp);
		dibujarGeometria(this.malla);
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