let botonFiltroProducto=document.getElementById("botonFiltroProducto") 
let nombreProducto=document.getElementById("nombreProducto") 


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

function filtrarProductosPorNombre(e){
    alert("hola")
    // const linkControlador=document.getElementById("linkControlador").value;
    // let categoriaProducto=document.getElementById("categoriaProducto");
    // let marcaProducto=document.getElementById("marcaProducto");
    // categoriaProducto.setAttribute("disable",true)
    // marcaProducto.setAttribute("disable",true)
    // alert(datosFiltro.get("categoriaProducto"))
    // $.ajax({
    //     type: 'POST',
    //     cache: false,
    //     dataType: 'json',
    //     url: linkControlador, 
    //     data: {
    //         ajax: true,
    //         action: 'getconsultarproductoconfiltros',
    //         categoriaProducto,
    //         marcaProducto
    //     },
    //     success: (respuesta) => {
    //         console.log(respuesta);
    //         let datos=respuesta.datos
    //         insertarDatosTablaProducto(datos);
    //     },
    //     error: () => {
    //         alert("error al conectar con el servidor");
    //     }
    // });
}

function bloquearFiltros(){
    console.log("bloqueando filtros")
    let categoriaProducto=document.getElementById("categoriaProducto");
    let marcaProducto=document.getElementById("marcaProducto");
    categoriaProducto.setAttribute("readonly",true)
    marcaProducto.setAttribute("readonly",true)
}

function desbloquearFiltros(){
    console.log("desbloqueando filtros")
    let categoriaProducto=document.getElementById("categoriaProducto");
    let marcaProducto=document.getElementById("marcaProducto");
    categoriaProducto.removeAttribute("readonly")
    marcaProducto.removeAttribute("readonly")
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
    if(datos.length===0){
        filasTablas="\
             <tr >\
                <td colspan='4' class='producto_tabla_td_pdd_tb'><center>Sin resultados</center></td>\
            </tr>";
    }
    tabla.innerHTML=filasTablas;
}

botonFiltroProducto.addEventListener("click", filtrarProductos)
// nombreProducto.addEventListener("keyup", filtrarProductosPorNombre)
nombreProducto.addEventListener("focus", bloquearFiltros)
nombreProducto.addEventListener("blur", desbloquearFiltros)

consultarProductos();