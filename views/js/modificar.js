let paises={}

let productosRespaldo={}
let listaProducutosPorPais={}

let productosModificados={}
let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")

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
        // <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><div><button class='btn btn-danger' data-id-modelo='"+idModeloProducto+"' onClick='eliminarProducto(this)'>Borrar</button></div></div>\
        html+="\
        <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 modal-footer caj-product alignitem-tb p-10 global-input fila-producto-eliminar' style='cursor: pointer;' >\
        <div class='col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11  text-left' data-id-modelo='"+idModeloProducto+"' onClick='mostrarModalDatosProducto(this)' data-toggle='modal' data-target='#staticBackdrop'><div><h4 class='text-primary'>"+infoModelo.product_model_attributes.name+"</h4></div></div>\
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><div><button class='btn btn-danger' data-id-modelo='"+idModeloProducto+"' onClick='eliminarProducto(this)'>\
            <svg data-id-modelo='"+idModeloProducto+"' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash-fill' viewBox='0 0 16 16'>\
                <path data-id-modelo='"+idModeloProducto+"' d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z'/>\
            </svg>\
        </button></div></div>\
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
                <input type="text" class="form-control" id="'+idModelo+'_precio_regular" data-id-modelo="'+idModelo+'" data-campo="precioRegular" onKeyup="capturarGeneral(this)" value="'+precio.regular_price.amount+'">\
            </div>\
        </div>\
        <div class="row">\
            <div class="form-group col-md-3">\
                <label for="">Precio Descuento</label>\
                <input type="text" class="form-control" id="'+idModelo+'_precio_descuento" data-id-modelo="'+idModelo+'" data-campo="precioPromocion" onKeyup="capturarGeneral(this)" value="'+precioDescuento+'">\
            </div>\
            <div class="form-group col-md-3">\
                <label for="">Fecha Inicio Descuento</label>\
                <input type="date" class="form-control" id="'+idModelo+'_fecha_inicio_descuento" data-id-modelo="'+idModelo+'" data-campo="fechaInicioPromocion" onBlur="capturarGeneral(this)" value="'+fechaInicioDescuento+'">\
            </div>\
            <div class="form-group col-md-3">\
                <label for="">Fecha Final Descuento</label>\
                <input type="date" class="form-control" id="'+idModelo+'_fecha_final_descuento" data-id-modelo="'+idModelo+'" data-campo="fechaFinPromocion" onBlur="capturarGeneral(this)" value="'+fechaFinalDescuento+'">\
            </div>\
            <div class="form-group col-md-3">\
                <label for="">Enviar descuento</label>\
                <input type="checkbox" class="form-control" id="'+idModelo+'_enviar_descuento" data-id-modelo="'+idModelo+'" data-campo="enviar_descuento" onBlur="capturarGeneral(this)">\
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
            <div class="form-group col-md-3" style="margin-bottom: 0px;padding-top: 10px;">\
                '+talla.product_simple_attributes.size_codes.size+'\
            </div>\
            <div class="form-group col-md-3">\
                <input type="text" class="form-control" id="'+idModelo+'_'+stock.ean+'_stock" data-id-modelo="'+idModelo+'" data-campo="stock" data-ean="'+stock.ean+'" onKeyup="capturarStockDeTallasProductos(this)" value="'+stock.quantity+'">\
            </div>\
            <div class="form-group col-md-3" >\
                <input type="checkbox" class="form-control" id="'+idModelo+'_'+stock.ean+'_enviar_stock" data-id-modelo="'+idModelo+'" data-ean="'+stock.ean+'" data-campo="enviar_stock" onClick="capturarStockDeTallasProductos(this)">\
            </div>\
        </div>'
    }
    let modalFooter=document.getElementById("modalFooter")
    modalFooter.innerHTML='\
    <button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>\
    <button type="button" data-id-modelo="'+idModelo+'" id="guardarPrecio" onClick="guardarPrecioDeProducto(this)" class="btn btn-primary">Guardar Precio</button>\
    <button type="button" data-id-modelo="'+idModelo+'" id="guardarStock" onClick="guardarStockDeProducto(this)" class="btn btn-primary">Guardar Stock</button>\
    '
    tallasStock.innerHTML=htmlTallaStock
    mostrarDatosProductosModificados(idModelo)
}

function mostrarDatosProductosModificados(idModelo){
    for(let idProducto in productosModificados){
        let idModeloProducto=idProducto.split("_")[0]
        if(idModelo===idModeloProducto){
            let producto=JSON.parse(JSON.stringify(productosModificados[idProducto]))
            document.getElementById(idModelo+"_precio_regular").value=producto.precioRegular
            document.getElementById(idModelo+"_"+producto.ean+"_stock").value=producto.stock
            document.getElementById(idModelo+"_"+producto.ean+"_enviar_stock").checked=producto.enviar_stock
            if(producto.precioPromocion){
                if(parseFloat(producto.precioPromocion)>0 || producto.precioPromocion!=="") {
                    document.getElementById(idModelo+"_precio_descuento").value=producto.precioPromocion
                    document.getElementById(idModelo+"_fecha_inicio_descuento").value=producto.fechaInicioPromocion
                    document.getElementById(idModelo+"_fecha_final_descuento").value=producto.fechaFinPromocion
                    document.getElementById(idModelo+"_enviar_descuento").checked=producto.enviar_descuento
                }
                else{
                    productosModificados[idProducto].fechaInicioPromocion=""
                    productosModificados[idProducto].fechaFinPromocion=""
                    productosModificados[idProducto].enviar_descuento=false
                }
            }
            else{
                productosModificados[idProducto].enviar_descuento=false
            }
        }
    }
}

function registrarndoProductosModificados(idModelo){
    for(let producto of listaProducutosPorPais[idModelo]){
        if(!productosModificados[idModelo+"_"+producto.ean]){
            producto=JSON.parse(JSON.stringify(producto))
            let infoStock=producto.datosStock[0]
            let infoPrecio=JSON.parse(producto.json_precio)
            productosModificados[idModelo+"_"+producto.ean]={
                ean:producto.ean,
                sales_channel_id:producto.sales_channel_id,
                stock:infoStock.quantity,
                moneda:infoPrecio.regular_price.currency,
                precioRegular:infoPrecio.regular_price.amount,
                enviar_stock:false,
                enviar_descuento:false
            }
            if(infoPrecio.promotional_price){
                let arrayFechaInicio=infoPrecio.scheduled_prices[0].start_time.split("T")[0]
                let arrayFechaFinal=infoPrecio.scheduled_prices[0].end_time.split("T")[0]
                productosModificados[idModelo+"_"+producto.ean]["precioPromocion"]=infoPrecio.promotional_price.amount
                productosModificados[idModelo+"_"+producto.ean]["fechaInicioPromocion"]=arrayFechaInicio
                productosModificados[idModelo+"_"+producto.ean]["fechaFinPromocion"]=arrayFechaFinal
            }
        }

    }
}

function capturarGeneral(a){
    let idModelo=a.getAttribute("data-id-modelo")
    let campo=a.getAttribute("data-campo")
    registrarndoProductosModificados(idModelo)
    // productosModificados[]
    for(let producto of listaProducutosPorPais[idModelo]){
        if(a.type==="checkbox"){
            productosModificados[idModelo+"_"+producto.ean][campo]=a.checked
        }
        else{
            productosModificados[idModelo+"_"+producto.ean][campo]=a.value
        }
    }
    console.log("productos registrados =>>>> ",productosModificados)

}

function capturarStockDeTallasProductos(a){
    let idModelo=a.getAttribute("data-id-modelo")
    let campo=a.getAttribute("data-campo")
    let ean=a.getAttribute("data-ean")
    registrarndoProductosModificados(idModelo)
    if(a.type==="checkbox"){
        productosModificados[idModelo+"_"+ean][campo]=a.checked
    }
    else{
        productosModificados[idModelo+"_"+ean][campo]=a.value
    }
    console.log("productos registrados =>>>> ",productosModificados)
}

function  guardarStockDeProducto(a){
    const linkControlador=document.getElementById("linkControlador").value;
    let idModelo=a.getAttribute("data-id-modelo")
    // alert("id modelo "+idModelo)
    let stocks=[]
    for(let idProducto in productosModificados){
        let idModeloProducto=idProducto.split("_")[0]
        if(idModelo===idModeloProducto){
            let datosProducto=JSON.parse(JSON.stringify(productosModificados[idProducto]))
            if(datosProducto.enviar_stock===true){
                let stock={
                    "sales_channel_id": datosProducto.sales_channel_id,
                    "ean": datosProducto.ean,
                    "quantity": parseInt(datosProducto.stock)
                }
                stocks.push(JSON.stringify(stock))
            }
        }
    }
    console.log("stocks a enviar =>>>> ",stocks)
    if(stocks.length>0){
        preloader.style.opacity="1"
        bodyPleloader.style.overflow="hidden"
        $.ajax({
            type: 'POST',
            cache: false,
            dataType: 'json',
            url: linkControlador, 
            data: {
                ajax: true,
                action: 'postmodificarProductos',
                stocks
            },
            success: (respuesta) => {
                let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
                console.log("stock de producto modificado =>>>>> ",respuestaJson)
                preloader.style.opacity="0"
                mostrarAlerta("alert-success","El stock a sido enviado correctamente")
            },
            error: () => {
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
                mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
            }
        });
    }
    else{
        // alert("no stocks para enviar en este producto")
        mostrarAlerta("alert-danger","no hay stock para enviar en este producto")
    }
    
}

function  guardarPrecioDeProducto(a){
    const linkControlador=document.getElementById("linkControlador").value;
    let idModelo=a.getAttribute("data-id-modelo")
    // alert("id modelo "+idModelo)
    let precios=[]
    for(let idProducto in productosModificados){
        let idModeloProducto=idProducto.split("_")[0]
        if(idModelo===idModeloProducto){
            let datosProducto=JSON.parse(JSON.stringify(productosModificados[idProducto]))
            if(datosProducto.enviar_descuento===true){
                let precio={
                    "ean": datosProducto.ean,
                    "sales_channel_id": datosProducto.sales_channel_id,
                    "regular_price": {
                        "amount": parseFloat(datosProducto.precioRegular),
                        "currency": datosProducto.moneda
                    },
                    "promotional_price": {
                        "amount": parseFloat(datosProducto.precioPromocion),
                        "currency": datosProducto.moneda
                    },
                    "scheduled_prices": [
                        {
                            "regular_price": {
                                "amount": parseFloat(datosProducto.precioRegular),
                                "currency": datosProducto.moneda
                            },
                            "promotional_price": {
                                "amount": parseFloat(datosProducto.precioPromocion),
                                "currency": datosProducto.moneda
                            },
                            "start_time": `${datosProducto.fechaInicioPromocion}T00:00:00.00Z`,
                            "end_time": `${datosProducto.fechaFinPromocion}T00:00:00.00Z`
                        }
                    ],
                    "ignore_warnings": true
                }
                precios.push(JSON.stringify(precio))
            }
            else{
                let precio={
                    "ean": datosProducto.ean,
                    "sales_channel_id": datosProducto.sales_channel_id,
                    "regular_price": {
                        "amount": parseFloat(datosProducto.precioRegular),
                        "currency": datosProducto.moneda
                    }
                }
                precios.push(JSON.stringify(precio))
            }
        }
    }
    console.log("precios a enviar =>>>> ",precios)
    if(precios.length>0){
        preloader.style.opacity="1"
        bodyPleloader.style.overflow="hidden"
        $.ajax({
            type: 'POST',
            cache: false,
            dataType: 'json',
            url: linkControlador, 
            data: {
                ajax: true,
                action: 'postmodificarProductos',
                precios
            },
            success: (respuesta) => {
                let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
                console.log("precios de producto modificado =>>>>> ",respuestaJson)
                preloader.style.opacity="0"
                mostrarAlerta("alert-success","El precio a sido enviado correctamente")
            },
            error: () => {
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
                mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
            }
        });
    }
    else{
        // alert("no precios para enviar en este producto")
        mostrarAlerta("alert-danger","no hay precios de producto para enviar")
    }

}

function eliminarProducto(a){
    let idModelo=a.getAttribute("data-id-modelo")
    let listaEansProductos=[]
    for(let producto of listaProducutosPorPais[idModelo]){
        listaEansProductos.push({
            ean:producto.ean,
            idPais:producto.sales_channel_id
        })
    }
    console.log("productos a eliminar =>>>> ",listaEansProductos)
    const linkControlador=document.getElementById("linkControlador").value;
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'posteliminarproducto',
            id_modelo:idModelo,
            eans:listaEansProductos
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("producto Eliminado =>>>>> ",respuestaJson)
            let checkboxsPaises=document.querySelectorAll(".checkbox-paises:checked");
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            consultarProductosPorPais2(checkboxsPaises[0].value)
            mostrarAlerta("alert-success","Eliminación Completada")
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
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
            mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
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
    let paisesRadio=document.querySelectorAll(".checkbox-paises")
    paisesRadio[0].setAttribute("checked",true)
    consultarProductosPorPais(paisesRadio[0])
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
            mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
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
            mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
        }
    });
}

function mostrarAlerta(colorAlerta,mensaje){
    let $contenedorAlerta=document.getElementById("contenedorAlerta")
    let htmlAlert='\
    <div id="alerta" class="alert '+colorAlerta+' alert-dismissible show" role="alert">\
        '+mensaje+' .\
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
            <span aria-hidden="true">&times;</span>\
        </button>\
    </div>\
    '
    $contenedorAlerta.innerHTML+=htmlAlert
}

consultarPaisesZalando();
