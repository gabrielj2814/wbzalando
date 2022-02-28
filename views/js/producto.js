// funciones que no se estan usando pero que pueden cer utiles borrar o comentar cuando se termene el desarrollo

async function mostrarModalSubirProductos(){
    let formularioSubirProducto=document.getElementById("contenedorVistaSubirProductos");
    let vistaInicial=document.querySelector(".vistaInicial");
    formularioSubirProducto.classList.toggle("mostrarVista");
    vistaInicial.classList.toggle("ocultar");
    // ---------
    // let formulariosProductos= document.getElementById("formulariosProductos");
    let idsProducto=document.querySelectorAll(".producto_centrar_checkbox_tabla_celda:checked");
    let checkboxsPaises=document.querySelectorAll(".checkbox-paises:checked");
    productosSeleccionados=[];
    for(let idProducto of idsProducto){
        // productosSeleccionados.push(idProducto.value);
        let producto=await consultarProducto(idProducto.value)
        productosSeleccionados.push(producto);
    }
    console.log("lista de productos =>>> ",productosSeleccionados)
    console.log("checkboxs Paises =>>> ",checkboxsPaises)
    for(let paises of checkboxsPaises){
        let formulario=document.getElementById("form-"+paises.value)
        formulario.innerHTML="";
        for(let producto of productosSeleccionados){
            formulario.innerHTML+=htmlPorducto(producto)
        }
    }
    // let htmlGenericoProductoFormulario=htmlGenericoProductosFormulario(productosSeleccionados);
    // let categorias=await consultarCategorias();
    // formulariosProductos.innerHTML=htmlGenericoProductoFormulario;
    // insertarCategoriasSelect(categorias);

}

function cerrarModalSubirProducto(){
    let formularioSubirProducto=document.getElementById("contenedorVistaSubirProductos");
    let vistaInicial=document.querySelector(".vistaInicial");
    formularioSubirProducto.classList.toggle("mostrarVista");
    vistaInicial.classList.toggle("ocultar");
}

function htmlGenericoProductosFormulario(productosSeleccionados){
    let html="";
    for(let producto of productosSeleccionados){
        html+="\
            <div id='contenedor-form-producto-"+producto+"'>\
                <select onBlur='consultarCategoriaModelo(this)' class='form-producto-categoria' id='form-producto-categoria-"+producto+"' data-form-producto='"+producto+"'></select>\
                <form id='form-producto-"+producto+"' class='form-producto-"+producto+"'></form>\
            </div>\
            </br>\
            </br>\
        ";
    }
    return html;
}

function htmlPorducto(producto){
    let html="\
    <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 alignitem-tb p-10 global-input'>\
    <div class='col-3 col-sm-3 col-md-3 col-lg-2 col-xl-3 col-xs-5 text-left'><div><h4 class='text-primary'>"+producto.name+"</h4></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5 text-center'><div class='mx'><input class='input-tb' type='text' id='stock'/></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-1 col-xl-2 col-xs-5 text-center'><div><input class='input-tb' type='text' id='precio'/></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5 text-center'><div class='mx'><input class='input-tb' type='text' id='descuento'/></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5 text-center'><div><input class='input-tb' type='date' id='fecha-descuento'/></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-1 col-xl-2 col-xs-5 text-center'><div><select class='h35'>opciones</select></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5 text-center'><div><input class='w20 m-auto' type='checkbox' id='check1'></div></div></div>\
    ";
    return html;
}

async function consultarProducto(idProducto){
    const linkControlador=document.getElementById("linkControlador").value;
    let datosProducto=[];
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarproducto',
            id_producto:idProducto
        },
        success: (respuesta) => {
            let json=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("producto consultado =>>> ",json);
            datosProducto=json.datos[0]
        },
        error: () => {
        }
    });

    return datosProducto;
}


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
let datos_brand_code={}
let datos_season_code={}
let datos_color_code={}
let datos_target_age_groups={}
let datos_target_genders={}
// ------ referencia a elementos html
let preloader=document.getElementById("preloader")
let $botonFiltroProducto=document.getElementById("botonFiltroProducto");
let $nombreProducto=document.getElementById("nombreProducto");
let botonTestEnvio=document.getElementById("botonTestEnvio")
let $botonIrHaformulario=document.getElementById("botonIrHaformulario")
let $botonIrHaVistaInicial=document.getElementById("botonIrHaVistaInicial")
let $botonIrHaVistaBorrarProductos=document.getElementById("botonIrHaVistaBorrarProductos")
let $botonIrHaVistaFormularioProductos=document.getElementById("botonIrHaVistaFormularioProductos")
// let obtenerProductos=document.getElementById("obtenerProductos");
// let botonSalirVistaSubirProducto=document.getElementById("botonSalirVistaSubirProducto");
// functiones


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
            datosResPaldoProductos[pais.value][pais.value+"_"+producto.id_product]={
                idProductoTienda:producto.id_product,
                nombreProducto:producto.name,
                lenguaje:producto.iso_code,
                descripcion:producto.description.replace("<p>","").replace("</p>",""),
                descripcion_corta:producto.description_short.replace("<p>","").replace("</p>",""),
                urlImagen:producto.urlImagen,
                idUrlImagen:producto.id_product,
                ean:producto.ean13,
                supplier_color:"supplier color",
                "color_code.primary":"",
                target_genders:[1,2],
                target_age_groups:[3,4],
                brand_code:"brand-code",
                moneda:"USD",
                precioRegular:"15",
                precioPromocional:"11",
                fechaInicioPromocion:"2022-02-27",
                fechaFinalPromocion:"2022-02-27",
                stock:"15",
                outline:"bag",
                haEnviar:false
            }
        }
    }
    console.log("productos aginados por pais =>>>> ",datosResPaldoProductos)
    datosProductosForm=JSON.parse(JSON.stringify(datosResPaldoProductos))
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
    insertarProductosVistaEnvio(a.value,productos)
    console.log("cargar porductos por pais seleccionado =>>>> ",productos)
    cargarDatosBrandCode();
}

function insertarProductosVistaEnvio(idPais,productos){
    let listaDeProductosForm=document.getElementById("listaDeProductosForm")
    listaDeProductosForm.innerHTML=""
    let html=""
    for(let codigoIdPaisIdproducto in productos){
        let producto=productos[codigoIdPaisIdproducto]
        html+='\
        <div data-id-producto-form="'+codigoIdPaisIdproducto+'" class="contenedor_producto_backend">\
            <div class="row preview-info-producto">\
                <div class="contenedor-check-envio col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">\
                    <label id="'+codigoIdPaisIdproducto+'_check_true" class="ocultar" for="'+codigoIdPaisIdproducto+'_check_envio">\
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16">\
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>\
                        </svg>\
                    </label>\
                    <label id="'+codigoIdPaisIdproducto+'_check_false" class="" for="'+codigoIdPaisIdproducto+'_check_envio">\
                        <div class="checked-false"></div>\
                    </label>\
                    <input style="display:none;" id="'+codigoIdPaisIdproducto+'_check_envio" data-id-producto="'+codigoIdPaisIdproducto+'" data-id-pais="'+idPais+'" onClick="cambiarEstadoDeEnvioDeProduct(this)" type="checkbox" class="haEnviar"/>\
                </div>\
                <div class="contenedor-nombre-producto col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10">\
                    <img class="imagen-producto" src="'+producto.urlImagen+'" alt=""/>\
                    <h3 class="margin-0">'+producto.nombreProducto+'</h3>\
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
                            <select class="form-control margin-0">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >brand</label>\
                            <select class="form-control margin-0">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >target age groups</label>\
                            <select class="form-control margin-0">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >target genders</label>\
                            <select class="form-control margin-0">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >season code</label>\
                            <select class="form-control margin-0">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >color</label>\
                            <select class="form-control margin-0">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label for="">supplier color</label>\
                            <input type="text" class="form-control " id="" placeholder="">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Stock</label>\
                            <input type="text" class="form-control " id="" placeholder="">\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label >Tallas</label>\
                            <select class="form-control margin-0">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Siglas Moneda</label>\
                            <input type="text" class="form-control " id="" placeholder="">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Precio Regular</label>\
                            <input type="text" class="form-control " id="" placeholder="">\
                        </div>\
                    </div>\
                    <div class="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">\
                        <div class="form-group">\
                            <label>Precio Descuento</label>\
                            <input type="text" class="form-control " id="" placeholder="">\
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
                            <label >upper material clothing</label>\
                            <select class="form-control margin-0">\
                                <option>Default select</option>\
                            </select>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">\
                        <div class="form-group">\
                            <label for="exampleFormControlInput1">warnings</label>\
                            <textarea class="form-control" id="" rows="3"></textarea>\
                        </div>\
                    </div>\
                </div>\
                <div class="row">\
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">\
                        <div class="form-group">\
                            <label for="exampleFormControlInput1">how to use</label>\
                            <textarea class="form-control" id="" rows="3"></textarea>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
        '
    }
    listaDeProductosForm.innerHTML=html
}

function cargarDatosBrandCode(){
    preloader.style.opacity="1"
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
                for(let datos of respuestaJson.datos){
                    option+="<option value='"+datos.codigo_color+"'>"+datos.color_zalando+"</option>"
                }
                edicionGlobalColor.innerHTML=option
            }
            preloader.style.opacity="0"
        },
        error: () => {
            preloader.style.opacity="0"
        }
    });
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
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><div><h4 class='text-center'>"+productos[codigoIdPaisIdproducto].stock+"</h4></div></div>\
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><div><h4 class='text-center'>"+productos[codigoIdPaisIdproducto].moneda+" "+productos[codigoIdPaisIdproducto].precioRegular+"</h4></div></div>\
        <div class='col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1  text-left'><div><h4 class='text-center'>"+productos[codigoIdPaisIdproducto].moneda+" "+productos[codigoIdPaisIdproducto].precioPromocional+"</h4></div></div>\
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
    document.getElementById(idProducto+"_check_true").classList.toggle("ocultar")
    document.getElementById(idProducto+"_check_false").classList.toggle("ocultar")
    // alert(a.checked)
}


































//====================================
//====================================
//====================================

function consultarProductos(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarproductos'
        },
        success: (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta.datos));
            console.log("datos producto prestashop =>>> ",datos);
            insertarDatosTablaProducto(datos);
        },
        error: () => {
        }
    });
}

function cargarProductoProcategoria(){
    const linkControlador=document.getElementById("linkControlador").value;
    let selectCategoriaAsosiadas=document.getElementById("selectCategoriaAsosiadas")
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'consultarporcategoriasasociadas',
            categoriaProducto:selectCategoriaAsosiadas.value
        },
        success: (respuesta) => {
            let productos=JSON.parse(JSON.stringify(respuesta.datos));
            console.log("datos categorias asociadas =>>> ",productos);
            let formulariosProductos= document.getElementById("formulariosProductos");
            formulariosProductos.innerHTML="";
            let htmlproducto="";
            for(let producto of productos){
                htmlproducto+=htmlPorducto(producto);
            }
            formulariosProductos.innerHTML=htmlproducto
        },
        error: () => {
        }
    });
}


function insertarDatosTablaProducto(datos){
    let tabla=document.getElementById("tablaProductos");
    tabla.innerHTML="";
    let filasTablas=""
    listaProductos={};
    for(let producto of datos){
        listaProductos[producto.id_product]=producto;
        let html="\
            <tr >\
                <td class='producto_tabla_td_pdd_tb'><input type='checkbox' class='form-check-input producto_centrar_checkbox_tabla_celda' name='array_productos[]' value='"+producto.id_product+"'/></td>\
                <td class='producto_tabla_td_pdd_tb'>"+producto.id_product+"</td>\
                <td class='producto_tabla_td_pdd_tb'><img style='width: 45px;height: 45px;display: inline-block;margin-right: 15px;' src='"+producto.urlImagen+"'/>"+producto.name+"</td>\
                <td class='producto_tabla_td_pdd_tb'>"+producto.ean13+"</td>\
            </tr>";
        filasTablas+=html;
    }
    if(datos.length===0){
        filasTablas="\
            <tr >\
                <td colspan='4' class='producto_tabla_td_pdd_tb'><center>Sin resultados</center></td>\
            </tr>";
    }
    tabla.innerHTML=filasTablas;
}

function consultarPaisesZalando(){
    const linkControlador=document.getElementById("linkControlador").value;
    preloader.style.opacity="1"
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
            // consultarCategoraisAsociadas();
            let datos=JSON.parse(JSON.stringify(respuesta))
            if(datos.respuestaServidor.items){
                console.log("paises zalando =>>> ",datos)
                crearRadiosPaisTest(datos.respuestaServidor.items);
                crearRadiosPaisTestBorrarProdcuto(datos.respuestaServidor.items)
            }
            if(datos.respuestaServidor.status && datos.respuestaServidor.status==401){
                console.log("respuesta en 401 =>>>>> " ,datos.respuestaServidor);
            }
            preloader.style.opacity="0"
        },
        error: () => {
            preloader.style.opacity="0"
            // alert("error al conectar con el servidor");
        }
    });
}

function crearRadiosPaisTest(paises){
    let contenedorBanderas=document.getElementById("paisesFormularioProducto");
    contenedorBanderas.innerHTML="";
    for(let pais of paises){
        let htmlCheckbox="\
            <label>\
                <input type='radio'  class='redio-paises-form' value='"+pais.sales_channel_id+"' id='"+pais.sales_channel_id+"' name='radio-form-producto' data-nombre-pais='"+pais.country_name+"' data-iso-code='"+pais.country_code+"' onChange='cargarProductosPorPaisSeleccionado(this)'/>\
                "+pais.country_name+"\
            </label>\
        ";
        contenedorBanderas.innerHTML+=htmlCheckbox;
    }
}

function crearRadiosPaisTestBorrarProdcuto(paises){
    // paisesBorrarProducto
    let contenedorBanderas=document.getElementById("paisesBorrarProducto");
    contenedorBanderas.innerHTML="";
    for(let pais of paises){
        let htmlCheckbox="\
            <label>\
                <input type='radio'  class='radio-form-producto-borrar' value='"+pais.sales_channel_id+"' id='"+pais.sales_channel_id+"_paises_borrar' name='radio-form-producto-borrar' data-nombre-pais='"+pais.country_name+"' data-iso-code='"+pais.country_code+"' onChange='cargarProductosHaEliminarPorPais(this)'/>\
                "+pais.country_name+"\
            </label>\
        ";
        contenedorBanderas.innerHTML+=htmlCheckbox;
    }
}
// function crearFormularioEnvioDeProducto(checkbox){
//     let contenedorFormularioProductosPaises=document.getElementById("contenedorFormularioProductosPaises")
//     if(checkbox.checked){
//         let formulario="<form id='form-"+checkbox.id+"' data-nombre-pais='"+checkbox.getAttribute("data-nombre-pais")+"'></form>";
//         contenedorFormularioProductosPaises.innerHTML+=formulario;
//     }
//     else{
//         let formularioProductosPaises=document.getElementById("form-"+checkbox.id)
//         contenedorFormularioProductosPaises.removeChild(formularioProductosPaises)
//     }
// }

function consultarCategoraisAsociadas(){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
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
            // insertarCategoriasSelect(json.datos);
        },
        error: () => {
        }
    });
}

function insertarCategoriasSelect(categorias){
    let selectCategoriaAsosiadas=document.getElementById("selectCategoriaAsosiadas")
    selectCategoriaAsosiadas.innerHTML=""
    let option="<option value='null'>Seleccion una categoria</option>";
    for(let categoria of categorias){
        option+="<option value='"+categoria.id_category+"'>"+categoria.name+"</option>";
    }
    selectCategoriaAsosiadas.innerHTML=option

}



function enviarProductos(){
    // id francia 733af55a-4133-4d7c-b5f3-d64d42c135fe
    // id alemania 01924c48-49bb-40c2-9c32-ab582e6db6f4
    preloader.style.opacity="1"
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
        },
        error: () => {
            preloader.style.opacity="0"
            // alert("error al conectar con el servidor");
        }
    });
}

function coonsultarPedidos(e){
    e.preventDefault();
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarpedidoszalando'
        },
        success: (respuesta) => {
            console.log(respuesta);
            let datos=JSON.parse(JSON.stringify(respuesta));
            // console.log("pedidos consultados =>>> ",datos)
        },
        error: () => {
        }
    });
}

async function consultarCategorias(){
    // console.clear()
    let categorias=[];
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    await $.ajax({
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
            categorias=json.datos;
            // let categoria=json.datos[0]
            // let jsonModeloProductoBase=JSON.parse(categoria.modelo);
            // let jsonModeloProducto=JSON.parse(JSON.stringify(jsonModeloProductoBase));
            // generarFormulario(jsonModeloProducto)
            // console.log("modelo esquema =>>> ",JSON.parse(json.respuestaServidor.datos[0].modelo))
        },
        error: () => {
        }
    });
    return categorias;
}

function coonsultarTallasProPais(){
    const linkDeControladorTalla=document.getElementById("linkDeControladorTalla").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorTalla, 
        data: {
            ajax: true,
            action: 'getconsultartodotallasporpais',
            pais:"fr"
        },
        success: (respuesta) => {
            console.log(respuesta);
        },
        error: () => {
        }
    });
}

async function consultarCategoriaModelo(selectCategoria){
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    let idFormulario=selectCategoria.getAttribute("data-form-producto");
    // alert(selectCategoria.value+" "+selectCategoria.getAttribute("data-form-producto"))
    let formulario=document.getElementById("form-producto-"+idFormulario);
    if(selectCategoria.value!=="null"){
        await $.ajax({
            type: 'GET',
            cache: false,
            dataType: 'json',
            url: linkDeControladorCategoria, 
            data: {
                ajax: true,
                action: 'getconsultar',
                id_categoria_asociacion:selectCategoria.value
            },
            success: async (respuesta) => {
                let datos=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
                if(datos.estado===200){
                    // formulario.textContent=JSON.stringify(datos.datos[0].modelo)
                    jsonModeloProductoBase=JSON.parse(datos.datos[0].modelo);
                    jsonModeloProducto=JSON.parse(JSON.stringify(jsonModeloProductoBase));
                    let datosCamposFormulario=await generarFormulario(jsonModeloProducto);
                    console.log("datos campos formulario =>>>> ",datosCamposFormulario);
                    formulario.innerHTML=agregarCamposAlFormulario(datosCamposFormulario);
                }
            },
            error: () => {
            }
        });
    }
    else{
        formulario.innerHTML="";
    }
}

async function generarFormulario(jsonModeloProducto){
    let datosCampos=[]
    let datosModeloAtributos=await datosCampoFormulario(jsonModeloProducto.product_model.product_model_attributes,"product_model_attributes");
    let datosModeloConfig=await datosCampoFormulario(jsonModeloProducto.product_model.product_configs[0].product_config_attributes,"product_config_attributes-0");
    let datosModeloConfigSimple=await datosCampoFormulario(jsonModeloProducto.product_model.product_configs[0].product_simples[0].product_simple_attributes,"product_simple_attributes-0");
    datosCampos=[...datosModeloAtributos,...datosModeloConfig,...datosModeloConfigSimple];
    return datosCampos;
}

async function datosCampoFormulario(nivelModelo,nombreNivel){
    let plantillaDatos={
        tipoInput:"", // con esto indicamos el tipo de campo de formulario que va hacer
        padre:false, // con esto indicamos si tiene o no tiene valore hijos false => no , true => si
        camposHijos:[], // aqui se almacena los campos hijos si es padre
        datos:[], // aqui se almacena los datos del padre
        name:"",//  nombre del name que tendra el campo del formulario
        id:"",//  nombre del id que tendra el campo del formulario
        label:"",//  nombre del label que tendra el campo del formulario que sera visible en el formulario
    }
    let datosCamposFormulario=[];
    for(let propiedadModelo in nivelModelo){
            let datosInput=JSON.parse(JSON.stringify(plantillaDatos));
            // console.log("Inicio for nivel 1")
            let datosPropiedad=await consultarDatosPropiedad(propiedadModelo);
            let tipoDeDatoPropiedadModel=Object.prototype.toString.call(nivelModelo[propiedadModelo]);
            // console.log(propiedadModelo," =>>> ",Object.prototype.toString.call(nivelModelo[propiedadModelo]))
            // console.log("datos items =>>> ",datosPropiedad)
            // console.log("=>>>>> ",propiedadModelo);
            datosInput.id=nombreNivel+"-"+propiedadModelo;
            datosInput.name=nombreNivel+"-"+propiedadModelo;
            datosInput.datos=datosPropiedad;
            datosInput.label=propiedadModelo.split("_").join(" ").split(".").join(" ");
            if(datosPropiedad.length===0){
                // [object Object] , [object String]
                if(tipoDeDatoPropiedadModel==="[object Object]"){
                    datosInput.tipoInput="compuesto";
                    datosInput.padre=true;
                    for(let propiedadModeloNivel2 in nivelModelo[propiedadModelo]){
                        let datosInput2=JSON.parse(JSON.stringify(plantillaDatos));
                        // console.log("inicio for nivel 2")
                        // let tipoDeDatoPropiedadModel2=Object.prototype.toString.call(nivelModelo[propiedadModelo][propiedadModeloNivel2]);
                        let datosPropiedad2=await consultarDatosPropiedad(propiedadModeloNivel2);
                        datosInput2.id=nombreNivel+"-"+propiedadModelo+"-"+propiedadModeloNivel2;
                        datosInput2.name=nombreNivel+"-"+propiedadModelo+"-"+propiedadModeloNivel2;
                        datosInput2.datos=datosPropiedad2;
                        datosInput2.label=propiedadModeloNivel2.split("_").join(" ").split(".").join(" ");
                        // console.log(propiedadModeloNivel2," =>>> ",Object.prototype.toString.call(nivelModelo[propiedadModelo][propiedadModeloNivel2]))
                        // console.log("datos items =>>> ",datosPropiedad2)
                        // console.log("fin for nivel 2")
                        if(datosPropiedad2.length===0){
                            datosInput2.tipoInput="text";
                        }
                        else{
                            datosInput2.tipoInput="select";
                        }
                        datosInput.camposHijos.push(datosInput2);
                    }
                }
                else{
                    datosInput.tipoInput="text";
                }
            }
            else{
                datosInput.tipoInput="select";
                datosInput.padre=false;
            }
            datosCamposFormulario.push(datosInput);
        
    }
    return datosCamposFormulario;
}

async function consultarDatosPropiedad(propiedad){
    let datosPropiedad=null;
    const linkDeControladorCategoria=document.getElementById("linkDeControladorCategoria").value;
    await $.ajax({
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
            // console.log(respuesta);
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            if(respuestaJson.estado===200){
                datosPropiedad=respuestaJson.datos;
            }
        },
        error: () => {
        }
    });
    return datosPropiedad;
}

function agregarCamposAlFormulario(campos){
    let htmlCampos="";
    for(let campo of campos){
        if(campo.tipoInput==="text"){
            htmlCampos+=campoTexto(campo);
        }
        if(campo.tipoInput==="select"){
            htmlCampos+=campoSelect(campo);
        }
        if(campo.tipoInput==="compuesto"){
            htmlCampos+=campoCompuesto(campo);
        }
    }
    return htmlCampos;

}

function campoTexto(campo){
    let input="<div>\
        <label for='"+campo.id+"'>"+campo.label+"</label>\
        <input type='text' id='"+campo.id+"' name='"+campo.name+"' />\
    </div>";
    return input;
    
}

function campoSelect(campo){
    let input="";
    let option="";
    for(let datosOption of campo.datos){
        datosOption=JSON.parse(datosOption)
        if(datosOption.value){
            if(datosOption.value.localized){
                option+="<option value='"+datosOption.label+"' >"+datosOption.value.localized["en"]+"</option>";
            }
            else{
                option+="<option value='"+datosOption.label+"' >"+datosOption.name.en+"</option>";
            }
        }
        else{
            option+="<option value='"+datosOption.label+"' >"+datosOption.name.en+"</option>";
        }
    }

    if(campo.label!=="color code primary"){
        input="<div>\
        <label for='"+campo.id+"'>"+campo.label+"</label>\
            <select id='"+campo.id+"' name='"+campo.name+"' >"+option+"</select>\
        </div>";
    }
    return input;
} 

function campoCompuesto(campo){
    let input="";
    let htmlCamposHijos="";
    for(let campoHijo of campo.camposHijos){
        if(campoHijo.tipoInput==="text"){
            htmlCamposHijos+=campoTexto(campoHijo);
        }
        if(campoHijo.tipoInput==="select"){
            htmlCamposHijos+=campoSelect(campoHijo);
        }
    }
    if(campo.label!=="size group" && campo.label!=="size codes"){
        input="<div>\
            <label for='"+campo.id+"'>"+campo.label+"</label>\
                    "+htmlCamposHijos+"\
            </div>";
    }
    return input;
}
// 











// asignadoles eventos a los elementos html
$botonFiltroProducto.addEventListener("click", filtrarProductos);
$nombreProducto.addEventListener("keyup", filtrarProductos);
$botonIrHaformulario.addEventListener("click",irHaFormularioDeProductos)
$botonIrHaVistaInicial.addEventListener("click",irHaVistaInicial)
$botonIrHaVistaFormularioProductos.addEventListener("click",irHaVistaFormularioProductos)
$botonIrHaVistaBorrarProductos.addEventListener("click",irHaVistaBorrarProductos)
// obtenerProductos.addEventListener("click", mostrarModalSubirProductos);
// botonSalirVistaSubirProducto.addEventListener("click", cerrarModalSubirProducto);
botonTestEnvio.addEventListener("click",enviarProductos)
// botonConsultarPedidos.addEventListener("click", coonsultarPedidos)
// botonConsultarCategoriasAso.addEventListener("click", consultarCategorias)
// botonConsultartallasAsociadasMasPais.addEventListener("click", coonsultarTallasProPais)
// ejecuciones de funciones al cargar el archivo
// consultarProductos();
consultarPaisesZalando();
