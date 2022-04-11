<style><link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css" rel="stylesheet" type="text/css" /></style>

<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<input type="hidden" id="linkDeControladorCategoria" value="{$linkDeControladorCategoria}"/>
<input type="hidden" id="linkDeControladorTalla" value="{$linkDeControladorTalla}"/>
<input type="hidden" id="linkDeControladorColor" value="{$linkDeControladorColor}"/>
<input type="hidden" id="linkDeControladorGaleria" value="{$linkDeControladorGaleria}"/>

<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<div id="contenedorAlerta"></div>

<div class="custom_bootstrap">

<div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-md">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title" id="staticBackdropLabel">Fotos de galeria</h2>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="galeriaFotosProductos" style="display: flex;flex-wrap: wrap;flex-direction: row;justify-content: space-evenly;">

      </div>
      <div id="modalFooter" class="modal-footer">

      </div>
    </div>
  </div>
</div>



<!-- vista-inicial-filtros -->
<!-- vista-inicial -->
<div class="vista-1" id="vista-inicial">
	<!-- mode_search -->
	<div class="wrapp_content">
		<div class="panel mode_search">
			<h3 class="panel-heading panel-heading-top">Buscar producto
			</h3>
			<div class="row">
				<div class="col-xs-12">
					<div class="col-xs-12">
						<div class="col-lg-6 tree_custom">
							<div class="row">
								<label class="control-label col-lg-12">
                                    Seleccione categoría de búsqueda
								</label>
                                <select multiple class="class-select form-control" id="categoriaProducto" name="categoriaProducto">
                                    <option value="null">Seleccione Una Categoria</option>
                                    {foreach $categoriasProductos as $categoria}
                                        <option value="{$categoria["id_category"]}">{$categoria["name"]}</option>
                                    {/foreach}
                                </select>
                            </div>
                            <div class="row">
                                <label class="control-label col-lg-12">
                                    Total de resultados encontrados: <span id="totalResultados">0</span>
                                </label>
                            </div>
						</div>

						<!-- search-products -->
						<div class="col-lg-6 search-products">
							<div class="row">
								<div class="col-sm-12 alignitem-tb">
									<label class="control-label search-prod margin-right">
										Buscar producto
									</label>
								</div>
								<div class="col-xs-12 form-group form-group-lg" style="margin-bottom: 0 !important;">
									<div class="col-sm-9 p-0">
										<input  type="text" class="form-control" id="nombreProducto" name="nombreProducto" placeholder="Buscar por nombre de producto"/>
									</div>
								</div>
								<label class="control-label col-xs-12 mt">
                                    Búsqueda por fabricante
								</label>
								<div class="col-xs-12">
                                    <select multiple class="class-select form-control" id="marcaProducto" name="marcaProducto">
                                        <option value="null">Seleccione Un Fabricante</option>
                                        {foreach $marcasProductos as $marca}
                                            <option value="{$marca["id_manufacturer"]}">{$marca["name"]}</option>
                                        {/foreach}
                                    </select>
								</div>
                                <!--
								<label class="control-label col-lg-12 mt">
                                    Búsqueda por proveedor
								</label>
								<div class="col-lg-12">
                                    <select id='' name=''>
                                            <option value="">Accessories suppller</option>
                                            <option value="">Fashion suppller</option>
                                    </select>
								</div>
                                -->

								<!-- Search by creation date -->

                                <div class="col-sm-12 mt">
									<label class="control-label">
                                        Cuántos productos a mostrar por pagina?
									</label>
									<select id='numeroDeProductos' name=''>
										<option value="5">5</option>
										<option value="10">10</option>
										<option value="15">15</option>
										<option value="20">20</option>
										<option value="25">25</option>
										<option value="30">30</option>
										<option value="35">35</option>
										<option value="40">40</option>
										<option value="45">45</option>
										<option value="50">50</option>
										<option value="55">55</option>
										<option value="60">60</option>
										<option value="65">65</option>
										<option value="70">70</option>
										<option value="75">75</option>
										<option value="80">80</option>
										<option value="85">85</option>
										<option value="90">90</option>
										<option value="95">95</option>
										<option value="100">100</option>
									</select>
								</div>
							</div>
						</div>
						<div class="col-lg-12 control_btn">
                            <div class="centrar-columnas" style="margin-bottom: 30px;margin-top: 60px;">
                                <button id="botonFiltroProducto" class="btn btn-default">
                                    Buscar producto
                                </button>

                                <button style="margin-left:10px;" id="botonIrHaformulario" class="btn btn-success" disabled>
                                    ir a formulario
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<!--
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Siglas Moneda</label>\
                            <input id="'+codigoIdPaisIdproducto+'_moneda" type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="moneda" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
-->







<!-- vista-form -->
<div class="vista-form-productos" id="vista-form-productos" style="opacity:0;">
    <button class="btn btn-primary" id="botonIrHaVistaInicial" style="margin-bottom: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
    </button>
    <!-- radios paises productos -->

    <div class="slider-pais-productos" id="slider-productos" style="width: 100%; position: relative; overflow: hidden;">
       
    </div>
    <div id="paisesFormularioProducto">
    
    </div>



    <div class="panel mode_search" style="display: inline-block; width: 100%;">
        <h3 class="panel-heading">Producto de búsqueda Resultado<span id="count_result" class="badge">#</span></h3>
        <div class="row">
            <div class="col-sm-2">
                <button class="btn btn-primary" id="botonEdicionGlobal">aplicar edicion global</button>
            </div>
        </div>
        <div id="formTablaProductos">
            <div style="display: flex;margin-bottom:30px;">
                <div class="col-sm-2">
                    <label class="control-label col-xs-12 mt" style="width: auto; min-width: 100px;padding-right: 0 !important;">
                        Brand
                    </label>
                    <div class="col-xs-12">
                        <select class="m-0" id='edicionGlobalBrandCode'></select>
                    </div>
                </div>
                <div class="col-sm-2">
                    <label class="control-label col-xs-12 mt" style="width: auto; min-width: 100px;padding-right: 0 !important;">
                        Season
                    </label>
                    <div class="col-xs-12">
                        <select class="m-0" id='edicionGlobalSeasonCode'></select>
                    </div>
                </div>
                <div class="col-sm-2">
                    <label class="control-label col-xs-12 mt" style="width: auto; min-width: 100px;padding-right: 0 !important;">
                        Color
                    </label>
                    <div class="col-xs-12">
                        <select class="m-0" id='edicionGlobalColor'></select>
                    </div>
                </div>
                <div class="alignitem-tb flex-wrap col-sm-3">
                    <label class="control-label col-xs-12 mt" style="width: auto; min-width: 140px;padding-right: 0 !important;">
                        Target Age Groups
                    </label>
                    <div class="col-xs-12">
                        <select class="class-select m-0" id='edicionGlobalTargetAgeGroups' multiple></select>
                    </div>
                </div>
                <div class="alignitem-tb flex-wrap col-sm-3">
                    <label class="control-label col-xs-12 mt" style="width: auto; min-width: 140px;padding-right: 0 !important;">
                        Target Genders
                    </label>
                    <div class="col-xs-12">
                        <select class="class-select m-0" id='edicionGlobalTargetGenders' multiple></select>
                    </div>
                </div>
            </div>


            <div class="p-20">
                <div class="modal-header" style="display: flex;">
                    <div class="col-xs-1" style="font-size: 14px;">No enviar</div>
                    <div class="col-xs-1" style="font-size: 14px;">Imagen</div>
                    <div class="col-xs-1" style="font-size: 14px;">Nombre</div>
                </div>
            </div>
            
            <div id="listaDeProductosForm">
            
            </div>
            <div class="justify-end-flex well-lg col-lg-12 col-xs-11">
                <button  class="btn btnVistaOne btn-primary" id="botonIrHaVistaBorrarProductos">
                    Guardar
                </button>
            </div>

        </div>
            
        </div>
<div id="controlesPaginacion"></div>
</div>















<!-- vista-borrar-productos -->
<div class="vista-2" id="vista-borrar-productos" style="width: 100%;opacity:0;">

    <button class="btn btn-primary" id="botonIrHaVistaFormularioProductos" style="margin-bottom: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
    </button>
    <!--
    <div class="col-12" style="position: relative;padding: 20px 0px;">
        <a href="#" class="btnVistaTwo btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
            <strong style="padding: 0px 15px;">Regresar</strong>
        </a>
    </div>
    -->
    
    <div class="panel" style="display: block;width: 100%;">    
        <div class="slider-pais-borrar" id="slider-dos" style="width: 100%; position: relative; overflow: hidden;">
            
        </div>
        <div id="paisesBorrarProducto">

        </div>

        <div style="display: flex;flex-wrap: wrap;">
            <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 modal-header p-20"> 
                <div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-2 txt-title">
                    <label>Productos</label>
                </div>
               <!--
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
               -->
                <div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xs-1 text-center txt-title">
                </div>
            </div>
            <div id="listaDeProductosHaBorrar" style="width: 100%;">
            </div>
        </div>
        
        <div id="controlesPaginacion"></div>

        <div class="well-lg is-relative">
            <button class="btn btn-primary is-absolute" id="botonEnviarPoductos">
                enviar productos
            </button>
        </div>
    </div>
</div>

<div id="consoleHtml"></div>
 
<div id="preloader" class="col-12 fat-pre">
    <div class="pre-loader">
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>

<script type="text/javascript" src="/modules/wbzalando/views/js/librerias/moment.js"></script>
<script type="text/javascript" src="/modules/wbzalando/views/js/librerias/owl.carousel.js"></script>
<script type="text/javascript" src="/modules/wbzalando/views/js/producto.js"></script>


<script>
/*

    var thisBtn = document.querySelector('#resultbtns')
    thisBtn.addEventListener('click', (e) => {
        var btnthis = document.querySelector('#resultThis')
        e.preventDefault()
        btnthis.classList.add('active');
        thisBtn.style.display = 'none';
        thisBtns.style.display = 'block';
    });

    var thisBtns = document.querySelector('#resultbtns2')
    thisBtns.addEventListener('click', (e) => {
        var btnthisth = document.querySelector('#resultThis')
        e.preventDefault()
        btnthisth.classList.remove('active');
        thisBtns.style.display = 'none';
        thisBtn.style.display = 'block';
    });



    
   

    var vistaOne = document.querySelector('.vista-1')
    var btnVistaOne = document.querySelector('.btnVistaOne')
    var vistaTwo = document.querySelector('.vista-2')
    var btnVistaTwo = document.querySelector('.btnVistaTwo')

    window.onload = function(){
        if(vistaTwo){ 
            vistaTwo.style.display = 'none';
        }
    }

    btnVistaOne.addEventListener('click', (e) => {
        e.preventDefault()
        vistaTwo.style.display = 'block';
        vistaOne.style.display = 'none';
    });

    btnVistaTwo.addEventListener('click', (e) => {
        e.preventDefault()
        vistaTwo.style.display = 'none';
        vistaOne.style.display = 'block';
    });
  
*/
</script>