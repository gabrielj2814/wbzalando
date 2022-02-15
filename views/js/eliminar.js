// console.log("print('hola en mundo en python pero es realmente en javascript XD')")

let paises={}

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
    listaDeProductosHaEliminar.innerHTML="";
    let html="";
    for(let producto of productos){
        let infoModelo=JSON.parse(producto.detallesDelProdcuto[0].json_modelo_producto)
        let infoConfig=JSON.parse(producto.detallesDelProdcuto[0].json_configuracion_producto)
        let infoSimple=JSON.parse(producto.detallesDelProdcuto[0].json_simple_producto)
        let infoPrecio=JSON.parse(producto.json_precio)
        let arrayFecha=infoPrecio.scheduled_prices[0].end_time.split("T")[0].split("-")
        html+="\
        <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 modal-footer alignitem-tb p-10 global-input'>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><div><h4 class='text-primary'>"+infoModelo.product_model_attributes.name+"</h4></div></div>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><div><h4 class='text-center'>"+producto.quantity+"</h4></div></div>\
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xs-1 text-left'><div><h4 class='text-center'>"+infoPrecio.regular_price.currency+" "+infoPrecio.regular_price.amount+"</h4></div></div>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><div><h4 class='text-center'>"+infoPrecio.promotional_price.currency+" "+infoPrecio.promotional_price.amount+"</h4></div></div>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><div><h4 class='text-center'>"+arrayFecha[2]+"/"+arrayFecha[1]+"/"+arrayFecha[0]+"</h4></div></div>\
        <div class='col-3 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><button style='border: unset;' id='-' onClick='eliminarProducto(this)'><img src='https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/50/000000/external-delete-miscellaneous-kiranshastry-lineal-kiranshastry.png' width='24px'/></button></div></div>\
        ";
        // html+=producto.ean+" - "+producto.sales_channel_id;
    }
    listaDeProductosHaEliminar.innerHTML=html

}

async function eliminarProducto(e){
    // alert(e.id)
    const linkControlador=document.getElementById("linkControlador").value;
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'geteliminarproducto',
            id:e.id
        },
        success: (respuesta) => {
            // console.log(respuesta);
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("producto Eliminado =>>>>> ",respuestaJson)
            consultarProductosWBZalando()
        },
        error: () => {
        }
    });
}

function consultarPaisesZalando(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarpaiseszalando'
        },
        success: (respuesta) => {
            // consultarProductosWBZalando();
            let datos=JSON.parse(JSON.stringify(respuesta))
            if(datos.respuestaServidor.items){
                console.log("paises zalando =>>> ",datos)
                crearCheckboxPaisTest(datos.respuestaServidor.items);
            }
            if(datos.respuestaServidor.status && datos.respuestaServidor.status==401){
                console.log("respuesta en 401 =>>>>> " ,datos.respuestaServidor);
            }
        },
        error: () => {
            // alert("error al conectar con el servidor");
        }
    });
}

function crearCheckboxPaisTest(paises){
    let contenedorBanderas=document.getElementById("paisesHaEnviar");
    contenedorBanderas.innerHTML="";
    for(let pais of paises){
        paises[pais.sales_channel_id]=true;
        let htmlCheckbox="\
            <label>\
                <input type='radio'  class='checkbox-paises' value='"+pais.sales_channel_id+"' id='"+pais.sales_channel_id+"' name='radio-paises' data-nombre-pais='"+pais.country_name+"' data-iso-code='"+pais.country_code+"' onChange='consultarProductosPorPais(this)'/>\
                "+pais.country_name+"\
            </label>\
        ";
        contenedorBanderas.innerHTML+=htmlCheckbox;
    }
}

function consultarProductosPorPais(a){
    // alert(a.id)
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarproductosporpais',
            codigoPais:a.id
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta))
            console.log("productos filtrados por pais =>>>> ",respuestaJson)
            insertarProductos(respuestaJson.respuestaServidor.datos)
        },
        error: () => {
            // alert("error al conectar con el servidor");
        }
    });
}
consultarPaisesZalando();
