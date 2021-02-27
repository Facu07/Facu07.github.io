function discretizadorDeCurvas(curva, cant) {
	var curvaDiscreta = [];
	for (var i = 0; i <= cant; i++) {
		curvaDiscreta.push(curva.evaluar(i/cant));
	}
	return curvaDiscreta;
}

function discretizadorDeRecorrido(curva, cant) {
    var matrices = [];
    for (var i = 0; i <= cant; i++) {

        var normal = curva.normal(i/cant);
        var tangente = curva.tangente(i/cant);
        var binormal = vec3.create();
        vec3.cross(binormal, normal, tangente);

        var m = mat3.fromValues(...normal,...binormal,...tangente);
        matrices.push(m);
    }
    return matrices;
}


function discretizadorNormal(curva, deltaU) {
	var normales = [];
	for (var i = 0; i <= 1; i += deltaU) {
		normales.push(curva.normal(i));
	}
	return normales;
}


class CurvaBezier {

	constructor(puntos) {
		this.puntos = puntos;
		this.n = puntos.length;
		this.anteriorNormal = vec3.zero(vec3.create());
	}

	binomial(m, k) {
	    var coeff = 1;
	    for (var x = m-k+1; x <= m; x++) coeff *= x;
	    for (x = 1; x <= k; x++) coeff /= x;
	    return coeff;
	}

	baseBern(i, t, m)  {
		return this.binomial(m, i) * Math.pow(1 - t, m - i) * Math.pow(t, i);
	}

    prodVectorial(vecA, vecB) {
        var x = vecA[1] * vecB[2] - vecA[2] * vecB[1];
        var y = vecA[2] * vecB[0] - vecA[0] * vecB[2];
        var z = vecA[0] * vecB[1] - vecA[1] * vecB[0];
        return [x,y,z];
	}
	
	prodVectorialNormal(vecA, vecB) {
		var vecC = this.prodVectorial(vecA, vecB);
		var x = vecC[0];
        var y = vecC[1];
        var z = vecC[2];
		var norm = Math.sqrt([x,y,z].flatMap(x=>Math.pow(x,2)).reduce((a,b) => a+b, 0));
		norm = norm == 0 ? 1 : norm;
		return [x/norm, y/norm, z/norm];
	}

	normal(t) {

 		var punto1 = this.tangente(t);
		var punto2 = this.tangente(t + 0.01);
		var result = this.prodVectorial(punto1, punto2);

		if (vec3.squaredLength(result) == 0) {
            result = [1,0,0];
        	var aux = this.prodVectorial(result, punto1);
            if (vec3.squaredLength(aux) == 0) {
                result = [0,1,0]; 
            }
        }

		if (vec3.squaredLength(this.anteriorNormal) != 0){
            var a = vec3.angle(this.anteriorNormal, result);
            var err = Math.abs(1*Math.PI - a);
            if (err <= 0.5*Math.PI){
                vec3.scale(result,result,-1);
            }
        }

		this.anteriorNormal = result;

		return result;
	}

	tangente(t) {
		var sum = [0, 0, 0];
		for (var i = 0; i < this.n - 1; i++) {
			sum[0] += (this.n-1) * this.baseBern(i, t, this.n - 2) * (this.puntos[i+1][0] - this.puntos[i][0]);
			sum[1] += (this.n-1) * this.baseBern(i, t, this.n - 2) * (this.puntos[i+1][1] - this.puntos[i][1]);
			sum[2] += (this.n-1) * this.baseBern(i, t, this.n - 2) * (this.puntos[i+1][2] - this.puntos[i][2]);
		}
		var x = sum[0];
        var y = sum[1];
        var z = sum[2];
		var norm = Math.sqrt([x,y,z].flatMap(x=>Math.pow(x,2)).reduce((a,b) => a+b, 0));
		norm = norm == 0 ? 1 : norm;
		return [x/norm, y/norm, z/norm];
	}

	evaluar(t) {
		var sum = [0, 0, 0];
		for (var i = 0; i < this.n; i++) {
			sum[0] += this.baseBern(i, t, this.n-1) * this.puntos[i][0];
			sum[1] += this.baseBern(i, t, this.n-1) * this.puntos[i][1];
			sum[2] += this.baseBern(i, t, this.n-1) * this.puntos[i][2];
		}
		return sum;
	}

	binormal(t) {
		var normal = this.normal(t);
		var tangente = this.tangente(t);

		return this.prodVectorialNormal(tangente, normal);
	}

	matrizNormal(t) {
		var matriz = [
			[0,0,0],
			[0,0,0],
			[0,0,0]
		]

		var normal = this.normal(t);
		var tgn = this.tangente(t);
		var binormal = this.binormal(t);

		for (let i = 0; i < matriz.length; i++) {
			matriz[i][0] = normal[i];
			matriz[i][1] = binormal[i];
			matriz[i][2] = tgn[i];
		}

		return matriz;
	}

}
