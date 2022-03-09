// console.log("print('hola en mundo en python pero es realmente en javascript XD')")

let paises={}

let productosRespaldo={}
let listaProducutosPorPais={}

let productosModificados={}
let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")

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
            // insertarProductos(respuestaJson.datos);
        },
        error: () => {
        }
    });
}

function insertarProductos(productos){
    let listaDeProductosHaEliminar=document.getElementById("listaDeProductosHaEliminar");
    listaDeProductosHaEliminar.innerHTML="";
    let html="";
    listaProducutosPorPais={}
    for(let producto of productos){
        if(listaProducutosPorPais[producto.detallesDelProdcuto[0].id_modelo_producto]){
            listaProducutosPorPais[producto.detallesDelProdcuto[0].id_modelo_producto].push(producto)
        }
        else{
            listaProducutosPorPais[producto.detallesDelProdcuto[0].id_modelo_producto]=[]
            listaProducutosPorPais[producto.detallesDelProdcuto[0].id_modelo_producto].push(producto)
        }
        listaProducutosPorPais[producto.detallesDelProdcuto[0].id_modelo_producto]
       
    }

    console.log("datos =>>>>>>>>>>>>>>>>>>> ",listaProducutosPorPais)
    for(let idModeloProducto in listaProducutosPorPais){
        let producto=listaProducutosPorPais[idModeloProducto][0]
        let infoModelo=JSON.parse(producto.detallesDelProdcuto[0].json_modelo_producto)
        // let infoStock=producto.datosStock[0]
        // let infoPrecio=JSON.parse(producto.json_precio)
        // if(!productosRespaldo[idModeloProducto+"_"+producto.ean]){
        //     productosRespaldo[idModeloProducto+"_"+producto.ean]={
        //         ean:producto.ean,
        //         sales_channel_id:producto.sales_channel_id,
        //         stock:infoStock.quantity,
        //         moneda:infoPrecio.regular_price.currency,
        //         precioRegular:infoPrecio.regular_price.amount
        //     }
        //     if(producto.precioPromocion){
        //         let arrayFechaInicio=infoPrecio.scheduled_prices[0].start_time.split("T")[0]
        //         let arrayFechaFinal=infoPrecio.scheduled_prices[0].end_time.split("T")[0]
        //         productosRespaldo[idModeloProducto+"_"+producto.ean]["precioPromocion"]=infoPrecio.promotional_price.amount
        //         productosRespaldo[idModeloProducto+"_"+producto.ean]["fechaInicioPromocion"]=arrayFechaInicio
        //         productosRespaldo[idModeloProducto+"_"+producto.ean]["fechaFinPromocion"]=arrayFechaFinal
        //     }
        // }
        html+="\
        <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 modal-footer caj-product alignitem-tb p-10 global-input' style='cursor: pointer;' >\
        <div class='col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11  text-left' data-id-modelo='"+idModeloProducto+"' onClick='mostrarModalDatosProducto(this)' data-toggle='modal' data-target='#staticBackdrop'><div><h4 class='text-primary'>"+infoModelo.product_model_attributes.name+"</h4></div></div>\
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><div><button class='btn btn-danger'>Borrar</button></div></div>\
        </div>\
        ";
    }
    listaDeProductosHaEliminar.innerHTML=html
}

function mostrarModalDatosProducto(a){
    let idModelo=a.getAttribute("data-id-modelo")
    // alert(idModelo)
    let detalleProducto=null
    for(let idModeloProducto in listaProducutosPorPais){
        if(idModeloProducto===idModelo){
            detalleProducto=JSON.parse(JSON.stringify(listaProducutosPorPais[idModeloProducto]))
        }
    }
    console.log("datalles producto =>>>>>> ",detalleProducto)
    let preciosProducto=document.getElementById("preciosProducto")
    let nombreDelProductoDetalle=document.getElementById("nombreDelProductoDetalle")
    nombreDelProductoDetalle.textContent=JSON.parse(detalleProducto[0].detallesDelProdcuto[0].json_modelo_producto).product_model_attributes.name
    let precio=JSON.parse(detalleProducto[0].json_precio)
    let precioDescuento=""
    let fechaInicioDescuento=""
    let fechaFinalDescuento=""
    if(precio.promotional_price){
        precioDescuento=precio.promotional_price.amount
        fechaInicioDescuento=precio.scheduled_prices[0].start_time.split("T")[0]
        fechaFinalDescuento=precio.scheduled_prices[0].end_time.split("T")[0]
    }
    preciosProducto.innerHTML='\
        <div class="row">\
            <div class="form-group col-md-4">\
                <label for="">Precio Regular</label>\
                <input type="text" class="form-control" value="'+precio.regular_price.amount+'">\
            </div>\
        </div>\
        <div class="row">\
            <div class="form-group col-md-4">\
                <label for="">Precio Descuento</label>\
                <input type="text" class="form-control" value="'+precioDescuento+'">\
            </div>\
            <div class="form-group col-md-4">\
                <label for="">Fecha Inicio Descuento</label>\
                <input type="date" class="form-control" value="'+fechaInicioDescuento+'">\
            </div>\
            <div class="form-group col-md-4">\
                <label for="">Fecha Final Descuento</label>\
                <input type="date" class="form-control" value="'+fechaFinalDescuento+'">\
            </div>\
        </div>\
    '
    let tallasStock=document.getElementById("tallasStock")
    tallasStock.innerHTML=""
    let htmlTallaStock=""
    for(let datosProducto of detalleProducto){
        let stock=datosProducto.datosStock[0]
        let talla=JSON.parse(datosProducto.detallesDelProdcuto[0].json_simple_producto)
        // product_simple_attributes
        htmlTallaStock+='\
        <div class="row" >\
            <div class="form-group col-md-4" style="margin-bottom: 0px;padding-top: 10px;">\
                '+talla.product_simple_attributes.size_codes.size+'\
            </div>\
            <div class="form-group col-md-3">\
                <input type="text" class="form-control" value="'+stock.quantity+'">\
            </div>\
        </div>'
    }
    tallasStock.innerHTML=htmlTallaStock

}

function cargarDatosProductosModificados(){
    for(let id in productosModificados){
        if(document.getElementById(id+"_stock")){
            document.getElementById(id+"_stock").value=productosModificados[id].stock
            document.getElementById(id+"_precioRegular").value=productosModificados[id].precioRegular
            document.getElementById(id+"_precioPromocion").value=productosModificados[id].precioPromocion
            document.getElementById(id+"_fechaInicioPromocion").value=productosModificados[id].fechaInicioPromocion
            document.getElementById(id+"_fechaFinPromocion").value=productosModificados[id].fechaFinPromocion
        }
    }
}

function guardarModificaciones(){
    // alert("guardando")
    let productosModificadosValidados=obtenerSoloProductosModificados()
    console.log("estado validacion producto =>>> ",productosModificadosValidados)
    if(productosModificadosValidados.length>0){
        let precios=[]
        let stocks=[]
        for(let datos of productosModificadosValidados){
            if(datos.enviarStock===true){
                let formatoStock={
                    "sales_channel_id": datos.sales_channel_id,
                    "ean": datos.ean,
                    "quantity": parseInt(datos.stock)
                }
                stocks.push(JSON.stringify(formatoStock))
            }
            if(datos.enviarPrecio===true){
                let formatoPrecio={
                    "ean": datos.ean,
                    "sales_channel_id": datos.sales_channel_id,
                    "regular_price": {
                        "amount": parseFloat(datos.precioRegular),
                        "currency": datos.moneda
                    },
                    "promotional_price": {
                        "amount": parseFloat(datos.precioPromocion),
                        "currency": datos.moneda
                    },
                    "scheduled_prices": [
                        {
                            "regular_price": {
                                "amount": parseFloat(datos.precioRegular),
                                "currency": datos.moneda
                            },
                            "promotional_price": {
                                "amount": parseFloat(datos.precioPromocion),
                                "currency": datos.moneda
                            },
                            "start_time": `${datos.fechaInicioPromocion}T00:00:00.00Z`,
                            "end_time": `${datos.fechaFinPromocion}T00:00:00.00Z`
                        }
                    ],
                    "ignore_warnings": true
                }
                precios.push(JSON.stringify(formatoPrecio))
            }
            
        }
        console.log("stocks listo para enviar =>>>> ",stocks)
        console.log("precios listo para enviar =>>>> ",precios)
        const linkControlador=document.getElementById("linkControlador").value;
        $.ajax({
            type: 'POST',
            cache: false,
            dataType: 'json',
            url: linkControlador, 
            data: {
                ajax: true,
                action: 'postmodificarProductos',
                stocks,
                precios
            },
            success: (respuesta) => {
                // console.log(respuesta);
                let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
                console.log("producto Eliminado =>>>>> ",respuestaJson)
            },
            error: () => {
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
            }
        });

    }
    else{
        alert("no hay productos modificados")
    }

}

function obtenerSoloProductosModificados(){
    let listaDeProductosModificados=[]
    for(let id in productosRespaldo){
        if(productosRespaldo[id] && productosModificados[id]){
            let productoRespaldo=productosRespaldo[id]
            let productoModificado=productosModificados[id]
            productoModificado["enviarStock"]=false
            productoModificado["enviarPrecio"]=false
            // if(
            //     productoModificado.precioPromocion!==productoRespaldo.precioPromocion ||  
            //     productoModificado.precioRegular!==productoRespaldo.precioRegular  ||
            //     !moment(productoRespaldo.fechaInicioPromocion).isSame(productoModificado.fechaInicioPromocion) ||
            //     !moment(productoRespaldo.fechaFinPromocion).isSame(productoModificado.fechaFinPromocion) ||
            //     productoModificado.stock!==productoRespaldo.stock
            // ){
            //     listaDeProductosModificados.push(productoModificado)
            // }
            if(productoModificado.stock!==productoRespaldo.stock){
                productoModificado["enviarStock"]=true
            }
            if(
                productoModificado.precioPromocion!==productoRespaldo.precioPromocion ||  
                productoModificado.precioRegular!==productoRespaldo.precioRegular  ||
                !moment(productoRespaldo.fechaInicioPromocion).isSame(productoModificado.fechaInicioPromocion) ||
                !moment(productoRespaldo.fechaFinPromocion).isSame(productoModificado.fechaFinPromocion) 
            ){
                productoModificado["enviarPrecio"]=true
            }
            listaDeProductosModificados.push(productoModificado)
        }
    }
    return listaDeProductosModificados
}



function modificandoProducucto(a){
    // productosModificados
    let idProducto=a.getAttribute("data-id-producto")
    let propiedad=a.getAttribute("data-propiedad")
    if(!productosModificados[idProducto]){
        // alert("no existe por eso se crea")
        let copiaDeProducto=JSON.parse(JSON.stringify(productosRespaldo[idProducto]))
        productosModificados[idProducto]=copiaDeProducto;
    }
    productosModificados[idProducto][propiedad]=a.value;
    console.log("producto =>>>>> ",productosModificados[idProducto])
}

async function eliminarProducto(e){
    // alert(e.id)
    const linkControlador=document.getElementById("linkControlador").value;
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
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
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            consultarProductosPorPais2(checkboxsPaises[0].value)
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}

function consultarPaisesZalando(){
    const linkControlador=document.getElementById("linkControlador").value;
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
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
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        },
        error: () => {
            // alert("error al conectar con el servidor");
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}

function crearCheckboxPaisTest(paises){
    let contenedorBanderas=document.getElementById("paisesRadio");
    let sliderPaises=document.getElementById("slider-paises");
    sliderPaises.innerHTML=""
    contenedorBanderas.innerHTML="";
    for(let pais of paises){
        paises[pais.sales_channel_id]=true;
        let htmlCheckbox="\
            <div style='display:none;'>\
                <input type='radio'  class='checkbox-paises' value='"+pais.sales_channel_id+"' id='"+pais.sales_channel_id+"' name='radio-paises' data-nombre-pais='"+pais.country_name+"' data-iso-code='"+pais.country_code+"' onChange='consultarProductosPorPais(this)'/>\
                "+pais.country_name+"\
            </div>\
        ";
        let htmlBotonPais="\
            <div class=''>\
                <label for='"+pais.sales_channel_id+"' class='btn btn-primary'>\
                "+pais.country_name+"\
                </label>\
            </div>\
        ";
        sliderPaises.innerHTML+=htmlBotonPais
        contenedorBanderas.innerHTML+=htmlCheckbox;
    }
    iniciarSlick()
}

function iniciarSlick(){
    var slider = document.querySelector('#slider-paises');
    if(slider.children.length > 0){
        $('#slider-paises').slick({
            infinite: true,
            prevArrow: '<span class="prev-arrow btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg></span>',
            nextArrow: '<span class="next-arrow btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></span>',
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                  breakpoint: 1920,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true
                  }
                },
                {
                  breakpoint: 1600,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true
                  }
                },
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true
                  }
                },
                {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      infinite: true
                    }
                  }
              ]
        })
    }else {
        iniciarSlick()
    }
}

function consultarProductosPorPais(a){
    let controlesPaginacion=document.getElementById("controlesPaginacion")
    controlesPaginacion.innerHTML="";
    let pagina=1;
    if(a!=1){
        pagina=(a.getAttribute("data-numero-pagina"))?a.getAttribute("data-numero-pagina"):1
    }
    let checkboxsPaises=document.querySelectorAll(".checkbox-paises:checked");
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarproductosporpais',
            codigoPais:checkboxsPaises[0].value,
            pagina
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta))
            console.log("productos filtrados por pais =>>>> ",respuestaJson)
            insertarProductos(respuestaJson.respuestaServidor.datos)
            if(respuestaJson.respuestaServidor.totalRegistros>1){
                insertarControlesPaginacion();
                let paginaAnt=document.getElementById("pagina-ant")
                let paginaSig=document.getElementById("pagina-sig")
                paginaSig.style.display="block"
                paginaAnt.style.display="block"
                if(parseInt(pagina)===respuestaJson.respuestaServidor.totalDePagina){
                    paginaSig.setAttribute("data-numero-pagina",respuestaJson.respuestaServidor.totalDePagina)
                    paginaSig.style.display="none"
                }
                else if(parseInt(pagina)<respuestaJson.respuestaServidor.totalDePagina){
                    paginaSig.setAttribute("data-numero-pagina",(parseInt(pagina)+1))
                }
                if(parseInt(pagina)===1){
                    paginaAnt.setAttribute("data-numero-pagina",1)
                    paginaAnt.style.display="none"
                }
                else if(parseInt(pagina)<=respuestaJson.respuestaServidor.totalDePagina){
                    paginaAnt.setAttribute("data-numero-pagina",(parseInt(pagina)-1))
                }
                insertarBotonesPaginasPaginacion(pagina,respuestaJson.respuestaServidor.totalDePagina)
            }
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            // alert("error al conectar con el servidor");
        }
    });
}

function insertarControlesPaginacion(){
    let controlesPaginacion=document.getElementById("controlesPaginacion")
    // controlesPaginacion.innerHTML="";
    let html="\
        <div class='estructura-paginador'>\
        <button id='pagina-ant' onClick='consultarProductosPorPais(this)'>\
            <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' class='bi bi-arrow-left-circle-fill' viewBox='0 0 16 16'>\
            <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z'/>\
            </svg>\
        </button>\
        <div id='lista-paginas'></div>\
        <button id='pagina-sig' onClick='consultarProductosPorPais(this)'>\
        <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' class='bi bi-arrow-right-circle-fill' viewBox='0 0 16 16'>\
        <path d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z'/>\
        </svg>\
        </button></div>"
    controlesPaginacion.innerHTML=html;
}

function insertarBotonesPaginasPaginacion(pagina,totalDePagina){
    let minimoPagina=5
    pagina=parseInt(pagina)
    let listaPaginas=document.getElementById("lista-paginas")
    listaPaginas.innerHTML=""
    let contador=0;
    let htmlBotonesPaginacion="";
    let agregarPrimeraPagina=false
    let agregarUltimaPagina=false
    while(contador<totalDePagina){
        let paginaBoton=(contador+1)
        let boton=""
        if(paginaBoton===pagina){
            boton+="<button onClick='consultarProductosPorPais(this)' style='color: #1900e7 !important; text-decoration: underline;' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
            if((totalDePagina-1)===pagina){
                agregarUltimaPagina=true
            }
            if(pagina>2){
                agregarPrimeraPagina=true
            }
            else{
                if(document.getElementById("primera-pagina")){
                    let primeraPagina=document.getElementById("primera-pagina")
                    primeraPagina.remove()
                }
            }
        }
        if(paginaBoton===pagina+1){
            boton+="<button onClick='consultarProductosPorPais(this)' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
        }
        if(paginaBoton===pagina-1 && paginaBoton!==0){
            boton+="<button onClick='consultarProductosPorPais(this)' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
        }
        contador++
    }
    if(totalDePagina>pagina && agregarUltimaPagina===false){
        htmlBotonesPaginacion+="<button onClick='consultarProductosPorPais(this)' id='ultima-pagina' class='ultima-pagina' data-numero-pagina='"+totalDePagina+"'>"+totalDePagina+"</button>";
    }
    if(agregarPrimeraPagina){
        listaPaginas.insertAdjacentHTML("afterBegin","<button onClick='consultarProductosPorPais(this)' id='primera-pagina' class='primera-pagina' data-numero-pagina='"+1+"'>"+1+"</button>")
    }
    listaPaginas.innerHTML+=htmlBotonesPaginacion;
}

function consultarProductosPorPais2(idPais){
    // alert(a.id)
    const linkControlador=document.getElementById("linkControlador").value;
    let pagina=1
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarproductosporpais',
            codigoPais:idPais,
            pagina
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta))
            console.log("productos filtrados por pais =>>>> ",respuestaJson)
            insertarProductos(respuestaJson.respuestaServidor.datos)
            if(respuestaJson.respuestaServidor.totalRegistros>1){
                insertarControlesPaginacion();
                let paginaAnt=document.getElementById("pagina-ant")
                let paginaSig=document.getElementById("pagina-sig")
                paginaSig.style.display="block"
                paginaAnt.style.display="block"
                if(parseInt(pagina)===respuestaJson.respuestaServidor.totalDePagina){
                    paginaSig.setAttribute("data-numero-pagina",respuestaJson.respuestaServidor.totalDePagina)
                    paginaSig.style.display="none"
                }
                else if(parseInt(pagina)<respuestaJson.respuestaServidor.totalDePagina){
                    paginaSig.setAttribute("data-numero-pagina",(parseInt(pagina)+1))
                }
                if(parseInt(pagina)===1){
                    paginaAnt.setAttribute("data-numero-pagina",1)
                    paginaAnt.style.display="none"
                }
                else if(parseInt(pagina)<=respuestaJson.respuestaServidor.totalDePagina){
                    paginaAnt.setAttribute("data-numero-pagina",(parseInt(pagina)-1))
                }
                insertarBotonesPaginasPaginacion(pagina,respuestaJson.respuestaServidor.totalDePagina)
            }
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        },
        error: () => {
            // alert("error al conectar con el servidor");
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}

consultarPaisesZalando();
