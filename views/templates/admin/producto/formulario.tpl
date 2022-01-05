<div class="formulario">
    <a href="{$linkControlador}{"&vista=inicio"}" class="btn btn-primary mb-15">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
    </a>

   <form>
   
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
        </div>
        <table class="table">
            <thead>
                <tr>
                <th scope="col"></th>
                <th scope="col">ID</th>
                <th scope="col">Nombre de Producto</th>
                <th scope="col">Referencia (EAN)</th>
                </tr>
            </thead>
            <tbody>
            {foreach $productos as $producto}

                <tr >
                    <td class="producto_tabla_td_pdd_tb"><input type="checkbox" class="form-check-input producto_centrar_checkbox_tabla_celda" name="array_productos[]" value="{$producto["id_product"]}"/></td>
                    <td class="producto_tabla_td_pdd_tb">{$producto["id_product"]}</td>
                    <td class="producto_tabla_td_pdd_tb"><img style="width: 45px;height: 45px;display: inline-block;margin-right: 15px;" src="{$producto["urlImagen"]}"/>{$producto["name"]}</td>
                    <td class="producto_tabla_td_pdd_tb">{$producto["ean13"]}</td>
                </tr>

            {/foreach}
            
                
            </tbody>
        </table>
   
   
   
   </form>


</div>