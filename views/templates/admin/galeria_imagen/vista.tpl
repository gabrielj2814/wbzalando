<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<div id="contenedorAlerta"></div>

<div class="panel">
    <form id="formulario_imagen" style="display:none;">\
        <input type="file" id="files_imagen" name="imagenProducto" accept="image/png, image/jpeg" >
    </form>
    <div class="row" style="margin-bottom:30px;">
        <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <input type="text" id="nombre_imagen_db" name="nombre_imagen_db" placeholder="Nombre de la imagen"/>
            <input type="hidden" id="nombre_tmp" name="nombre_tmp" data-nombre-tmp="" data-extencion=""/>
        </div>
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
        <div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <img id="imagen" src="" alt="" style="display:none;height: 400px;width: 300px;"/>
        </div>
    </div>
</div>

<div class="panel">
    <div class="row" id="filaImagenProducto" style="display: flex;flex-wrap: wrap;flex-direction: row;justify-content: space-evenly;">

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