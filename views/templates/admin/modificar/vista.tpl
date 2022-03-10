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
            <div class="col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11 col-xs-11 txt-title">
                <label>Productos</label>
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

<div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-md">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title" id="staticBackdropLabel">Detalles del Producto</h2>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="formularioDatosProductos">
        <div class="row">
            <div class="form-group col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style="font-size:1.2rem;">
                Nombre: <span id="nombreDelProductoDetalle" class="text-primary">Nombre</span>
            </div>
        </div>
       <div id="preciosProducto">
       
            <div class="row">
                <div class="form-group col-md-4">
                    <label for="">Precio Regular</label>
                    <input type="text" class="form-control" >
                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-4">
                    <label for="">Precio Descuento</label>
                    <input type="text" class="form-control" >
                </div>
                <div class="form-group col-md-4">
                    <label for="">Fecha Inicio Descuento</label>
                    <input type="date" class="form-control" >
                </div>
                <div class="form-group col-md-4">
                    <label for="">Fecha Final Descuento</label>
                    <input type="date" class="form-control" >
                </div>
            </div>
       
       </div>
        <div class="row">
            <div class="form-group col-md-4">
                <label for="">Talla</label>
            </div>
            <div class="form-group col-md-3">
                <label for="">Stock</label>
            </div>
        </div>
        <div id="tallasStock">
            <div class="row" >
                <div class="form-group col-md-4" style="margin-bottom: 0px;padding-top: 10px;">
                    X
                </div>
                <div class="form-group col-md-3">
                    <input type="text" class="form-control" >
                </div>
            </div>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary">Guardar</button>
      </div>
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
<script type="text/javascript" src="/modules/wbzalando/views/js/modificar.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"></script>
<script>