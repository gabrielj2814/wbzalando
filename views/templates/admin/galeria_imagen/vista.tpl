<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<div id="contenedorAlerta"></div>

<div class="panel">
    <form id="formulario_imagen" style="display:none;">\
        <input type="file" id="files_imagen" name="imagenProducto[]" accept="image/png, image/jpeg" multiple>
    </form>
    <div class="row" style="margin-bottom:30px;">
        <form id="imagensTmp">
        
        
        </form>
        <input type="hidden" id="nombre_tmp" name="nombre_tmp" data-nombre-tmp="" data-extencion=""/>
        <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
            <label for="files_imagen" class="btn btn-primary" id="">Subir Imagen</label>
        </div>
        <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
            <button class="btn btn-primary" id="cargarImagen" onClick="cargarImagenProducto(this)">Cargar imagen</button>
        </div>
        <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
            <button class="btn btn-primary" id="" onClick="guardarImagen(this)">Guardar</button>
        </div>
    </div>
    <div class="row">
        <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
            <div>total de imagenes subidas <span id="imagenesTotalesSubidas">0</span>/<span id="totalDeImagenesHaSubir">0</span></div>
        </div>
    </div>
    <div class="row">
        <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <img id="imagen" src="" alt="" style="display:none;height: 400px;width: 300px;"/>
        </div>
    </div>
</div>

<div class="panel">
    <div style="">
        <!-- sel le agrego el max-width: 1100px; para centrar el contenedor teniendo en cuenta que cada colunna de imagen tiene un ancho de 200 mas dos margenes de 10 dando un total de 210 por imagene que 210 x 5 es igual a 1100px -->
        <div class="row" id="filaImagenProducto" style="display: flex;flex-wrap: wrap;flex-direction: row;max-width: 1100px;margin-left: auto;margin-right: auto;">

        </div>
    </div>


</div>


<div class="col-12 fat-pre"  id="preloader">
    <div class="pre-loader">
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>
<script type="text/javascript" src="/modules/wbzalando/views/js/librerias/moment.js"></script>
<script type="text/javascript" src="/modules/wbzalando/views/js/galeria.js"></script>