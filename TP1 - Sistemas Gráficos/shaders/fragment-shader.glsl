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
        const vec4 Ka= vec4( 0.2, 0.2, 0.2, 1.0);
        const vec4 Kd= vec4( 0.2, 0.2, 0.2 ,1.0);
        const vec4 Ks= vec4( 1.0, 1.0, 1.0, 1.0);
        const vec4 La= vec4( 0.2, 0.2, 0.2, 1.0);
        const vec4 Ld= vec4( 0.2, 0.2, 0.2 ,1.0 );
        const vec4 Ls= vec4( 1.0, 1.0, 1.0, 1.0 );           
                 

        uniform bool uUseReflection;        // usar refleccion si/no
        uniform bool uUseColor;             // usar color si/no
        uniform bool uUsePhong;             // uso phong si/no

        uniform sampler2D uSampler;
        uniform sampler2D uSamplerReflectionMap;

        const float alfa = 0.6;

        vec4 phong (vec3 N, vec3 L, vec3 V){
            vec4 ambient = Ka*La;
            vec4 diffuse = vec4(0.0);
            vec4 specular= vec4(0.0);
            float NdotL=dot(N,L);
            if(NdotL>0.0){
                vec3 R =normalize(2.0*N*NdotL-L);
                float RdotVn=pow(max(0.0,dot(R,V)),alfa);
                diffuse=NdotL*(Ld*Kd);
                specular=RdotVn*(Ls*Ks);
            }
            return(ambient+diffuse+specular);
        }


        void main(void) {


            vec3 n = normalize(N);
            vec3 L = vec3(normalize(vec3(500.0,300.0,-500.0) - Position));
            vec3 V = normalize(vec3(-Position));
            vec4 prueba = phong(n, L, V);

            vec3 lightDirection= -normalize(uLightPosition - vec3(vWorldPosition));
            vec3 lightDirection2= -normalize(uLightPosition2 - vec3(vWorldPosition));

            vec3 textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t)).xyz;

            textureColor+=uAmbientColor;
            textureColor+=uDirectionalColor*max(dot(vNormal,lightDirection), 0.0);
            textureColor+=uDirectionalColor2*pow(max(dot(vNormal,lightDirection2), 0.0),32.0);

            vec3 vectorReflectado = reflect(pos_camera_view, vNormal);
            float r=sqrt(pow(vectorReflectado.x,2.0)+pow(vectorReflectado.y,2.0)+pow(vectorReflectado.z,2.0));
            float alfa=atan(vectorReflectado.y/vectorReflectado.x);
            float beta=acos(vectorReflectado.z/r);
            
            vec3 colorRefleccion = texture2D(uSamplerReflectionMap, vec2(alfa, beta)).xyz*0.3;

            vec3 color = vec3(0,0,0);
            color.x=RGB.x;
            color.y=RGB.y;
            color.z=RGB.z;

            color+=uAmbientColor;
            color+=uDirectionalColor*max(dot(vNormal,-lightDirection), 0.0);
            color+=uDirectionalColor2*pow(max(dot(vNormal,-lightDirection2), 0.0),32.0);

            textureColor+=uAmbientColor;
            textureColor+=uDirectionalColor*max(dot(vNormal,-lightDirection), 0.0);
            textureColor+=uDirectionalColor2*pow(max(dot(vNormal,-lightDirection2), 0.0),32.0);

            // color difuso
            float factorDifuso=max(0.8,dot(vNormal,uDirectionalColor)*1.1);

            // Utilizo color o textura
            if (uUseColor)
                gl_FragColor = vec4(color,1.0);
            else
                gl_FragColor = vec4(textureColor*factorDifuso,1.0);

            if(uUseReflection){
                //gl_FragColor = vec4(textureColor+colorRefleccion,1.0);
                gl_FragColor = vec4(mix(textureColor*2.0, colorRefleccion, 0.5).rgb, 1.0);
            }
            if(uUsePhong){
                gl_FragColor += prueba*0.5;
                //gl_FragColor = vec4(mix(textureColor*2.0, colorRefleccion, vec3(prueba)).rgb, 1.0);
            }
            
        }