        precision mediump float;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec4 vTextureCoord;
        

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;	    // color de luz direccional
        uniform vec3 uDirectionalColor2;    // color de luz direccional2
        uniform vec3 uLightPosition;        // posición de la luz
        uniform vec3 uLightPosition2;       // posición de la luz2
        uniform vec3 RGB;
        
        uniform bool uUseReflection;        // usar refleccion si/no
        uniform bool uUseColor;             // usar color si/no

        uniform sampler2D uSampler;
        uniform sampler2D uSamplerReflectionMap;

        void main(void) {

            vec3 lightDirection= -normalize(uLightPosition - vec3(vWorldPosition));
            vec3 lightDirection2= -normalize(uLightPosition2 - vec3(vWorldPosition));

            vec3 textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t)).xyz;

            textureColor+=uAmbientColor;
            textureColor+=uDirectionalColor*max(dot(vNormal,lightDirection), 0.0);
            textureColor+=uDirectionalColor2*pow(max(dot(vNormal,lightDirection2), 0.0),32.0);

            vec3 vectorReflectado = reflect(lightDirection*lightDirection2, -vNormal);
            float r=sqrt(pow(vectorReflectado.x,2.0)+pow(vectorReflectado.y,2.0)+pow(vectorReflectado.z,2.0));
            float alfa=atan(vectorReflectado.y/vectorReflectado.x);
            float beta=acos(vectorReflectado.z/r);
            
            vec3 colorRefleccion = texture2D(uSamplerReflectionMap, vec2(alfa, beta)).xyz*0.3;

            float factorDifuso=max(0.8,dot(vNormal,uDirectionalColor)*1.1);
            
            //vec3 color=(uAmbientColor+uDirectionalColor*max(dot(vNormal,lightDirection), 0.0));
            vec3 color = vec3(0,0,0);
            color.x=RGB.x;
            color.y=RGB.y;
            color.z=RGB.z;

            color+=uAmbientColor;
            color+=uDirectionalColor*max(dot(vNormal,lightDirection), 0.0);
            color+=uDirectionalColor2*pow(max(dot(vNormal,lightDirection2), 0.0),32.0);

            // Utilizo color o textura
            if (uUseColor)
                gl_FragColor = vec4(color,1.0);
            else
                gl_FragColor = vec4(textureColor,1.0);

            if(uUseReflection){
                //gl_FragColor = vec4(textureColor+colorRefleccion,1.0);
                gl_FragColor = vec4(mix(textureColor*3.0, colorRefleccion, 0.5).rgb, 1.0);
            }
            
        }