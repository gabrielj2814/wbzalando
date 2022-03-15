// variables globales
let listaProductos={};
let productosSeleccionados=[];
let productosFiltrados=[];
let datosResPaldoProductos={}
let datosProductosForm={}
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
let $botonEdicionGlobal=document.getElementById("botonEdicionGlobal")
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
            console.log("datos paises =>>>> ",datos)
            if(datos.respuestaServidor.items){
                consultarCategoraisAsociadas();
                crearRadiosPaisTest(datos.respuestaServidor.items);
                crearRadiosPaisTestBorrarProdcuto(datos.respuestaServidor.items)
            }
            if(datos.respuestaServidor.status && datos.respuestaServidor.status==401){
                console.log("respuesta en 401 =>>>>> " ,datos.respuestaServidor);
                mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
            }

        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
            datos_categorias=json.datos
            // insertarCategoriasSelect(json.datos);
            consultarCategoriasTalla()
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
            datos_categorias_tallas_zalando=datos.respuestaServidor
            consultarMaterialesDeConstruccion()
            // preloader.style.opacity="0"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
            datos_materiales_contruccion=datos.respuestaServidor
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
                <label for='"+pais.sales_channel_id+"_paises_borrar' class='btn btn-primary'>\
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
// function para filtrar los productos de la primera vista
function filtrarProductos(e){
    e.preventDefault()
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
            let datos=JSON.parse(JSON.stringify(respuesta.datos));
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
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
        }
    });
}

// slider
let $vistaFormProductos=document.getElementById("vista-form-productos")
let $vistaBorrarProductos=document.getElementById("vista-borrar-productos")
let $vistaInicial=document.getElementById("vista-inicial")

function irHaFormularioDeProductos(){
    datosResPaldoProductos={}
    datosProductosForm={}
    $vistaInicial.style.display="none"
    $vistaFormProductos.style.display="block"
    let radiosPaisesForm=document.querySelectorAll(".redio-paises-form");

    for(let pais of radiosPaisesForm){
        datosResPaldoProductos[pais.value]={}
        for(let producto of productosFiltrados){
            let descripcionProducto=producto.description.replace("<p>","").replace("</p>","").split("'").join("")
            let nombrePro=producto.name.split("'").join("")
            datosResPaldoProductos[pais.value][pais.value+"_"+producto.id_product]={
                paisTalla:"",
                idProductoTienda:producto.id_product,
                ean:producto.ean13,
                nombreProducto:nombrePro,
                urlImagen:producto.urlImagen,
                idUrlImagen:producto.id_product,
                descripcion:descripcionProducto,
                brand_code:"null",
                lenguaje:producto.iso_code,
                outline:"null",
                stock:"0",
                size_group:"",
                supplier_color:"",
                "color_code.primary":"null",
                target_genders:[],
                target_age_groups:[],
                season_code:"null",
                moneda:"",
                precioRegular:"",
                precioPromocional:"",
                fechaInicioPromocion:"",
                fechaFinalPromocion:"",
                datosTallas:{},
                haEnviar:false,
                how_to_use:"null",
                warnings:"null",
                material_percentage:"null",
                material_code:"null",
                atributos_producto:producto.atributos_producto
            }
        }
    }
    // console.log("lista ---- =>>>> ",productosFiltrados)
    // console.log("productos aginados por pais =>>>> ",datosResPaldoProductos)
    // datosProductosForm=JSON.parse(JSON.stringify(datosResPaldoProductos))
    radiosPaisesForm[0].setAttribute("checked",true)
    cargarProductosPorPaisSeleccionado(radiosPaisesForm[0]);
    
}

window.onload = function(){
    if($vistaFormProductos && $vistaBorrarProductos){ 
        setTimeout(function(){
            $vistaFormProductos.style.display="none"
            $vistaFormProductos.style.opacity="1"

            $vistaBorrarProductos.style.display="none"
            $vistaBorrarProductos.style.opacity="1"
        }, 2000);
    }
}
//  ====================================
//  ====================================
//  ====================================
// navegación entre paginas
function irHaVistaInicial(){
    $vistaInicial.style.display="block"
    $vistaFormProductos.style.display="none"
}

function irHaVistaBorrarProductos(e){
    e.preventDefault()
    $vistaFormProductos.style.display="none"
    $vistaBorrarProductos.style.display="block"
}

function irHaVistaFormularioProductos(){
    $vistaFormProductos.style.display="block"
    $vistaBorrarProductos.style.display="none"
}

function cargarProductosPorPaisSeleccionado(a){
    let productos=datosResPaldoProductos[a.value]
    console.log("cargar porductos por pais seleccionado =>>>> ",productos)
    cargarDatosBrandCode();
    insertarProductosVistaEnvio(a.value,productos)
}
//  ====================================
//  ====================================
//  ====================================
// cargar los datos de los productos que an sido ingresados en el formulario 
function cargarDatosGuardados(pais){
    // alert("hola cargar datos guar")
    console.log("aqiiiiiiiiiiiiiiiiiiii =>>> ",datosProductosForm[pais])
    if(datosProductosForm[pais]){
        // _categoria
        for(let idProducto in datosProductosForm[pais]){
            let datosProducto=datosProductosForm[pais][idProducto]
            document.getElementById(idProducto+"_categoria").value=datosProducto.outline
            let categoriaTalla=document.getElementById(idProducto+"_categoria_talla")
            let paisTalla=document.getElementById(idProducto+"_pais_talla")
            categoriaTalla.value=datosProducto.size_group
            paisTalla.value=datosProducto.paisTalla
            consultarTallasPorPaisYCategoriaTalla(categoriaTalla);

            document.getElementById(idProducto+"_color").value=datosProducto["color_code.primary"]
            document.getElementById(idProducto+"_supplier_color").value=datosProducto.supplier_color
            
            document.getElementById(idProducto+"_moneda").value=datosProducto.moneda
            document.getElementById(idProducto+"_precio_regular").value=datosProducto.precioRegular
            document.getElementById(idProducto+"_precio_promocion").value=datosProducto.precioPromocional
            document.getElementById(idProducto+"_fecha_inicio_promocion").value=datosProducto.fechaInicioPromocion
            
            document.getElementById(idProducto+"_fecha_final_promocion").value=datosProducto.fechaFinalPromocion
            if(document.getElementById(idProducto+"_material")){
                document.getElementById(idProducto+"_material").value=datosProducto.material_code
                document.getElementById(idProducto+"_material_precentage").value=(datosProducto.material_percentage!=="null")?datosProducto.material_percentage:""
            }
            let setelctTargetAgeGroups=document.getElementById(idProducto+"_target_age_groups")
            seleccionarValoresSelectMultiples(setelctTargetAgeGroups,datosProducto.target_age_groups)

            let setelctTargetGenders=document.getElementById(idProducto+"_target_genders")
            seleccionarValoresSelectMultiples(setelctTargetGenders,datosProducto.target_genders)
            document.getElementById(idProducto+"_brand").value=datosProducto.brand_code
            document.getElementById(idProducto+"_season").value=datosProducto.season_code
            
            if(document.getElementById(idProducto+"_warnings")){
                document.getElementById(idProducto+"_warnings").value=(datosProducto.warnings!=="null")?datosProducto.warnings:""
            }
            if(document.getElementById(idProducto+"_how_to_use")){
                document.getElementById(idProducto+"_how_to_use").value=(datosProducto.how_to_use!=="null")?datosProducto.how_to_use:"";
            }
            let radioFormulario=document.getElementById(idProducto+"_check_envio")
            radioFormulario.checked=datosProducto.haEnviar
            cambiarEstadoDeEnvioDeProduct(radioFormulario)
            console.log("xxxxx =>>>> ",datosProductosForm[pais][idProducto])
        }
        // let datosProductosPais=JSON.parse(JSON.stringify(datosProductosForm[pais]))
    }
}
// funcion para hacer la seleccion en select multiples al cargar los datos en el formulario
function seleccionarValoresSelectMultiples(select,valoresHaSeleccionar){
    let estado=false
    for(let valor of valoresHaSeleccionar){
        for(let option of select){
            if(valor===option.value){
                estado=true
                option.selected=true
            }
        }
    }
    if(estado===false){
        select[0].selected=true
    }
    else{
        select[0].selected=false
    }

    
}
// cargar el stock de las tallas guardadas
function cargarStockTalla(e){
    let idPais=e.getAttribute("data-id-pais")
    let idProducto=e.getAttribute("data-id-producto")
    let tallaCliente=e.value.split("-")[1]
    if(datosProductosForm[idPais][idProducto].datosTallas[tallaCliente]){
        document.getElementById(idProducto+"_stock").value=datosProductosForm[idPais][idProducto].datosTallas[tallaCliente].stock
    }
    else{
        document.getElementById(idProducto+"_stock").value=""
    }
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
                            <label >Categoria</label>\
                            <select id="'+codigoIdPaisIdproducto+'_categoria" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="outline" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-categoria">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >Categoria talla</label>\
                            <select id="'+codigoIdPaisIdproducto+'_categoria_talla" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="size_group" onBlur="consultarTallasPorPaisYCategoriaTalla(this)" class="form-control margin-0 campo-categoria-talla">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >Talla Pais</label>\
                            <select  id="'+codigoIdPaisIdproducto+'_pais_talla" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="paisTalla" onBlur="consultarTallasPorPaisYCategoriaTalla(this)"  class="form-control margin-0 ">\
                                <option value="null">Seleccione</option>\
                                <option value="eu">Europa</option>\
                                <option value="fr">Francia</option>\
                                <option value="it">Italia</option>\
                                <option value="uk">Reino Unido</option>\
                                <option value="us">Estados Unidos</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >color</label>\
                            <select data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="color_code.primary" id="'+codigoIdPaisIdproducto+'_color" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-color-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label for="">supplier color</label>\
                            <input id="'+codigoIdPaisIdproducto+'_supplier_color" type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="supplier_color" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Siglas Moneda</label>\
                            <input id="'+codigoIdPaisIdproducto+'_moneda" type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="moneda" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Precio Regular</label>\
                            <input id="'+codigoIdPaisIdproducto+'_precio_regular" type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="precioRegular" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Precio Descuento</label>\
                            <input id="'+codigoIdPaisIdproducto+'_precio_promocion" type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="precioPromocional" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Fecha de Inicio de Descuento</label>\
                            <input id="'+codigoIdPaisIdproducto+'_fecha_inicio_promocion" type="date" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="fechaInicioPromocion"  class="form-control campo-fecha-inicio-promo" onBlur="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Fecha de Final de Descuento</label>\
                            <input id="'+codigoIdPaisIdproducto+'_fecha_final_promocion" type="date" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="fechaFinalPromocion"  class="form-control campo-fecha-fin-promo" onBlur="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >material</label>\
                            <select disabled id="'+codigoIdPaisIdproducto+'_material" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="material_code" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-material-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >material percentage</label>\
                            <input disabled id="'+codigoIdPaisIdproducto+'_material_precentage" type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="material_percentage" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >target age groups</label>\
                            <select id="'+codigoIdPaisIdproducto+'_target_age_groups" multiple data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="target_age_groups" onBlur="insertarDatosDeEnvioDeProduct(this)" class="class-select m-0 form-control margin-0 campo-target-age-groups">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >target genders</label>\
                            <select id="'+codigoIdPaisIdproducto+'_target_genders" multiple data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="target_genders" onBlur="insertarDatosDeEnvioDeProduct(this)" class="class-select m-0 form-control margin-0 campo-target-genders">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >brand</label>\
                            <select id="'+codigoIdPaisIdproducto+'_brand" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="brand_code" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-brand-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >season code</label>\
                            <select id="'+codigoIdPaisIdproducto+'_season" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="season_code" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-season-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <h2>Tallas</h2>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >Tallas</label>\
                                <select id="'+codigoIdPaisIdproducto+'_talla" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="size_codes" id="'+codigoIdPaisIdproducto+'_talla" class="form-control margin-0 campo-talla" onBlur="cargarStockTalla(this)">\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Stock</label>\
                            <input id="'+codigoIdPaisIdproducto+'_stock" type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="stock" placeholder="" onKeyup="guardarDatosTalla(this)">\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">\
                        <div class="form-group">\
                            <label for="">warnings</label>\
                            <textarea disabled id="'+codigoIdPaisIdproducto+'_warnings" class="form-control" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="warnings" rows="3" onKeyup="insertarDatosDeEnvioDeProduct(this)"></textarea>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">\
                        <div class="form-group">\
                            <label for="">how to use</label>\
                            <textarea disabled id="'+codigoIdPaisIdproducto+'_how_to_use" class="form-control" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="how_to_use" rows="3" onKeyup="insertarDatosDeEnvioDeProduct(this)"></textarea>\
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
            let option="<option value='"+color.codigo_color+"-"+color.id_attribute+"'>"+color.name+"</option>"
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
    let $campoTallaCode=document.getElementById(idProducto+"_talla")
    $campoTallaCode.innerHTML=""
    let html="<option value='null'>Seleccione una o mas tallas</option>"
    for(let talla of tallas){
        let option="<option value='"+talla.talla_zalando+"-"+talla.id_attribute+"'>"+talla.name+"</option>"
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
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
                let option="<option value='null'>Seleccione</option>"
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
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
                let option="<option value='null'>Seleccione</option>"
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
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
                    option+="<option value='"+datos.codigo_color+"'>"+datos.name+"</option>"
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
                let radiosPaisesForm=document.querySelectorAll(".redio-paises-form:checked")[0];
                cargarDatosGuardados(radiosPaisesForm.value)

            }
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
        }
    });
}
// -------------------------------------
// cargar datos al interacturar con el formulario 
function consultarTallasPorPaisYCategoriaTalla(a){
    insertarDatosDeEnvioDeProduct(a)
    const linkDeControladorTalla=document.getElementById("linkDeControladorTalla").value;
    let idProducto=a.getAttribute("data-id-producto")
    let isoCode=document.getElementById(idProducto+"_pais_talla")
    let grupo=document.getElementById(idProducto+"_categoria_talla")
    let idPais=a.getAttribute("data-id-pais")
    datosProductosForm[idPais][idProducto].datosTallas={}
    if(grupo.value!=="null" && isoCode.value!=="null"){
        preloader.style.opacity="1"
        bodyPleloader.style.overflow="hidden"
        $.ajax({
            type: 'GET',
            cache: false,
            dataType: 'json',
            url: linkDeControladorTalla, 
            data: {
                ajax: true,
                action: 'getConsultartodotallasporpaisycategoriatallazalando',
                pais:isoCode.value,
                grupo:grupo.value
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
                mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
    if(document.getElementById(idProducto+"_check_envio")){
        let radioFormulario=document.getElementById(idProducto+"_check_envio")
        radioFormulario.checked=true
        cambiarEstadoDeEnvioDeProduct(radioFormulario)
    }
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
    if(a.checked===true){
        document.getElementById(idProducto+"_check_true").classList.remove("ocultar")
        document.getElementById(idProducto+"_check_false").classList.add("ocultar")
    }
    else{
        document.getElementById(idProducto+"_check_true").classList.add("ocultar")
        document.getElementById(idProducto+"_check_false").classList.remove("ocultar")
    }
    if(!datosProductosForm[idPais]){
        datosProductosForm[idPais]={}
    }
    if(!datosProductosForm[idPais][idProducto]){
        datosProductosForm[idPais][idProducto]=datosResPaldoProductos[idPais][idProducto]
    }
    datosProductosForm[idPais][idProducto][campo]=a.checked
    // alert("hola")
    // console.log(datosProductosForm)
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
            if(option.selected===true){
                opciones.push(option.value)
            }
        }
        datosProductosForm[idPais][idProducto][campo]=opciones
    }
    else{
        datosProductosForm[idPais][idProducto][campo]=a.value
    }
    console.log(datosProductosForm)
    if(campo==="outline"){
        bloquearCampoPorCategoriaZalando(a.value,datosProductosForm[idPais][idProducto],idPais,idProducto)
    }
}

function bloquearCampoPorCategoriaZalando(categoria,producto,idPais,idProducto){
    alert(categoria)
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorCategoria, 
        data: {
            ajax: true,
            action: 'getatributoscategoria',
            outline:categoria
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("propiedades categoria =>>> ",respuestaJson.datos);
            // disabled
            let busquedaConfig=respuestaJson.datos.config.mandatory_types.filter(propiedad => propiedad==="material.upper_material_clothing")
            let busquedaModelo=respuestaJson.datos.model.mandatory_types.filter(propiedad =>  propiedad==="how_to_use" || propiedad==="warnings")
            if(busquedaConfig.length>0){
                let campoMaterial=document.getElementById(idProducto+"_material")
                campoMaterial.removeAttribute("disabled")
                producto["material_code"]=""
                let campoMaterialPrecentege=document.getElementById(idProducto+"_material_precentage")
                campoMaterialPrecentege.removeAttribute("disabled")
                producto["material_precentage"]=""
            }
            else{
                let campoMaterial=document.getElementById(idProducto+"_material")
                campoMaterial.setAttribute("disabled","disabled")
                campoMaterial.value=""
                producto["material_code"]="null"
                let campoMaterialPrecentege=document.getElementById(idProducto+"_material_precentage")
                campoMaterialPrecentege.setAttribute("disabled","disabled")
                campoMaterialPrecentege.value=""
                producto["material_precentage"]="null"
            }
            if(busquedaModelo.length===2){
                alert("lo encontre en modelo")
                let campoWarning=document.getElementById(idProducto+"_warnings")
                campoWarning.removeAttribute("disabled")
                producto["warnings"]=""
                let campoHowToUse=document.getElementById(idProducto+"_how_to_use")
                campoHowToUse.removeAttribute("disabled")
                producto["how_to_use"]=""
            }
            else{
                let campoWarning=document.getElementById(idProducto+"_warnings")
                campoWarning.setAttribute("disabled","disabled")
                campoWarning.value=""
                producto["warnings"]="null"
                let campoHowToUse=document.getElementById(idProducto+"_how_to_use")
                campoHowToUse.setAttribute("disabled","disabled")
                campoHowToUse.value=""
                producto["how_to_use"]="null"
            }
        },
        error: () => {
            // console.log("error al consultar las propiedades de la categoria")
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
        }
    });
} 

function guardarDatosTalla(e){
    let idPais=e.getAttribute("data-id-pais")
    let idProducto=e.getAttribute("data-id-producto")
    if(!datosProductosForm[idPais]){
        datosProductosForm[idPais]={}
    }
    if(!datosProductosForm[idPais][idProducto]){
        datosProductosForm[idPais][idProducto]=datosResPaldoProductos[idPais][idProducto]
    }
    // let campo=a.getAttribute("data-campo")
    let tallaZalando=document.getElementById(idProducto+"_talla").value.split("-")[0]
    let tallaCliente=document.getElementById(idProducto+"_talla").value.split("-")[1]
    let colorCliente=document.getElementById(idProducto+"_color").value.split("-")[1]
    let listaColores=[]
    let datosAtributos=JSON.parse(JSON.stringify(datosProductosForm[idPais][idProducto].atributos_producto));
    for(let atributo of datosAtributos){
        if(colorCliente===atributo.id_attribute){
            listaColores.push(JSON.parse(JSON.stringify(atributo)))
        }
    }
    for(let contador=0;contador<listaColores.length;contador++){
        for(let atributo3 of datosAtributos){
            if(listaColores[contador].ean13===atributo3.ean13 && listaColores[contador].id_attribute!==atributo3.id_attribute){
                listaColores[contador]["id_atributo_talla"]=atributo3.id_attribute
            }
        }
    }
    let combinacionEncontrada=listaColores.filter(combinacion => combinacion.id_attribute===colorCliente && combinacion.id_atributo_talla===tallaCliente)
    console.log("encontrado =>>",combinacionEncontrada)
    if(combinacionEncontrada.length===1){
        datosProductosForm[idPais][idProducto].datosTallas[tallaCliente]={
            talla:tallaZalando,
            ean:combinacionEncontrada[0].ean13,
            stock:e.value
        }
    }
}

function aplicarEdicionGlobal(){
    let $edicionGlobalBrandCode=document.getElementById("edicionGlobalBrandCode")
    let $edicionGlobalSeasonCode=document.getElementById("edicionGlobalSeasonCode")
    let $edicionGlobalColor=document.getElementById("edicionGlobalColor")
    let $edicionGlobalTargetAgeGroups=document.getElementById("edicionGlobalTargetAgeGroups")
    let $edicionGlobalTargetGenders=document.getElementById("edicionGlobalTargetGenders")
    let $camposColorCode=document.querySelectorAll(".campo-color-code")
    let $camposSeasonCode=document.querySelectorAll(".campo-season-code")
    let $camposBrandCode=document.querySelectorAll(".campo-brand-code")
    let $camposTargetAgeGroupsCode=document.querySelectorAll(".campo-target-age-groups")
    let $camposTargetGendersCode=document.querySelectorAll(".campo-target-genders")
    let estadoColor=false
    $camposColorCode.forEach( campoColor => {
        for(let option of campoColor){
            let colorZalando=option.value.split("-")[0]
            if(colorZalando===$edicionGlobalColor.value){
                option.selected=true
                estadoColor=true
            }
            else{
                option.selected=false
            }
        }
    })
    let estadoEdicionGlobalSeason=seleccionSeleccionUnicaEdicionGlobal($camposSeasonCode,$edicionGlobalSeasonCode.value)
    let estadoEdicionGlobalBrand=seleccionSeleccionUnicaEdicionGlobal($camposBrandCode,$edicionGlobalBrandCode.value)
    let estadoEdicionGlobalTargetAge=seleccionSeleccionMultipleEdicionGlobal($camposTargetAgeGroupsCode,$edicionGlobalTargetAgeGroups)
    let estadoEdicionGlobalTargetG=seleccionSeleccionMultipleEdicionGlobal($camposTargetGendersCode,$edicionGlobalTargetGenders)
    if(estadoEdicionGlobalBrand===true){
        $camposBrandCode.forEach(select => {
            insertarDatosDeEnvioDeProduct(select)
        })
    }
    if(estadoEdicionGlobalSeason===true){
        $camposSeasonCode.forEach(select => {
            insertarDatosDeEnvioDeProduct(select)
        })
    }
    if(estadoColor===true){
        $camposColorCode.forEach(select => {
            insertarDatosDeEnvioDeProduct(select)
        })
    }
    if(estadoEdicionGlobalTargetAge===true){
        $camposTargetAgeGroupsCode.forEach(select => {
            insertarDatosDeEnvioDeProduct(select)
        })
    }
    if(estadoEdicionGlobalTargetG===true){
        $camposTargetGendersCode.forEach(select => {
            insertarDatosDeEnvioDeProduct(select)
        })
    }
}

function seleccionSeleccionUnicaEdicionGlobal(selects,valor){
    let estado=false
    selects.forEach( select => {
        for(let option of select){
            if(option.value===valor){
                option.selected=true
                estado=true
            }
            else{
                option.selected=false
            }
        }
    })
    return estado
}

function seleccionSeleccionMultipleEdicionGlobal(selects,selectEdicion){
    let estado=false
    selects.forEach( select => {
        for(let option of select){
            option.selected=false
        }
    })
    for(let optionEdicion of selectEdicion){
        // console.log(optionEdicion)
        if(optionEdicion.selected===true){
            selects.forEach( select => {
                for(let option of select){
                    if(option.value===optionEdicion.value){
                        option.selected=true
                        estado=true
                    }
                }
            })
        }
    }
    return estado
  
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
                   "producto":{
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
                }
                if(datosProductosForm[pais][producto]["how_to_use"]!=="null" && datosProductosForm[pais][producto]["warnings"]!=="null"){
                    modelo.producto.product_model_attributes["how_to_use"]=datosProductosForm[pais][producto]["how_to_use"]
                    modelo.producto.product_model_attributes["warnings"]=datosProductosForm[pais][producto]["warnings"]
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
                        "description": {},
                        "season_code": "",
                        "supplier_color": datosProductosForm[pais][producto].supplier_color,
                        "color_code.primary": ""
                    },
                    "product_simples":[]
                }
                config.product_config_attributes.description["en"]=datosProductosForm[pais][producto].descripcion
                config.product_config_attributes.season_code=datosProductosForm[pais][producto].season_code
                config.product_config_attributes["color_code.primary"]=datosProductosForm[pais][producto]["color_code.primary"].split("-")[0]
                if(datosProductosForm[pais][producto]["material_code"] !=="null" && datosProductosForm[pais][producto]["material_percentage"] !=="null"){
                    // "material.upper_material_clothing":{"material_percentage":"DecimalDefinition","material_code":"LocalizedStringDefinition"}
                    config.product_config_attributes["material.upper_material_clothing"]={
                        material_percentage:datosProductosForm[pais][producto]["material_percentage"],
                        material_code:{
                            en:datosProductosForm[pais][producto]["material_code"]
                        }
                    }
                }
                
                modelo.producto.product_model.product_configs.push(config)
                let precio=[]
                let stock=[]
                for(let idAtributoTalla in datosProductosForm[pais][producto].datosTallas){
                    let datosTalla=datosProductosForm[pais][producto].datosTallas[idAtributoTalla]
                    let simple= {
                        "merchant_product_simple_id": "simple-"+datosTalla.talla+"-"+moment().format("x"),
                        "product_simple_attributes": {
                            "ean": datosTalla.ean,
                            "size_codes": {
                                "size": datosTalla.talla
                            }
                        }
                    }
                    modelo.producto.product_model.product_configs[0].product_simples.push(simple)
                    if(datosProductosForm[pais][producto].precioPromocional!=="" && parseFloat(datosProductosForm[pais][producto].precioPromocional)>0){
                        precio.push({
                            "ean": datosTalla.ean,
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
                        })
                    }
                    else{
                        precio.push({
                            "ean": datosTalla.ean,
                            "sales_channel_id": pais,
                            "regular_price": {
                                "amount": parseFloat(datosProductosForm[pais][producto].precioRegular),
                                "currency": datosProductosForm[pais][producto].moneda
                            }
                        })
                    }
                    if(parseInt(datosTalla.stock)>0 && datosTalla.stock!==""){
                        stock.push(
                            {
                                "sales_channel_id": pais,
                                "ean": datosTalla.ean,
                                "quantity": parseInt(datosTalla.stock)
                            }
                        )
                    }
                    

                }
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
            mostrarAlerta("alert-success","Productos enviados")
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
            // alert("error al conectar con el servidor");
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

// asignadoles eventos a los elementos html
$botonFiltroProducto.addEventListener("click", filtrarProductos);
$nombreProducto.addEventListener("keyup", filtrarProductos);
$botonIrHaformulario.addEventListener("click",irHaFormularioDeProductos)
$botonIrHaVistaInicial.addEventListener("click",irHaVistaInicial)
$botonIrHaVistaFormularioProductos.addEventListener("click",irHaVistaFormularioProductos)
$botonIrHaVistaBorrarProductos.addEventListener("click",irHaVistaBorrarProductos)
$botonEnviarPoductos.addEventListener("click",generarFormatoZalado)
$botonEdicionGlobal.addEventListener("click",aplicarEdicionGlobal)
// ejecuciones de funciones al cargar el archivo
consultarPaisesZalando();
