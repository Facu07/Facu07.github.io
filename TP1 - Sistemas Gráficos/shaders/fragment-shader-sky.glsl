precision mediump float;

    varying vec4 vTextureCoord;
    varying vec3 vPosition;
    varying vec3 vmPosition;
    varying vec3 vNormal;
    varying vec3 vTangent;
    varying vec3 vBinormal;

    varying float vUseReflection;
    uniform bool uUseColor;
    uniform bool uUseNormal;
    uniform bool uUseIlumination;
    uniform float uIluminationIntensity;

    uniform vec3 uCameraPosition;
    varying vec3 light_dir_normalized;
    varying vec3 view_dir_normalized;

    uniform sampler2D uSampler;
    uniform sampler2D uSamplerReflectionMap;
    uniform sampler2D uSamplerNormalMap;
    uniform sampler2D uSamplerIluminationMap;

    uniform vec3 uAmbientColor;
    uniform bool uUseLighting;
    uniform bool uUsePunctualLights;

    // Sol: Direccional
    uniform vec3 uPrincipalLightDirection;
    uniform vec3 uPrincipalDiffuseColor;
    uniform vec3 uPrincipalSpecularColor;
    uniform float uPrincipalLightIntensity;

    void main(void) {
        
        // Calculos de la iluminación
        // Sol
        /*vec3 dir_luz_norm = normalize(uPrincipalLightDirection - vmPosition);
        vec3 dir_vista_norm = normalize(uCameraPosition - vmPosition);
        vec3 halfVector = normalize(dir_luz_norm + dir_vista_norm);

        vec3 lightDir = uPrincipalLightDirection;
        vec3 lightDirNormalized = normalize(lightDir);
        float diffusePrincipalLightWeighting = max(dot(lightDirNormalized,normal), 0.0);
        float specularPrincipalLightWeighting = pow(max(dot(normal, halfVector),0.0),64.0);*/

        vec3 lightDirection= normalize(uLightPosition - vec3(vWorldPosition));
        vec3 lightDirection2= normalize(uLightPosition2 - vec3(vWorldPosition));

        vec3 color = texture2D(uSampler, vec2(vUv.s, vUv.t)).xyz;

        color+=uAmbientColor;
        color+=uDirectionalColor*max(dot(vNormal,lightDirection), 0.0);
        color+=uDirectionalColor2*max(dot(vNormal,lightDirection2), 0.0);  

        /*vec3 vectorReflectado = reflect(vectorObjetoHastaCamara, -vNormal);
        float r=sqrt(pow(vectorReflectado.x,2.0)+pow(vectorReflectado.y,2.0)+pow(vectorReflectado.z,2.0));
        float alfa=atan(vectorReflectado.y/vectorReflectado.x);
        float beta=acos(vectorReflectado.z/r);
        
        vec3 colorRefleccion = texture2D(uSamplerReflectionMap, vec2(alfa, beta)).xyz;*/

        gl_FragColor = vec4(color,1.0);
     

    }