
function filtrarProductos(e){
    e.preventDefault();
    const linkControlador=document.getElementById("linkControlador").value;
    let categoriaProducto=document.getElementById("categoriaProducto").value;
    let marcaProducto=document.getElementById("marcaProducto").value;
    // alert(datosFiltro.get("categoriaProducto"))
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarproductoconfiltros',
            categoriaProducto,
            marcaProducto
        },
        success: (respuesta) => {
            console.log(respuesta);
            let datos=respuesta.datos
            insertarDatosTablaProducto(datos);
        },
        error: () => {
            alert("error al conectar con el servidor");
        }
    });
}

function consultarProductos(){
    const linkControlador=document.getElementById("linkControlador").value;
    // alert(datosFiltro.get("categoriaProducto"))
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarproductos'
        },
        success: (respuesta) => {
            // console.log(respuesta);
            let datos=respuesta.datos
            insertarDatosTablaProducto(datos);
        },
        error: () => {
            alert("error al conectar con el servidor");
        }
    });
}

function insertarDatosTablaProducto(datos){
    let tabla=document.getElementById("tablaProductos");
    tabla.innerHTML="";
    let filasTablas=""
    for(let producto of datos){
        let html="\
            <tr >\
                <td class='producto_tabla_td_pdd_tb'><input type='checkbox' class='form-check-input producto_centrar_checkbox_tabla_celda' name='array_productos[]' value='"+producto.id_product+"'/></td>\
                <td class='producto_tabla_td_pdd_tb'>"+producto.id_product+"</td>\
                <td class='producto_tabla_td_pdd_tb'><img style='width: 45px;height: 45px;display: inline-block;margin-right: 15px;' src='"+producto.urlImagen+"'/>"+producto.name+"</td>\
                <td class='producto_tabla_td_pdd_tb'>"+producto.ean13+"</td>\
            </tr>";
        filasTablas+=html;
    }
    tabla.innerHTML=filasTablas;
}

botonFiltroProducto.addEventListener("click", filtrarProductos)

consultarProductos();