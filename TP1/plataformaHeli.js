class PlataformaHeli{
	
	constructor(){

		this.plataformaHeli = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas));
		this.plataformaHeli.setPosicion(0,1.73,0)
		this.plataformaHeli.setColor(0.6,0.6,0.6);
		this.tapaPlataformaHeli1 = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas));
		this.tapaPlataformaHeli1.setRotacion(Math.PI/2,0,0)
		this.tapaPlataformaHeli1.setPosicion(0,1.23,-0.5)
		this.tapaPlataformaHeli1.setColor(0.6,0.6,0.6);
		this.tapaPlataformaHeli2 = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas));
		this.tapaPlataformaHeli2.setRotacion(0,0,Math.PI/2)
		this.tapaPlataformaHeli2.setPosicion(-0.50,1.23,0)
		this.tapaPlataformaHeli2.setColor(0.6,0.6,0.6);
		this.tapaPlataformaHeli3 = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas));
		this.tapaPlataformaHeli3.setRotacion(0,0,Math.PI/2)
		this.tapaPlataformaHeli3.setPosicion(0.5,1.23,0)
		this.tapaPlataformaHeli3.setColor(0.6,0.6,0.6);
		this.tapaPlataformaHeli4 = new Objeto3D(crearGeometria(new Plano(1,1), filas, columnas));
		this.tapaPlataformaHeli4.setRotacion(Math.PI/2,0,0)
		this.tapaPlataformaHeli4.setPosicion(0,1.23,0.5)
		this.tapaPlataformaHeli4.setColor(0.6,0.6,0.6);
	}

	dibujar = function(){

		this.plataformaHeli.dibujar(mat4.create());
		this.tapaPlataformaHeli1.dibujar(mat4.create());
		this.tapaPlataformaHeli2.dibujar(mat4.create());
		this.tapaPlataformaHeli3.dibujar(mat4.create());
		this.tapaPlataformaHeli4.dibujar(mat4.create());

	}
}