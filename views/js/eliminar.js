console.log("print('hola en mundo en python pero es realmente en javascript XD')")

async function consultarProductosWBZalando(){
    const linkDeControladorProducto=document.getElementById("linkDeControladorProducto").value;
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorProducto, 
        data: {
            ajax: true,
            action: 'getconsultarproductoswbzalando',
        },
        success: (respuesta) => {
            // console.log(respuesta);
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("datos consultados productos zalando =>>>>> ",respuestaJson)
            insertarProductos(respuestaJson.datos);
        },
        error: () => {
        }
    });
}

function insertarProductos(productos){
    let listaDeProductosHaEliminar=document.getElementById("listaDeProductosHaEliminar");
    let html="";
    for(let producto of productos){
        let jsonModelo=JSON.parse(producto.json_modelo_producto);
        console.log("json =>>>>>>>>>>>>> ",jsonModelo)
        html+="<h1>"+jsonModelo.product_model_attributes.name+"</h1>";
    }
    listaDeProductosHaEliminar.innerHTML=html

}

async function eliminarProducto(id){
    const linkControlador=document.getElementById("linkControlador").value;
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'geteliminarproducto',
            id
        },
        success: (respuesta) => {
            // console.log(respuesta);
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("producto Eliminado =>>>>> ",respuestaJson)
        },
        error: () => {
        }
    });
}

consultarProductosWBZalando();