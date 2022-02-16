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
        <div class='col-3 col-sm-2 col-md-2 col-lg-2 col-xl-3 col-xs-2 text-left'><button style='border: unset;' id='"+jsonModelo.merchant_product_model_id+"' onClick='eliminarProducto(this)'><svg width='24' height='24' fill='currentColor' class='bi bi-trash3' viewBox='0 0 16 16'><path d='M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z'/></svg></button></div></div>\
        ";
        // html+=producto.ean+" - "+producto.sales_channel_id;
    }
    listaDeProductosHaEliminar.innerHTML=html

}

async function eliminarProducto(e){
    // alert(e.id)
    const linkControlador=document.getElementById("linkControlador").value;
    let idModelo=e.getAttribute("data-id-modelo")
    let idConfig=e.getAttribute("data-id-config")
    let ean=e.getAttribute("data-ean")
    let idPais=e.getAttribute("data-id-pais")
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'geteliminarproducto',
            idModelo,
            idConfig,
            ean,
            idPais
        },
        success: (respuesta) => {
            // console.log(respuesta);
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("producto Eliminado =>>>>> ",respuestaJson)
            let checkboxsPaises=document.querySelectorAll(".checkbox-paises:checked");
            consultarProductosPorPais2(checkboxsPaises[0].value)
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
    let contenedorBanderas=document.getElementById("paisesRadio");
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
function consultarProductosPorPais2(idPais){
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
            codigoPais:idPais
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
