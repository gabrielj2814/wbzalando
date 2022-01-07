let listaProductos=[]

let botonFiltroProducto=document.getElementById("botonFiltroProducto") 
let nombreProducto=document.getElementById("nombreProducto") 
let obtenerProductos=document.getElementById("obtenerProductos") 


function filtrarProductos(e){
    e.preventDefault();
    const linkControlador=document.getElementById("linkControlador").value;
    let categoriaProducto=document.getElementById("categoriaProducto").value;
    let marcaProducto=document.getElementById("marcaProducto").value;
    let nombreProducto=document.getElementById("nombreProducto").value;
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
            marcaProducto,
            nombreProducto
        },
        success: (respuesta) => {
            // console.log(respuesta);
            listaProductos=JSON.parse(JSON.stringify(respuesta.datos))
            let datos=JSON.parse(JSON.stringify(respuesta.datos))
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
            listaProductos=JSON.parse(JSON.stringify(respuesta.datos))
            let datos=JSON.parse(JSON.stringify(respuesta.datos))
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

function obtenerProductosSeleccionados(){
    let datosFormularioTabla=new FormData(document.getElementById("formTablaProductos"))
    console.log(mostrarDatosFormData(datosFormularioTabla))
    console.log(listaProductos)
}

function mostrarDatosFormData(formData){
    // let json={}
    let json=[]
    let iterador = formData.entries()
    let next= iterador.next();
    while(!next.done){
        // json[next.value[0]]=next.value[1]
        json.push({name:next.value[0],value:next.value[1]})
        next=iterador.next()
    }
    return json 
}

botonFiltroProducto.addEventListener("click", filtrarProductos)
nombreProducto.addEventListener("keyup", filtrarProductos)
obtenerProductos.addEventListener("click", obtenerProductosSeleccionados)
consultarProductos();