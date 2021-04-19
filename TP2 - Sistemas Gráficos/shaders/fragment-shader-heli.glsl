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
                 

        uniform bool uUseReflection;        // usar refleccion si/no
        uniform bool uUseColor;             // usar color si/no
        uniform bool uUsePhong;             // uso phong si/no

        uniform sampler2D uSampler;
        uniform sampler2D uSamplerReflectionMap;

        // constantes        
        const float PI=3.141592653;

        void main(void) {

            vec3 lightDirection= normalize(uLightPosition - vec3(vWorldPosition));
            vec3 lightDirection2= normalize(uLightPosition2 - vec3(vWorldPosition));

            //vec3 textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t)).xyz;
            vec3 textureColor = texture2D(uSampler, vec2(Position.y/4.0+100.0, Position.x/6.0)).xyz*0.5;

            vec3 vectorReflectado = reflect(pos_camera_view, N);
            float r=sqrt(pow(vectorReflectado.x,2.0)+pow(vectorReflectado.y,2.0)+pow(vectorReflectado.z,2.0));
            float alfa=atan(vectorReflectado.x/vectorReflectado.z);
            float beta=acos(vectorReflectado.y/r);
            
            vec3 colorRefleccion = texture2D(uSamplerReflectionMap, vec2(alfa, beta)).xyz;

            vec3 color = vec3(0,0,0);
            color.x=RGB.x;
            color.y=RGB.y;
            color.z=RGB.z;

            vec3 lightVec = vec3(-1.0,1.0,-1.0);
            // color difuso
            float factorDifuso=max(0.5,dot(N,lightVec)*1.1);
            color+=uAmbientColor;
            color+=0.2*factorDifuso*max(dot(N,lightVec), 0.0);
            color+=uDirectionalColor2*pow(max(dot(N,lightDirection2), 0.0),64.0);

            vec3 iluminacion =uAmbientColor;
            iluminacion+=factorDifuso*max(dot(N,lightDirection), 0.0);
            iluminacion+=uDirectionalColor2*max(dot(N,lightDirection2), 0.0);
            //Especular
            vec3 specularColor = vec3(0.0,0.0,0.0);

            // Calculate the reflection vector
            //vec3 reflection = 2.0 * dot(vNormal,lightDirection) * vNormal - lightDirection;
            vec3 reflection = reflect(-lightDirection,vNormal);

            // Calculate a vector from the fragment location to the camera.
            // The camera is at the origin, so negating the vertex location gives the vector
            vec3 to_camera = -1.0 * vWorldPosition;

            // Calculate the cosine of the angle between the reflection vector
            // and the vector going to the camera.
            reflection = normalize(reflection);
            to_camera = normalize(to_camera);
            float specularStrength = 1.0;
            float specularComponent = dot(to_camera, reflection);
            specularComponent = max(specularComponent, 0.0);
            specularComponent = pow(specularComponent, 128.0);

            if(specularComponent > 0.0){
            specularColor = vec3(1.0,1.0,1.0) * specularComponent * specularStrength;
            } else {
            specularColor = vec3(0.0, 0.0, 0.0);
            }
            iluminacion+=specularColor;

            // Utilizo color o textura
            if (uUseColor){
                gl_FragColor = vec4(color,1.0);
            }
            else{
                gl_FragColor = vec4(textureColor+iluminacion,1.0);
            }
            if(uUseReflection){
                gl_FragColor = vec4(textureColor+iluminacion+colorRefleccion*0.3,1.0);
                //gl_FragColor = vec4(mix(textureColor, colorRefleccion, 0.5).rgb, 1.0);
            }

            //gl_FragColor = vec4(N,1.0);
            
        }