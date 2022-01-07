<div class="formulario">
    <input type="hidden" id="linkControlador" value="{$linkControlador}"/>
    <a href="{$linkControlador}{"&vista=inicio"}" class="btn btn-primary" style="margin-bottom: 30px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
    </a>

        <div class=" centrar-columnas" style="margin-bottom: 30px;">
            <div class="col-11 col-sm-11 col-md-11 col-lg-6 col-xl-6" style="margin-left:auto;margin-right:auto;">
                <input  type="text" class="form-control" id="nombreProducto" name="nombreProducto" placeholder="Buscar por nombre de producto"/>
            </div>
        </div>

    <div class="row" style="margin-bottom: 30px;">
        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <label>Categoria</label>
            <select id="categoriaProducto" name="categoriaProducto">
            <option value="null">Seleccione Una Categoria</option>
            {foreach $categoriasProductos as $categoria}
                <option value="{$categoria["id_category"]}">{$categoria["name"]}</option>
            {/foreach}
            </select>
        </div>
        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
            <label>Marcas</label>
            <select id="marcaProducto" name="marcaProducto">
            <option value="null">Seleccione Una Marca</option>
            {foreach $marcasProductos as $marca}
                <option value="{$marca["id_manufacturer"]}">{$marca["name"]}</option>
            {/foreach}
            </select>
        </div>
        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3" style="margin-top: 24px;">
            <button class="btn btn-primary" id="botonFiltroProducto" data-url-ajax="{$linkControlador}">
                <svg style="margin-right: 5px;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter" viewBox="0 0 16 16">
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                </svg>
                Filtrar
            </button>
        </div>
    </div>

   

   <form id="formTablaProductos">
   
        <table class="table">
            <thead>
                <tr>
                <th scope="col"></th>
                <th scope="col">ID</th>
                <th scope="col">Nombre de Producto</th>
                <th scope="col">Referencia (EAN)</th>
                </tr>
            </thead>
            <tbody id="tablaProductos">
            
                
            </tbody>
        </table>
   
   </form>

<script type="text/javascript" src="/modules/wbzalando/views/js/producto.js"></script>
</div>