<style><link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css" rel="stylesheet" type="text/css" /></style>

<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<input type="hidden" id="linkDeControladorCategoria" value="{$linkDeControladorCategoria}"/>
<input type="hidden" id="linkDeControladorTalla" value="{$linkDeControladorTalla}"/>
<input type="hidden" id="linkDeControladorColor" value="{$linkDeControladorColor}"/>

<input type="hidden" id="linkControlador" value="{$linkControlador}"/>


<div class="custom_bootstrap">



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
                                <select id="categoriaProducto" name="categoriaProducto">
                                    <span class="tree_categories_header margin-right">
                                    <option value="null">Seleccione Una Categoria</option>
                                    {foreach $categoriasProductos as $categoria}
                                        <option value="{$categoria["id_category"]}">{$categoria["name"]}</option>
                                    {/foreach}
                                </select>
                                </span>
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
                                    <select id="marcaProducto" name="marcaProducto">
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

								<!--
                                <div class="col-sm-12 mt">
									<label class="control-label">
                                        Cuántas de mostrar los productos?
									</label>
									<select id='' name=''>
										<option selected value="20">20</option>
										<option value="50">50</option>
										<option value="100">100</option>
										<option value="300">300</option>
										<option value="500">500</option>
										<option value="1000">1000</option>
									</select>
								</div>
                                -->
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










<!-- vista-form -->
<div class="vista-form-productos" id="vista-form-productos" style="display:none">
    <button class="btn btn-primary" id="botonIrHaVistaInicial" style="margin-bottom: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
    </button>
    <!-- radios paises productos -->

    <div class="slider-pais-productos" id="slider-productos" style="width: 100%; position: relative;">
       
    </div>
    <div id="paisesFormularioProducto">
    
    </div>



    <div class="panel mode_search" style="display: inline-block; width: 100%;">
        <h3 class="panel-heading">Producto de búsqueda Resultado<span id="count_result" class="badge">#</span></h3>
        <form id="formTablaProductos">
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
                <div data-id-producto-form="idpaisIdProdocuto" class="contenedor_producto_backend">
                    <div class="row preview-info-producto">
                        <div class="contenedor-check-envio col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
                            <input data-id-producto="idproducto" data-id-pais="idpais" onClick="cambiarEstadoDeEnvioDeProduct(this)" type="checkbox" class="haEnviar"/>
                        </div>
                        <div class="contenedor-nombre-producto col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10">
                            <img class="imagen-producto" src="https://www.xtrafondos.com/wallpapers/chica-anime-pensando-4699.jpg" alt=""/>
                            <h3 class="margin-0">nombre del producto</h3>
                        </div>
                        <div class="contenedor-toggle-producto col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
                            <svg id="idPais-idProducto-cerrar" data-id-producto="idPais-idProducto" onClick="cerrarFormularioProducto(this)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ocultar bi bi-arrow-up-short" viewBox="0 0 16 16">
                                <path data-id-producto="idPais-idProducto" fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                            </svg>

                            <svg id="idPais-idProducto-abrir" data-id-producto="idPais-idProducto" onClick="mostrarFormularioProducto(this)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                                <path data-id-producto="idPais-idProducto" fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="contenedor-formulario-producto ocultar" id="idPais-idProducto-contenedor-formulario-producto">
                        <div class="row">
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label >Cetegoria</label>
                                    <select class="form-control margin-0">
                                        <option>Default select</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label >brand</label>
                                    <select class="form-control margin-0">
                                        <option>Default select</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label >target age groups</label>
                                    <select class="form-control margin-0">
                                        <option>Default select</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label >target genders</label>
                                    <select class="form-control margin-0">
                                        <option>Default select</option>
                                    </select>
                                </div>
                            </div>

                        
                        </div>
                        <div class="row">
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label >season code</label>
                                    <select class="form-control margin-0">
                                        <option>Default select</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label >color</label>
                                    <select class="form-control margin-0">
                                        <option>Default select</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label >upper material clothing</label>
                                    <select class="form-control margin-0">
                                        <option>Default select</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label>supplier color</label>
                                    <input type="text" class="form-control " id="" placeholder="">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label>Siglas Moneda</label>
                                    <input type="text" class="form-control " id="" placeholder="">
                                </div>
                            </div>
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label>Stock</label>
                                    <input type="text" class="form-control " id="" placeholder="">
                                </div>
                            </div>
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label>Precio Regular</label>
                                    <input type="text" class="form-control " id="" placeholder="">
                                </div>
                            </div>
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label>Fecha de Inicio de Descuento</label>
                                    <input type="date" class="form-control " id="">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div class="form-group">
                                    <label>Fecha de Final de Descuento</label>
                                    <input type="date" class="form-control " id="">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">warnings</label>
                                    <textarea class="form-control" id="" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div class="form-group">
                                    <label for="exampleFormControlInput1">how to use</label>
                                    <textarea class="form-control" id="" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
            </div>
            <div class="justify-end-flex well-lg col-lg-12 col-xs-11">
                <button  class="btn btnVistaOne btn-primary" id="botonIrHaVistaBorrarProductos">
                    Guardar
                </button>
            </div>






            <!-- ===================================== -->
            <!-- ===================================== -->
            <!-- ===================================== -->
<!--
            <div data-id-producto-form="idpaisIdProdocuto" class="contenedor_producto_backend">
                <div class="row preview-info-producto">
                    <div class="contenedor-check-envio col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
                        <input data-id-producto="idproducto" data-id-pais="idpais" onClick="cambiarEstadoDeEnvioDeProduct(this)" type="checkbox" class="haEnviar"/>
                    </div>
                    <div class="contenedor-nombre-producto col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10">
                        <img class="imagen-producto" src="https://www.xtrafondos.com/wallpapers/chica-anime-pensando-4699.jpg" alt=""/>
                        <h3 class="margin-0">nombre del producto</h3>
                    </div>
                    <div class="contenedor-toggle-producto col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
                        <svg id="idPais-idProducto-cerrar" data-id-producto="idPais-idProducto" onClick="cerrarFormularioProducto(this)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ocultar bi bi-arrow-up-short" viewBox="0 0 16 16">
                            <path data-id-producto="idPais-idProducto" fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                        </svg>

                        <svg id="idPais-idProducto-abrir" data-id-producto="idPais-idProducto" onClick="mostrarFormularioProducto(this)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                            <path data-id-producto="idPais-idProducto" fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                        </svg>
                    </div>
                </div>




                <div class="contenedor-formulario-producto ocultar" id="idPais-idProducto-contenedor-formulario-producto">
                    <div class="row">
                        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-group">
                                <label >Cetegoria</label>
                                <select class="form-control margin-0">
                                    <option>Default select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-group">
                                <label >brand</label>
                                <select class="form-control margin-0">
                                    <option>Default select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-group">
                                <label >target age groups</label>
                                <select class="form-control margin-0">
                                    <option>Default select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-group">
                                <label >target genders</label>
                                <select class="form-control margin-0">
                                    <option>Default select</option>
                                </select>
                            </div>
                        </div>

                    
                    </div>
                    <div class="row">
                        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-group">
                                <label >season code</label>
                                <select class="form-control margin-0">
                                    <option>Default select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-group">
                                <label >color</label>
                                <select class="form-control margin-0">
                                    <option>Default select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-group">
                                <label >upper material clothing</label>
                                <select class="form-control margin-0">
                                    <option>Default select</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                            <div class="form-group">
                                <label for="exampleFormControlInput1">supplier color</label>
                                <input type="email" class="form-control " id="exampleFormControlInput1" placeholder="name@example.com">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div class="form-group">
                                <label for="exampleFormControlInput1">warnings</label>
                                <textarea class="form-control" id="" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div class="form-group">
                                <label for="exampleFormControlInput1">how to use</label>
                                <textarea class="form-control" id="" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                </div>


-->




            </div>
<!--
            <table class="table">
                <div class="p-20">
                    <div class="text-font-10 table_head modal-header modal-tr">
                        <div style="width: 6%;" class="text-center">ID</div>
                        <div style="width: 9%;" class="text-center">Imagen</div>
                        <div style="width: 12%;" class="text-center">Nombre</div>
                        <div style="width: 9%;" class="text-center">Categoría</div>
                        <div style="width: 4%;" class="text-center">Moneda</div>
                        <div style="width: 5%;" class="text-center">Stock</div>
                        <div style="width: 5%;" class="text-center">Precio</div>
                        <div style="width: 5%;" class="text-center">Descuento</div>
                        <div style="width: 11%;" class="text-center">Fecha Descuento</div>
                        <div style="width: 11%;" class="text-center">Fecha final Descuento</div>
                        <div style="width: 9%;" class="text-center">Tallas</div>
                        <div style="width: 5%;" class="text-center">Activo</div>
                        <div style="width: 6%;" class="text-center">No enviar</div>
                    </div>
                </div>


                <div id="resultThis" class="result-produt-one">
                    <div class="inf-product">
                        <div class="caj-product">
                            <div class="text-center" style="width: 6%;">42</div>
                            <div class="text-center" style="width: 9%;"><img style="width: 100%; height: 60px;" href="/img/tmp/product_mini_42_184.jpg?time=1645803475" alt="" class="imgm img-thumbnail"></div>
                            <div class="text-center text-primary" style="width: 12%;" data-name="">GLYCERIN 16 NEGRO / NARANJA</div>
                            <div class="text-center" style="width: 9%;" data-category="">RUNNING</div>
                            <div class="text-center" style="width: 4%;">
                                <select class='h35' style="padding: 5px 0px;">
                                        <option value="">EUR</option>
                                        <option value="">Dolar</option>
                                </select>
                            </div>
                            <div class="text-center alignitem-tb" style="width: 5%;" data-quantity=""><input class='input-tb' type='text' id='stock'/></div>
                            <div class="text-center alignitem-tb" style="width: 5%;" data-price=""><input class='input-tb' type='text' id='precio'/></div>
                            <div class="text-center alignitem-tb" style="width: 5%"><input class='input-tb' type='text' id='descuento'/></div>
                            <div class="text-center" style="width: 11%"><input class='input-tb' type='date' id='fecha-descuento'/></div>
                            <div class="text-center" style="width: 11%"><input class='input-tb' type='date' id='fecha-descuento'/></div>
                            <div class="text-center" style="width: 9%;"><select class='h35'>opciones</select></div>
                            <div class="text-center" style="width: 5%;" data-active=""><img src="../img/admin/disabled.gif"></div>
                            <div class="text-center" style="width: 5%;"><input style="height: 50px;" class='w20 m-auto' type='checkbox' id='check1'></div>
                            <div class="text-center" style="width: 1px; position: relative;">
                                <a id="resultbtns" href="#" class="btn-inf-product btn btn-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="p-20" >
                        <div class="text-font-10 modal-header modal-tr-2">
                            <div style="width: 5%; text-align: center;">Proveedor</div>
                            <div style="width: 5%; text-align: center;">Fabricante</div>
                            <div style="width: 12%; text-align: left;"">upper_material_clothing</div>
                            <div style="width: 20%; text-align: left;">how_to_use</div>
                            <div style="width: 20%; text-align: left;">warning</div>
                            <div style="width: 20%; text-align: left;">description</div>
                        </div>
                        <div class="caj-product">
                            <div style="width: 5%; text-align: center;" data-supplier="">SUPPLIER</div>
                            <div style="width: 5%; text-align: center;" data-reference="">FABRICANTE</div>
                            <div style="width: 10%; text-align: center;"><select class='h35'>opciones</select></div>
                            <div style="width: 20%; text-align: center;"><textarea style="" name="" id="" cols="30" rows="10"></textarea></div>
                            <div style="width: 20%; text-align: center;"><textarea style="" name="" id="" cols="30" rows="10"></textarea></div>
                            <div style="width: 20%; text-align: center;"><textarea style="" name="" id="" cols="30" rows="10"></textarea></div>
                            <div class="text-center" style="width: 1px; position: relative;">
                                <a id="resultbtns2" href="#" class="btn-inf-product btn btn-primary" style="display; none;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                                    </svg>
                                </a>
                            </div> 
                        </div>
                    </div>
                </div>
            </table>
-->
            
        </form>
    </div>
</div>















<!-- vista-borrar-productos -->
<div class="vista-2" id="vista-borrar-productos" style="width: 100%;display:none">

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
        <div class="slider-pais-borrar" id="slider-dos" style="width: 100%; position: relative;">
            
        </div>
        <div id="paisesBorrarProducto">

        </div>

        <div style="display: flex;flex-wrap: wrap;">
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
            <div id="listaDeProductosHaBorrar">
            </div>
        </div>
        
        <div id="controlesPaginacion"></div>

        <div class="well-lg is-relative">
            <button class="btn btn-primary is-absolute" id="botonEnviarPoductos">
                enviar productos
            </button>
            <button class="btn btn-primary is-absolute" id="botonTestEnvio" style="left: 15%;">
                probar envio
            </button>
            <div class="justify-end-flex">
                <button  class="btn btnVistaOne btn-primary" id="">
                    Guardar
                </button>
            </div>
        </div>
    </div>
</div>
 
<div id="preloader" class="col-12 fat-pre">
    <div class="pre-loader">
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>

<script type="text/javascript" src="/modules/wbzalando/views/js/librerias/moment.js"></script>
<script type="text/javascript" src="/modules/wbzalando/views/js/producto.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"></script>

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