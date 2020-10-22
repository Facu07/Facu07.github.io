
        // atributos del vértice (cada uno se alimenta de un ARRAY_BUFFER distinto)

        attribute vec3 aPosition;   //posicion (x,y,z)
        attribute vec3 aNormal;     //vector normal (x,y,z)
        attribute vec2 aUv;         //coordenadas de texture (x,y)  x e y (en este caso) van de 0 a 1

        // variables Uniform (son globales a todos los vértices y de solo-lectura)

        uniform mat4 uMMatrix;     // matriz de modelado
        uniform mat4 uVMatrix;     // matriz de vista
        uniform mat4 uPMatrix;     // matriz de proyección
        uniform mat3 uNMatrix;     // matriz de normales
                        
        uniform float time;                 // tiempo en segundos
        
        uniform sampler2D uSampler;         // sampler de textura de la tierra

        // variables varying (comunican valores entre el vertex-shader y el fragment-shader)
        // Es importante remarcar que no hay una relacion 1 a 1 entre un programa de vertices y uno de fragmentos
        // ya que por ejemplo 1 triangulo puede generar millones de pixeles (dependiendo de su tamaño en pantalla)
        // por cada vertice se genera un valor de salida en cada varying.
        // Luego cada programa de fragmentos recibe un valor interpolado de cada varying en funcion de la distancia
        // del pixel a cada uno de los 3 vértices. Se realiza un promedio ponderado

        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        varying vec2 vUv;                           
        
        // constantes
        
        const float PI=3.141592653;

        void main(void) {
                    
            vec3 position = aPosition;		
            vec3 normal = aNormal;	
            vec2 uv = aUv;
                                   	
           vec4 textureColor = texture2D(uSampler, vec2(uv.s, uv.t));         
            
            // **************** EDITAR A PARTIR DE AQUI *******************************
            
            float latitude = 41.145556;	 // (φ)
			float longitude = -73.995; 	  // (λ)

			float mapWidth = 2018.0;
			float mapHeight = 1024.0;

			position+=normal*(1.0+sin(position.y*8.0*PI))*0.03;

			// get x value
			//position.x = (latitude+180)*(2048.0/360.0);

			// convert from degrees to radians
			//float latRad = latitude*PI/180.0;

			// get y value
			//float mercN = Math.ln(Math.tan((PI/4.0)+(latRad/2.0)));
			//position.y = (mapHeight/2.0)-(mapWidth*mercN/(2.0*PI));

            // ************************************************************************

            vec4 worldPos = uMMatrix*vec4(position, 1.0);                        

            gl_Position = uPMatrix*uVMatrix*worldPos;

            vWorldPosition=worldPos.xyz;              
            vNormal=normalize(uNMatrix * aNormal);
            vUv=uv;	
        }