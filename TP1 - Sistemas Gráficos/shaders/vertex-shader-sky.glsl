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
        varying vec4 vTextureCoord;
        uniform float uUseReflection;
        varying vec3 vectorObjetoHastaCamara;                             
        
        // constantes
        
        const float PI=3.141592653;
        const float epsilon=0.01;

        const float amplitud=4.0;

        // Sol: Direccional
        uniform vec3 uPrincipalLightDirection;
        uniform vec3 uPrincipalDiffuseColor;
        uniform vec3 uPrincipalSpecularColor;
        uniform float uPrincipalLightIntensity;
        uniform vec3 uEyePoint;
        uniform vec3 uSunPosition;

        varying vec3 light_dir_normalized;
        varying vec3 view_dir_normalized;

    void main(void) {

        vec3 position = aPosition;      
        vec3 normal = aNormal;  
        vec2 uv = aUv;
                                
        vec4 worldPos = uMMatrix*vec4(position, 1.0);                        
        vec4 posMult = uVMatrix*worldPos;                        

        gl_Position = uPMatrix*uVMatrix*worldPos;

        vWorldPosition=worldPos.xyz;              
        vUv=uv;

        // Para normalMap
        vNormal=normalize(uNMatrix * aNormal);
        //vTangent = normalize(uNMatrix * aTangent);
        //vBinormal = normalize(uNMatrix * aBinormal);

        vWorldPosition = (uMMatrix * vec4(aPosition, 1.0)).xyz;

        light_dir_normalized = normalize(uSunPosition - vWorldPosition);
        view_dir_normalized = normalize(uEyePoint - vWorldPosition);
    }