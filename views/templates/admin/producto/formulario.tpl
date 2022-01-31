<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3" style="margin-top: 24px;">
            <button class="btn btn-primary" id="botonConsultarCategoriasAso" data-url-ajax="{$linkControlador}">
                consultar Categorias
            </button>
        </div>
        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3" style="margin-top: 24px;">
            <button class="btn btn-primary" id="botonConsultartallasAsociadas" data-url-ajax="{$linkControlador}">
                consultar tallas
            </button>
        </div>
<div class="vistaInicial id="vistaInicial">
    <div class="centrar-columnas" style="margin-bottom: 30px;margin-top: 60px;">
        <div class="col-11 col-sm-11 col-md-11 col-lg-6 col-xl-6" style="margin-left:auto;margin-right:auto;">
            <input  type="text" class="form-control" id="nombreProducto" name="nombreProducto" placeholder="Buscar por nombre de producto"/>
        </div>
    </div>

    <div class="row">
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

    <div class="row justify-content-end" style="margin-bottom: 30px;">
        <div class="col-auto" style="margin-top: 24px;">
            <button class="btn btn-primary" id="obtenerProductos" data-url-ajax="{$linkControlador}">
                <svg style="margin-right: 5px;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                </svg>
                Enviar Productos
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

</div>

<div id="contenedorVistaSubirProductos" class="contenedorVistaSubirProductos">
    <button class="btn btn-primary" style="margin-bottom: 30px;" id="botonSalirVistaSubirProducto">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
    </button>
    
    <div class="centrar-columnas">
        <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3" style="margin-bottom: 30px;">
            <label>Paises</label>
                <select multiple id="paisesProducto" name="paisesProducto" style="height: 45px;margin-bottom:10px;">
            </select>
            <span>precione Ctrl + shift</span>
        </div>
    </div>
    <h2 class="centrar-texto">Lista de productos seleccionados</h2>
    <button class="btn btn-primary" style="margin-bottom: 30px;" id="botonTestEnvio"">
        probar envio
    </button>
    <button class="btn btn-primary" style="margin-bottom: 30px;" id="botonConsultarPedidos"">
        consultar pedidos
    </button>

</div>

<script type="text/javascript" src="/modules/wbzalando/views/js/producto.js"></script>