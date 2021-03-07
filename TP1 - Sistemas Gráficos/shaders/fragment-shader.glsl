        precision mediump float;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 pos_camera_view;
        varying vec3 Position;
        varying vec3 N;
        

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;	    // color de luz direccional
        uniform vec3 uDirectionalColor2;    // color de luz direccional2
        uniform vec3 uLightPosition;        // posición de la luz
        uniform vec3 uLightPosition2;       // posición de la luz2
        uniform vec3 RGB;
        //varying vec4 Ka;// = vec4( 1.0, 0.3, 0.3, 1.0);
        const vec4 Kd= vec4( 0.2, 0.2, 0.2 ,1.0);
        const vec4 Ks= vec4( 1.0, 1.0, 1.0, 1.0);
        const vec4 La= vec4( 0.3, 0.3, 0.3, 1.0);
        const vec4 Ld= vec4( 0.3, 0.3, 0.3, 1.0);
        const vec4 Ls= vec4( 0.4, 0.4, 0.4, 1.0);           
                 

        uniform bool uUseReflection;        // usar refleccion si/no
        uniform bool uUseColor;             // usar color si/no
        uniform bool uUsePhong;             // uso phong si/no

        uniform sampler2D uSampler;
        uniform sampler2D uSamplerReflectionMap;


        void main(void) {

            vec3 lightDirection= normalize(uLightPosition);
            vec3 lightDirection2= normalize(uLightPosition2 - vec3(vWorldPosition));

            vec3 textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t)).xyz;            

            vec3 lightVec = vec3(-1.0,1.0,-1.0);

            textureColor+=uAmbientColor;
            textureColor+=uDirectionalColor*max(dot(N,lightDirection), 0.0);
            textureColor+=uDirectionalColor2*pow(max(dot(N,lightDirection), 0.0),64.0);


            gl_FragColor = vec4(textureColor,1.0);
            
        }