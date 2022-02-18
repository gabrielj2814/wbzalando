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
                                        <span class="wrapp_search_category">
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
								<div class="col-sm-12">
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
								<div class="col-xs-12 form-group form-group-lg">
									<div class="col-sm-9">
										<input name="search_query" class="form-control" type="text"/>
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
								<label class="control-label col-xs-12">
                                    Búsqueda por fabricante
								</label>
								<div class="col-xs-12">
									<select id="manufacturer" class="form-control" multiple name="">
											<option value="">Graphic Comer</option>
                                            <option value="">Studio Design</option>
                                    </select>
									<!-- <script>
                                        $(document).ready(function() {
                                            $('#manufacturer').select2();
                                        });
									</script> -->
								</div>
								<label class="control-label col-lg-12">
                                    Búsqueda por proveedor
								</label>
								<div class="col-lg-12">
									<select id="supplier" class="form-control" multiple name="">
											<option value="">Accessories suppller</option>
                                            <option value="">Fashion suppller</option>
                                    </select>
									<!-- <script>
                                        $(document).ready(function() {
                                            $('#supplier').select2();
                                        });
									</script> -->
								</div>

                                <label class="control-label col-lg-12">
                                    Search by carrier
                                </label>
                                <div class="col-lg-12">
                                    <select id="carrier" class="form-control" multiple name="carrier[]">
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

								<div class="col-sm-12">
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

                                        <label class="control-label margin-right">
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

								<div class="col-lg-12">
									<label class="control-label font-weight-bold margin-right">
                                        Buscar por el cantidad?
									</label>
									<!-- search-quantity -->
									<span class="search-quantity margin-right">
                                        <label class="control-label">
                                            De
                                        </label>
                                        <input type="text" class="fixed-width-xs" name="qty_from"">
                                    </span>
									<span class="search-quantity">
                                        <label class="control-label">
                                            Hasta
                                        </label>
                                        <input type="text" class="fixed-width-xs" name="qty_to">
                                    </span>
								</div>

								<div class="col-lg-12">
									<!-- Search by price -->
									<label class="control-label font-weight-bold margin-right">
                                        Buscar por precio?
									</label>
									<select name="type_price" class="fixed-width-md margin-right">
										<option value="0">Precio base</option>
										<option value="1">Precio final</option>
									</select>
									<span class="search-quantity margin-right">
                                        <label class="control-label">
                                            De
                                        </label>
                                        <input type="text" class="fixed-width-xs" name="price_from">
                                    </span>
									<span class="search-quantity">
                                        <label class="control-label">
                                            Hasta
                                        </label>
                                        <input type="text" class="fixed-width-xs" name="price_to">
                                    </span>

								</div>

								<label class="control-label font-weight-bold col-lg-12">
                                    Buscar por fecha de creación?
								</label>

								<!-- Search by creation date -->
								<div class="col-lg-12">
									<label class="control-label margin-right">
										Desde
									</label>
									<input class="datetimepicker fixed-width-lg margin-right" type="text" name="date_from" value="" autocomplete="off">
									<label class="control-label margin-right">
										A
									</label>
									<input class="datetimepicker fixed-width-lg" type="text" name="date_to" value="" autocomplete="off">
								</div>

								<div class="col-sm-12">
									<label class="control-label margin-right">
                                        Cuántas de mostrar los productos?
									</label>
									<select class="form-control fixed-width-sm" name="how_many_show">
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
										<label class="control-label margin-right">
                                            Seleccionar característica
                                        </label>
										<select name="feature_group" class="fixed-width-lg">
                                            <option value="">Composition (6)</option>
                                            <option value="">Property (4)</option>
										</select>
									</div>
                                    <div " style="display: none" class="form-group clearfix"></div>
								</div>
							</div>
						</div>
						<div class="col-lg-12 control_btn">
							<button id="beginSearch" class="btn btn-default">
                                Buscar producto
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="panel mode_search">
			<h3 class="panel-heading">Producto de búsqueda Resultado</h3>
			<div class="table_search_product">
				<div class="alert alert-warning">¿Necesitas iniciar la búsqueda</div>
			</div>
			<div class="row_select_all clearfix">
				<button class="btn btn-default selectAll">
                    Seleccionar todo
				</button>
			</div>
		</div>

		<div class="panel mode_edit panel-container row">
			<div class="tn-box mv_succes">
            <p class="message_mv_content">Actualización con éxito!</p>
            <div class="tn-progress"></div>
        </div>
        <div class="tn-box mv_error">
            <p class="message_mv_content">error</p>
            <div class="tn-progress"></div>
        </div>
        <div class="panel">
            <div class="panel-heading clearfix">
                <button class="change_date_button">
                    <i class="icon-plus"></i>
                </button>
                <span>Configuración global
                </span>
                <a class="masseditdoc" href="http://zalando.test/admin639kgjtj6/index.php?controller=AdminModules&amp;token=fa51ac314d730e3a5d2dc58ce267468e&amp;configure=masseditproduct&amp;tab_module=masseditproduct&amp;tab_module=front_office_features&amp;module_name=masseditproduct">Documentación</a>
                <a class="float-right" id="seosa_manager_btn" href="#">Nuestros módulos</a>
            </div>
            <div class="form-group change_date_container clearfix">
                <label class="control-label col-lg-12">Cambiar la fecha de actualización del producto después de que los cambios entren en vigor?</label>
                <div class="col-lg-12">
                    <div class="btn-group btn-group-radio">
                        <label for="change_date_upd_yes">
                            <input type="radio" name="change_date_upd" value="1" id="change_date_upd_yes">
                            <span class="btn btn-default">Sí</span>
                        </label>
                        <label for="change_date_upd_no">
                            <input type="radio" checked="" name="change_date_upd" value="0" id="change_date_upd_no">
                            <span class="btn btn-default">No</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="form-group change_date_container clearfix">
                <label class="control-label col-lg-12">Productos reindex después del cambio?</label>
                <div class="col-lg-12">
                    <div class="btn-group btn-group-radio">
                        <label for="reindex_products_yes">
                            <input type="radio" checked="" name="reindex_products" value="1" id="reindex_products_yes">
                            <span class="btn btn-default">Sí</span>
                        </label>
                        <label for="reindex_products_no">
                            <input type="radio" name="reindex_products" value="0" id="reindex_products_no">
                            <span class="btn btn-default">No</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <br>
		
        <div class="tab_container">
            <div class="col-md-2">
                <button class="tab-menu">Menú<i class="icon-chevron-down"></i></button>
                <ul class="tabs clearfix">
                    <li data-tab="category">Categorías</li>
                    <li data-tab="price">Precio</li>
                    <li data-tab="active">Activo</li>
                    <li data-tab="manufacturer">Fabricante</li>
                    <li data-tab="accessories">Accesorios</li>
                    <li data-tab="supplier">Proveedor</li>
                    <li data-tab="discount">Descuento</li>
                    <li data-tab="features">Características</li>
                    <li data-tab="delivery">Entrega</li>
                    <li data-tab="image">Imagen</li>
                    <li data-tab="description">Descripción</li>
                    <li data-tab="rule_combination">Combinaciones</li>
                    <li data-tab="attachment">Archivos adjuntos</li>
                    <li data-tab="advanced_stock_management">Gestion de Stocks</li>
                    <li data-tab="quantity">Cantidad</li>
                    <li data-tab="meta">Meta</li>
                    <li data-tab="reference">Referencia</li>
                    <li data-tab="createproducts" data-action="create_products">Crear productos</li>
                    <li data-tab="customization">Campos de personalización</li>
                </ul>
            </div>
            <div class="col-md-10">
                <div class="tabs_content clearfix ">
                <h3 id="title_edit_tabs" class="panel-heading">Comenzar a trabajar con los productos seleccionados</h3>
                <h3 id="title_create_tabs" class="panel-heading">Comenzar a crear productos</h3>
                <div class="tab_content ajax_load_tab loading" id="category">
                </div>
                <div class="tab_content ajax_load_tab loading" id="price">
                </div>
                <div class="tab_content ajax_load_tab loading" id="active">
                </div>
                <div class="tab_content ajax_load_tab loading" id="manufacturer">
                </div>
                <div class="tab_content ajax_load_tab loading" id="accessories">
                </div>
                <div class="tab_content ajax_load_tab loading" id="supplier">
                </div>
                <div class="tab_content ajax_load_tab loading" id="discount">
                </div>
                <div class="tab_content ajax_load_tab loading" id="features">
                </div>
                <div class="tab_content ajax_load_tab loading" id="delivery">
                </div>
                <div class="tab_content ajax_load_tab loading" id="image">
                </div>
                <div class="tab_content ajax_load_tab loading" id="description">
                </div>
                <div class="tab_content ajax_load_tab loading" id="rule_combination">
                </div>
                <div class="tab_content ajax_load_tab loading" id="attachment">
                </div>
                <div class="tab_content ajax_load_tab loading" id="advanced_stock_management">
                </div>
                <div class="tab_content ajax_load_tab loading" id="quantity">
                </div>
                <div class="tab_content ajax_load_tab loading" id="meta">
                </div>
                <div class="tab_content ajax_load_tab loading" id="reference">
                </div>
                <div class="tab_content ajax_load_tab loading" id="createproducts">
                </div>
                <div class="tab_content ajax_load_tab loading" id="customization">
                </div>
            </div>
        </div>
		<div class="panel mode_edit clearfix">
            <h3 class="panel-heading">Artículos seleccionados</h3>
            <div class="table_selected_products">
                <div class="col-xs-12">
                  <table class="table">
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
                                <div class="selector_item select_combinations">
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
                    </table>
                </div>
            </div>
        </div>
	</div>
</div>

<script id="image_row" type="text/html">
	<div class="row">
		<div class="col-lg-12">
			<input name="" type="file">
		</div>
	</div>
</script>
<style>
	@media (max-width: 991px) {
		.table td:nth-of-type(1):before {
			content: "{l s='ID' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(2):before {
			content: "{l s='Image' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(3):before {
			content: "{l s='Name' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(4):before {
			content: "{l s='Reference' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(5):before {
			content: "{l s='Category default' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(6):before {
			content: "{l s='Price' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(7):before {
			content: "{l s='Price final' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(8):before {
			content: "{l s='Manufacture' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(9):before {
			content: "{l s='Supplier' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(10):before {
			content: "{l s='Quantity' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(11):before {
			content: "{l s='Stock management' mod='masseditproduct' js=true}";
		}
		.table td:nth-of-type(12):before {
			content: "{l s='Active' mod='masseditproduct' js=true}";
		}

		#supplier .table td:nth-of-type(1):before {
			content: "{l s='Suppliers' mod='masseditproduct' js=true}";
		}
		#supplier .table td:nth-of-type(2):before {
			content: "{l s='Supplier reference' mod='masseditproduct' js=true}";
		}
		#supplier .table td:nth-of-type(3):before {
			content: "{l s='Unit price tax excluded' mod='masseditproduct' js=true}";
		}
		#supplier .table td:nth-of-type(4):before {
			content: "{l s='Unit price currency' mod='masseditproduct' js=true}";
		}
	}
</style>
<script type="text/javascript" src="/modules/wbzalando/views/js/modificarprodcuto.js"></script>