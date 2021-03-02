 // atributos del vértice (cada uno se alimenta de un ARRAY_BUFFER distinto)

        attribute vec3 aPosition;   //posicion (x,y,z)
        attribute vec3 aNormal;     //vector normal (x,y,z)
        attribute vec2 aUv;         //coordenadas de texture (x,y)  x e y (en este caso) van de 0 a 1
        attribute vec4 aTextureCoord;

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
        varying float vUseReflection;
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

    void main(void) {
        // Transformamos al vértice al espacio de la cámara
        /*vec4 pos_camera_view = uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

        // Transformamos al vértice al espacio de la proyección
        gl_Position = uProyMatrix * pos_camera_view;

        vPosition = vec3(pos_camera_view) / pos_camera_view.w;

        // Coordenada de textura sin modificaciones
        /*vTextureCoord = aTextureCoord;

        // Para normalMap
        vNormal = normalize(uNormalMatrix * aVertexNormal);
        vTangent = normalize(uNormalMatrix * aVertexTangent);
        vBinormal = normalize(uNormalMatrix * aVertexBinormal);

        vmPosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz;

        light_dir_normalized = normalize(uSunPosition - vmPosition);
        view_dir_normalized = normalize(uEyePoint - vmPosition);

        // Indica si usa reflection.
        vUseReflection = uUseReflection;*/

        vec3 position = aPosition;      
        vec3 normal = aNormal;  
        vec2 uv = aUv;
                                
        vec4 worldPos = uMMatrix*vec4(position, 1.0);                        
        vec4 posMult = uVMatrix*worldPos;                        

        gl_Position = uPMatrix*uVMatrix*worldPos;

        vWorldPosition=worldPos.xyz;              
        vNormal=normalize(uNMatrix * aNormal);
        vUv=uv;

        // Indica si usa reflection.
        vUseReflection = uUseReflection;
    }