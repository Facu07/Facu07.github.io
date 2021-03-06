var filas=40;
var columnas=40;

var count = 0;
var rotando = false
var alasAltas = false
var angulo = 0;
var angulo2 = 0;
var angulo3 = 0;
var angulo4 = 0;
var anguloTurbina = 0;
var anguloTurbina2 = 0;
var anguloTurbina3 = 0;
var anguloTurbina4 = 0;
var turbinasRotadas1 = false
var turbinasRotadas2 = false
var anguloCola = 0
var colaRotadaIzq = false
var colaRotadaDer = false

var controlF = [[-3,-3,0],[3,-3,0],[5,-3,0],[5,0,0],[3,1,0],[2,1,0],[-4,0,0],[-3,-3,0]];
var controlR = [[0,0,-1.5],[0,0,0.5],[0,0,1.5]];

var controlFBase = [[-0.7,-1.7,0],[1.0,-1.7,0],[1.5,-1.2,0],[1.6,-0.5,0],[1,0.5,0],[0.2,0.7,0],[-3,0,0],[-0.7,-1.7,0]];
var controlRBase = [[0,0,-0.5],[0,0,0],[0,0,0.5]];

var controlFTurbinas = [[2,2,1],[1,1,1],[0,0,1],[1,1,1],[2,2,1]];
var controlRTurbinas = [[-2.9,-1,0],[-3,2.4,0],[2,2.5,0],[2,0,0],[2,-2,0],[2,-4,0],[-2.8,-4,0],[-2.9,-1,0]];

class Helicoptero {

	constructor(shaderProgram) {

		this.shaderProgram = shaderProgram;
		
		this.helicoptero = new Objeto3D(crearGeometria(new Esfera(0.5), filas, columnas, false), this.shaderProgram);
		this.helicoptero.setEscala(0.03,0.03,0.03);

		this.forma = new CurvaBezier(controlF);
		this.recorrido = new CurvaBezier(controlR);
		this.formaDiscreta = discretizadorDeCurvas(this.forma, columnas);
		this.matricesModelado = discretizadorDeCurvas(this.recorrido, filas);
		this.matricesNormales = discretizadorDeRecorrido(this.recorrido,filas);
		this.normales = discretizadorNormal(this.forma, columnas);

		this.SUPERFICIE = new SuperficieBarrido(this.formaDiscreta, this.matricesModelado, this.matricesNormales, filas, columnas, true, this.normales);
		this.cabina1 = new Objeto3D(crearGeometria(this.SUPERFICIE, filas, columnas, true), this.shaderProgram);
		this.cabina1.setPosicion(0,-2,0);
		this.cabina1.setColor(0.84,0.81,0.7)
		this.cabina1.initTexture("img/cabina1.png");
		this.cabina1.initReflectionTexture("img/cielo1-refmap.jpg");

		this.forma1 = new CurvaBezier(controlFBase);
		this.recorrido1 = new CurvaBezier(controlRBase);
		this.formaDiscreta1 = discretizadorDeCurvas(this.forma1, columnas);
		this.matricesModelado1 = discretizadorDeCurvas(this.recorrido1, filas);
		this.matricesNormales1 = discretizadorDeRecorrido(this.recorrido1,filas);
		this.normales1 = discretizadorNormal(this.forma1, columnas);

		this.SUPERFICIE1 = new SuperficieBarrido(this.formaDiscreta1, this.matricesModelado1, this.matricesNormales1, filas, columnas, true, this.normales1);
		this.baseAla1 = new Objeto3D(crearGeometria(this.SUPERFICIE1, filas, columnas, false), this.shaderProgram);
		this.baseAla1.setEscala(0.2,0.2,1);
		this.baseAla1.setPosicion(-2.4,2.8,1.5);
		this.baseAla1.setRotacion(0,Math.PI/2,0)
		this.baseAla1.setColor(0.3,0.3,0.3)

		this.cono1 = new Objeto3D(crearGeometria(this.SUPERFICIE1, filas, columnas, false), this.shaderProgram);
		this.cono1.setPosicion(-3.5,0,0);
		this.cono1.setEscala(0.2,1,5);
		this.cono1.setRotacion(0,Math.PI/2,0)
		this.cono1.setColor(1,1,1)
		this.cono1.initTexture("img/cabina1.png");
		this.cono1.initReflectionTexture("img/cielo1-refmap.jpg");

		this.formaPrueba = new CurvaBezier(controlFTurbinas);
		this.recorridoPrueba = new CurvaBezier(controlRTurbinas);
		this.formaDiscretaPrueba = discretizadorDeCurvas(this.formaPrueba, columnas);
		this.matricesModeladoPrueba = discretizadorDeCurvas(this.recorridoPrueba, filas);
		this.matricesNormalesPrueba = discretizadorDeRecorrido(this.recorridoPrueba,filas);
		//this.SUPERFICIETURBINA = new SuperficieBarrido(this.formaDiscretaPrueba, this.matricesModeladoPrueba, this.matricesNormalesPrueba, filas, columnas, false);
		//this.prueba = new Objeto3D(crearGeometria(this.SUPERFICIETURBINA, filas, columnas, false,), this.shaderProgram);

		this.turbina1 = new Objeto3D(crearGeometria(new Turbina(0.5,0.1,5,false), filas, columnas, false), this.shaderProgram)
		this.turbina1_2 = new Objeto3D(crearGeometria(new Turbina(0.5,0.1,5,true), filas, columnas, false), this.shaderProgram)
		this.turbina1_2.setEscala(1,0.2,1)
		this.turbina1.setPosicion(0,-1,-1.5)
		this.turbina1.setEscala(8,8,2);
		this.turbina1.setColor(1,0,0)
		this.turbina1.initTexture("img/textura-rojo.jpg");
		this.turbina1_2.initTexture("img/textura-rojo.jpg");

		
		this.cilindro1 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.2, 0.5, true), filas, columnas, false), this.shaderProgram)
		this.cilindro1.setPosicion(0,0.3,0)
		this.cilindro1.setColor(1,1,1)
		this.cilindro1.initTexture("img/cabina1.png");
		this.cilindro1.initReflectionTexture("img/cielo1-refmap.jpg");

		this.dibujarHelices1()

		this.baseAla2 = new Objeto3D(crearGeometria(this.SUPERFICIE1, filas, columnas, false), this.shaderProgram);
		this.baseAla2.setEscala(0.2,0.2,1);
		this.baseAla2.setPosicion(0.5,2.7,-1.5);
		this.baseAla2.setRotacion(0,-Math.PI/2,0)
		this.baseAla2.setColor(0.3,0.3,0.3)

		this.cono2 = new Objeto3D(crearGeometria(this.SUPERFICIE1, filas, columnas, false), this.shaderProgram);
		this.cono2.setPosicion(-3.5,0,0);
		this.cono2.setEscala(0.2,1,5);
		this.cono2.setRotacion(0,Math.PI/2,0)
		this.cono2.setColor(1,1,1)
		this.cono2.initTexture("img/cabina1.png");
		this.cono2.initReflectionTexture("img/cielo1-refmap.jpg");

		this.turbina2 = new Objeto3D(crearGeometria(new Turbina(0.5,0.1,5,false), filas, columnas, false), this.shaderProgram)
		this.turbina2_2 = new Objeto3D(crearGeometria(new Turbina(0.5,0.1,5,true), filas, columnas, false), this.shaderProgram)
		this.turbina2_2.setEscala(1,0.2,1)
		this.turbina2.setPosicion(0,-1,-1.5)
		this.turbina2.setEscala(8,8,2);
		this.turbina2.setColor(1,0,0)
		this.turbina2.initTexture("img/textura-rojo.jpg");
		this.turbina2_2.initTexture("img/textura-rojo.jpg");


		this.cilindro2 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.2, 0.5, true), filas, columnas, false), this.shaderProgram)
		this.cilindro2.setColor(1,1,1)
		this.cilindro2.setPosicion(0,0.3,0)
		this.cilindro2.initTexture("img/cabina1.png");
		this.cilindro2.initReflectionTexture("img/cielo1-refmap.jpg");

		this.dibujarHelices2();

		this.baseAla3 = new Objeto3D(crearGeometria(this.SUPERFICIE1, filas, columnas, false), this.shaderProgram);
		this.baseAla3.setEscala(0.2,0.2,1);
		this.baseAla3.setRotacion(0,-Math.PI/2,0)
		this.baseAla3.setPosicion(-2.4,2.8,-1.5);
		this.baseAla3.setColor(0.3,0.3,0.3)

		this.cono3 = new Objeto3D(crearGeometria(this.SUPERFICIE1, filas, columnas, false));
		this.cono3.setPosicion(-3.5,0,0);
		this.cono3.setEscala(0.2,1,5);
		this.cono3.setRotacion(0,Math.PI/2,0)
		this.cono3.setColor(1,1,1)
		this.cono3.initTexture("img/cabina1.png");
		this.cono3.initReflectionTexture("img/cielo1-refmap.jpg");

		this.turbina3 = new Objeto3D(crearGeometria(new Turbina(0.5,0.1,5,false), filas, columnas, false), this.shaderProgram)
		this.turbina3_2 = new Objeto3D(crearGeometria(new Turbina(0.5,0.1,5,true), filas, columnas, false), this.shaderProgram)
		this.turbina3_2.setEscala(1,0.2,1)
		this.turbina3.setPosicion(0,-1,-1.5)
		this.turbina3.setEscala(8,8,2);
		this.turbina3.setColor(1,0,0)
		this.turbina3.initTexture("img/textura-rojo.jpg");
		this.turbina3_2.initTexture("img/textura-rojo.jpg");

		this.cilindro3 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.2, 0.5, true), filas, columnas, false), this.shaderProgram)
		this.cilindro3.setColor(1,1,1)
		this.cilindro3.setPosicion(0,0.3,0)
		this.cilindro3.initTexture("img/cabina1.png");
		this.cilindro3.initReflectionTexture("img/cielo1-refmap.jpg");

		this.dibujarHelices3();


		this.baseAla4 = new Objeto3D(crearGeometria(this.SUPERFICIE1, filas, columnas, false), this.shaderProgram);
		this.baseAla4.setEscala(0.2,0.2,1);
		this.baseAla4.setRotacion(0,-Math.PI/2,0)
		this.baseAla4.setPosicion(0.5,2.7,1.5);
		this.baseAla4.setColor(0.3,0.3,0.3)

		this.cono4 = new Objeto3D(crearGeometria(this.SUPERFICIE1, filas, columnas, false), this.shaderProgram);
		this.cono4.setPosicion(3.5,0,0);
		this.cono4.setEscala(0.2,1,5);
		this.cono4.setRotacion(0,Math.PI/2,0)
		this.cono4.setColor(1,1,1)
		this.cono4.initTexture("img/cabina1.png");
		this.cono4.initReflectionTexture("img/cielo1-refmap.jpg");

		this.turbina4 = new Objeto3D(crearGeometria(new Turbina(0.5,0.1,5,false), filas, columnas, false), this.shaderProgram)
		this.turbina4_2 = new Objeto3D(crearGeometria(new Turbina(0.5,0.1,5,true), filas, columnas, false), this.shaderProgram)
		this.turbina4_2.setEscala(1,0.2,1)
		this.turbina4.setPosicion(0,-1,1.5)
		this.turbina4.setEscala(8,8,2);
		this.turbina4.setColor(1,0,0)
		this.turbina4.initTexture("img/textura-rojo.jpg");
		this.turbina4_2.initTexture("img/textura-rojo.jpg");

		this.cilindro4 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.2, 0.5, true), filas, columnas, false), this.shaderProgram)
		this.cilindro4.setColor(1,1,1)
		this.cilindro4.setPosicion(0,0.3,0)
		this.cilindro4.initTexture("img/cabina1.png");
		this.cilindro4.initReflectionTexture("img/cielo1-refmap.jpg");

		this.dibujarHelices4();

		this.pataIzq1 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 3, true), filas, columnas, false), this.shaderProgram)
		this.pataIzq1.setPosicion(-1.2,0.3,1.5)
		this.pataIzq1.setRotacion(-Math.PI/12,0,0)
		this.pataIzq1.setColor(0,0,0)
		this.pataIzq2 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 2, true), filas, columnas, false), this.shaderProgram)
		this.pataIzq2.setPosicion(1.2,0,1.5)
		this.pataIzq2.setRotacion(-Math.PI/12,0,0)
		this.pataIzq2.setColor(0,0,0)
		this.baseIzq = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 4, true), filas, columnas, false), this.shaderProgram)

		this.pataDer1 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 3, true), filas, columnas, false), this.shaderProgram)
		this.pataDer1.setPosicion(-1.2,0.3,-1.5)
		this.pataDer1.setRotacion(Math.PI/12,0,0)
		this.pataDer1.setColor(0,0,0)
		this.pataDer2 = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 2, true), filas, columnas, false), this.shaderProgram)
		this.pataDer2.setPosicion(1.2,0,-1.5)
		this.pataDer2.setRotacion(Math.PI/12,0,0)
		this.pataDer2.setColor(0,0,0)

		this.baseDer = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 10, true), filas, columnas, false), this.shaderProgram)
		this.baseDer.setPosicion(1,-0.8,0)
		this.baseDer.setRotacion(0,0,1.6)
		this.baseDer.setColor(0,0,0)
		this.baseDer.initTexture("img/negro.png");
		this.baseDer.initReflectionTexture("img/cielo1-refmap.jpg");

		this.baseIzq = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.09, 10, true), filas, columnas, false), this.shaderProgram)
		this.baseIzq.setPosicion(1,-0.8,0)
		this.baseIzq.setRotacion(0,0,1.6)
		this.baseIzq.setColor(0,0,0)
		this.baseIzq.initTexture("img/negro.png");
		this.baseIzq.initReflectionTexture("img/cielo1-refmap.jpg");

		this.dibujarColaIzq();

		this.dibujarColaDer();

		this.unidorDeCola = new Objeto3D(crearGeometria(new TuboSenoidal(0, 1, 0.2, 2.5, true), filas, columnas, false), this.shaderProgram);
		this.unidorDeCola.setPosicion(-2,-0.5,0);
		this.unidorDeCola.setRotacion(Math.PI/50,0,0);
		this.unidorDeCola.setColor(0.96,0.96,0.86);
		this.baseIzq.initTexture("img/cabina1");
		this.baseIzq.initReflectionTexture("img/cielo1-refmap.jpg");

		this.colaDer = new Objeto3D(crearGeometria(new Plano(1,2), filas, columnas, false), this.shaderProgram);
		this.colaDer.setPosicion(0,-0.7,0);
		this.colaDer.setRotacion(0,0.5,0);
		this.colaDer.setColor(1,0,0)
		this.colaDer.initTexture("img/textura-rojo.jpg");
		this.colaDer.initReflectionTexture("img/cielo1-refmap.jpg");

		this.colaIzq = new Objeto3D(crearGeometria(new Plano(1,2), filas, columnas, false), this.shaderProgram);
		this.colaIzq.setPosicion(0,0.7,0);
		this.colaIzq.setRotacion(0,0.5,0);
		this.colaIzq.setColor(1,0,0)
		this.colaIzq.initTexture("img/textura-rojo.jpg");
		this.colaIzq.initReflectionTexture("img/cielo1-refmap.jpg");
		
		this.agregarHijos();
	}


	dibujar = function(){

		this.cilindro1.setRotacion(0,time*10,0);
		this.cilindro2.setRotacion(0,time*10,0);
		this.cilindro3.setRotacion(0,time*10,0);
		this.cilindro4.setRotacion(0,time*10,0);

		this.helicoptero.dibujar(mat4.create(),false);

	}

	actualizar = function(x, y, z,rx, ry, rz){

		anguloTurbina = this.turbina1.getRotacion()
		anguloTurbina2 = this.turbina2.getRotacion()
		anguloTurbina3 = this.turbina3.getRotacion()
		anguloTurbina4 = this.turbina4.getRotacion()

		if(wKeyPressed && !turbinasRotadas1){
			if(anguloTurbina[2] < Math.PI/4){
				this.turbina1.setRotacion(0,0,anguloTurbina[2]+0.05)
				this.turbina2.setRotacion(0,0,anguloTurbina2[2]-0.05)
				this.turbina3.setRotacion(0,0,anguloTurbina3[2]-0.05)
				this.turbina4.setRotacion(0,0,anguloTurbina4[2]-0.05)
			}else{
				turbinasRotadas1 = true;
			}
		}
		if(!wKeyPressed && turbinasRotadas1){
			if(anguloTurbina[2] > 0){
				this.turbina1.setRotacion(0,0,anguloTurbina[2]-0.05)
				this.turbina2.setRotacion(0,0,anguloTurbina2[2]+0.05)
				this.turbina3.setRotacion(0,0,anguloTurbina3[2]+0.05)
				this.turbina4.setRotacion(0,0,anguloTurbina4[2]+0.05)
			}else{
				turbinasRotadas1 = false
			}
		}
		if(sKeyPressed && !turbinasRotadas2){
			if(anguloTurbina[2] > -Math.PI/4){
				this.turbina1.setRotacion(0,0,anguloTurbina[2]-0.05)
				this.turbina2.setRotacion(0,0,anguloTurbina2[2]+0.05)
				this.turbina3.setRotacion(0,0,anguloTurbina3[2]+0.05)
				this.turbina4.setRotacion(0,0,anguloTurbina4[2]+0.05)
			}else{
				turbinasRotadas2 = true
			}
		}

		if(!sKeyPressed && turbinasRotadas2){
			if(anguloTurbina[2] < 0){
				this.turbina1.setRotacion(0,0,anguloTurbina[2]+0.05)
				this.turbina2.setRotacion(0,0,anguloTurbina2[2]-0.05)
				this.turbina3.setRotacion(0,0,anguloTurbina3[2]-0.05)
				this.turbina4.setRotacion(0,0,anguloTurbina4[2]-0.05)
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
		angulo2 = this.baseAla2.getRotacion()
		angulo3 = this.baseAla3.getRotacion()
		angulo4 = this.baseAla4.getRotacion()

		if((lKeyPressed && !alasAltas)){
			if((angulo[2] > -Math.PI/2 && !alasAltas)){
				this.baseAla1.setRotacion(angulo[0],angulo[1],angulo[2]-0.05);
				this.baseAla2.setRotacion(angulo2[0],angulo2[1],angulo2[2]-0.05);
				this.baseAla3.setRotacion(angulo3[0],angulo3[1],angulo3[2]-0.05);
				this.baseAla4.setRotacion(angulo4[0],angulo4[1],angulo4[2]+0.05);
			}else{
				alasAltas = true
				lKeyPressed = false
			}
		}
		if((lKeyPressed && alasAltas)){
			if(angulo[2] < 0 && alasAltas){
				this.baseAla1.setRotacion(angulo[0],angulo[1],angulo[2]+0.05);
				this.baseAla2.setRotacion(angulo2[0],angulo2[1],angulo2[2]+0.05);
				this.baseAla3.setRotacion(angulo3[0],angulo3[1],angulo3[2]+0.05);
				this.baseAla4.setRotacion(angulo4[0],angulo4[1],angulo4[2]-0.05);
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

		this.baseColaIzq = new Objeto3D(crearGeometria(new Plano(4,0.4), filas, columnas, false), this.shaderProgram)
		this.baseColaIzq.setPosicion(-4.5,2.7,0.5)
		this.baseColaIzq.setRotacion(1.5,0,-0.1)
		this.baseColaIzq.setColor(0.96,0.96,0.86)

		this.baseColaIzq1 = new Objeto3D(crearGeometria(new Plano(4,0.4), filas, columnas, false), this.shaderProgram)
		this.baseColaIzq1.setPosicion(-4.5,2.7,0.4)
		this.baseColaIzq1.setRotacion(1.5,0,-0.1)
		this.baseColaIzq1.setColor(0.96,0.96,0.86)

		this.baseColaIzq2 = new Objeto3D(crearGeometria(new Plano(4,0.12), filas, columnas, false), this.shaderProgram)
		this.baseColaIzq2.setPosicion(-4.5,2.85,0.45)
		this.baseColaIzq2.setRotacion(0,0,-0.1)
		this.baseColaIzq2.setColor(0.96,0.96,0.86)

	}

	dibujarColaDer = function(){

		this.baseColaDer = new Objeto3D(crearGeometria(new Plano(4,0.3), filas, columnas, false), this.shaderProgram);
		this.baseColaDer.setPosicion(-4.5,2.7,-0.5);
		this.baseColaDer.setRotacion(1.5,0,-0.1);
		this.baseColaDer.setColor(0.96,0.96,0.86);

		this.baseColaDer1 = new Objeto3D(crearGeometria(new Plano(4,0.3), filas, columnas, false), this.shaderProgram);
		this.baseColaDer1.setPosicion(-4.5,2.7,-0.4);
		this.baseColaDer1.setRotacion(1.5,0,-0.1);
		this.baseColaDer1.setColor(0.96,0.96,0.86);

		this.baseColaDer2 = new Objeto3D(crearGeometria(new Plano(4,0.12), filas, columnas, false), this.shaderProgram)
		this.baseColaDer2.setPosicion(-4.5,2.85,-0.45)
		this.baseColaDer2.setRotacion(0,0,-0.1)
		this.baseColaDer2.setColor(0.96,0.96,0.86)

	}

	dibujarHelices1 = function(){

		this.helice1_1 = new Objeto3D(crearGeometria(new Plano(0.75,0.2), filas, columnas, false), this.shaderProgram)
		this.helice1_1.setRotacion(Math.PI/4,0,0)
		this.helice1_1.setColor(0.3,0.3,0.3)
		this.helice1_2 = new Objeto3D(crearGeometria(new Plano(0.75,0.2), filas, columnas, false), this.shaderProgram)
		this.helice1_2.setRotacion(Math.PI/4,Math.PI/4,0)
		this.helice1_2.setColor(0.3,0.3,0.3)
		this.helice1_3 = new Objeto3D(crearGeometria(new Plano(0.75,0.2), filas, columnas, false), this.shaderProgram)
		this.helice1_3.setRotacion(Math.PI/4,Math.PI/2,0)
		this.helice1_3.setColor(0.3,0.3,0.3)
		this.helice1_4 = new Objeto3D(crearGeometria(new Plano(0.75,0.2), filas, columnas, false), this.shaderProgram)
		this.helice1_4.setRotacion(Math.PI/4,Math.PI*7/4,0)
		this.helice1_4.setColor(0.3,0.3,0.3)

	}

	dibujarHelices2 = function(){

		this.helice2_1 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice2_1.setRotacion(Math.PI/4,0,0)
		this.helice2_1.setColor(0.3,0.3,0.3)
		this.helice2_2 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice2_2.setRotacion(Math.PI/4,Math.PI/4,0)
		this.helice2_2.setColor(0.3,0.3,0.3)
		this.helice2_3 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice2_3.setRotacion(Math.PI/4,Math.PI/2,0)
		this.helice2_3.setColor(0.3,0.3,0.3)
		this.helice2_4 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice2_4.setRotacion(Math.PI/4,Math.PI*7/4,0)
		this.helice2_4.setColor(0.3,0.3,0.3)


	}

	dibujarHelices3 = function(){

		this.helice3_1 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice3_1.setRotacion(Math.PI/4,0,0)
		this.helice3_1.setColor(0.3,0.3,0.3)
		this.helice3_2 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice3_2.setRotacion(Math.PI/4,Math.PI/4,0)
		this.helice3_2.setColor(0.3,0.3,0.3)
		this.helice3_3 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice3_3.setRotacion(Math.PI/4,Math.PI/2,0)
		this.helice3_3.setColor(0.3,0.3,0.3)
		this.helice3_4 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice3_4.setRotacion(Math.PI/4,Math.PI*7/4,0)
		this.helice3_4.setColor(0.3,0.3,0.3)

	}

	dibujarHelices4 = function(){

		this.helice4_1 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice4_1.setRotacion(Math.PI/4,0,0)
		this.helice4_1.setColor(0.3,0.3,0.3)
		this.helice4_2 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice4_2.setRotacion(Math.PI/4,Math.PI/2,0)
		this.helice4_2.setColor(0.3,0.3,0.3)
		this.helice4_3 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice4_3.setRotacion(Math.PI/4,Math.PI/4,0)
		this.helice4_3.setColor(0.3,0.3,0.3)
		this.helice4_4 = new Objeto3D(crearGeometria(new Plano(1,0.2), filas, columnas, false), this.shaderProgram)
		this.helice4_4.setRotacion(Math.PI/4,Math.PI*7/4,0)
		this.helice4_4.setColor(0.3,0.3,0.3)

	}

	agregarHijos = function(){

		this.helicoptero.agregarHijo(this.cabina1);
		this.cabina1.agregarHijo(this.baseAla1);
		this.baseAla1.agregarHijo(this.cono1);
		this.cono1.agregarHijo(this.turbina1)
		this.turbina1.agregarHijo(this.turbina1_2);
		this.turbina1.agregarHijo(this.cilindro1);
		this.cilindro1.agregarHijo(this.helice1_1);
		this.cilindro1.agregarHijo(this.helice1_2);
		this.cilindro1.agregarHijo(this.helice1_3);
		this.cilindro1.agregarHijo(this.helice1_4);

		this.cabina1.agregarHijo(this.baseAla2);
		this.baseAla2.agregarHijo(this.cono2);
		this.cono2.agregarHijo(this.turbina2)
		this.turbina2.agregarHijo(this.turbina2_2);
		this.turbina2.agregarHijo(this.cilindro2);
		this.cilindro2.agregarHijo(this.helice2_1);
		this.cilindro2.agregarHijo(this.helice2_2);
		this.cilindro2.agregarHijo(this.helice2_3);
		this.cilindro2.agregarHijo(this.helice2_4);


		this.cabina1.agregarHijo(this.baseAla3);
		this.baseAla3.agregarHijo(this.cono3);
		this.cono3.agregarHijo(this.turbina3)
		this.turbina3.agregarHijo(this.turbina3_2);
		this.turbina3.agregarHijo(this.cilindro2);
		this.cilindro3.agregarHijo(this.helice3_1);
		this.cilindro3.agregarHijo(this.helice3_2);
		this.cilindro3.agregarHijo(this.helice3_3);
		this.cilindro3.agregarHijo(this.helice3_4);

		this.cabina1.agregarHijo(this.baseAla4);
		this.baseAla4.agregarHijo(this.cono4);
		this.cono4.agregarHijo(this.turbina4);
		this.turbina4.agregarHijo(this.turbina4_2);
		this.turbina4.agregarHijo(this.cilindro4);
		this.cilindro4.agregarHijo(this.helice4_1);
		this.cilindro4.agregarHijo(this.helice4_2);
		this.cilindro4.agregarHijo(this.helice4_3);
		this.cilindro4.agregarHijo(this.helice4_4);

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
