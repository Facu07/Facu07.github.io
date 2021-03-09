class PlataformaHeli{
	
	constructor(shaderProgram){

		this.shaderProgram = shaderProgram;
		this.plataformaHeli = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas, true), this.shaderProgram);
		this.plataformaHeli.setPosicion(1,2,1)
		this.plataformaHeli.initTexture("img/helipad.jpg");

    }

	actualizarMatrices(matPadre, temp){

		this.plataformaHeli.setMatrizModelado(mat4.create());
		var matrizModelado = this.plataformaHeli.getMatrizModelado();
		var matrizNormal = this.plataformaHeli.getMatrizNormal();
		var posicion = this.plataformaHeli.getPosicion();
		var rotacion = this.plataformaHeli.getRotacion();

		mat4.translate(matrizModelado, matrizModelado, posicion);

		mat4.rotateY(matrizModelado, matrizModelado, rotacion[1]);
		mat4.rotateZ(matrizModelado, matrizModelado, rotacion[2]);
		mat4.rotateX(matrizModelado, matrizModelado, rotacion[0]);

		//mat4.scale(this.matrizModelado, this.matrizModelado, this.escala)

		mat4.multiply(temp, matPadre, matrizModelado);

		mat3.fromMat4(matrizNormal, temp);

        //matrizNormal= (inversa(traspuesta(matrizModelado)));
        mat3.invert(matrizNormal, matrizNormal);
        mat3.transpose(matrizNormal, matrizNormal);

		//gl.uniform3fv(shaderProgram.color, this.rgb);

		gl.uniformMatrix4fv(this.shaderProgram.mMatrixUniform, false, temp);
		gl.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, matrizNormal);
	}


	dibujar = function(matPadre){

		var temp = mat4.create();
		this.actualizarMatrices(matPadre, temp);
		this.dibujarPlat(this.plataformaHeli.getMalla(), this.plataformaHeli.getTexture());

	}

	dibujarPlat(mallaDeTriangulos, textura){
    
	    // Se configuran los buffers que alimentaron el pipeline
	    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
	    gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniform1i(this.shaderProgram.useColorUniform, false);
        gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
        gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textura);
        gl.uniform1i(this.shaderProgram.samplerUniform, 0);

	    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
	    gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);

	    if (modo!="wireframe"){
	        gl.uniform1i(this.shaderProgram.useLightingUniform,(lighting=="true"));
	        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
	    }
	    
	    if (modo!="smooth") {
	        gl.uniform1i(this.shaderProgram.useLightingUniform,false);
	        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
	    }
 
	}
}