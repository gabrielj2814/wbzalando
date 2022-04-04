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
let imagenSubidaAlServidor=[]
let listaDePaises={}
let datos_futter={}
let datos_upper_material={}
let datos_sole_material={}
let datos_decksohle={}
let imagenesProductos=[]
let imagenesProductosFiltradas=[]
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
            cargarDatosfutter();

        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
        }
    });
}

function cargarDatosfutter(){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    let propiedad="futter"
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
            // console.log("datos propiedad "+propiedad+" =>>> ",respuestaJson.datos);
            datos_futter=respuestaJson.datos
            cargarDatosUpperMaterial()
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
        }
    });
}
function cargarDatosUpperMaterial(){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    let propiedad="upper_material"
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
            // console.log("datos propiedad "+propiedad+" =>>> ",respuestaJson.datos);
            datos_upper_material=respuestaJson.datos
            cargarDatosSoleMaterial()
            
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
        }
    });
}

function cargarDatosSoleMaterial(){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    let propiedad="sole_material"
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
            // console.log("datos propiedad "+propiedad+" =>>> ",respuestaJson.datos);
            datos_sole_material=respuestaJson.datos
            cargarDatosdecksohle()
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
        }
    });
}

function cargarDatosdecksohle(){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    let propiedad="decksohle"
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
            // console.log("datos propiedad "+propiedad+" =>>> ",respuestaJson.datos);
            datos_decksohle=respuestaJson.datos
            consultarTodasLasImagenes()
            
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
        }
    });
}

function consultarTodasLasImagenes(){
    const linkControlador=document.getElementById("linkDeControladorGaleria").value;

    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultartodo'
        },
        success: (respuesta) => {
            let responseJson=respuesta.respuestaServidor
            console.log("consultar iamgenes todos =>>>>>> ",responseJson)
            imagenesProductos=responseJson.datos
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            // mostrarAlerta("alert-success","El precio a sido enviado correctamente")
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            // mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
        }
    });
}

// =====================
// =====================
// =====================
function crearRadiosPaisTest(paises){
    let contenedorBanderasProductos=document.getElementById("paisesFormularioProducto");
    let sliderPaisesProductos=document.getElementById("slider-productos");
    sliderPaisesProductos.innerHTML=""
    contenedorBanderasProductos.innerHTML="";
    listaDePaises={}
    for(let pais of paises){
        let htmlCheckbox="\
            <div style='display:none;'>\
                <input type='radio'  class='redio-paises-form' value='"+pais.sales_channel_id+"' id='"+pais.sales_channel_id+"' name='radio-form-producto' data-nombre-pais='"+pais.country_name+"' data-iso-code='"+pais.country_code+"' onChange='cargarProductosPorPaisSeleccionado(this)'/>\
                "+pais.country_name+"\
            </div>\
        ";
        listaDePaises[pais.sales_channel_id]=pais.country_name
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
    let numeroDeProductos=document.getElementById("numeroDeProductos")
    $botonIrHaformulario.setAttribute("disabled","disabled")
    totalResultados.textContent="cargando... "
    let pagina=1
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
            nombreProducto:$nombreProducto,
            minimo:numeroDeProductos.value,
            pagina
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta));
            totalResultados.textContent=respuestaJson.totalRegistros.toString()
            console.log("datosssssssssssssssssssssssssssssssss =>>>>>>>>>>>>>>>>> ",respuestaJson)
            if(respuestaJson.totalRegistros>0){
                $botonIrHaformulario.removeAttribute("disabled")
                productosFiltrados=respuestaJson.productosPaginados
                if(respuestaJson.totalRegistros>0){
                    insertarControlesPaginacion();
                    let paginaAnt=document.getElementById("pagina-ant")
                    let paginaSig=document.getElementById("pagina-sig")
                    paginaSig.style.display="block"
                    paginaAnt.style.display="block"
                    if(parseInt(pagina)===respuestaJson.totalDePagina){
                        paginaSig.setAttribute("data-numero-pagina",respuestaJson.totalDePagina)
                        paginaSig.style.display="none"
                    }
                    else if(parseInt(pagina)<respuestaJson.totalDePagina){
                        paginaSig.setAttribute("data-numero-pagina",(parseInt(pagina)+1))
                    }
                    if(parseInt(pagina)===1){
                        paginaAnt.setAttribute("data-numero-pagina",1)
                        paginaAnt.style.display="none"
                    }
                    else if(parseInt(pagina)<=respuestaJson.totalDePagina){
                        paginaAnt.setAttribute("data-numero-pagina",(parseInt(pagina)-1))
                    }
                    insertarBotonesPaginasPaginacion(pagina,respuestaJson.totalDePagina)
                }
                
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
    datosProductosForm={}

}

function insertarControlesPaginacion(){
    let controlesPaginacion=document.getElementById("controlesPaginacion")
    // controlesPaginacion.innerHTML="";
    let html="\
        <div class='estructura-paginador'>\
        <button id='pagina-ant' onClick='filtrarProductosPaginar(this)'>\
            <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' class='bi bi-arrow-left-circle-fill' viewBox='0 0 16 16'>\
            <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z'/>\
            </svg>\
        </button>\
        <div id='lista-paginas'></div>\
        <button id='pagina-sig' onClick='filtrarProductosPaginar(this)'>\
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
            boton+="<button onClick='filtrarProductosPaginar(this)' style='color: #1900e7 !important; text-decoration: underline;' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
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
            boton+="<button onClick='filtrarProductosPaginar(this)' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
        }
        if(paginaBoton===pagina-1 && paginaBoton!==0){
            boton+="<button onClick='filtrarProductosPaginar(this)' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
        }
        contador++
    }
    if(totalDePagina>pagina && agregarUltimaPagina===false){
        htmlBotonesPaginacion+="<button onClick='filtrarProductosPaginar(this)' id='ultima-pagina' class='ultima-pagina' data-numero-pagina='"+totalDePagina+"'>"+totalDePagina+"</button>";
    }
    if(agregarPrimeraPagina){
        listaPaginas.insertAdjacentHTML("afterBegin","<button onClick='filtrarProductosPaginar(this)' id='primera-pagina' class='primera-pagina' data-numero-pagina='"+1+"'>"+1+"</button>")
    }
    listaPaginas.innerHTML+=htmlBotonesPaginacion;
}

function filtrarProductosPaginar(a){
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    let pagina=1;
    if(a!=1){
        pagina=(a.getAttribute("data-numero-pagina"))?a.getAttribute("data-numero-pagina"):1
    }
    const linkControlador=document.getElementById("linkControlador").value;
    let categoriaProducto=document.getElementById("categoriaProducto").value;
    let marcaProducto=document.getElementById("marcaProducto").value;
    let $nombreProducto=document.getElementById("nombreProducto").value;
    let totalResultados=document.getElementById("totalResultados")
    let numeroDeProductos=document.getElementById("numeroDeProductos")
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
            nombreProducto:$nombreProducto,
            minimo:numeroDeProductos.value,
            pagina
        },
        success: (respuesta) => {
            let respuestaJson=JSON.parse(JSON.stringify(respuesta));
            totalResultados.textContent=respuestaJson.totalRegistros.toString()
            console.log("datosssssssssssssssssssssssssssssssss =>>>>>>>>>>>>>>>>> ",respuestaJson)
            if(respuestaJson.totalRegistros>0){
                $botonIrHaformulario.removeAttribute("disabled")
                productosFiltrados=respuestaJson.productosPaginados
                irHaFormularioDeProductos()
                if(respuestaJson.totalRegistros>0){
                    insertarControlesPaginacion();
                    let paginaAnt=document.getElementById("pagina-ant")
                    let paginaSig=document.getElementById("pagina-sig")
                    paginaSig.style.display="block"
                    paginaAnt.style.display="block"
                    if(parseInt(pagina)===respuestaJson.totalDePagina){
                        paginaSig.setAttribute("data-numero-pagina",respuestaJson.totalDePagina)
                        paginaSig.style.display="none"
                    }
                    else if(parseInt(pagina)<respuestaJson.totalDePagina){
                        paginaSig.setAttribute("data-numero-pagina",(parseInt(pagina)+1))
                    }
                    if(parseInt(pagina)===1){
                        paginaAnt.setAttribute("data-numero-pagina",1)
                        paginaAnt.style.display="none"
                    }
                    else if(parseInt(pagina)<=respuestaJson.totalDePagina){
                        paginaAnt.setAttribute("data-numero-pagina",(parseInt(pagina)-1))
                    }
                    insertarBotonesPaginasPaginacion(pagina,respuestaJson.totalDePagina)
                }
                
            }
            else{
                totalResultados.textContent="0"
            }
        },
        error: () => {
            totalResultados.textContent="0"
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
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
    // datosProductosForm={}
    $vistaInicial.style.display="none"
    $vistaFormProductos.style.display="block"
    let radiosPaisesForm=document.querySelectorAll(".redio-paises-form");

    for(let pais of radiosPaisesForm){
        datosResPaldoProductos[pais.value]={}
        for(let producto of productosFiltrados){
            let descripcionProducto=producto.description.replace("<p>","").replace("</p>","").split("'").join("")
            let nombrePro=producto.name.split("'").join("")
            if(datosResPaldoProductos[pais.value]){
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
                    size_group:"",
                    supplier_color:"",
                    "color_code.primary":"null",
                    target_genders:[],
                    target_age_groups:[],
                    futter:[],
                    upper_material:[],
                    sole_material:[],
                    decksohle:[],
                    season_code:"null",
                    moneda:"",
                    precioRegular:producto.price,
                    precioPromocional:"",
                    fechaInicioPromocion:"",
                    fechaFinalPromocion:"",
                    // datosTallas:{},
                    haEnviar:false,
                    how_to_use:"null",
                    warnings:"null",
                    material_percentage:"null",
                    material_code:"null",
                    atributos_producto:producto.atributos_producto,
                    //============
                    combinaciones:[],
                    tallas:[],
                    listIdImagenesGaleria:[]
                }
            }
            
        }
    }
    if(document.querySelector(".redio-paises-form:checked")){
        cargarProductosPorPaisSeleccionado(document.querySelector(".redio-paises-form:checked"));
    }
    else{
        cargarProductosPorPaisSeleccionado(document.querySelectorAll(".redio-paises-form")[0]);
    }
    
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
    let validacion=validarProducto()
    if(validacion){
        $vistaFormProductos.style.display="none"
        $vistaBorrarProductos.style.display="block"
        let radioPaiseHaEliminar=document.querySelectorAll(".radio-form-producto-borrar:checked")
        if(radioPaiseHaEliminar.length===1){
            cargarProductosHaEliminarPorPais(radioPaiseHaEliminar[0])
            duplicarDatos()
        }
        else{
            let radiosPaisesHaEliminar=document.querySelectorAll(".radio-form-producto-borrar")
            radiosPaisesHaEliminar[0].setAttribute("checked",true)
            cargarProductosHaEliminarPorPais(radiosPaisesHaEliminar[0])
            duplicarDatos()
        }
    }
}
// validar datos de productos antes de pasar a la ultima pagina
function validarProducto(){
    let estado=true
    let error="NULL"
    let productoError="null"
    let paisProductoError="null"
    for(let pais in datosProductosForm){
        for(let idProducto in datosProductosForm[pais]){
            let producto=datosProductosForm[pais][idProducto]
            if(producto.haEnviar===false){
                paisProductoError=pais
                if(producto.listIdImagenesGaleria.length<=0){
                    error="no se puede subir un producto sin imagen"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.outline==="null"){
                    error="El porducto no tiene una categoria seleccionada"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.brand_code==="null"){
                    error="El porducto no tine un brand seleccionado"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.moneda===""){
                    error="TIENE QUE SELECIONAR UNA MONEDA PARA EL PRECIO"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.season_code==="null"){
                    error="El porducto no tine una temporada seleccionada"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.size_group==="null"){
                    error="El porducto no tine un size grouo seleccionado"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.supplier_color===""){
                    error="El porducto no tine un proveedor de color"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto["color_code.primary"]==="null"){
                    error="El porducto no tine un color seleccionado"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.precioRegular===""){
                    error="El porducto no puede estar sin un precio regular"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.target_age_groups.length<=0){
                    error="El porducto no tine un target age groups seleccionado"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.target_genders.length<=0){
                    error="El porducto no tine un target genders seleccionado"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.upper_material.length<=0){
                    error="El porducto no tine no tiene upper material"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.sole_material.length<=0){
                    error="El porducto no tine no tiene sole material"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.futter.length<=0){
                    error="El porducto no tine futter"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.decksohle.length<=0){
                    error="El porducto no tine decksohle"
                    productoError=producto
                    estado=false
                    break
                }
                if(producto.precioPromocional!=="" || parseFloat(producto.precioPromocional)){
                    if(parseFloat(producto.precioPromocional)<=0){
                        error="El precio promocinal de producto no puede ser 0"
                        productoError=producto
                        estado=false
                        break
                    }
                    if(parseFloat(producto.precioPromocional)>=parseFloat(producto.precioRegular)){
                        error="El precio promocinal de producto no puede ser igual o mayor al precio regular"
                        productoError=producto
                        estado=false
                        break
                    }
                    if(moment(producto.fechaInicioPromocion).isAfter(moment().format("YYYY-MM-DD"))){
                        if(moment(producto.fechaInicioPromocion).isAfter(producto.fechaFinalPromocion)){
                            error="La fecha de inicio de promoción del productos no puede ser posterios a la fecha final de promocion"
                            productoError=producto
                            estado=false
                            break
                        }
                    }
                    else{
                        error="La fecha de inicio de promocion no pude ser hoy pude comenzar apartir de mañana"
                        productoError=producto
                        estado=false
                        break
                    }
                }
            }
        }
        if(!estado){
            break
        }
    }
    if(estado===false){
        let errorCompleto=`el producto ${productoError.nombreProducto} que decea enviar a ${listaDePaises[paisProductoError]} tiene el siguiente error :${error}`
        mostrarAlerta("alert-danger",errorCompleto)
    }
    return estado
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

function recurcibaMostrarTallas(idProducto,datosProducto){
    if(document.getElementById(idProducto+"_talla").children.length>0){
        let selectTallas=document.getElementById(idProducto+"_talla")
        for(let talla of datosProducto.tallas){
            for(let opcion of selectTallas){
                console.log("que verga mano =>>>>> ",opcion)
                if(opcion.value===talla){
                    opcion.selected=true
                }
            }
        }
    }
    else{
        recurcibaMostrarTallas(idProducto,datosProducto)
    }
}

function cargarDatosGuardados(pais){
    if(datosProductosForm[pais]){
        for(let idProducto in datosProductosForm[pais]){
            if(datosProductosForm[pais][idProducto]){
                if(document.getElementById(idProducto+"_categoria")){
                    let datosProducto=datosProductosForm[pais][idProducto]
                    document.getElementById(idProducto+"_categoria").value=datosProducto.outline
                    let categoriaTalla=document.getElementById(idProducto+"_categoria_talla")
                    let paisTalla=document.getElementById(idProducto+"_pais_talla")
                    categoriaTalla.value=datosProducto.size_group
                    paisTalla.value=datosProducto.paisTalla
                    let tallasRespaldo=[...datosProductosForm[pais][idProducto].tallas]
                    document.getElementById(idProducto+"_color").value=datosProducto["color_code.primary"]
                    consultarTallasPorPaisYCategoriaTalla(categoriaTalla);
                    datosProductosForm[pais][idProducto].tallas=tallasRespaldo
                    document.getElementById(idProducto+"_supplier_color").value=datosProducto.supplier_color
                    // let selectTallas=document.getElementById(idProducto+"_talla")
                    // console.log("select =>>>>> ",selectTallas)
                    // recurcibaMostrarTallas(idProducto,datosProducto)

                    

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
                    // ==============
                    let setelctTargetGenders=document.getElementById(idProducto+"_target_genders")
                    seleccionarValoresSelectMultiples(setelctTargetGenders,datosProducto.target_genders)
                    // ==============
                    let setelctfutter=document.getElementById(idProducto+"_futter")
                    seleccionarValoresSelectMultiples(setelctfutter,datosProducto.futter)
                    // ==============
                    let setelctUpperMaterial=document.getElementById(idProducto+"_upper_material")
                    seleccionarValoresSelectMultiples(setelctUpperMaterial,datosProducto.upper_material)
                    // ==============
                    let setelctSoleMaterial=document.getElementById(idProducto+"_sole_material")
                    seleccionarValoresSelectMultiples(setelctSoleMaterial,datosProducto.sole_material)
                    // ==============
                    let setelctSecksohle=document.getElementById(idProducto+"_decksohle")
                    seleccionarValoresSelectMultiples(setelctSecksohle,datosProducto.decksohle)

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
               
                
            }
           
        }
        // let datosProductosPais=JSON.parse(JSON.stringify(datosProductosForm[pais]))
    }
}

function duplicarDatos(){
    // primero tener el paises que tiene el numero mayor de productos
    let totalProductosPaises={}
    for(let pais in listaDePaises){
        totalProductosPaises[pais]=0
        for(let idProducto in datosProductosForm[pais]){
            totalProductosPaises[pais]+=1
        }
    }
    console.log("total de productos por pais =>>>>>>>>> ",totalProductosPaises)
    let paisConMayorProductos=obtenerIdPaisConMayorProductos(totalProductosPaises)
    if(datosProductosForm[paisConMayorProductos.id]){
        let copiarDatosPaises=JSON.parse(JSON.stringify(datosProductosForm[paisConMayorProductos.id]))
        console.log("copias de datos =>>>> ",copiarDatosPaises)
        for(let idProductoCopia in copiarDatosPaises){
            let id=idProductoCopia.split("_")[1]
            for(let pais in listaDePaises){
                if(datosProductosForm[pais]){
                    let idPaisMasProducto=pais+"_"+id
                    if(!datosProductosForm[pais][idPaisMasProducto]){
                        datosProductosForm[pais][idPaisMasProducto]=JSON.parse(JSON.stringify(copiarDatosPaises[idProductoCopia]))
                    }
                }
                else{
                    datosProductosForm[pais]={}
                    let idPaisMasProducto=pais+"_"+id
                    if(!datosProductosForm[pais][idPaisMasProducto]){
                        datosProductosForm[pais][idPaisMasProducto]=JSON.parse(JSON.stringify(copiarDatosPaises[idProductoCopia]))
                    }
                }
            }
        }

    }
    console.log("copia final =>>>>> ",datosProductosForm)

}

function obtenerIdPaisConMayorProductos(totalProductosPaises){
    let paisMayor={id:"",total:0}
    let mayor=-1
    for(let pais in totalProductosPaises){
        if(totalProductosPaises[pais]>mayor){
            paisMayor={id:pais,total:totalProductosPaises[pais]}
            mayor=totalProductosPaises[pais]
        }
    }
    console.log("pais mayor =>>>> ",paisMayor)
    return paisMayor
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
// function cargarStockTalla(e){
//     let idPais=e.getAttribute("data-id-pais")
//     let idProducto=e.getAttribute("data-id-producto")
//     let tallaCliente=e.value.split("-")[1]
//     if(datosProductosForm[idPais][idProducto].datosTallas[tallaCliente]){
//         document.getElementById(idProducto+"_stock").value=datosProductosForm[idPais][idProducto].datosTallas[tallaCliente].stock
//     }
//     else{
//         document.getElementById(idProducto+"_stock").value=""
//     }
// }

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
                            <label ><span class="campo-obligatorio">(*)</span> Categoria</label>\
                            <select id="'+codigoIdPaisIdproducto+'_categoria" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="outline" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-categoria">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> Categoria talla</label>\
                            <select id="'+codigoIdPaisIdproducto+'_categoria_talla" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="size_group" onBlur="consultarTallasPorPaisYCategoriaTalla(this)" class="form-control margin-0 campo-categoria-talla">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> Talla Pais</label>\
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
                            <label ><span class="campo-obligatorio">(*)</span> color</label>\
                            <select data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="color_code.primary" id="'+codigoIdPaisIdproducto+'_color" onBlur="consultarTallasPorPaisYCategoriaTalla(this)" class="form-control margin-0 campo-color-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label for=""><span class="campo-obligatorio">(*)</span> supplier color</label>\
                            <input id="'+codigoIdPaisIdproducto+'_supplier_color" type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="supplier_color" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> Siglas Moneda</label>\
                            <select id="'+codigoIdPaisIdproducto+'_moneda" class="form-control margin-0" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="moneda" onBlur="insertarDatosDeEnvioDeProduct(this)">\
                                <option value="null">Seccionar moneda</option>\
                                <option value="EUR">EUR</option>\
                                <option value="PLN">PLN</option>\
                                <option value="SEK">SEK</option>\
                                <option value="CZK">CZK</option>\
                                <option value="GBP">GBP</option>\
                                <option value="CHF">CHF</option>\
                                <option value="RON">RON</option>\
                                <option value="DKK">DKK</option>\
                                <option value="HUF">HUF</option>\
                                <option value="NOK">NOK</option>\
                                <option value="HRK">HRK</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label><span class="campo-obligatorio">(*)</span> Precio Regular</label>\
                            <input id="'+codigoIdPaisIdproducto+'_precio_regular" type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'"value="'+producto.precioRegular+'" data-campo="precioRegular" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                            <span>Los decimales del precio se indican mediante el "."</span>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Precio Descuento</label>\
                            <input id="'+codigoIdPaisIdproducto+'_precio_promocion" type="text" class="form-control " data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="precioPromocional" placeholder="" onKeyup="insertarDatosDeEnvioDeProduct(this)">\
                            <span>Los decimales del precio se indican mediante el "."</span>\
                        </div>\
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
                            <label ><span class="campo-obligatorio">(*)</span> target age groups</label>\
                            <select id="'+codigoIdPaisIdproducto+'_target_age_groups" multiple data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="target_age_groups" onBlur="insertarDatosDeEnvioDeProduct(this)" class="class-select m-0 form-control margin-0 campo-target-age-groups">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> target genders</label>\
                            <select id="'+codigoIdPaisIdproducto+'_target_genders" multiple data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="target_genders" onBlur="insertarDatosDeEnvioDeProduct(this)" class="class-select m-0 form-control margin-0 campo-target-genders">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> brand</label>\
                            <select id="'+codigoIdPaisIdproducto+'_brand" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="brand_code" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-brand-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> season code</label>\
                            <select id="'+codigoIdPaisIdproducto+'_season" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="season_code" onBlur="insertarDatosDeEnvioDeProduct(this)" class="form-control margin-0 campo-season-code">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> futter</label>\
                            <select multiple id="'+codigoIdPaisIdproducto+'_futter" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="futter" onBlur="insertarDatosDeEnvioDeProduct(this)" class="class-select form-control margin-0 campo-futter">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> upper material</label>\
                            <select multiple id="'+codigoIdPaisIdproducto+'_upper_material" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="upper_material" onBlur="insertarDatosDeEnvioDeProduct(this)" class="class-select form-control margin-0 campo-upper-material">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> sole material</label>\
                            <select multiple id="'+codigoIdPaisIdproducto+'_sole_material" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="sole_material" onBlur="insertarDatosDeEnvioDeProduct(this)" class="class-select form-control margin-0 campo-sole-material">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> decksohle</label>\
                            <select multiple id="'+codigoIdPaisIdproducto+'_decksohle" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="decksohle" onBlur="insertarDatosDeEnvioDeProduct(this)" class="class-select form-control margin-0 campo-decksohle">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label ><span class="campo-obligatorio">(*)</span> Tallas</label>\
                                <select multiple id="'+codigoIdPaisIdproducto+'_talla" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" data-campo="tallas" id="'+codigoIdPaisIdproducto+'_talla" class="class-select form-control margin-0 campo-talla" onBlur="insertarDatosDeEnvioDeProduct(this)">\
                            </select>\
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
                <div class="row" style="padding-bottom:30px;">\
                    <button data-id-pais="'+idPais+'" data-id-producto="'+codigoIdPaisIdproducto+'" class="btn btn-primary" data-toggle="modal" data-target="#staticBackdrop" onClick="insertarFotosModal(this)">Seleccionar Fotos</button>\
                </div>\
            </div>\
        </div>\
        '
    }
    listaDeProductosForm.innerHTML=html
}

function capturarImagenGaleria(a){
    let idPais=a.getAttribute("data-id-pais")
    let idProducto=a.getAttribute("data-id-producto")
    if(!datosProductosForm[idPais]){
        datosProductosForm[idPais]={}
    }
    if(!datosProductosForm[idPais][idProducto]){
        datosProductosForm[idPais][idProducto]=datosResPaldoProductos[idPais][idProducto]
    }
    let checkImagen=document.getElementById("check-"+a.value)
    if(a.checked===true){
        checkImagen.style.display="block"
    }
    else{
        checkImagen.style.display="none"
    }
    let checkboxImagesGaleria=document.querySelectorAll(".checkebox-imagen-galeria:checked")
    let listaIdImagenes=[]
    for(let checkbox of checkboxImagesGaleria){
        listaIdImagenes.push(checkbox.value)
    }
    console.log("imagenes selecionadas =>>>> ",listaIdImagenes)
    datosProductosForm[idPais][idProducto].listIdImagenesGaleria=listaIdImagenes
}

// insertar elementos html a los select de los formulario de prodcuto
function insertarFotosModal(a){
    let idPais=a.getAttribute("data-id-pais")
    let idProducto=a.getAttribute("data-id-producto")
    let galeriaFotosProductos=document.getElementById("galeriaFotosProductos")
    galeriaFotosProductos.innerHTML=""
    let listaImagenes=""
    for(let imagen of imagenesProductos){
        listaImagenes+="\
        <div class='col-auto' style='position: relative;'>\
            <svg  id='check-"+imagen.id_imagen+"' style='display:none;position: absolute;top:15px;right:15px;color: grey;width: 20px;height: 20px;' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-check-circle-fill' viewBox='0 0 16 16'>\
                <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z'/>\
            </svg>\
            <label for='"+imagen.id_imagen+"-imagen' style='margin:0;'>\
                <img id='"+imagen.id_imagen+"' src='"+imagen.url_imagen+"' style='display:block;height: 240px;width: 200px;margin-bottom: 25px;'/>\
            </label>\
            <input type='checkbox' value='"+imagen.id_imagen+"' data-id-pais='"+idPais+"' data-id-producto='"+idProducto+"' id='"+imagen.id_imagen+"-imagen'  class='checkebox-imagen-galeria' onClick='capturarImagenGaleria(this)' hidden>\
        </div>\
        "
    }
    galeriaFotosProductos.innerHTML=listaImagenes
    if(datosProductosForm[idPais][idProducto].listIdImagenesGaleria.length>0){
        for(let idImagen of datosProductosForm[idPais][idProducto].listIdImagenesGaleria){
            let checkboxImagenesGaleria=document.querySelectorAll(".checkebox-imagen-galeria")
            for(let checkbox of checkboxImagenesGaleria){
                if(idImagen===checkbox.value){
                    checkbox.checked=true
                    let checkImagen=document.getElementById("check-"+checkbox.value)
                    checkImagen.style.display="block"
                }
            }
        }
    }
}

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

function insertarFutter(){
    let $camposFutters=document.querySelectorAll(".campo-futter")
    for(let $camposFutter of $camposFutters){
        $camposFutter.innerHTML=""
        let html="<option value='null'>Seleccione</option>"
        for(let futter of datos_futter){
            futter=JSON.parse(futter)
            let option='<option value="'+futter.label+'">'+futter.value.localized.es+'</option>'
            html+=option
        }
        $camposFutter.innerHTML=html
    }
}

function insertarUpperMaterial(){
    let $camposUpperMaterials=document.querySelectorAll(".campo-upper-material")
    for(let $camposUpperMaterial of $camposUpperMaterials){
        $camposUpperMaterial.innerHTML=""
        let html="<option value='null'>Seleccione</option>"
        for(let upper_material of datos_upper_material){
            upper_material=JSON.parse(upper_material)
            let option='<option value="'+upper_material.label+'">'+upper_material.value.localized.es+'</option>'
            html+=option
        }
        $camposUpperMaterial.innerHTML=html
    }
}

function insertarSoleMaterial(){
    let $camposSoleMaterials=document.querySelectorAll(".campo-sole-material")
    for(let $camposSoleMaterial of $camposSoleMaterials){
        $camposSoleMaterial.innerHTML=""
        let html="<option value='null'>Seleccione</option>"
        for(let sole_material of datos_sole_material){
            sole_material=JSON.parse(sole_material)
            let option='<option value="'+sole_material.label+'">'+sole_material.value.localized.es+'</option>'
            html+=option
        }
        $camposSoleMaterial.innerHTML=html
    }
}

function insertarDecksohle(){
    let $camposDecksohles=document.querySelectorAll(".campo-decksohle")
    for(let $camposDecksohle of $camposDecksohles){
        $camposDecksohle.innerHTML=""
        let html="<option value='null'>Seleccione</option>"
        for(let decksohle of datos_decksohle){
            decksohle=JSON.parse(decksohle)
            let option='<option value="'+decksohle.label+'">'+decksohle.value.localized.es+'</option>'
            html+=option
        }
        $camposDecksohle.innerHTML=html
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
    // let isoCode=pais.getAttribute("data-iso-code")
    // alert(isoCode)
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorColor, 
        data: {
            ajax: true,
            action: 'getconsultartodoporpais',
            isoCode:"es"
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
                insertarFutter()
                insertarUpperMaterial()
                insertarSoleMaterial()
                insertarDecksohle()
                duplicarDatos()
                if(document.querySelector(".redio-paises-form:checked")){
                    let radiosPaisesForm=document.querySelector(".redio-paises-form:checked");
                    cargarDatosGuardados(radiosPaisesForm.value)
                }

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
    let color=document.getElementById(idProducto+"_color")
    let idPais=a.getAttribute("data-id-pais")
    if(grupo.value!=="null" && isoCode.value!=="null" && color.value!=="null"){
        datosProductosForm[idPais][idProducto].tallas=[]
        // alert("funciona")
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
                let tallas=capturasDeTallasProducto(color.value,respuestaJson.datos,idPais,idProducto)
                insertarTallaCodeSelect(idProducto,tallas.listaTallas)
                if(datosProductosForm[idPais][idProducto].tallas.length>0){
                    let select=document.getElementById(idProducto+"_talla")
                    for(let talla of datosProductosForm[idPais][idProducto].tallas){
                        for(let option of select){
                            if(option.value===talla){
                                option.selected=true
                            }
                        }
                    }
                }
                // insertarTallaCodeSelect(idProducto,respuestaJson.datos)
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
        <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 modal-footer alignitem-tb p-10 global-input fila-producto-eliminar'>\
        <div class='col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11  text-left'><div><h4 class='text-primary'>"+productos[codigoIdPaisIdproducto].nombreProducto+"</h4></div></div>\
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><button style='border: unset;' class='btn btn-danger' data-id-pais='"+idPais+"' data-id-producto='"+codigoIdPaisIdproducto+"'   onClick='cambiarEstadoDeEnvioDeProductoBorrarProducto(this)'>\
            <svg data-id-pais='"+idPais+"' data-id-producto='"+codigoIdPaisIdproducto+"' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash-fill' viewBox='0 0 16 16'>\
                <path data-id-pais='"+idPais+"' data-id-producto='"+codigoIdPaisIdproducto+"' d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z'/>\
            </svg>\
        </button></div></div>\
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
    // alert(categoria)
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    if(categoria!=="null"){
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
    
} 

function capturasDeTallasProducto(colorCliente,misTallas,idPais,idProducto){

    colorCliente=colorCliente.split("-")[1]
    let combinaciones=[]
    let listaTallas=[]
    let datosAtributos=JSON.parse(JSON.stringify(datosProductosForm[idPais][idProducto].atributos_producto));
    combinaciones=datosAtributos.filter(color => color.id_attribute===colorCliente)
    for(let contador=0;contador<combinaciones.length;contador++){
        for(let atributo3 of datosAtributos){
            if(combinaciones[contador].ean13===atributo3.ean13 && combinaciones[contador].id_attribute!==atributo3.id_attribute){
                combinaciones[contador]["id_atributo_talla"]=atributo3.id_attribute
            }
        }
    }
    console.log("busqueda de combinaciones =>>>>> ",combinaciones)
    for(let combinacion of combinaciones){
        let tallaSelect=misTallas.filter(talla => talla.id_attribute===combinacion.id_atributo_talla)
        if(tallaSelect.length>0){
            listaTallas.push(tallaSelect[0])
        }
    }
    if(combinaciones.length>0){
        datosProductosForm[idPais][idProducto].combinaciones=combinaciones

    }
    console.log("tallas a mostrar =>>>> ",listaTallas)
    return {
        listaTallas,
        combinaciones
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
    let id=parseInt(moment().format("x"))
    for(let pais in datosProductosForm){
        for(let producto in datosProductosForm[pais]){
            // haEnviar
            if(datosProductosForm[pais][producto].haEnviar===false){
                
                let modelo={
                   "producto":{
                        "outline": datosProductosForm[pais][producto].outline,
                        "product_model": {
                            "merchant_product_model_id": "modelo-"+id,
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
                modelo["idPais"]=pais;
                if(datosProductosForm[pais][producto]["how_to_use"]!=="null" && datosProductosForm[pais][producto]["warnings"]!=="null"){
                    modelo.producto.product_model_attributes["how_to_use"]=datosProductosForm[pais][producto]["how_to_use"]
                    modelo.producto.product_model_attributes["warnings"]=datosProductosForm[pais][producto]["warnings"]
                }
                let medias=[]
                for(let imagenes of datosProductosForm[pais][producto].listIdImagenesGaleria){
                    let busquedaImagen=imagenesProductos.filter(magenFilter=> magenFilter.id_imagen===imagenes)
                    if(busquedaImagen.length>0){
                        let media= {
                            "media_path": busquedaImagen[0].url_imagen,
                            "media_sort_key": busquedaImagen[0].id_imagen
                        }
                        medias.push(media)
                    }
                }
                let config={
                    "merchant_product_config_id": "config-"+id,
                    "product_config_attributes": {
                        "media": medias,
                        "description": {},
                        "season_code": "",
                        "supplier_color": datosProductosForm[pais][producto].supplier_color,
                        "color_code.primary": "",
                        "decksohle":datosProductosForm[pais][producto].decksohle,
                        "sole_material":datosProductosForm[pais][producto].sole_material,
                        "upper_material":datosProductosForm[pais][producto].upper_material,
                        "futter":datosProductosForm[pais][producto].futter
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
                for(let idAtributoTalla of datosProductosForm[pais][producto].tallas){
                    // console.log("talla id  =>>>> ",idAtributoTalla)
                    let idTalla=idAtributoTalla.split("-")[1]
                    let tallaZalando=idAtributoTalla.split("-")[0]
                    // console.log("talla =>>>> ",idTalla)
                    // console.log("combinaciones del productos =>>>> ",datosProductosForm[pais][producto].combinaciones)
                    let combinacionTalla=datosProductosForm[pais][producto].combinaciones.filter(combinacion => combinacion.id_atributo_talla===idTalla)
                    // console.log("filter talla =>>>>>>> ",combinacionTalla)
                    let simple= {
                        "merchant_product_simple_id": "simple-"+tallaZalando+"-"+id,
                        "product_simple_attributes": {
                            "ean": combinacionTalla[0].ean13,
                            "size_codes": {
                                "size": tallaZalando
                            }
                        }
                    }
                    modelo.producto.product_model.product_configs[0].product_simples.push(simple)
                    if(datosProductosForm[pais][producto].precioPromocional!=="" && parseFloat(datosProductosForm[pais][producto].precioPromocional)>0){
                        precio.push({
                            "ean": combinacionTalla[0].ean13,
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
                            "ean": combinacionTalla[0].ean13,
                            "sales_channel_id": pais,
                            "regular_price": {
                                "amount": parseFloat(datosProductosForm[pais][producto].precioRegular),
                                "currency": datosProductosForm[pais][producto].moneda
                            }
                        })
                    }
                    // if(parseInt(datosTalla.stock)>0 && datosTalla.stock!==""){
                    //     stock.push(
                    //         {
                    //             "sales_channel_id": pais,
                    //             "ean": datosTalla.ean,
                    //             "quantity": parseInt(datosTalla.stock)
                    //         }
                    //     )
                    // }
                    stock.push(
                        {
                            "sales_channel_id": pais,
                            "ean": combinacionTalla[0].ean13,
                            "quantity": 0
                        }
                    )
                    

                }
                modelo["precio"]={
                    product_prices:precio
                }
                modelo["stock"]={
                    items:stock
                }
                modelo["borrarImagenes"]=imagenSubidaAlServidor
                productosConFormato.push(modelo)
            }
            id+=1
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
