    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec3 aVertexTangent;
    attribute vec3 aVertexBinormal;
    attribute vec4 aTextureCoord;

    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uProyMatrix;
    uniform mat3 uNormalMatrix;

    uniform vec3 uPunctual1LightPosition;
    uniform vec3 uPunctual2LightPosition;
    uniform vec3 uPunctual3LightPosition;
    uniform vec3 uPunctual4LightPosition;

    uniform vec3 uEyePoint;
    uniform vec3 uSunPosition;

    varying vec4 vTextureCoord;
    varying vec3 vPosition;
    varying vec3 vmPosition;
    varying vec3 vNormal;
    varying vec3 vTangent;
    varying vec3 vBinormal;

    varying vec3 light_dir_normalized;
    varying vec3 view_dir_normalized;

    uniform float uUseReflection;
    varying float vUseReflection;

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