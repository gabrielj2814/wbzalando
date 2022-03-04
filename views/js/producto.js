// funciones que no se estan usando pero que pueden ser utiles borrar o comentar cuando se termene el desarrollo


//====================================
//====================================
//====================================

// variables globales
let listaProductos={};
let productosSeleccionados=[];
let productosFiltrados=[];
let datosResPaldoProductos={}
let datosProductosForm={}
//=======================
//=======================
//=======================
let datos_brand_code=[]
let datos_season_code={}
let datos_color_code={}
let datos_target_age_groups={}
let datos_target_genders={}
let datos_categorias_tallas_zalando=[]
let datos_categorias=[]
let datos_materiales_contruccion={}
// ------ referencia a elementos html
let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")
let $botonFiltroProducto=document.getElementById("botonFiltroProducto");
let $nombreProducto=document.getElementById("nombreProducto");
let botonTestEnvio=document.getElementById("botonTestEnvio")
let $botonIrHaformulario=document.getElementById("botonIrHaformulario")
let $botonIrHaVistaInicial=document.getElementById("botonIrHaVistaInicial")
let $botonIrHaVistaBorrarProductos=document.getElementById("botonIrHaVistaBorrarProductos")
let $botonIrHaVistaFormularioProductos=document.getElementById("botonIrHaVistaFormularioProductos")
let $botonEnviarPoductos=document.getElementById("botonEnviarPoductos")
// let obtenerProductos=document.getElementById("obtenerProductos");
// let botonSalirVistaSubirProducto=document.getElementById("botonSalirVistaSubirProducto");
// functiones
// funciones anidadas peticiones al servidor consultarPaisesZalando,consultarCategoraisAsociadas,consultarCategoriasTalla,consultarMaterialesDeConstruccion
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
                consultarCategoraisAsociadas();
                console.log("paises zalando =>>> ",datos)
                crearRadiosPaisTest(datos.respuestaServidor.items);
                crearRadiosPaisTestBorrarProdcuto(datos.respuestaServidor.items)
            }
            if(datos.respuestaServidor.status && datos.respuestaServidor.status==401){
                console.log("respuesta en 401 =>>>>> " ,datos.respuestaServidor);
            }

        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            // alert("error al conectar con el servidor");
        }
    });
}

function consultarCategoraisAsociadas(){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    datos_categorias=[]
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorCategoria, 
        data: {
            ajax: true,
            action: 'getconsultartodo'
        },
        success: (respuesta) => {
            let json=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("datos categorias asociadas =>>> ",json.datos);
            datos_categorias=json.datos
            // insertarCategoriasSelect(json.datos);
            consultarCategoriasTalla()
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}

function consultarCategoriasTalla(){
    const linkDeControladorTalla=document.getElementById("linkDeControladorTalla").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorTalla, 
        data: {
            ajax: true,
            action: 'getconsultarcateogriasquetienentallazalando'
        },
        success: (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta));
            console.log("categorias de tallas filtrados =>>> ",datos.respuestaServidor);
            datos_categorias_tallas_zalando=datos.respuestaServidor
            consultarMaterialesDeConstruccion()
            // preloader.style.opacity="0"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}

function consultarMaterialesDeConstruccion(){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorCategoria, 
        data: {
            ajax: true,
            action: 'getconsultarinformacionpropiedadmaterial',
        },
        success: (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta));
            console.log("datos material.upper_material_clothing =>>> ",datos.respuestaServidor);
            datos_materiales_contruccion=datos.respuestaServidor
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}

function crearRadiosPaisTest(paises){
    let contenedorBanderasProductos=document.getElementById("paisesFormularioProducto");
    let sliderPaisesProductos=document.getElementById("slider-productos");
    sliderPaisesProductos.innerHTML=""
    contenedorBanderasProductos.innerHTML="";
    for(let pais of paises){
        let htmlCheckbox="\
            <div style='display:none;'>\
                <input type='radio'  class='redio-paises-form' value='"+pais.sales_channel_id+"' id='"+pais.sales_channel_id+"' name='radio-form-producto' data-nombre-pais='"+pais.country_name+"' data-iso-code='"+pais.country_code+"' onChange='cargarProductosPorPaisSeleccionado(this)'/>\
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
        sliderPaisesProductos.innerHTML+=htmlBotonPais
        contenedorBanderasProductos.innerHTML+=htmlCheckbox;
    }
    iniciarSlickTres()
}
function iniciarSlickTres(){
    var sliderProductos = document.querySelector('#slider-productos');
    if(sliderProductos.children.length > 0){
        $('#slider-productos').slick({
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
        iniciarSlickTres()
    }
}

function crearRadiosPaisTestBorrarProdcuto(paises){
    // paisesBorrarProducto
    let contenedorBanderasBorrar=document.getElementById("paisesBorrarProducto");
    let sliderPaisesBorrar=document.getElementById("slider-dos");
    sliderPaisesBorrar.innerHTML=""
    contenedorBanderasBorrar.innerHTML="";
    for(let pais of paises){
        let htmlCheckbox="\
            <div style='display:none;'>\
                <input type='radio'  class='radio-form-producto-borrar' value='"+pais.sales_channel_id+"' id='"+pais.sales_channel_id+"_paises_borrar' name='radio-form-producto-borrar' data-nombre-pais='"+pais.country_name+"' data-iso-code='"+pais.country_code+"' onChange='cargarProductosHaEliminarPorPais(this)'/>\
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
        sliderPaisesBorrar.innerHTML+=htmlBotonPais
        contenedorBanderasBorrar.innerHTML+=htmlCheckbox;
    }
    iniciarSlickDos()
}
function iniciarSlickDos(){
    var sliderDos = document.querySelector('#slider-dos');
    if(sliderDos.children.length > 0){
        $('#slider-dos').slick({
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
        iniciarSlickDos()
    }
}

function filtrarProductos(e){
    e.preventDefault();
    const linkControlador=document.getElementById("linkControlador").value;
    let categoriaProducto=document.getElementById("categoriaProducto").value;
    let marcaProducto=document.getElementById("marcaProducto").value;
    let $nombreProducto=document.getElementById("nombreProducto").value;
    let totalResultados=document.getElementById("totalResultados")
    $botonIrHaformulario.setAttribute("disabled","disabled")
    totalResultados.textContent="cargando... "
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
            nombreProducto:$nombreProducto
        },
        success: (respuesta) => {
            // console.log(respuesta);
            let datos=JSON.parse(JSON.stringify(respuesta.datos));
            // console.log("productos filtrados =>>> ",datos);
            totalResultados.textContent=datos.length.toString()
            if(datos.length>0){
                $botonIrHaformulario.removeAttribute("disabled")
                productosFiltrados=datos
                
            }
            else{
                totalResultados.textContent="0"
            }
            // insertarDatosTablaProducto(datos);
        },
        error: () => {
            totalResultados.textContent="0"
        }
    });
}

function irHaFormularioDeProductos(){
    datosResPaldoProductos={}
    datosProductosForm={}
    let $vistaInicial=document.getElementById("vista-inicial")
    $vistaInicial.style.display="none"
    let $vistaFormProductos=document.getElementById("vista-form-productos")
    $vistaFormProductos.style.display="block"
    console.log("los datos que se deben de mostrar en esta vista =>>> ",productosFiltrados)
    let radiosPaisesForm=document.querySelectorAll(".redio-paises-form");

    for(let pais of radiosPaisesForm){
        datosResPaldoProductos[pais.value]={}
        for(let producto of productosFiltrados){
            let descripcionProducto=producto.description.replace("<p>","").replace("</p>","").split("'").join("")
            let nombrePro=producto.name.split("'").join("")
            datosResPaldoProductos[pais.value][pais.value+"_"+producto.id_product]={
                idProductoTienda:producto.id_product,
                ean:producto.ean13,
                nombreProducto:nombrePro,
                urlImagen:producto.urlImagen,
                idUrlImagen:producto.id_product,
                descripcion:descripcionProducto,
                brand_code:"brand-code",
                lenguaje:producto.iso_code,
                outline:"bag",
                stock:"15",
                size_group:"",
                size_codes:[],
                supplier_color:"supplier color",
                "color_code.primary":"",
                target_genders:[],
                target_age_groups:[],
                season_code:"season",
                moneda:"USD",
                precioRegular:"15",
                precioPromocional:"11",
                fechaInicioPromocion:"2022-02-27",
                fechaFinalPromocion:"2022-02-27",
                haEnviar:false,
                how_to_use:null,
                warnings:null,
                material_percentage:null,
                material_code:null
            }
        }
    }
    console.log("productos aginados por pais =>>>> ",datosResPaldoProductos)
    // datosProductosForm=JSON.parse(JSON.stringify(datosResPaldoProductos))
    radiosPaisesForm[0].setAttribute("checked",true)
    cargarProductosPorPaisSeleccionado(radiosPaisesForm[0]);
    
}


function irHaVistaInicial(){
    let $vistaFormProductos=document.getElementById("vista-form-productos")
    $vistaFormProductos.style.display="none"
    let $vistaInicial=document.getElementById("vista-inicial")
    $vistaInicial.style.display="block"
}

function irHaVistaBorrarProductos(e){
    e.preventDefault()
    let $vistaFormProductos=document.getElementById("vista-form-productos")
    $vistaFormProductos.style.display="none"
    let $vistaBorrarProductos=document.getElementById("vista-borrar-productos")
    $vistaBorrarProductos.style.display="block"
}

function irHaVistaFormularioProductos(){
    let $vistaBorrarProductos=document.getElementById("vista-borrar-productos")
    $vistaBorrarProductos.style.display="none"
    let $vistaFormProductos=document.getElementById("vista-form-productos")
    $vistaFormProductos.style.display="block"
}

function cargarProductosPorPaisSeleccionado(a){
    let productos=datosResPaldoProductos[a.value]
    console.log("cargar porductos por pais seleccionado =>>>> ",productos)
    cargarDatosBrandCode();
    insertarProductosVistaEnvio(a.value,productos)
}
// creacion del formulario de producto
function insertarProductosVistaEnvio(idPais,productos){
    let listaDeProductosForm=document.getElementById("listaDeProductosForm")
    listaDeProductosForm.innerHTML=""
    let html=""
    for(let codigoIdPaisIdproducto in productos){
        let producto=productos[codigoIdPaisIdproducto]
        html+='\
        <div data-id-producto-form="'+codigoIdPaisIdproducto+'" class="contenedor_producto_backend">\
            <div class="row preview-info-producto">\
                <div class="col-xs-1 contenedor-check-envio col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">\
                    <label id="'+codigoIdPaisIdproducto+'_check_true" class="ocultar" for="'+codigoIdPaisIdproducto+'_check_envio">\
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16">\
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>\
                        </svg>\
                    </label>\
                    <label id="'+codigoIdPaisIdproducto+'_check_false" class="" for="'+codigoIdPaisIdproducto+'_check_envio">\
                        <div class="checked-false"></div>\
                    </label>\
                    <input style="display:none;" id="'+codigoIdPaisIdproducto+'_check_envio" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="haEnviar" onClick="cambiarEstadoDeEnvioDeProduct(this)" type="checkbox" class="haEnviar"/>\
                </div>\
                <div class="contenedor-nombre-producto col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10">\
                    <img class="col-xs-1 imagen-producto" src="'+producto.urlImagen+'" alt=""/>\
                    <h3 class="margin-0 text-primary" style="margin-left: 15px !important;">'+producto.nombreProducto+'</h3>\
                </div>\
                <div class="contenedor-toggle-producto col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">\
                    <svg id="'+codigoIdPaisIdproducto+'-cerrar" data-id-producto="'+codigoIdPaisIdproducto+'" onClick="cerrarFormularioProducto(this)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ocultar bi bi-arrow-up-short" viewBox="0 0 16 16">\
                        <path data-id-producto="'+codigoIdPaisIdproducto+'" fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>\
                    </svg>\
                    <svg id="'+codigoIdPaisIdproducto+'-abrir" data-id-producto="'+codigoIdPaisIdproducto+'" onClick="mostrarFormularioProducto(this)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">\
                        <path data-id-producto="'+codigoIdPaisIdproducto+'" fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>\
                    </svg>\
                </div>\
            </div>\
            <div class="contenedor-formulario-producto ocultar" id="'+codigoIdPaisIdproducto+'-contenedor-formulario-producto">\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >Cetegoria</label>\
                            <select data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="outline" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-categoria">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >Categoria talla</label>\
                            <select data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="size_group" onBlur="consultarTallasPorPaisYCategoriaTalla(this)" class="form-control margin-0 campo-categoria-talla">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >color</label>\
                            <select data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="color_code.primary" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-color-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label for="">supplier color</label>\
                            <input type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="supplier_color" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Stock</label>\
                            <input type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="stock" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Siglas Moneda</label>\
                            <input type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="moneda" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Precio Regular</label>\
                            <input type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="precioRegular" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Precio Descuento</label>\
                            <input type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="precioPromocional" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Fecha de Inicio de Descuento</label>\
                            <input type="date" class="form-control " id="">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Fecha de Final de Descuento</label>\
                            <input type="date" class="form-control " id="">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >material</label>\
                            <select data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="material_code" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-material-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >material percentage</label>\
                            <input type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="material_percentage" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >Tallas</label>\
                            <select multiple data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="size_codes" id="'+codigoIdPaisIdproducto+'_tallas" class="class-select m-0 form-control margin-0 campo-talla" onBlur="insertarDatosDeEnvioDeProduct(this)">\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >target age groups</label>\
                            <select multiple data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="target_age_groups" onBlur="insertarDatosDeEnvioDeProduct(this)" class="class-select m-0 form-control margin-0 campo-target-age-groups">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >target genders</label>\
                            <select multiple data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="target_genders" onBlur="insertarDatosDeEnvioDeProduct(this)" class="class-select m-0 form-control margin-0 campo-target-genders">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >brand</label>\
                            <select data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="brand_code" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-brand-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >season code</label>\
                            <select data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="season_code" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-season-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">\
                        <div class="form-group">\
                            <label for="exampleFormControlInput1">warnings</label>\
                            <textarea class="form-control" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="warnings" rows="3" onKeyup="insertarDatosDeEnvioDeProduct(this)"></textarea>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">\
                        <div class="form-group">\
                            <label for="exampleFormControlInput1">how to use</label>\
                            <textarea class="form-control" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="how_to_use" rows="3" onKeyup="insertarDatosDeEnvioDeProduct(this)"></textarea>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
        '
    }
    listaDeProductosForm.innerHTML=html
}
// insertar elementos html a los select de los formulario de prodcuto
function insertarCategoriasSelect(){
    let $camposCategorias=document.querySelectorAll(".campo-categoria")
    for(let $campoCategorias of $camposCategorias){
        $campoCategorias.innerHTML=""
        let html="<option value='null'>Seleccione una categoria</option>"
        for(let categoria of datos_categorias){
            let option='<option value="'+categoria.outline+'">'+categoria.name+'</option>'
            html+=option
        }
        $campoCategorias.innerHTML=html
    }
}

function insertarBrandCodeSelect(){
    let $camposBrandCode=document.querySelectorAll(".campo-brand-code")
    for(let $campoBrandCode of $camposBrandCode){
        $campoBrandCode.innerHTML=""
        let html="<option value='null'>Seleccione una brand</option>"
        for(let brand of datos_brand_code){
            brand=JSON.parse(brand)
            let option="<option value='"+brand.label+"'>"+brand.name.en+"</option>"
            html+=option
        }
        $campoBrandCode.innerHTML=html
    }
}

function insertarSeasonCodeSelect(){
    let $camposSeasonCode=document.querySelectorAll(".campo-season-code")
    for(let $campoSeasonCode of $camposSeasonCode){
        $campoSeasonCode.innerHTML=""
        let html="<option value='null'>Seleccione una season</option>"
        for(let season of datos_season_code){
            season=JSON.parse(season)
            let option="<option value='"+season.label+"'>"+season.value.localized.en+"</option>"
            html+=option
        }
        $campoSeasonCode.innerHTML=html
    }
}

function insertarColorCodeSelect(){
    let $camposColorCode=document.querySelectorAll(".campo-color-code")
    for(let $campoColorCode of $camposColorCode){
        $campoColorCode.innerHTML=""
        let html="<option value='null'>Seleccione un color</option>"
        for(let color of datos_color_code){
            // season=JSON.parse(season)
            let option="<option value='"+color.codigo_color+"'>"+color.color_zalando+"</option>"
            html+=option
        }
        $campoColorCode.innerHTML=html
    }
}

function insertarCategoriasTallasZalando(){
    // campo-categoria-talla
    let $camposCategoriaTallaCode=document.querySelectorAll(".campo-categoria-talla")
    for(let $campoCategoriaTallaCode of $camposCategoriaTallaCode){
        $campoCategoriaTallaCode.innerHTML=""
        let html="<option value='null'>Seleccione una categoria</option>"
        for(let categoriaTalla of datos_categorias_tallas_zalando){
            let option="<option value='"+categoriaTalla.codigo_size_group+"'>"+categoriaTalla.nombreGrupo+"</option>"
            html+=option
        }
        $campoCategoriaTallaCode.innerHTML=html
    }
}

function insertarTallaCodeSelect(idProducto,tallas){
    let $campoTallaCode=document.getElementById(idProducto+"_tallas")
    $campoTallaCode.innerHTML=""
    let html="<option value='null'>Seleccione una o mas tallas</option>"
    for(let talla of tallas){
        let option="<option value='"+talla.talla_zalando+"'>"+talla.name+"</option>"
        html+=option
    }
    $campoTallaCode.innerHTML=html
}

function insertarTargetAgeGroupsCodeSelect(){
    let $camposTargetAgeGroups=document.querySelectorAll(".campo-target-age-groups")
    for(let $campoTargetAgeGroups of $camposTargetAgeGroups){
        $campoTargetAgeGroups.innerHTML=""
        let html="<option value='null'>Seleccione una target age groups</option>"
        for(let targetAgeGroups of datos_target_age_groups){
            targetAgeGroups=JSON.parse(targetAgeGroups)
            let option="<option value='"+targetAgeGroups.label+"'>"+targetAgeGroups.name.en+"</option>"
            html+=option
        }
        $campoTargetAgeGroups.innerHTML=html
    }
}

function insertarTargetGendersCodeSelect(){
    let $camposTargetGenders=document.querySelectorAll(".campo-target-genders")
    for(let $campoTargetGenders of $camposTargetGenders){
        $campoTargetGenders.innerHTML=""
        let html="<option value='null'>Seleccione una target genders</option>"
        for(let targetGenders of datos_target_genders){
            targetGenders=JSON.parse(targetGenders)
            let option="<option value='"+targetGenders.label+"'>"+targetGenders.name.en+"</option>"
            html+=option
        }
        $campoTargetGenders.innerHTML=html
    }
}

function insertarMaterialesContruccionCodeSelect(){
    // datos_materiales_contruccion
    let $camposMaterialCode=document.querySelectorAll(".campo-material-code")
    for(let $campoMaterialCode of $camposMaterialCode){
        $campoMaterialCode.innerHTML=""
        let html="<option value='null'>Seleccione un material</option>"
        for(let labelMaterialContruccion in datos_materiales_contruccion){
            let option="<option value='"+labelMaterialContruccion+"'>"+datos_materiales_contruccion[labelMaterialContruccion]+"</option>"
            html+=option
        }
        $campoMaterialCode.innerHTML=html
    }
}

// -----------------------------------------------
// cargar de datos para los inputs de los formulario al cargar la vista formulario
function cargarDatosBrandCode(){
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    let edicionGlobalBrandCode=document.getElementById("edicionGlobalBrandCode")
    edicionGlobalBrandCode.innerHTML=""
    let propiedad="brand_code"
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorCategoria, 
        data: {
            ajax: true,
            action: 'getconsultardatospropiedad',
            propiedad
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("datos propiedad "+propiedad+" =>>> ",respuestaJson.datos);
            datos_brand_code=respuestaJson.datos
            if(respuestaJson.datos.length>0){
                let option="<option value='null'>Seleccione</option>"
                for(let datos of respuestaJson.datos){
                    datos=JSON.parse(datos)
                    option+="<option value='"+datos.label+"'>"+datos.name.en+"</option>"
                }
                edicionGlobalBrandCode.innerHTML=option
                cargarDatosSeasonCode();
            }
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}

function cargarDatosSeasonCode(){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    let edicionGlobalSeasonCode=document.getElementById("edicionGlobalSeasonCode")
    edicionGlobalSeasonCode.innerHTML=""
    let propiedad="season_code"
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorCategoria, 
        data: {
            ajax: true,
            action: 'getconsultardatospropiedad',
            propiedad
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("datos propiedad "+propiedad+" =>>> ",respuestaJson.datos);
            datos_season_code=respuestaJson.datos;
            if(respuestaJson.datos.length>0){
                let option="<option value='null'>Vacio</option>"
                for(let datos of respuestaJson.datos){
                    datos=JSON.parse(datos)
                    option+="<option value='"+datos.label+"'>"+datos.value.localized.en+"</option>"
                }
                edicionGlobalSeasonCode.innerHTML=option
                cargarDatosEdicionGlobalTargetAgeGroups()
            }
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}

function cargarDatosEdicionGlobalTargetAgeGroups(){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    let edicionGlobalTargetAgeGroups=document.getElementById("edicionGlobalTargetAgeGroups")
    edicionGlobalTargetAgeGroups.innerHTML=""
    let propiedad="target_age_groups"
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorCategoria, 
        data: {
            ajax: true,
            action: 'getconsultardatospropiedad',
            propiedad
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("datos propiedad "+propiedad+" =>>> ",respuestaJson.datos);
            datos_target_age_groups=respuestaJson.datos
            if(respuestaJson.datos.length>0){
                let option="<option value='null'>Vacio</option>"
                for(let datos of respuestaJson.datos){
                    datos=JSON.parse(datos)
                    option+="<option value='"+datos.label+"'>"+datos.name.en+"</option>"
                }
                edicionGlobalTargetAgeGroups.innerHTML=option
                cargarDatosEdicionGlobalTargetGenders()
            }
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}


function cargarDatosEdicionGlobalTargetGenders(){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    let edicionGlobalTargetGenders=document.getElementById("edicionGlobalTargetGenders")
    edicionGlobalTargetGenders.innerHTML=""
    let propiedad="target_genders"
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorCategoria, 
        data: {
            ajax: true,
            action: 'getconsultardatospropiedad',
            propiedad
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("datos propiedad "+propiedad+" =>>> ",respuestaJson.datos);
            datos_target_genders=respuestaJson.datos
            if(respuestaJson.datos.length>0){
                let option="<option value='null'>Seleccione</option>"
                for(let datos of respuestaJson.datos){
                    datos=JSON.parse(datos)
                    option+="<option value='"+datos.label+"'>"+datos.name.en+"</option>"
                }
                edicionGlobalTargetGenders.innerHTML=option
                let radiosPaisesForm=document.querySelectorAll(".redio-paises-form:checked")[0];
                cargarDatosEdicionGlobalColor(radiosPaisesForm)
            }
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}

function cargarDatosEdicionGlobalColor(pais){
    const linkDeControladorColor=document.getElementById("linkDeControladorColor").value;
    let edicionGlobalColor=document.getElementById("edicionGlobalColor")
    edicionGlobalColor.innerHTML=""
    let isoCode=pais.getAttribute("data-iso-code")
    // alert(isoCode)
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorColor, 
        data: {
            ajax: true,
            action: 'getconsultartodoporpais',
            isoCode
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("datos propiedad colores asociados =>>> ",respuestaJson.datos);
            if(respuestaJson.datos.length>0){
                // alert(isoCode)
                let option="<option value='null'>Seleccione</option>"
                datos_color_code=respuestaJson.datos
                for(let datos of respuestaJson.datos){
                    option+="<option value='"+datos.codigo_color+"'>"+datos.color_zalando+"</option>"
                }
                edicionGlobalColor.innerHTML=option
                insertarCategoriasSelect()
                insertarBrandCodeSelect()
                insertarSeasonCodeSelect()
                insertarColorCodeSelect()
                insertarCategoriasTallasZalando()
                insertarTargetGendersCodeSelect()
                insertarTargetAgeGroupsCodeSelect()
                insertarMaterialesContruccionCodeSelect()
            }
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
}
// -------------------------------------
// cargar datos al interacturar con el formulario 
function consultarTallasPorPaisYCategoriaTalla(a){
    insertarDatosDeEnvioDeProduct(a)
    const linkDeControladorTalla=document.getElementById("linkDeControladorTalla").value;
    let radiosPaisesForm=document.querySelectorAll(".redio-paises-form:checked")[0];
    let isoCode=radiosPaisesForm.getAttribute("data-iso-code")
    let idProducto=a.getAttribute("data-id-producto")
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    if(a.value!==null){
        $.ajax({
            type: 'GET',
            cache: false,
            dataType: 'json',
            url: linkDeControladorTalla, 
            data: {
                ajax: true,
                action: 'getConsultartodotallasporpaisycategoriatallazalando',
                pais:isoCode,
                grupo:a.value
            },
            success: (respuesta) => {
                let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
                console.log("datos talla consultar por categoria y pais =>>> ",respuestaJson.datos);
                insertarTallaCodeSelect(idProducto,respuestaJson.datos)
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
            },
            error: () => {
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
            }
        });
    }
}

function cargarProductosHaEliminarPorPais(a){
    console.table("lista de productus a eliminar =>>>> ",datosProductosForm[a.value])
    insertarProductos(a.value,datosProductosForm[a.value])
}

function insertarProductos(idPais,productos){
    let listaDeProductosHaBorrar=document.getElementById("listaDeProductosHaBorrar");
    listaDeProductosHaBorrar.innerHTML="";
    let html="";
    for(let codigoIdPaisIdproducto in productos){
        // <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><button style='border: unset;' data-id-modelo='"+producto.detallesDelProdcuto[0].id_modelo_producto+"' data-id-config='"+producto.detallesDelProdcuto[0].id_configuracion_producto+"' data-ean='"+producto.detallesDelProdcuto[0].ean+"' data-id-pais='"+producto.sales_channel_id+"' onClick='eliminarProducto(this)'><img src='https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/50/000000/external-delete-miscellaneous-kiranshastry-lineal-kiranshastry.png' width='24px'/></button></div></div>\
       if(productos[codigoIdPaisIdproducto].haEnviar!=true){
        html+="\
        <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 modal-footer alignitem-tb p-10 global-input'>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2  text-left'><div><h4 class='text-primary'>"+productos[codigoIdPaisIdproducto].nombreProducto+"</h4></div></div>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2  text-left'><div><h4 class='text-center'>"+productos[codigoIdPaisIdproducto].stock+"</h4></div></div>\
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><div><h4 class='text-center'>"+productos[codigoIdPaisIdproducto].moneda+" "+productos[codigoIdPaisIdproducto].precioRegular+"</h4></div></div>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2  text-left'><div><h4 class='text-center'>"+productos[codigoIdPaisIdproducto].moneda+" "+productos[codigoIdPaisIdproducto].precioPromocional+"</h4></div></div>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2  text-left'><div><h4 class='text-center'>"+productos[codigoIdPaisIdproducto].fechaInicioPromocion+"</h4></div></div>\
        <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2  text-left'><div><h4 class='text-center'>"+productos[codigoIdPaisIdproducto].fechaFinalPromocion+"</h4></div></div>\
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><button style='border: unset;' data-id-pais='"+idPais+"' data-id-producto='"+codigoIdPaisIdproducto+"'   onClick='cambiarEstadoDeEnvioDeProductoBorrarProducto(this)'><img src='https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/50/000000/external-delete-miscellaneous-kiranshastry-lineal-kiranshastry.png' width='24px'/></button></div></div>\
        ";
       }
        // html+=producto.ean+" - "+producto.sales_channel_id;
    }
    listaDeProductosHaBorrar.innerHTML=html

}

function cambiarEstadoDeEnvioDeProductoBorrarProducto(a){
    let idPais=a.getAttribute("data-id-pais")
    let idProducto=a.getAttribute("data-id-producto")
    datosProductosForm[idPais][idProducto].haEnviar=true
    let radioPaisBorrarProducto=document.querySelectorAll(".radio-form-producto-borrar:checked")
    cargarProductosHaEliminarPorPais(radioPaisBorrarProducto[0]);
}

// toggle de lista de productos
function mostrarFormularioProducto(a){
    let idProducto=a.getAttribute("data-id-producto")
    a.classList.toggle("ocultar")
    document.getElementById(idProducto+"-cerrar").classList.toggle("ocultar")
    document.getElementById(idProducto+"-contenedor-formulario-producto").classList.toggle("ocultar")
}

function cerrarFormularioProducto(a){
    let idProducto=a.getAttribute("data-id-producto")
    a.classList.toggle("ocultar")
    document.getElementById(idProducto+"-abrir").classList.toggle("ocultar")
    document.getElementById(idProducto+"-contenedor-formulario-producto").classList.toggle("ocultar")
}

function cambiarEstadoDeEnvioDeProduct(a){
    let idPais=a.getAttribute("data-id-pais")
    let idProducto=a.getAttribute("data-id-producto")
    let campo=a.getAttribute("data-campo")
    document.getElementById(idProducto+"_check_true").classList.toggle("ocultar")
    document.getElementById(idProducto+"_check_false").classList.toggle("ocultar")
    if(!datosProductosForm[idPais]){
        datosProductosForm[idPais]={}
    }
    if(!datosProductosForm[idPais][idProducto]){
        datosProductosForm[idPais][idProducto]=datosResPaldoProductos[idPais][idProducto]
    }
    datosProductosForm[idPais][idProducto][campo]=a.checked
    console.log(datosProductosForm)
}

function insertarDatosDeEnvioDeProduct(a){
    let idPais=a.getAttribute("data-id-pais")
    let idProducto=a.getAttribute("data-id-producto")
    let campo=a.getAttribute("data-campo")
    if(!datosProductosForm[idPais]){
        datosProductosForm[idPais]={}
    }
    if(!datosProductosForm[idPais][idProducto]){
        datosProductosForm[idPais][idProducto]=datosResPaldoProductos[idPais][idProducto]
    }
    if(a.multiple){
        let opciones=[]
        for(let option of a){
            if(option.selected){
                opciones.push(option.value)
            }
        }
        datosProductosForm[idPais][idProducto][campo]=opciones
    }
    else{
        datosProductosForm[idPais][idProducto][campo]=a.value
    }
    console.log(datosProductosForm)
}

//============================
//============================
//============================

function generarFormatoZalado(){
    let productosConFormato=[]
    for(let pais in datosProductosForm){
        for(let producto in datosProductosForm[pais]){
            // haEnviar
            if(datosProductosForm[pais][producto].haEnviar===false){
                let modelo={
                    "outline": datosProductosForm[pais][producto].outline,
                    "product_model": {
                        "merchant_product_model_id": "modelo-"+moment().format("x"),
                        "product_model_attributes": {
                            "name": datosProductosForm[pais][producto].nombreProducto,
                            "brand_code": datosProductosForm[pais][producto].brand_code,
                            "size_group": {
                                "size": datosProductosForm[pais][producto].size_group,
                            },
                            "target_genders": datosProductosForm[pais][producto].target_genders,
                            "target_age_groups": datosProductosForm[pais][producto].target_age_groups
                        },
                        "product_configs":[]
                    }
                }
                let config={
                    "merchant_product_config_id": "config-"+moment().format("x"),
                    "product_config_attributes": {
                        "media": [
                            {
                                "media_path": datosProductosForm[pais][producto].urlImagen,
                                "media_sort_key": parseInt(datosProductosForm[pais][producto].idUrlImagen)
                            }
                        ],
                        "description": "",
                        "season_code": "",
                        "supplier_color": datosProductosForm[pais][producto].supplier_color,
                        "color_code.primary": ""
                    },
                    "product_simples":[]
                }
                config.product_config_attributes.description["en"]=datosProductosForm[pais][producto].descripcion
                config.product_config_attributes.season_code["en"]=datosProductosForm[pais][producto].season_code
                config.product_config_attributes["color_code.primary"]["en"]=datosProductosForm[pais][producto]["color_code.primary"]
                modelo.product_model.product_configs.push(config)
                for(let datoTallasProducto of datosProductosForm[pais][producto].size_codes){
                    let simple= {
                        "merchant_product_simple_id": "simple-"+datoTallasProducto+"-"+moment().format("x"),
                        "product_simple_attributes": {
                            "ean": datosProductosForm[pais][producto].ean,
                            "size_codes": {
                                "size": datoTallasProducto
                            }
                        }
                    }
                    modelo.product_model.product_configs[0].product_simples.push(simple)
                }
    
                let precio=[
                    {
                        "ean": datosProductosForm[pais][producto].ean,
                        "sales_channel_id": pais,
                        "regular_price": {
                            "amount": parseFloat(datosProductosForm[pais][producto].precioRegular),
                            "currency": datosProductosForm[pais][producto].moneda
                        },
                        "promotional_price": {
                            "amount": parseFloat(datosProductosForm[pais][producto].precioPromocional),
                            "currency": datosProductosForm[pais][producto].moneda
                        },
                        "scheduled_prices": [
                            {
                                "regular_price": {
                                    "amount": parseFloat(datosProductosForm[pais][producto].precioRegular),
                                    "currency": datosProductosForm[pais][producto].moneda
                                },
                                "promotional_price": {
                                    "amount": parseFloat(datosProductosForm[pais][producto].precioPromocional),
                                    "currency": datosProductosForm[pais][producto].moneda
                                },
                                "start_time": datosProductosForm[pais][producto].fechaInicioPromocion+"T00:00:00.00Z",
                                "end_time": datosProductosForm[pais][producto].fechaFinalPromocion+"T00:00:00.00Z"
                            }
                        ],
                        "ignore_warnings": true
                    }
                ]
                let stock= [
                    {
                        "sales_channel_id": pais,
                        "ean": datosProductosForm[pais][producto].ean,
                        "quantity": parseInt(datosProductosForm[pais][producto].stock)
                    }
                ]
                modelo["precio"]={
                    product_prices:precio
                }
                modelo["stock"]={
                    items:stock
                }
                productosConFormato.push(modelo)
            }
        }
    }
    console.log("datos finales =>>>> ",productosConFormato)
    enviarDatos(productosConFormato)
}

function enviarDatos(productos){
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
            action: 'postenviarproductos',
            productos:productos
        },
        success: (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta));
            console.log("datos envio =>>>>>>",datos);
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


//====================================
//====================================
//====================================

function enviarProductos(){
    // id francia 733af55a-4133-4d7c-b5f3-d64d42c135fe
    // id alemania 01924c48-49bb-40c2-9c32-ab582e6db6f4
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    const linkControlador=document.getElementById("linkControlador").value;
    let productos=[
        {
            outline: "bag",
            product_model: {
                merchant_product_model_id: "modelo_producto_1",
                product_model_attributes: {
                    name: "Mi Producto 2",
                    brand_code: "5FX",
                    size_group: {
                        size: "2MAE000A2A"
                    },
                    target_age_groups: [
                        "target_age_group_kid",
                        "target_age_group_baby"
                    ],
                    target_genders: [
                        "target_gender_female",
                        "target_gender_male"
                    ]
              },
              product_configs: [
                {
                    merchant_product_config_id: "333666",
                    product_config_attributes: {
                        color_code: "802",
                        season_code: "fs18",
                        "color_code.primary": "fff",
                        description: {
                            en:"hello"
                        },
                        "supplier_color": "hola que tal 2",
                        media: [
                            {
                                media_path: "https://zalando.com/1667531.jpg",
                                url: "https://zalando.com/1667531.jpg",
                                media_sort_key: 222
                            }
                        ]
                  },
                  product_simples: [
                    {
                        merchant_product_simple_id: "WTC741-XL",
                        product_simple_attributes: {
                            ean: "352369874563",
                            size_codes: {
                                size: "XL"
                        }
                      }
                    },
                    {
                        merchant_product_simple_id: "WTC742-S",
                        product_simple_attributes: {
                            ean: "352369874563",
                            size_codes: {
                                size: "S"
                        }
                      }
                    },
                    {
                        merchant_product_simple_id: "WTC743-L",
                        product_simple_attributes: {
                            ean: "352369874563",
                            size_codes: {
                                size: "L"
                        }
                      }
                    }
                  ]
                },
                {
                    merchant_product_config_id: "3336662",
                    product_config_attributes: {
                        color_code: "802",
                        season_code: "fs18",
                        "color_code.primary": "fff",
                        description: {
                            en:"hello"
                        },
                        "supplier_color": "hola que tal 2",
                        media: [
                            {
                                media_path: "https://zalando.com/1667531.jpg",
                                url: "https://zalando.com/1667531.jpg",
                                media_sort_key: 222
                            }
                        ]
                  },
                  product_simples: [
                    {
                        merchant_product_simple_id: "WTC7412-XL",
                        product_simple_attributes: {
                            ean: "3523698745632",
                            size_codes: {
                                size: "XL"
                        }
                      }
                    },
                    {
                        merchant_product_simple_id: "WTC7422-S",
                        product_simple_attributes: {
                            ean: "3523698745632",
                            size_codes: {
                                size: "S"
                        }
                      }
                    },
                    {
                        merchant_product_simple_id: "WTC7432-L",
                        product_simple_attributes: {
                            ean: "3523698745632",
                            size_codes: {
                                size: "L"
                        }
                      }
                    }
                  ]
                }
              ]
            },
            precio:{
                "product_prices": [
                    {
                        "ean": "352369874563",
                        "sales_channel_id": "01924c48-49bb-40c2-9c32-ab582e6db6f4",
                        "regular_price": {
                            "amount": 89.95,
                            "currency": "EUR"
                        },
                        "promotional_price": {
                            "amount": 80.95,
                            "currency": "EUR"
                        },
                        "scheduled_prices": [
                            {
                                "regular_price": {
                                    "amount": 89.95,
                                    "currency": "EUR"
                                },
                                "promotional_price": {
                                    "amount": 80.95,
                                    "currency": "EUR"
                                },
                                "start_time": "2022-01-25T00:00:00.00Z",
                                "end_time": "2022-01-28T00:00:00.00Z"
                            }
                        ],
                        "ignore_warnings": true
                    },
                    {
                        "ean": "352369874563",
                        "sales_channel_id": "733af55a-4133-4d7c-b5f3-d64d42c135fe",
                        "regular_price": {
                            "amount": 89.95,
                            "currency": "EUR"
                        },
                        "promotional_price": {
                            "amount": 80.95,
                            "currency": "EUR"
                        },
                        "scheduled_prices": [
                            {
                                "regular_price": {
                                    "amount": 89.95,
                                    "currency": "EUR"
                                },
                                "promotional_price": {
                                    "amount": 80.95,
                                    "currency": "EUR"
                                },
                                "start_time": "2022-01-25T00:00:00.00Z",
                                "end_time": "2022-01-28T00:00:00.00Z"
                            }
                        ],
                        "ignore_warnings": true
                    },
                    {
                        "ean": "3523698745632",
                        "sales_channel_id": "00f2a393-6889-4fc0-8cd9-86e454e6dfa3",
                        "regular_price": {
                            "amount": 89.95,
                            "currency": "EUR"
                        },
                        "promotional_price": {
                            "amount": 80.95,
                            "currency": "EUR"
                        },
                        "scheduled_prices": [
                            {
                                "regular_price": {
                                    "amount": 89.95,
                                    "currency": "EUR"
                                },
                                "promotional_price": {
                                    "amount": 80.95,
                                    "currency": "EUR"
                                },
                                "start_time": "2022-01-25T00:00:00.00Z",
                                "end_time": "2022-01-28T00:00:00.00Z"
                            }
                        ],
                        "ignore_warnings": true
                    }
                  ]
            },
            stock:{
                items: [
                    {
                        "sales_channel_id": "733af55a-4133-4d7c-b5f3-d64d42c135fe",
                        "ean": "352369874563",
                        "quantity": 50
                    },
                    {
                        "sales_channel_id": "01924c48-49bb-40c2-9c32-ab582e6db6f4",
                        "ean": "352369874563",
                        "quantity": 25
                    },
                    {
                        "sales_channel_id": "00f2a393-6889-4fc0-8cd9-86e454e6dfa3",
                        "ean": "3523698745632",
                        "quantity": 25
                    }
                  ]
            }
          }
    ]

    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'postenviarproductos',
            productos
        },
        success: (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta));
            console.log("datos envio =>>>>>>",datos);
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
// asignadoles eventos a los elementos html
$botonFiltroProducto.addEventListener("click", filtrarProductos);
$nombreProducto.addEventListener("keyup", filtrarProductos);
$botonIrHaformulario.addEventListener("click",irHaFormularioDeProductos)
$botonIrHaVistaInicial.addEventListener("click",irHaVistaInicial)
$botonIrHaVistaFormularioProductos.addEventListener("click",irHaVistaFormularioProductos)
$botonIrHaVistaBorrarProductos.addEventListener("click",irHaVistaBorrarProductos)
$botonEnviarPoductos.addEventListener("click",generarFormatoZalado)
// obtenerProductos.addEventListener("click", mostrarModalSubirProductos);
// botonSalirVistaSubirProducto.addEventListener("click", cerrarModalSubirProducto);
botonTestEnvio.addEventListener("click",enviarProductos)
// botonConsultarPedidos.addEventListener("click", coonsultarPedidos)
// botonConsultarCategoriasAso.addEventListener("click", consultarCategorias)
// botonConsultartallasAsociadasMasPais.addEventListener("click", consultarTallasProPais)
// ejecuciones de funciones al cargar el archivo
consultarPaisesZalando();
