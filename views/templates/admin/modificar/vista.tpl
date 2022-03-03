<style><link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css" rel="stylesheet" type="text/css" /></style>
<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<input type="hidden" id="linkDeControladorProducto" value="{$linkDeControladorProducto}"/>


<div class="panel">
    
    <div class="slider-pais" id="slider-paises" style="width: 100%; position: relative;">
       
    </div>
    <div id="paisesRadio">
    
    </div>
    <div class="col-12" style="display: flex;">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 caj-product modal-header p-20"> 
            <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-2 txt-title">
                <label>Productos</label>
            </div>
            <div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xs-1 text-center txt-title">
                <label>Stock</label>
            </div>
            <div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xs-1 text-center txt-title">
                <label>Moneda</label>
            </div>
            <div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xs-1 text-center txt-title">
                <label>Precio</label>
            </div>
            <div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xs-1 text-center txt-title">
                <label>Descuento</label>
            </div>
            <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-2 text-center txt-title">
                <label>Fecha de inicio descuento</label>
            </div>
            <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-2 text-center txt-title">
                <label>Fecha de final descuento</label>
            </div>
            <div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xs-1 text-center txt-title">
            </div>
        </div>
    </div>
    <div id="listaDeProductosHaEliminar">

    </div>

    <div id="controlesPaginacion"></div>

    <div class="justify-end-flex well-lg" >
        <button id="" class="btn btn-primary"  id="guardarModificaciones" onClick="guardarModificaciones()">
            Guardar
        </button>
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
<script type="text/javascript" src="/modules/wbzalando/views/js/modificar.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"></script>
<script>