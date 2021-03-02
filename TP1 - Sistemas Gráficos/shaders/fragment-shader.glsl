        precision mediump float;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec4 vTextureCoord;
        

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;	    // color de luz direccional
        uniform vec3 uDirectionalColor2;     // color de luz direccional2
        uniform vec3 uLightPosition;        // posición de la luz
        uniform vec3 uLightPosition2;        // posición de la luz2
        uniform vec3 RGB;
        
        uniform bool uUseLighting;          // usar iluminacion si/no
        uniform bool uUseColor;             // usar color si/no

        uniform sampler2D uSampler;

        void main(void) {

            vec3 lightDirection= normalize(uLightPosition - vec3(vWorldPosition));
            vec3 lightDirection2= normalize(uLightPosition2 - vec3(vWorldPosition));

            vec3 textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t)).xyz;

            /*textureColor+=uAmbientColor;
            textureColor+=uDirectionalColor*max(dot(vNormal,lightDirection), 0.0);
            textureColor+=uDirectionalColor2*max(dot(vNormal,lightDirection2), 0.0);*/
            
            vec3 color=(uAmbientColor+uDirectionalColor*max(dot(vNormal,lightDirection), 0.0));
           
            color.x=RGB.x;
            color.y=RGB.y;
            color.z=RGB.z;

            // Utilizo color o textura
            if (RGB.x > 1.1)
                gl_FragColor = vec4(textureColor,1.0);
            else
                gl_FragColor = vec4(color,1.0);

            
        }