        precision mediump float;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;	    // color de luz direccional
        uniform vec3 uLightPosition;        // posición de la luz
        uniform vec3 RGB;
        
        uniform bool uUseLighting;          // usar iluminacion si/no

        uniform sampler2D uSampler;
        uniform sampler2D uSampler1;

        void main(void) {

            vec4 textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t));
            vec4 heliPad = texture2D(uSampler1, vec2(vUv.s, vUv.t));
            
            vec3 lightDirection= normalize(uLightPosition - vec3(vWorldPosition));
            
            vec3 color=(uAmbientColor+uDirectionalColor*max(dot(vNormal,lightDirection), 0.0))*heliPad.xyz;
           
            color.x=RGB.x;
            color.y=RGB.y;
            color.z=RGB.z;
           
           // if (uUseLighting)
                gl_FragColor = vec4(color,1.0);
                //gl_FragColor = texture2D(uSampler,vUv);
            /*else
                gl_FragColor = vec4(0.7,0.7,0.7,1.0);*/
            
        }