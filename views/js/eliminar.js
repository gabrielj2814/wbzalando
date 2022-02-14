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
        html+="\
        <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 modal-footer alignitem-tb p-10 global-input'>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><div><h4 class='text-primary'>"+jsonModelo.product_model_attributes.name+"</h4></div></div>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><div><h4 class='text-center'>11000</h4></div></div>\
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xs-1 text-left'><div><h4 class='text-center'>€1200</h4></div></div>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><div><h4 class='text-center'>€200</h4></div></div>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><div><h4 class='text-center'>12/12/21</h4></div></div>\
        <div class='col-3 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><button style='border: unset;'><img src='https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/50/000000/external-delete-miscellaneous-kiranshastry-lineal-kiranshastry.png' width='24px'/></button></div>\
        ";
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