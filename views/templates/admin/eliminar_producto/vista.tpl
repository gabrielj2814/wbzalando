<style><link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css" rel="stylesheet" type="text/css" /></style>
<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<input type="hidden" id="linkDeControladorProducto" value="{$linkDeControladorProducto}"/>


<div class="panel">
    
    <div class="slider-pais" style="width: 100%; position: relative;">
        <div class="">
            <button id="botonRegistrar" class="btn btn-primary">
                España
            </button>
        </div>
        <div class="">
            <button id="botonRegistrar" class="btn btn-primary">
                EEUU
            </button>
        </div>
        <div class="">
            <button id="botonRegistrar" class="btn btn-primary">
                Germany
            </button>
        </div>
        <div class="">
            <button id="botonRegistrar" class="btn btn-primary">
                France
            </button>
        </div>
        <div class="">
            <button id="botonRegistrar" class="btn btn-primary">
                España
            </button>
        </div>
        <div class="">
            <button id="botonRegistrar" class="btn btn-primary">
                EEUU
            </button>
        </div>
    </div>
    <div id="paisesRadio">
    
    </div>
    <div class="col-12" style="display: flex;">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 modal-header p-20"> 
            <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-2 txt-title">
                <label>Productos</label>
            </div>
            <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-2 text-center txt-title">
                <label>stock</label>
            </div>
            <div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xs-1 text-center txt-title">
                <label>Precio</label>
            </div>
            <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-2 text-center txt-title">
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
</div>

<div id="controlesPaginacion"></div>
<div class="col-12 fat-pre"  id="preloader">
    <div class="pre-loader">
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>
<script type="text/javascript" src="/modules/wbzalando/views/js/eliminar.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"></script>
<script>
    $('.slider-pais').slick
    ({
        infinite: true,
        prevArrow: '<span class="prev-arrow btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg></span>',
        nextArrow: '<span class="next-arrow btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></span>',
        slidesToShow: 5,
        slidesToScroll: 1
    });
</script>