var filas=40;
var columnas=40;

var count = 0;
var rotando = false
var alasAltas = false
var angulo = 0;
var anguloTurbina = 0;
var turbinasRotadas1 = false
var turbinasRotadas2 = false
var anguloCola = 0
var colaRotadaIzq = false
var colaRotadaDer = false

var controlF = [[-3,-3,0],[3,-3,0],[5,-3,0],[5,0,0],[3,0,0],[1,0,0],[0,0,0],[-4,-1,0],[-3,-3,0]];
var controlR = [[0,0,-1.5],[0,0,0.5],[0,0,1.5]];

var controlFBase = [[-0.5,0,0],[0,0.5,0],[0.5,0,0],[0,-0.5,0],[-0.5,0,0]];
var controlRBase = [[1,0,-4],[0,0,0],[1,0,-1]];

class Helicoptero {

	constructor() {
		
		this.helicoptero = new Objeto3D(crearGeometria(new Esfera(0.5), filas, columnas));
		this.helicoptero.setEscala(0.03,0.03,0.03);

		this.forma = new CurvaBezier(controlF);
		this.recorrido = new CurvaBezier(controlR);
		this.formaDiscreta = discretizadorDeCurvas(this.forma, columnas);
		this.matricesModelado = discretizadorDeCurvas(this.recorrido, filas);
		this.matricesNormales = discretizadorDeRecorrido(this.recorrido,filas);

		this.SUPERFICIE = new SuperficieBarrido(this.formaDiscreta, this.matricesModelado, this.matricesNormales, filas, columnas, true);
		this.cabina1 = new Objeto3D(crearGeometria(this.SUPERFICIE, filas, columnas));
		this.cabina1.setPosicion(0,-2,0);
		this.cabina1.setColor(0.84,0.81,0.7)

		this.baseAla1 = new Objeto3D(crearGeometria(new TuboSenoidal(0,1,0.2,2, true), filas, columnas));
		this.baseAla1.setPosicion(-1.5,3,1.5);
		this.baseAla1.setRotacion(0,0,1.5)
		this.baseAla1.setColor(0.3,0.3,0.3)

		this.cono1 = new Objeto3D(crearGeometria(new TuboSenoidal(0,1,0.2,2, true), filas, columnas));
		this.cono1.setPosicion(0,0,0.7);
		this.cono1.setRotacion(1.5,0,0)
		this.cono1.setColor(1,1,1)

		this.turbina1 = new Objeto3D(crearGeometria(new Dona(0.1,0.5), filas, columnas))
		this.turbina1.setPosicion(0,1,0)
		this.turbina1.setRotacion(0,0,1.5)
		this.turbina1.setColor(1,0,0)

		this.cilindro1 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 0.5, true), filas, columnas))
		this.cilindro1.setColor(1,1,1)

		this.dibujarHelices1()

		this.baseAla2 = new Objeto3D(crearGeometria(new TuboSenoidal(0,1,0.2,2, true), filas, columnas));
		this.baseAla2.setPosicion(1.5,2.7,-1.5);
		this.baseAla2.setRotacion(0,0,1.5)
		this.baseAla2.setColor(0.3,0.3,0.3)

		this.cono2 = new Objeto3D(crearGeometria(new TuboSenoidal(0,1,0.2,2, true), filas, columnas));
		this.cono2.setPosicion(0,0,-0.7);
		this.cono2.setRotacion(1.5,0,0)
		this.cono2.setColor(1,1,1)

		this.turbina2 = new Objeto3D(crearGeometria(new Dona(0.1,0.5), filas, columnas))
		this.turbina2.setPosicion(0,-1,0)
		this.turbina2.setRotacion(0,0,1.5)
		this.turbina2.setColor(1,0,0)

		this.cilindro2 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 0.5, true), filas, columnas))
		this.cilindro2.setColor(1,1,1)

		this.dibujarHelices2();

		this.baseAla3 = new Objeto3D(crearGeometria(new TuboSenoidal(0,1,0.2,2, true), filas, columnas));
		this.baseAla3.setPosicion(-1.4,3,-1.5);
		this.baseAla3.setRotacion(0,0,1.5)
		this.baseAla3.setColor(0.3,0.3,0.3)

		this.cono3 = new Objeto3D(crearGeometria(new TuboSenoidal(0,1,0.2,2, true), filas, columnas));
		this.cono3.setPosicion(0,0,-0.7);
		this.cono3.setRotacion(1.5,0,0)
		this.cono3.setColor(1,1,1)

		this.turbina3 = new Objeto3D(crearGeometria(new Dona(0.1,0.5), filas, columnas))
		this.turbina3.setPosicion(0,-1,0)
		this.turbina3.setRotacion(0,0,1.5)
		this.turbina3.setColor(1,0,0)

		this.cilindro3 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 0.5, true), filas, columnas))
		this.cilindro3.setColor(1,1,1)

		this.dibujarHelices3();


		this.baseAla4 = new Objeto3D(crearGeometria(new TuboSenoidal(0,1,0.2,2, true), filas, columnas));
		this.baseAla4.setPosicion(1.5,2.7,1.5);
		this.baseAla4.setRotacion(0,0,1.5)
		this.baseAla4.setColor(0.3,0.3,0.3)

		this.cono4 = new Objeto3D(crearGeometria(new TuboSenoidal(0,1,0.2,2, true), filas, columnas));
		this.cono4.setPosicion(0,0,0.7);
		this.cono4.setRotacion(1.5,0,0)
		this.cono4.setColor(1,1,1)

		this.turbina4 = new Objeto3D(crearGeometria(new Dona(0.1,0.5), filas, columnas))
		this.turbina4.setPosicion(0,1,0)
		this.turbina4.setRotacion(0,0,1.5)
		this.turbina4.setColor(1,0,0)

		this.cilindro4 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 0.5, true), filas, columnas))
		this.cilindro4.setColor(1,1,1)

		this.dibujarHelices4();

		this.pataIzq1 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 3, true), filas, columnas))
		this.pataIzq1.setPosicion(-1.2,0.3,1.5)
		this.pataIzq1.setRotacion(-Math.PI/12,0,0)
		this.pataIzq2 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 2, true), filas, columnas))
		this.pataIzq2.setPosicion(1.2,0,1.5)
		this.pataIzq2.setRotacion(-Math.PI/12,0,0)
		this.baseIzq = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 4, true), filas, columnas))

		this.pataDer1 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 3, true), filas, columnas))
		this.pataDer1.setPosicion(-1.2,0.3,-1.5)
		this.pataDer1.setRotacion(Math.PI/12,0,0)
		this.pataDer2 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 2, true), filas, columnas))
		this.pataDer2.setPosicion(1.2,0,-1.5)
		this.pataDer2.setRotacion(Math.PI/12,0,0)

		this.baseDer = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 10, true), filas, columnas))
		this.baseDer.setPosicion(1,-0.8,0)
		this.baseDer.setRotacion(0,0,1.6)
		this.baseIzq = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 10, true), filas, columnas))
		this.baseIzq.setPosicion(1,-0.8,0)
		this.baseIzq.setRotacion(0,0,1.6)

		this.dibujarColaIzq();

		this.dibujarColaDer();

		this.unidorDeCola = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.2, 2.5, true), filas, columnas));
		this.unidorDeCola.setPosicion(-2,-0.5,0);
		this.unidorDeCola.setRotacion(Math.PI/50,0,0);
		this.unidorDeCola.setColor(0.96,0.96,0.86)

		this.colaDer = new Objeto3D(crearGeometria(new Plano(1,2), filas, columnas));
		this.colaDer.setPosicion(0,-0.7,0);
		this.colaDer.setRotacion(0,0.5,0);
		this.colaDer.setColor(1,0,0)

		this.colaIzq = new Objeto3D(crearGeometria(new Plano(1,2), filas, columnas));
		this.colaIzq.setPosicion(0,0.7,0);
		this.colaIzq.setRotacion(0,0.5,0);
		this.colaIzq.setColor(1,0,0)
		
		this.agregarHijos();
	}


	dibujar = function(){

		this.cilindro1.setRotacion(0,time*100,0);
		this.cilindro2.setRotacion(0,time*100,0);
		this.cilindro3.setRotacion(0,time*100,0);
		this.cilindro4.setRotacion(0,time*100,0);

		this.helicoptero.dibujar(mat4.create());

	}

	actualizar = function(x, y, z,rx, ry, rz){

		anguloTurbina = this.turbina1.getRotacion()

		if(wKeyPressed && !turbinasRotadas1){
			if(anguloTurbina[0] > -0.8){
				this.turbina1.setRotacion(anguloTurbina[0]-0.05,0,anguloTurbina[2]+0.01)
				this.turbina2.setRotacion(anguloTurbina[0]-0.05,0,anguloTurbina[2]+0.01)
				this.turbina3.setRotacion(anguloTurbina[0]-0.05,0,anguloTurbina[2]+0.01)
				this.turbina4.setRotacion(anguloTurbina[0]-0.05,0,anguloTurbina[2]+0.01)
			}else{
				turbinasRotadas1 = true;
			}
		}
		if(!wKeyPressed && turbinasRotadas1){
			if(anguloTurbina[0] < 0){
				this.turbina1.setRotacion(anguloTurbina[0]+0.05,0,anguloTurbina[2]-0.01)
				this.turbina2.setRotacion(anguloTurbina[0]+0.05,0,anguloTurbina[2]-0.01)
				this.turbina3.setRotacion(anguloTurbina[0]+0.05,0,anguloTurbina[2]-0.01)
				this.turbina4.setRotacion(anguloTurbina[0]+0.05,0,anguloTurbina[2]-0.01)
			}else{
				turbinasRotadas1 = false
			}
		}
		if(sKeyPressed && !turbinasRotadas2){
			if(anguloTurbina[0] < 0.8){
				this.turbina1.setRotacion(anguloTurbina[0]+0.05,0,anguloTurbina[2]+0.01)
				this.turbina2.setRotacion(anguloTurbina[0]+0.05,0,anguloTurbina[2]+0.01)
				this.turbina3.setRotacion(anguloTurbina[0]+0.05,0,anguloTurbina[2]+0.01)
				this.turbina4.setRotacion(anguloTurbina[0]+0.05,0,anguloTurbina[2]+0.01)
			}else{
				turbinasRotadas2 = true
			}
		}

		if(!sKeyPressed && turbinasRotadas2){
			if(anguloTurbina[0] > 0){
				this.turbina1.setRotacion(anguloTurbina[0]-0.05,0,anguloTurbina[2]-0.01)
				this.turbina2.setRotacion(anguloTurbina[0]-0.05,0,anguloTurbina[2]-0.01)
				this.turbina3.setRotacion(anguloTurbina[0]-0.05,0,anguloTurbina[2]-0.01)
				this.turbina4.setRotacion(anguloTurbina[0]-0.05,0,anguloTurbina[2]-0.01)
			}else{
				turbinasRotadas2 = false
			}
		}

		anguloCola = this.colaIzq.getRotacion()

		if(aKeyPressed && !colaRotadaIzq){
			if(anguloCola[0] < 0.5){
				this.colaIzq.setRotacion(anguloCola[0]+0.05,0,anguloCola[2]+0.01)
				this.colaDer.setRotacion(anguloCola[0]+0.05,0,anguloCola[2]+0.01)
			}else{
				colaRotadaIzq = true;
			}
		}

		if(!aKeyPressed && colaRotadaIzq){
			if(anguloCola[0] > 0){
				this.colaIzq.setRotacion(anguloCola[0]-0.05,0,anguloCola[2]-0.01)
				this.colaDer.setRotacion(anguloCola[0]-0.05,0,anguloCola[2]-0.01)
			}else{
				colaRotadaIzq = false;
			}
		}

		if(dKeyPressed && !colaRotadaDer){
			if(anguloCola[0] > -0.5){
				this.colaIzq.setRotacion(anguloCola[0]-0.05,0,anguloCola[2]-0.01)
				this.colaDer.setRotacion(anguloCola[0]-0.05,0,anguloCola[2]-0.01)
			}else{
				colaRotadaDer = true
			}
		}

		if(!dKeyPressed && colaRotadaDer){
			if(anguloCola[0] < 0){
				this.colaIzq.setRotacion(anguloCola[0]+0.05,0,anguloCola[2]+0.01)
				this.colaDer.setRotacion(anguloCola[0]+0.05,0,anguloCola[2]+0.01)
			}else{
				colaRotadaDer = false;
			}
		}

		angulo = this.baseAla1.getRotacion()

		if((lKeyPressed && !alasAltas)){
			if((angulo[0] > -1.5 && !alasAltas)){
				this.baseAla1.setRotacion(angulo[0]-0.05,angulo[1]+0.05,0);
				this.baseAla2.setRotacion(0.05-angulo[0],angulo[1]-0.05,0);
				this.baseAla3.setRotacion(0.05-angulo[0],angulo[1]+0.05,0);
				this.baseAla4.setRotacion(angulo[0]+0.05,angulo[1]+0.05,0);
			}else{
				alasAltas = true
				lKeyPressed = false
			}
		}
		if((lKeyPressed && alasAltas)){
			if((angulo[0] < 0) && (alasAltas)){
				this.baseAla1.setRotacion(0.05+angulo[0],angulo[1]-0.05,angulo[2]+0.05);
				this.baseAla2.setRotacion(0.05-angulo[0],angulo[1]+0.05,angulo[2]-0.05);
				this.baseAla3.setRotacion(0.05-angulo[0],angulo[1]+0.05,angulo[2]-0.05);
				this.baseAla4.setRotacion(0.05+angulo[0],angulo[1]+0.05,angulo[2]+0.05);
			}else{
				alasAltas = false
				lKeyPressed = false
			}
		}

		this.helicoptero.setPosicion(x,y,z);
		this.helicoptero.setRotacion(rx,ry,rz);

	}

	getPosicion = function(){

		this.posicion = this.helicoptero.getPosicion();

		return this.posicion;

	}

	getRotacion = function(){

		return this.posicion = this.helicoptero.getRotacion();

	}

	dibujarColaIzq = function(){

		this.baseColaIzq = new Objeto3D(crearGeometria(new Plano(4,0.4), filas, columnas))
		this.baseColaIzq.setPosicion(-4.5,2.7,0.5)
		this.baseColaIzq.setRotacion(1.5,0,-0.1)
		this.baseColaIzq.setColor(0.96,0.96,0.86)

		this.baseColaIzq1 = new Objeto3D(crearGeometria(new Plano(4,0.4), filas, columnas))
		this.baseColaIzq1.setPosicion(-4.5,2.7,0.4)
		this.baseColaIzq1.setRotacion(1.5,0,-0.1)
		this.baseColaIzq1.setColor(0.96,0.96,0.86)

		this.baseColaIzq2 = new Objeto3D(crearGeometria(new Plano(4,0.12), filas, columnas))
		this.baseColaIzq2.setPosicion(-4.5,2.85,0.45)
		this.baseColaIzq2.setRotacion(0,0,-0.1)
		this.baseColaIzq2.setColor(0.96,0.96,0.86)

	}

	dibujarColaDer = function(){

		this.baseColaDer = new Objeto3D(crearGeometria(new Plano(4,0.3), filas, columnas));
		this.baseColaDer.setPosicion(-4.5,2.7,-0.5);
		this.baseColaDer.setRotacion(1.5,0,-0.1);
		this.baseColaDer.setColor(0.96,0.96,0.86);

		this.baseColaDer1 = new Objeto3D(crearGeometria(new Plano(4,0.3), filas, columnas));
		this.baseColaDer1.setPosicion(-4.5,2.7,-0.4);
		this.baseColaDer1.setRotacion(1.5,0,-0.1);
		this.baseColaDer1.setColor(0.96,0.96,0.86);

		this.baseColaDer2 = new Objeto3D(crearGeometria(new Plano(4,0.12), filas, columnas))
		this.baseColaDer2.setPosicion(-4.5,2.85,-0.45)
		this.baseColaDer2.setRotacion(0,0,-0.1)
		this.baseColaDer2.setColor(0.96,0.96,0.86)

	}

	dibujarHelices1 = function(){

		this.helice1_1 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice1_1.setRotacion(Math.PI/4,0,0)
		this.helice1_1.setColor(0.3,0.3,0.3)
		this.helice1_2 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice1_2.setRotacion(Math.PI/4,Math.PI/6,0)
		this.helice1_2.setColor(0.3,0.3,0.3)
		this.helice1_3 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice1_3.setRotacion(Math.PI/4,Math.PI/6*2,0)
		this.helice1_3.setColor(0.3,0.3,0.3)
		this.helice1_4 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice1_4.setRotacion(Math.PI/4,Math.PI/6*3,0)
		this.helice1_4.setColor(0.3,0.3,0.3)
		this.helice1_5 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice1_5.setRotacion(Math.PI/4,Math.PI/6*4,0)
		this.helice1_5.setColor(0.3,0.3,0.3)
		this.helice1_6 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice1_6.setRotacion(Math.PI/4,Math.PI/6*5,0)
		this.helice1_6.setColor(0.3,0.3,0.3)

	}

	dibujarHelices2 = function(){

		this.helice2_1 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice2_1.setRotacion(Math.PI/4,0,0)
		this.helice2_1.setColor(0.3,0.3,0.3)
		this.helice2_2 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice2_2.setRotacion(Math.PI/4,Math.PI/6,0)
		this.helice2_2.setColor(0.3,0.3,0.3)
		this.helice2_3 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice2_3.setRotacion(Math.PI/4,Math.PI/6*2,0)
		this.helice2_3.setColor(0.3,0.3,0.3)
		this.helice2_4 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice2_4.setRotacion(Math.PI/4,Math.PI/6*3,0)
		this.helice2_4.setColor(0.3,0.3,0.3)
		this.helice2_5 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice2_5.setRotacion(Math.PI/4,Math.PI/6*4,0)
		this.helice2_5.setColor(0.3,0.3,0.3)
		this.helice2_6 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice2_6.setRotacion(Math.PI/4,Math.PI/6*5,0)
		this.helice2_6.setColor(0.3,0.3,0.3)

	}

	dibujarHelices3 = function(){

		this.helice3_1 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice3_1.setRotacion(Math.PI/4,0,0)
		this.helice3_1.setColor(0.3,0.3,0.3)
		this.helice3_2 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice3_2.setRotacion(Math.PI/4,Math.PI/6,0)
		this.helice3_2.setColor(0.3,0.3,0.3)
		this.helice3_3 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice3_3.setRotacion(Math.PI/4,Math.PI/6*2,0)
		this.helice3_3.setColor(0.3,0.3,0.3)
		this.helice3_4 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice3_4.setRotacion(Math.PI/4,Math.PI/6*3,0)
		this.helice3_4.setColor(0.3,0.3,0.3)
		this.helice3_5 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice3_5.setRotacion(Math.PI/4,Math.PI/6*4,0)
		this.helice3_5.setColor(0.3,0.3,0.3)
		this.helice3_6 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice3_6.setRotacion(Math.PI/4,Math.PI/6*5,0)
		this.helice3_6.setColor(0.3,0.3,0.3)

	}

	dibujarHelices4 = function(){

		this.helice4_1 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice4_1.setRotacion(Math.PI/4,0,0)
		this.helice4_1.setColor(0.3,0.3,0.3)
		this.helice4_2 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice4_2.setRotacion(Math.PI/4,Math.PI/6,0)
		this.helice4_2.setColor(0.3,0.3,0.3)
		this.helice4_3 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice4_3.setRotacion(Math.PI/4,Math.PI/6*2,0)
		this.helice4_3.setColor(0.3,0.3,0.3)
		this.helice4_4 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice4_4.setRotacion(Math.PI/4,Math.PI/6*3,0)
		this.helice4_4.setColor(0.3,0.3,0.3)
		this.helice4_5 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice4_5.setRotacion(Math.PI/4,Math.PI/6*4,0)
		this.helice4_5.setColor(0.3,0.3,0.3)
		this.helice4_6 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas))
		this.helice4_6.setRotacion(Math.PI/4,Math.PI/6*5,0)
		this.helice4_6.setColor(0.3,0.3,0.3)

	}

	agregarHijos = function(){

		this.helicoptero.agregarHijo(this.cabina1);
		this.cabina1.agregarHijo(this.baseAla1);
		this.baseAla1.agregarHijo(this.cono1);
		this.cono1.agregarHijo(this.turbina1)
		this.turbina1.agregarHijo(this.cilindro1);
		this.cilindro1.agregarHijo(this.helice1_1);
		this.cilindro1.agregarHijo(this.helice1_2);
		this.cilindro1.agregarHijo(this.helice1_3);
		this.cilindro1.agregarHijo(this.helice1_4);
		this.cilindro1.agregarHijo(this.helice1_5);
		this.cilindro1.agregarHijo(this.helice1_6);

		this.cabina1.agregarHijo(this.baseAla2);
		this.baseAla2.agregarHijo(this.cono2);
		this.cono2.agregarHijo(this.turbina2)
		this.turbina2.agregarHijo(this.cilindro2);
		this.cilindro2.agregarHijo(this.helice2_1);
		this.cilindro2.agregarHijo(this.helice2_2);
		this.cilindro2.agregarHijo(this.helice2_3);
		this.cilindro2.agregarHijo(this.helice2_4);
		this.cilindro2.agregarHijo(this.helice2_5);
		this.cilindro2.agregarHijo(this.helice2_6);

		this.cabina1.agregarHijo(this.baseAla3);
		this.baseAla3.agregarHijo(this.cono3);
		this.cono3.agregarHijo(this.turbina3)
		this.turbina3.agregarHijo(this.cilindro2);
		this.cilindro3.agregarHijo(this.helice3_1);
		this.cilindro3.agregarHijo(this.helice3_2);
		this.cilindro3.agregarHijo(this.helice3_3);
		this.cilindro3.agregarHijo(this.helice3_4);
		this.cilindro3.agregarHijo(this.helice3_5);
		this.cilindro3.agregarHijo(this.helice3_6);

		this.cabina1.agregarHijo(this.baseAla4);
		this.baseAla4.agregarHijo(this.cono4);
		this.cono4.agregarHijo(this.turbina4)
		this.turbina4.agregarHijo(this.cilindro4);
		this.cilindro4.agregarHijo(this.helice4_1);
		this.cilindro4.agregarHijo(this.helice4_2);
		this.cilindro4.agregarHijo(this.helice4_3);
		this.cilindro4.agregarHijo(this.helice4_4);
		this.cilindro4.agregarHijo(this.helice4_5);
		this.cilindro4.agregarHijo(this.helice4_6);

		this.cabina1.agregarHijo(this.pataIzq1);
		this.cabina1.agregarHijo(this.pataIzq2);

		this.cabina1.agregarHijo(this.pataDer1);
		this.cabina1.agregarHijo(this.pataDer2);
		this.pataDer1.agregarHijo(this.baseDer);
		this.pataIzq1.agregarHijo(this.baseIzq);

		this.cabina1.agregarHijo(this.baseColaIzq);
		this.cabina1.agregarHijo(this.baseColaIzq1);
		this.cabina1.agregarHijo(this.baseColaIzq2);

		this.cabina1.agregarHijo(this.baseColaDer);
		this.cabina1.agregarHijo(this.baseColaDer1);
		this.cabina1.agregarHijo(this.baseColaDer2);

		this.baseColaIzq.agregarHijo(this.unidorDeCola);

		this.unidorDeCola.agregarHijo(this.colaIzq);
		this.unidorDeCola.agregarHijo(this.colaDer);

	}

}