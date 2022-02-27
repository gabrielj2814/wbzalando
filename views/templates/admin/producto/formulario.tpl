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
<div class="vista-form-productos" id="vista-form-productos" style="display:none;">
    <button class="btn btn-primary" id="botonIrHaVistaInicial" style="margin-bottom: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
    </button>
    <!-- radios paises productos -->
    <div id="paisesFormularioProducto"></div>
    <div class="panel mode_search" style="display: inline-block; width: 100%;">
        <h3 class="panel-heading">Producto de búsqueda Resultado<span id="count_result" class="badge">#</span></h3>
        <form id="formTablaProductos">
            <table class="table">
                <div style="display: flex;">
                    <div class="alignitem-tb col-sm-2">
                        <label class="control-label col-xs-12 mt" style="width: auto; min-width: 100px;padding-right: 0 !important;">
                            Brand
                        </label>
                        <div class="col-xs-12">
                            <select id='edicionGlobalBrandCode'></select>
                        </div>
                    </div>
                    <div class="alignitem-tb col-sm-2">
                        <label class="control-label col-xs-12 mt" style="width: auto; min-width: 100px;padding-right: 0 !important;">
                            Season
                        </label>
                        <div class="col-xs-12">
                            <select id='edicionGlobalSeasonCode'></select>
                        </div>
                    </div>
                    <div class="alignitem-tb col-sm-2">
                        <label class="control-label col-xs-12 mt" style="width: auto; min-width: 100px;padding-right: 0 !important;">
                            Color
                        </label>
                        <div class="col-xs-12">
                            <select id='edicionGlobalColor'></select>
                        </div>
                    </div>
                    <div class="alignitem-tb col-sm-3">
                        <label class="control-label col-xs-12 mt" style="width: auto; min-width: 140px;padding-right: 0 !important;">
                            Target Age Groups
                        </label>
                        <div class="col-xs-12">
                            <select id='edicionGlobalTargetAgeGroups' multiple></select>
                        </div>
                    </div>
                    <div class="alignitem-tb col-sm-3">
                        <label class="control-label col-xs-12 mt" style="width: auto; min-width: 140px;padding-right: 0 !important;">
                            Target Genders
                        </label>
                        <div class="col-xs-12">
                            <select id='edicionGlobalTargetGenders' multiple></select>
                        </div>
                    </div>
                </div>


                
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
            <div class=justify-end-flex col-lg-12 col-xs-11">
                <button  class="btn btnVistaOne btn-primary" id="botonIrHaVistaBorrarProductos">
                    Guardar
                </button>
            </div>
        </form>
    </div>
</div>





















<!-- html-form-producto -->
<!--

    <div class="panel mode_search" style="display: inline-block; width: 100%;">
        <h3 class="panel-heading">Producto de búsqueda Resultado<span id="count_result" class="badge">#</span></h3>
        <form id="formTablaProductos">
            <table class="table">
                <div style="display: flex;">
                    <div class="alignitem-tb col-sm-2">
                        <label class="control-label col-xs-12 mt" style="width: auto; min-width: 100px;padding-right: 0 !important;">
                            Brand-code
                        </label>
                        <div class="col-xs-12">
                            <select id='' name=''>
                                    <option value="">vacio</option>
                                    <option value="">1</option>
                                    <option value="">2</option>
                            </select>
                        </div>
                    </div>
                    <div class="alignitem-tb col-sm-2">
                        <label class="control-label col-xs-12 mt" style="width: auto; min-width: 100px;padding-right: 0 !important;">
                            Season-code
                        </label>
                        <div class="col-xs-12">
                            <select id='' name=''>
                                    <option value="">vacio</option>
                                    <option value="">1</option>
                                    <option value="">2</option>
                            </select>
                        </div>
                    </div>
                    <div class="alignitem-tb col-sm-2">
                        <label class="control-label col-xs-12 mt" style="width: auto; min-width: 100px;padding-right: 0 !important;">
                            Color-code
                        </label>
                        <div class="col-xs-12">
                            <select id='' name=''>
                                    <option value="">vacio</option>
                                    <option value="">1</option>
                                    <option value="">2</option>
                            </select>
                        </div>
                    </div>
                    <div class="alignitem-tb col-sm-3">
                        <label class="control-label col-xs-12 mt" style="width: auto; min-width: 140px;padding-right: 0 !important;">
                            Target-age-griiups
                        </label>
                        <div class="col-xs-12">
                            <select id='' name=''>
                                    <option value="">vacio</option>
                                    <option value="">1</option>
                                    <option value="">2</option>
                            </select>
                        </div>
                    </div>
                    <div class="alignitem-tb col-sm-3">
                        <label class="control-label col-xs-12 mt" style="width: auto; min-width: 140px;padding-right: 0 !important;">
                            Target-genders
                        </label>
                        <div class="col-xs-12">
                            <select id='' name=''>
                                    <option value="">vacio</option>
                                    <option value="">1</option>
                                    <option value="">2</option>
                            </select>
                        </div>
                    </div>
                </div>


                
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
            <div class=justify-end-flex col-lg-12 col-xs-11">
                <button  class="btn btnVistaOne btn-primary">
                    Guardar
                </button>
            </div>
        </form>
    </div>
</div>

-->





<!--
<tr class="">
    <th style="width: 50px; text-align: center;">42</th>
    <th style="width: 80px; text-align: center;"><img style="width: 100%; height: 60px;" src="/img/tmp/product_mini_42_184.jpg?time=1645803475" alt="" class="imgm img-thumbnail"></th>
    <th style="width: 150px; text-align: center;" data-name="">GLYCERIN 16 NEGRO / NARANJA</th>
    <th style="width: 60px; text-align: center;" data-category="">RUNNING</th>
    <th style="width: 60px; text-align: center;" data-quantity="">12</th>
    <th style="width: 60px; text-align: center;" data-price="">140,50&nbsp;€</th>
    <th style="width: 50px; text-align: center;">Descuento</th>
    <th style="width: 70px; text-align: center;">Fecha Descuento</th>
    <th style="width: 70px; text-align: center;">Fecha final Descuento</th>
    <th style="width: 60px; text-align: center;">Tallas</th>
    <th style="width: 50px; text-align: center;" data-active=""><img src="../img/admin/disabled.gif"></th>
    <th style="width: 50px; text-align: center;">No enviar</th>
    <th>
        <button  class="btn btn-primary" style="font-size: 13px;padding: 0px 10px;width: 100px;position: absolute;bottom: 0;right: 0;">
            Ver mas...
        </button>
    </th>
</tr>
<tr>
    <tr style="display: none !important;">
        
        <tr>
            <th style="width: 60px; text-align: center;">Proveedor</th>
            <th style="width: 60px; text-align: center;">Fabricante</th>
            <th style="width: 150px; text-align: center;">how_to_use</th>
            <th style="width: 150px; text-align: center;">warning</th>
            <th style="width: 150px; text-align: center;">description</th>
            <th style="width: 150px; text-align: center;">upper_material_clothing</th>
        </tr>
        <tr>
            <th style="width: 60px; text-align: center;" data-supplier="">BROOKS</th>
            <th style="width: 60px; text-align: center;" data-reference="">Fabricante</th>
            <th style="width: 150px; text-align: center;">how_to_use</th>
            <th style="width: 150px; text-align: center;">warning</th>
            <th style="width: 150px; text-align: center;">description</th>
            <th style="width: 150px; text-align: center;">upper_material_clothing</th>
        </tr>
    </tr>
</tr>
-->




















































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
    <div id="paisesBorrarProducto"></div>
    <div class="panel" style="display: block;width: 100%;">    
        <div class="slider-pais" style="width: 100%; position: relative;">
            <div class="">
                <label id="botonRegistrar" class="btn btn-primary">
                    España
                </label>
            </div>
            <div class="">
                <label id="botonRegistrar" class="btn btn-primary">
                    EEUU
                </label>
            </div>
            <div class="">
                <label id="botonRegistrar" class="btn btn-primary">
                    Germany
                </label>
            </div>
            <div class="">
                <label id="botonRegistrar" class="btn btn-primary">
                    France
                </label>
            </div>
            <div class="">
                <label id="botonRegistrar" class="btn btn-primary">
                    España
                </label>
            </div>
            <div class="">
                <label id="botonRegistrar" class="btn btn-primary">
                    EEUU
                </label>
            </div>
        </div>
        <div id="paisesRadio">
        
        </div>
        <div style="display: flex;">
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
            <div id="listaDeProductosHaBorrar"></div>
        </div>

        <div id="controlesPaginacion"></div>
    </div>
</div>
 <button class="btn btn-primary" id="botonTestEnvio"">
            probar envio
        </button>
<div id="preloader" class="col-12 fat-pre">
    <div class="pre-loader">
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>

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