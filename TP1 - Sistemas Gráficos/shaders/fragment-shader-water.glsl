 precision mediump float;

        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 pos_camera_view;
        varying vec3 Position;

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;     // color de luz direccional
        uniform vec3 uLightPosition;        // posición de la luz
        

        uniform vec3 uDirectionalColor2;    // color de luz direccional
        uniform vec3 uLightPosition2;       // posición de la luz   

        uniform bool uUseLighting;          // usar iluminacion si/no

        uniform sampler2D uSampler;
        uniform sampler2D uSamplerReflectionMap;

        varying highp vec2 vUv;
                        
        
        // ***************************************************************************
            
        void main(void) {

            // uSampler: agua

            vec3 lightDirection= normalize(uLightPosition - vec3(vWorldPosition));
            vec3 lightDirection2= normalize(uLightPosition2 - vec3(vWorldPosition));
            vec3 lightVec = vec3(-1.0,1.0,-1.0);
            vec3 color = texture2D(uSampler, vec2(vUv.s, vUv.t)).xyz*0.5;

            //Le sumo las contribuciones de la ambiente, difusa y especular respectivamente
            float factorDifuso=max(0.8,dot(vNormal,lightVec)*1.1);
            //color+=uAmbientColor;
            /*color+=0.3*factorDifuso*max(dot(vNormal,lightVec), 0.0);
            color+=uDirectionalColor2*pow(max(dot(vNormal, lightVec), 0.0),64.0);*/

            vec3 vectorReflectado = reflect(pos_camera_view, vNormal);
            float r=sqrt(pow(vectorReflectado.x,2.0)+pow(vectorReflectado.y,2.0)+pow(vectorReflectado.z,2.0));
            float alfa=atan(2.0*vectorReflectado.x/vectorReflectado.z);
            float beta=acos(vectorReflectado.y/r);
            
            vec3 colorRefleccion = texture2D(uSamplerReflectionMap, vec2(alfa/2.0, beta/2.0)).xyz*0.5;
            /*colorRefleccion+=uAmbientColor;
            colorRefleccion+=0.3*factorDifuso*pow(max(dot(pos_camera_view,lightDirection2), 0.0),64.0);*/

            //gl_FragColor = vec4(mix(color, colorRefleccion, 0.5).rgb, 1.0);
            gl_FragColor = vec4(color + colorRefleccion, 1.0);
        }