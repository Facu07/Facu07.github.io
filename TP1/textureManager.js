var fila_parcelas = 12
var lado_parcela = 12

class TextureManager {

	constructor(parcela) {

        this.texture = null;

        this.arrayParcelas = []

	}

    initParcelas = function(latitude_bands, longitude_bands){

        for (var i = 0; i < fila_parcelas; i ++) {
            var temp = []
            for (var j = 0; j < fila_parcelas; j++) {
                var parcela = new Earth(latitude_bands, longitude_bands);
                parcela.initBuffers(i,j)
                temp.push(parcela);
            }
            this.arrayParcelas.push(temp);
        }

    }

 	initTexture = function(texture_file){
            
        this.texture = gl.createTexture();
        this.texture.image = new Image();

        this.texture.image.onload = function () {
               //onTextureLoaded()
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, textureManager.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureManager.texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
    
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.texture.image.src = texture_file;
    }

    estaEnRango = function(i,j){
       if((i >= 0 && i < fila_parcelas) && (j >= 0 && j < fila_parcelas)){
            return true
       }
    }

    dibujarAlrrededor = function(i, j){

        if(this.estaEnRango(i,j)){
            this.arrayParcelas[i][j].draw(this.texture);
        }            
        if(this.estaEnRango(i+1,j)){
            this.arrayParcelas[i+1][j].draw(this.texture);
        }
        if(this.estaEnRango(i,j+1)){
            this.arrayParcelas[i][j+1].draw(this.texture);
        }
        if(this.estaEnRango(i+1,j+1)){
            this.arrayParcelas[i+1][j+1].draw(this.texture);
        }
        if(this.estaEnRango(i+2,j)){
            this.arrayParcelas[i+2][j].draw(this.texture);
        }
        if(this.estaEnRango(i,j+2)){
            this.arrayParcelas[i][j+2].draw(this.texture);
        }
        if(this.estaEnRango(i+1,j+2)){
            this.arrayParcelas[i+1][j+2].draw(this.texture);
        }
        if(this.estaEnRango(i+2,j+1)){
            this.arrayParcelas[i+2][j+1].draw(this.texture);
        }
        if(this.estaEnRango(i+2,j+2)){
            this.arrayParcelas[i+2][j+2].draw(this.texture);
        }
    }


    dibujar = function(x,z){

        var tempi = Math.abs(Math.floor((x / lado_parcela) +lado_parcela))
        var tempj = Math.abs(Math.floor((z / lado_parcela) +lado_parcela))


        for (var i = tempi; i < tempi + 12; i++) {
            for (var j = tempj; j < (tempj+12); j++){
                this.dibujarAlrrededor(i,j)
            }
        }
    }


    
}