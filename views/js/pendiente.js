// alert("hola")
let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")
let listaProducutosPorPais={}
let jsonProductoSeleccionado=[]


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


function insertarProductos(productos){
    let listaDeProductosPendientes=document.getElementById("listaDeProductosPendientes");
    listaDeProductosPendientes.innerHTML="";
    let html="";
    listaProducutosPorPais={}
    for(let producto of productos){
        listaProducutosPorPais[producto.id_modelo_producto]=producto
    }

    console.log("datos =>>>>>>>>>>>>>>>>>>> ",listaProducutosPorPais)
    for(let idModeloProducto in listaProducutosPorPais){
        let producto=listaProducutosPorPais[idModeloProducto]
        let infoModelo=JSON.parse(producto.json_modelo_producto)
        html+="\
        <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 modal-footer caj-product alignitem-tb p-10 global-input fila-producto-eliminar' style='cursor: pointer;' >\
        <div class='col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11  text-left' data-id-modelo='"+idModeloProducto+"' onClick='mostrarModalDatosProducto(this)' data-toggle='modal' data-target='#staticBackdrop'><div><h4 class='text-primary'>"+infoModelo.product_model_attributes.name+"</h4></div></div>\
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><div><button class='btn btn-danger' data-id-modelo='"+idModeloProducto+"' data-nombre-imagen='"+producto.nombre_imagen+"' onClick='eliminarProducto(this)'>\
            <svg data-id-modelo='"+idModeloProducto+"' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash-fill' viewBox='0 0 16 16'>\
                <path data-id-modelo='"+idModeloProducto+"' d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z'/>\
            </svg>\
        </button></div></div>\
        </div>\
        ";
    }
    listaDeProductosPendientes.innerHTML=html
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
    jsonProductoSeleccionado=[]
    console.log("datalles producto =>>>>>> ",detalleProducto)
    let preciosProducto=document.getElementById("preciosProducto")
    let nombreDelProductoDetalle=document.getElementById("nombreDelProductoDetalle")
    nombreDelProductoDetalle.textContent=JSON.parse(detalleProducto.json_modelo_producto).product_model_attributes.name
    let precio=JSON.parse(detalleProducto.simples[0].precio.json_precio)
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
                <div>'+precio.regular_price.amount+'</div>\
            </div>\
        </div>\
        <div class="row">\
            <div class="form-group col-md-3">\
                <label for="">Precio Descuento</label>\
                <div>'+((precioDescuento!=="")?precioDescuento:"Sin Precio")+'</div>\
            </div>\
            <div class="form-group col-md-3">\
                <label for="">Fecha Inicio Descuento</label>\
                <div>'+((fechaInicioDescuento!=="")?moment(fechaInicioDescuento,"YYYY-MM-DD").format("DD-MM-YYYY"):"Sin Fecha")+'</div>\
            </div>\
            <div class="form-group col-md-3">\
                <label for="">Fecha Final Descuento</label>\
                <div>'+((fechaFinalDescuento!=="")?moment(fechaFinalDescuento,"YYYY-MM-DD").format("DD-MM-YYYY"):"Sin Fecha")+'</div>\
            </div>\
        </div>\
    '
    let tallasStock=document.getElementById("tallasStock")
    tallasStock.innerHTML=""
    let htmlTallaStock=""
    for(let simple of detalleProducto.simples){
        let precioProducto=JSON.parse(simple.precio.json_precio)
        let stock=simple.stock
        let talla=JSON.parse(simple.json_simple_producto)
        let jsonDatosProducto={
            ean:stock.ean,
            stock:stock.quantity,
            precionRegular:precioProducto.regular_price.amount,
            moneda:precioProducto.regular_price.currency,
            precioPromocion:(precioProducto.scheduled_prices)?precioProducto.promotional_price.amount:null,
            fechaInicioPromocio:(precioProducto.scheduled_prices)?precioProducto.scheduled_prices[0].start_time:null,
            fechaFinalPromocio:(precioProducto.scheduled_prices)?precioProducto.scheduled_prices[0].end_time:null,
            pais:stock.sales_channel_id
        }
        jsonProductoSeleccionado.push(jsonDatosProducto)
        // product_simple_attributes
        console.log("datosssssssssssssssssssssssssssss =>>>>>>>>>>>>>> ",jsonDatosProducto)
        htmlTallaStock+='\
        <div class="row" >\
            <div class="form-group col-md-3" style="margin-bottom: 0px;">\
                '+talla.product_simple_attributes.size_codes.size+'\
            </div>\
            <div class="form-group col-md-3">\
                '+stock.quantity+'\
            </div>\
        </div>'
    }
    let modalFooter=document.getElementById("modalFooter")
    modalFooter.innerHTML='\
    <button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>\
    <button type="button" data-id-modelo="'+idModelo+'" id="guardarPrecio" onClick="enviarProducto(this)" class="btn btn-primary">Enviar</button>\
    '
    tallasStock.innerHTML=htmlTallaStock
    // mostrarDatosProductosModificados(idModelo)
}

function enviarProducto(a){
    const linkControlador=document.getElementById("linkControlador").value;
    let idModelo=a.getAttribute("data-id-modelo")
    let precios=[]
    let stocks=[]
    for(let datos of jsonProductoSeleccionado){
        if(datos.precioPromocion!==null){
            let precio={
                "ean": datos.ean,
                "sales_channel_id": datos.pais,
                "regular_price": {
                    "amount": parseFloat(datos.precionRegular),
                    "currency": datos.moneda
                },
                "promotional_price": {
                    "amount": parseFloat(datos.precioPromocion),
                    "currency": datos.moneda
                },
                "scheduled_prices": [
                    {
                        "regular_price": {
                            "amount": parseFloat(datos.precionRegular),
                            "currency": datos.moneda
                        },
                        "promotional_price": {
                            "amount": parseFloat(datos.precioPromocion),
                            "currency": datos.moneda
                        },
                        "start_time": `${datos.fechaInicioPromocio}`,
                        "end_time": `${datos.fechaFinalPromocio}`
                    }
                ],
                "ignore_warnings": true
            }
            precios.push(JSON.stringify(precio))
        }
        else{
            let precio={
                "ean": datos.ean,
                "sales_channel_id": datos.pais,
                "regular_price": {
                    "amount": parseFloat(datos.precionRegular),
                    "currency": datos.moneda
                },
            }
            precios.push(JSON.stringify(precio))
        }
        let stock={
            "sales_channel_id": datos.pais,
            "ean": datos.ean,
            "quantity": parseInt(datos.stock)
        }
        stocks.push(JSON.stringify(stock))
    }

    console.log("precios a enviar =>>>>>>>>>>>>>>", precios)
    console.log("stocks a enviar =>>>>>>>>>>>>>>", stocks)
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
            idModelo,
            precios,
            stocks
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("stock de producto modificado =>>>>> ",respuestaJson)
            if(respuestaJson.respuestaLiveProducto===true){
                let paisRadio=document.querySelector(".checkbox-paises:checked")
                consultarProductosPorPais(paisRadio)
                // respuestaJson.precioZalando
                let erroresAlSubirPrecio=respuestaJson.precioZalando.filter(datosPrecios => datosPrecios.respuestaZalando.code!==0)
                let erroresAlSubirStock=respuestaJson.stockZalando.filter(datosStock => datosStock.respuestaZalando.code!==0)
                erroresAlSubirPrecio.forEach(errorPrecio => {
                    mostrarAlerta("alert-danger","codigo error "+errorPrecio.respuestaZalando.code+" : "+errorPrecio.respuestaZalando.description)
                    
                });
                erroresAlSubirStock.forEach(errorStock => {
                    mostrarAlerta("alert-danger","codigo error "+errorStock.respuestaZalando.code+" : "+errorStock.respuestaZalando.description)
                    
                });
                if(erroresAlSubirPrecio.length===0 && erroresAlSubirStock.length===0){
                    mostrarAlerta("alert-success","stocks y precios enviados a zalando con exito")
                }
            }
            else{
                let listEans=respuestaJson.precioZalando.map( datos => datos.ean).join(", ")
                mostrarAlerta("alert-danger","El al subir el stock o precios a zalando, los siguientes eans no esta registrados en zalando: "+listEans)
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
            }


        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
        }
    });
}

function eliminarProducto(a){
    let idModelo=a.getAttribute("data-id-modelo")
    let nombreImagen=a.getAttribute("data-nombre-imagen")
    let listaEansProductos=[]
    for(let producto of listaProducutosPorPais[idModelo].simples){
        listaEansProductos.push({
            ean:producto.ean,
            idPais:listaProducutosPorPais[idModelo].sales_channel_id
        })
    }
    console.log("eans capturados =>>>> ",listaEansProductos)
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
            nombre_imagen:nombreImagen,
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
    let checkboxsPaises=document.querySelector(".checkbox-paises:checked");
    let controlesPaginacion=document.getElementById("controlesPaginacion")
    controlesPaginacion.innerHTML="";
    let pagina=1;
    if(a!=1){
        pagina=(a.getAttribute("data-numero-pagina"))?a.getAttribute("data-numero-pagina"):1
    }
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
            codigoPais:checkboxsPaises.value,
            pagina
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta))
            console.log("datos =>>>>>>>>>>>>>>>> ",respuestaJson)
            insertarProductos(respuestaJson.respuestaServidor.datos)
            if(respuestaJson.respuestaServidor.totalRegistros>20){
                alert("hola")
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