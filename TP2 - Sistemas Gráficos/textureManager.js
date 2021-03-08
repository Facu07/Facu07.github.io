var fila_parcelas = 12
var lado_parcela = 12

class TextureManager {

	constructor(parcela) {

        this.textures = [];
        this.reflectiveTexture = null;
        this.useReflection = false;
        this.arrayParcelas = []

	}

    initParcelas = function(latitude_bands, longitude_bands, shaderProgram, y){

        for (var i = 0; i < fila_parcelas; i ++) {
            var temp = []
            for (var j = 0; j < fila_parcelas; j++) {
                var parcela = new Earth(latitude_bands, longitude_bands, shaderProgram);
                parcela.initBuffers(i,j,y)
                temp.push(parcela);
            }
            this.arrayParcelas.push(temp);
        }

    }

 	initTexture = function(texture_file){
            
        var texture = gl.createTexture();
        texture.image = new Image();

        this.textures.push(texture);

        texture.image.onload = function () {
               //onTextureLoaded()
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
    
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        texture.image.src = texture_file;
    }

    initReflectionTexture = function(texture_file){
        var aux_texture = gl.createTexture();
        aux_texture.image = new Image();
        this.reflectiveTexture = aux_texture;
        this.useReflection = true;
        aux_texture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, aux_texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, aux_texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        aux_texture.image.src = texture_file;
        this.reflectiveTexture = aux_texture;
    }

    estaEnRango = function(k,w){
       if((k > 0 && k < fila_parcelas) && (w > 0 && w < fila_parcelas)){
            return true
       }
    }

    dibujarAlrrededor = function(i, j){

                   
        if(this.estaEnRango(i,j)){
            this.arrayParcelas[i][j].draw(this.textures, this.reflectiveTexture, this.useReflection);
        }
    }


    dibujar = function(x,z){

        var tempi = Math.floor((x / lado_parcela) +lado_parcela)
        var tempj = Math.floor((z / lado_parcela) +lado_parcela)

        for (var i = tempi; i <= tempi + 4; i++) {
            for (var j = tempj; j <= (tempj+4); j++){
                this.dibujarAlrrededor(i,j)
            }
        }
    }


    
}