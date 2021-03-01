        precision mediump float;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec4 vTextureCoord;
        

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;	    // color de luz direccional
        uniform vec3 uLightPosition;        // posición de la luz
        uniform vec3 RGB;
        
        uniform bool uUseLighting;          // usar iluminacion si/no
        uniform bool uUseColor;             // usar color si/no

        uniform sampler2D uSampler;
        uniform sampler2D uSampler1;

        void main(void) {

            vec3 textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t)).xyz;
            vec4 heliPad = texture2D(uSampler1, vec2(vUv.s, vUv.t));
            
            vec3 lightDirection= normalize(uLightPosition - vec3(vWorldPosition));
            
            vec3 color=(uAmbientColor+uDirectionalColor*max(dot(vNormal,lightDirection), 0.0));
           
            color.x=RGB.x;
            color.y=RGB.y;
            color.z=RGB.z;
            /*color.x=vUv.x;
            color.y=vUv.y;
            color.z=0.0;*/
           
           if (uUseLighting)
                gl_FragColor = vec4(textureColor,1.0);
                //gl_FragColor = heliPad;
            else
                gl_FragColor = vec4(0.7,0.7,0.7,1.0);

            // Utilizo color o textura
            /*vec4 textureColor;
            if (uUseColor) {
                textureColor = vec4(vTextureCoord.rgb, 1.0);
            } else {
                textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
            }*/
            
        }