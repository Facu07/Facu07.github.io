 precision mediump float;

        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;     // color de luz direccional
        uniform vec3 uLightPosition;        // posición de la luz
        

        uniform vec3 uDirectionalColor2;    // color de luz direccional
        uniform vec3 uLightPosition2;       // posición de la luz   

        uniform bool uUseLighting;          // usar iluminacion si/no

        uniform sampler2D uSampler;

        varying highp vec2 vUv;
                        
        
        // ***************************************************************************
            
        void main(void) {

            // uSampler: agua

            vec4 textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t));         

            gl_FragColor = textureColor;
            
        }