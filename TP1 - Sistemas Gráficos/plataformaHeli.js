class PlataformaHeli{
	
	constructor(){

		this.plataformaHeli = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas, true));
		this.plataformaHeli.setPosicion(1,1.7,1)
		this.plataformaHeli.initTexture("img/helipad.jpg");
		this.tapaPlataformaHeli1 = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas, false));
		this.tapaPlataformaHeli1.setRotacion(Math.PI/2,0,0)
		this.tapaPlataformaHeli1.setPosicion(0,-0.5,0.5)
		this.tapaPlataformaHeli1.setColor(0.6,0.6,0.6);
		this.tapaPlataformaHeli2 = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas, false));
		this.tapaPlataformaHeli2.setRotacion(0,0,Math.PI/2)
		this.tapaPlataformaHeli2.setPosicion(0.5,-0.5,0)
		this.tapaPlataformaHeli2.setColor(0.6,0.6,0.6);
		this.tapaPlataformaHeli3 = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas, false));
		this.tapaPlataformaHeli3.setRotacion(0,0,Math.PI/2)
		this.tapaPlataformaHeli3.setPosicion(-0.5,-0.5,0)
		this.tapaPlataformaHeli3.setColor(0.6,0.6,0.6);
		this.tapaPlataformaHeli4 = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas, false));
		this.tapaPlataformaHeli4.setRotacion(Math.PI/2,0,0)
		this.tapaPlataformaHeli4.setPosicion(0,-0.5,-0.5)
		this.tapaPlataformaHeli4.setColor(0.6,0.6,0.6);

		this.plataformaHeli.agregarHijo(this.tapaPlataformaHeli1);
		this.plataformaHeli.agregarHijo(this.tapaPlataformaHeli2);
		this.plataformaHeli.agregarHijo(this.tapaPlataformaHeli3);
		this.plataformaHeli.agregarHijo(this.tapaPlataformaHeli4);
    }



	dibujar = function(){

		this.plataformaHeli.dibujar(mat4.create(),true);

	}
}