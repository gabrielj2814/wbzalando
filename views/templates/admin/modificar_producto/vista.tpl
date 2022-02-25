<style><link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css" rel="stylesheet" type="text/css" /></style>

<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<input type="hidden" id="linkDeControladorCategoria" value="{$linkDeControladorCategoria}"/>
<input type="hidden" id="linkDeControladorTalla" value="{$linkDeControladorTalla}"/>

<input type="hidden" id="linkControlador" value="{$linkControlador}"/>



<div class="{if $smarty.const._PS_VERSION_ < 1.6}custom_responsive{/if} custom_bootstrap">
	

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
                                <span class="tree_categories_header margin-right">
                                    <a class="collapse_all btn btn-default button" href="#" style="display: none;">
                                        <i class="icon-collapse-alt"></i>
                                        Desplegar todo
                                    </a>
                                    <a class="expand_all btn btn-default button" href="#">
                                        <i class="icon-expand-alt"></i>
                                        Expandir todo
                                    </a>
                                    <a class="check_all_associated_categories btn btn-default button" href="#">
                                        <i class="icon-check-sign"></i>
                                        Seleccionar todo
                                    </a>
                                    <a class="uncheck_all_associated_categories btn btn-default button margin-right" href="#">
                                        <i class="icon-check-empty"></i>
                                        Deseleccionar todo
                                    </a>
                                        <span class="wrapp_search_category" style="display: inline-block;">
                                            <input type="text" class="search_category">
                                        </span>
                                </span>
                                <span class="wrap_snap_category margin-right">
                                    <label class="control-label">
                                        <input type="checkbox" id="search_only_default_category" /> Solo defecto
                                    </label>
                                </span>
                                <span class="wrap_snap_category margin-right">
                                    <label class="control-label">
                                        <input type="checkbox" id="bind_child" />{l s='Snap the child categories' mod='masseditproduct'}
                                    </label>
                                </span>
                                <!-- <ul {if isset($root) && $root}class="col-sm-9 {if isset($class_tree)}{$class_tree|escape:'quotes':'UTF-8'}{else}tree_categories{/if} tree_root"{/if}>
                                    {if isset($categories[$id_category])}
                                        {foreach from=$categories[$id_category] item=category}
                                            <li class="tree_item {if !$category['infos']['active']}tree_no_active{/if}">
                                                <span class="tree_label {if isset($selected_categories) && in_array($category['infos']['id_category'], $selected_categories)}tree_selected{/if}">
                                                    <input data-name="{$category['infos']['name']|escape:'quotes':'UTF-8'}" {if isset($selected_categories) && in_array($category['infos']['id_category'], $selected_categories)}checked{/if} class="tree_input" type="{if isset($multiple) && $multiple}checkbox{else}radio{/if}" name="{$name|escape:'quotes':'UTF-8'}[]" value="{$category['infos']['id_category']|escape:'quotes':'UTF-8'}" />
                                                    <label class="tree_toogle">
                                                        {if isset($categories[$category['infos']['id_category']]) && count($categories[$category['infos']['id_category']])}
                                                            <i class="icon-folder-close"></i>
                                                        {else}
                                                            <i class="tree-dot"></i>
                                                        {/if}
                                                        {$category['infos']['name']|escape:'quotes':'UTF-8'}
                                                        {if isset($categories[$category['infos']['id_category']]) && count($categories[$category['infos']['id_category']])}
                                                            <span class="tree_counter"></span>
                                                        {/if}
                                                    </label>
                                                </span>
                                                {if isset($categories[$category['infos']['id_category']]) && count($categories[$category['infos']['id_category']])}
                                                    {include file="./tree.tpl" categories=$categories id_category=$category['infos']['id_category'] selected_categories=$selected_categories root=false}
                                                {/if}
                                            </li>
                                        {/foreach}
                                    {/if}
                                </ul> -->
							</div>
						</div>

						<!-- search-products -->
						<div class="col-lg-6 search-products">
							<div class="row">
								<div class="col-sm-12 alignitem-tb">
									<label class="control-label search-prod margin-right">
										Buscar producto
									</label>
									<span class="search_product_name">
										<span class="switch prestashop-switch fixed-width-xxxl switch-product-combination">
                                            <input type="radio" 
                                                    name=""
                                                    value=""
                                                    id=""/>
                                            <label for="">
                                            </label>
                                        <a class="slide-button btn"></a>
                                        </span>
									</span>
								</div>
								<div class="col-xs-12 form-group form-group-lg" style="margin-bottom: 0 !important;">
									<div class="col-sm-9 p-0">
										<input  type="text" class="form-control" id="nombreProducto" name="nombreProducto" placeholder="Buscar por nombre de producto"/>
									</div>
									<div class="col-sm-3">
										<select class="form-control" name="type_search">
											<option value="0">Nombre</option>
											<option value="1">ID del producto </option>
											<option value="2">Referencia</option>
											<option value="3">EAN-13</option>
											<option value="4">UPC</option>
											<option value="5">Description</option>
											<option value="6">Description short</option>
										</select>
									</div>
								</div>
								<label class="control-label col-xs-12 mt">
                                    Búsqueda por fabricante
								</label>
								<div class="col-xs-12">
                                    <select id='' name=''>
                                            <option value="">Graphic Comer</option>
                                            <option value="">Studio Design</option>
                                    </select>
									<!-- <script>
                                        $(document).ready(function() {
                                            $('#manufacturer').select2();
                                        });
									</script> -->
								</div>
								<label class="control-label col-lg-12 mt">
                                    Búsqueda por proveedor
								</label>
								<div class="col-lg-12">
                                    <select id='' name=''>
                                            <option value="">Accessories suppller</option>
                                            <option value="">Fashion suppller</option>
                                    </select>
									<!-- <script>
                                        $(document).ready(function() {
                                            $('#supplier').select2();
                                        });
									</script> -->
								</div>

                                <label class="control-label col-lg-12 mt">
                                    Search by carrier
                                </label>
                                <div class="col-lg-12">
                                    <select id='' name=''>
                                            <option value="">zalandolocal</option>
                                            <option value="">My carrier</option>
                                            <option value="">My cheap carrier</option>
                                            <option value="">My light carrier</option>
                                    </select>
                                    <!-- <script>
                                        $(document).ready(function() {
                                            $('#carrier').select2();
                                        });
                                    </script> -->
                                </div>

								<div class="col-sm-12 mt">
                                        <label class="control-label margin-right">
                                            Sólo los productos activos
                                        </label>
                                        <!-- Only active products -->
                                        <!-- {if $smarty.const._PS_VERSION_ < 1.6}
                                            <label class="t"><img src="../img/admin/enabled.gif"></label>
                                            <input name="active" value="1" type="radio"/>
                                            <label class="t"><img src="../img/admin/disabled.gif"></label>
                                            <input checked name="active" value="0" type="radio"/>
                                        {else}
                                        <span class="switch prestashop-switch fixed-width-sm margin-right">
                                            {foreach [1,0] as $value}
                                                <input type="radio" name="active" value="{$value|escape:'quotes':'UTF-8'}"
                                                        {if $value == 1} id="active_on" {else} id="active_off" {/if}
                                                        {if 0 == $value}checked="checked"{/if} />
                                                <label {if $value == 1} for="active_on" {else} for="active_off" {/if} >
                                                    {if $value == 1} {l s='Yes' mod='masseditproduct'} {else} {l s='No' mod='masseditproduct'} {/if}
                                                </label>
                                            {/foreach}
                                            <a class="slide-button btn"></a>
                                        </span>
                                        {/if} -->

                                        <label class="control-label">
                                            Sólo no activo productos
                                        </label>
                                        <!-- Only disabled products -->
                                        <!-- {if $smarty.const._PS_VERSION_ < 1.6}
                                            <label class="t"><img src="../img/admin/enabled.gif"></label>
                                            <input name="disable" value="1" type="radio"/>
                                            <label class="t"><img src="../img/admin/disabled.gif"></label>
                                            <input checked name="disable" value="0" type="radio"/>
                                        {else}
                                        <span class="switch prestashop-switch fixed-width-sm">
                                            {foreach [1,0] as $value}
                                                <input type="radio" name="disable" value="{$value|escape:'quotes':'UTF-8'}"
                                                        {if $value == 1} id="disable_on" {else} id="disable_off" {/if}
                                                        {if 0 == $value}checked="checked"{/if} />
                                                <label {if $value == 1} for="disable_on" {else} for="disable_off" {/if}>
                                                    {if $value == 1} {l s='Yes' mod='masseditproduct'} {else} {l s='No' mod='masseditproduct'} {/if}
                                                </label>
                                            {/foreach}
                                            <a class="slide-button btn"></a>
                                        </span>
                                        {/if} -->
								</div>

								<div class="col-lg-12 alignitem-tb mt">
									<label class="control-label font-weight-bold">
                                        Buscar por el cantidad?
									</label>
									<!-- search-quantity -->
									<span class="alignitem-tb search-quantity">
                                        <label class="control-label">
                                            De
                                        </label>
                                        <input type="text" class="fixed-width-xs" name="qty_from"">
                                    </span>
									<span class="alignitem-tb search-quantity ml">
                                        <label class="control-label">
                                            Hasta
                                        </label>
                                        <input type="text" class="fixed-width-xs" name="qty_to">
                                    </span>
								</div>

								<div class="col-lg-12 alignitem-tb mt">
									<!-- Search by price -->
									<label class="control-label font-weight-bold">
                                        Buscar por precio?
									</label>
									<select id='' name='' style="width: 19%;">
										<option value="0">Precio base</option>
										<option value="1">Precio final</option>
									</select>
									<span class="alignitem-tb search-quantity ml">
                                        <label class="control-label">
                                            De
                                        </label>
                                        <input type="text" class="fixed-width-xs" name="price_from">
                                    </span>
									<span class="alignitem-tb search-quantity ml">
                                        <label class="control-label">
                                            Hasta
                                        </label>
                                        <input type="text" class="fixed-width-xs" name="price_to">
                                    </span>

								</div>

								<label class="control-label font-weight-bold col-lg-12 mt">
                                    Buscar por fecha de creación?
								</label>

								<!-- Search by creation date -->
								<div class="col-lg-12 alignitem-tb mt">
									<label class="control-label ">
										Desde
									</label>
									<input class="datetimepicker fixed-width-lg" type="text" name="date_from" value="" autocomplete="off">
									<label class="control-label ml">
										A
									</label>
									<input class="datetimepicker fixed-width-lg" type="text" name="date_to" value="" autocomplete="off">
								</div>

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
								<div class="col-sm-12">
									<div class="clearfix">
										<label class="control-label">
                                            Seleccionar característica
                                        </label>
										<select id='' name=''>
                                            <option value="">Composition (6)</option>
                                            <option value="">Property (4)</option>
										</select>
									</div>
                                    <div data-feature-values="1" style="" class="form-group clearfix"><!-- feature_values -->
                                        <div class="feature_checkbox">
                                            <div class="col-xs-12 col-sm-3">
                                                <label class="control-label">
                                                    <input type="checkbox" name="features[]" value="4">
                                                    Algodón
                                                </label>
                                            </div>
                                            <div class="col-xs-12 col-sm-3">
                                                <label class="control-label">
                                                    <input type="checkbox" name="features[]" value="3">
                                                    Ceramic
                                                </label>
                                            </div>
                                            <div class="col-xs-12 col-sm-3">
                                                <label class="control-label">
                                                    <input type="checkbox" name="features[]" value="2">
                                                    Lana
                                                </label>
                                            </div>
                                            <div class="col-xs-12 col-sm-3">
                                                <label class="control-label">
                                                    <input type="checkbox" name="features[]" value="6">
                                                    Matt paper
                                                </label>
                                            </div>
                                            <div class="col-xs-12 col-sm-3">
                                                <label class="control-label">
                                                    <input type="checkbox" name="features[]" value="1">
                                                    Poliéster
                                                </label>
                                            </div>
                                            <div class="col-xs-12 col-sm-3">
                                                <label class="control-label">
                                                    <input type="checkbox" name="features[]" value="5">
                                                    Recycled cardboard
                                                </label>
                                            </div>
                                            <div class="col-xs-12 col-sm-12">
                                                <div class="row">
                                                    <div class="col-sm-12 clearfix" style="padding-top: 5px;padding-bottom: 5px;margin-top:5px;background-color:#f1f1f1;">
                                                        <label class="control-label">
                                                            <input type="checkbox" name="no_feature_value[]" value="1">
                                                            Sin valor
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div " style="display: none" class="form-group clearfix"></div>
								</div>
							</div>
						</div>
						<div class="col-lg-12 control_btn">
                        <div class="centrar-columnas" style="margin-bottom: 30px;margin-top: 60px;">
                            <button id="beginSearch" class="btn btn-default">
                                Buscar producto
                            </button>
						</div>
					</div>
				</div>
			</div>
		</div>
    </div>
</div>


<div class="panel mode_search" style="display: block;">
    <h3 class="panel-heading">Producto de búsqueda Resultado<span id="count_result" class="badge">#</span></h3>
    <form id="formTablaProductos">
        <table class="table">
            <!--
            <thead>
                <tr>
                <th scope="col"></th>
                <th scope="col">ID</th>
                <th scope="col">Nombre de Producto</th>
                <th scope="col">Referencia (EAN)</th>
                </tr>
            </thead>
            -->
            <thead>
                <tr class="table_head">
                    <th>
                        <span class="title_box" data-orderby="id_product">ID
                            <a href="#" data-orderway="DESC">
                                <i class="icon-caret-down"></i>
                            </a>
                            <a href="#" data-orderway="ASC">
                                <i class="icon-caret-up"></i>
                            </a>
                        </span>
                    </th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>
                        <span class="title_box" data-orderby="reference">Referencia
                            <a href="#" data-orderway="DESC">
                                <i class="icon-caret-down"></i>
                            </a>
                            <a href="#" data-orderway="ASC">
                                <i class="icon-caret-up"></i>
                            </a>
                        </span>
                    </th>
                    <th>Categoría por defecto</th>
                    <th>
                        <span class="title_box" data-orderby="price">Precio
                            <a href="#" data-orderway="DESC">
                                <i class="icon-caret-down"></i>
                            </a>
                            <a href="#" data-orderway="ASC">
                                <i class="icon-caret-up"></i>
                            </a>
                        </span>
                    </th>
                    <th>Precio unitario (incl IVA )</th>
                    <th>Fabricante</th>
                    <th>Proveedor</th>
                    <th>
                        <span class="title_box" data-orderby="quantity">Cantidad
                            <a href="#" data-orderway="DESC">
                                <i class="icon-caret-down"></i>
                            </a>
                            <a href="#" data-orderway="ASC">
                                <i class="icon-caret-up"></i>
                            </a>
                        </span>
                    </th>
                    <th>Gestion de Stocks</th>
                    <th>Activo</th>
                    <th data-combinations="">Combinaciones <a href="#">Seleccionar</a>
                        <div class="selector_item select_combinations" style="display: none;">
                            <a class="check_all_combinations btn btn-default button" href="#">
                                <i class="icon-check-sign"></i>
                                Marcar todo
                            </a>
                            <a class="uncheck_all_combinations btn btn-default button" href="#">
                                <i class="icon-check-empty"></i>
                                Desmarcar todo
                            </a>
                            <a class="check_attribute_combinations btn btn-default button" href="#">
                                <i class="icon-list"></i>
                                Seleccionar atributo
                            </a>
                            <div id="attributes_select">
                                <div class="attribute_group_block">
                                    <div>
                                        Atributo
                                        <select class="select_attribute">
                                            <option value="0">--</option>
                                            <option value="2">Color</option>
                                            <option value="3">Dimension</option>
                                            <option value="4">Paper Type</option>
                                            <option value="1">Tamaño</option>
                                        </select>
                                    </div>
                                    <div>
                                        Valor
                                        <select class="select_attribute_value">
                                        </select>
                                    </div>
                                </div>
                                <a class="start_select_combinations btn btn-default button" href="#">
                                    Seleccionar
                                </a>
                            </div>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody id="tablaProductos">
            </tbody>
        </table>

        <div class="well-lg col-lg-12 blockquote-reverse col-xs-11">
            <button id="" class="btn btn-primary" >
                Guardar
            </button>
        </div>
    </form>
</div>

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
        

        <div id="listaDeProductosHaEliminar">

        </div>
    </div>

    <div id="controlesPaginacion"></div>
</div>

<div class="col-12 fat-pre" id="preloader">
    <div class="pre-loader">
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>

<script type="text/javascript" src="/modules/wbzalando/views/js/producto.js"></script>
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