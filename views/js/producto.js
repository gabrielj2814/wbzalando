// variables globales
let listaProductos={};
let productosSeleccionados=[];
// ------ referencia a elementos html
let botonFiltroProducto=document.getElementById("botonFiltroProducto");
let nombreProducto=document.getElementById("nombreProducto");
let obtenerProductos=document.getElementById("obtenerProductos");
let botonSalirVistaSubirProducto=document.getElementById("botonSalirVistaSubirProducto");
let botonTestEnvio=document.getElementById("botonTestEnvio")
// let botonConsultarPedidos=document.getElementById("botonConsultarPedidos")
// let botonConsultarCategoriasAso=document.getElementById("botonConsultarCategoriasAso")
// let botonConsultartallasAsociadasMasPais=document.getElementById("botonConsultartallasAsociadasMasPais")
// functiones
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

function htmlPorducto(producto){
    let html="\
    <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 alignitem-tb p-10'>\
    <div class='col-3 col-sm-3 col-md-3 col-lg-2 col-xl-3 col-xs-5 text-left'><div><h4 class='text-primary'>"+producto.name+"</h4></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5 text-center'><div class='mx'><input class='input-tb' type='text' id='stock'/></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-1 col-xl-2 col-xs-5 text-center'><div><input class='input-tb' type='text' id='precio'/></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5 text-center'><div class='mx'><input class='input-tb' type='text' id='descuento'/></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5 text-center'><div><input type='date' id='fecha-descuento'/></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-1 col-xl-2 col-xs-5 text-center'><div><select >opciones</select></div></div>\
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5 text-center'><div><input class='attributes-color-container m-auto' type='checkbox' id='check1'></div></div></div>\
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

function insertarCategoriasSelect(categorias){
    let capturandoSelectsCategorias=document.querySelectorAll(".form-producto-categoria");
    for(let selectCategoria of capturandoSelectsCategorias){
        selectCategoria.innerHTML="";
        let option="<option value='null'>select a category</option>";
        for(let categoria of categorias){
            option+="<option value='"+categoria.id_categoria_asociacion +"'>"+categoria.name+"</option>";
        }
        selectCategoria.innerHTML=option;
    }
}

function cerrarModalSubirProducto(){
    let formularioSubirProducto=document.getElementById("contenedorVistaSubirProductos");
    let vistaInicial=document.querySelector(".vistaInicial");
    formularioSubirProducto.classList.toggle("mostrarVista");
    vistaInicial.classList.toggle("ocultar");
}

function filtrarProductos(e){
    e.preventDefault();
    const linkControlador=document.getElementById("linkControlador").value;
    let categoriaProducto=document.getElementById("categoriaProducto").value;
    let marcaProducto=document.getElementById("marcaProducto").value;
    let nombreProducto=document.getElementById("nombreProducto").value;
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
            nombreProducto
        },
        success: (respuesta) => {
            // console.log(respuesta);
            let datos=JSON.parse(JSON.stringify(respuesta.datos));
            console.log("productos filtrados =>>> ",datos);
            insertarDatosTablaProducto(datos);
        },
        error: () => {
        }
    });
}



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
            consultarPaisesZalando();
        },
        error: () => {
        }
    });
}

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
            insertarCategoriasSelect(json.datos);
            consultarProductosWBZalando();
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
            consultarCategoraisAsociadas();
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
        let htmlCheckbox="\
            <label>\
                <input type='checkbox'  class='checkbox-paises' value='"+pais.sales_channel_id+"' id='"+pais.sales_channel_id+"' data-nombre-pais='"+pais.country_name+"' data-iso-code='"+pais.country_code+"' onChange='crearFormularioEnvioDeProducto(this)'/>\
                "+pais.country_name+"\
            </label>\
        ";
        contenedorBanderas.innerHTML+=htmlCheckbox;
    }
}

function crearFormularioEnvioDeProducto(checkbox){
    let contenedorFormularioProductosPaises=document.getElementById("contenedorFormularioProductosPaises")
    if(checkbox.checked){
        let formulario="<form id='form-"+checkbox.id+"' data-nombre-pais='"+checkbox.getAttribute("data-nombre-pais")+"'></form>";
        contenedorFormularioProductosPaises.innerHTML+=formulario;
    }
    else{
        let formularioProductosPaises=document.getElementById("form-"+checkbox.id)
        contenedorFormularioProductosPaises.removeChild(formularioProductosPaises)
    }
}

function enviarProductos(){
    // id francia 733af55a-4133-4d7c-b5f3-d64d42c135fe
    // id alemania 01924c48-49bb-40c2-9c32-ab582e6db6f4
    const linkControlador=document.getElementById("linkControlador").value;
    let productos=[
        {
            outline: "bag",
            product_model: {
                merchant_product_model_id: "modelo_producto_1",
                product_model_attributes: {
                    name: "New Fancy Product 2.0",
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
                            ean: "1523698745631",
                            size_codes: {
                                size: "XL"
                        }
                      }
                    },
                    {
                        merchant_product_simple_id: "WTC742-XL",
                        product_simple_attributes: {
                            ean: "1523698745632",
                            size_codes: {
                                size: "XL"
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
                        "ean": "1523698745631",
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
                        "ean": "1523698745632",
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
                    }
                  ]
            },
            stock:{
                items: [
                    {
                        "sales_channel_id": "01924c48-49bb-40c2-9c32-ab582e6db6f4",
                        "ean": "1523698745631",
                        "quantity": 25
                    },
                    {
                        "sales_channel_id": "01924c48-49bb-40c2-9c32-ab582e6db6f4",
                        "ean": "1523698745632",
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
        },
        error: () => {
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

async function consultarProductosWBZalando(propiedad){
    let datosPropiedad=null;
    const linkControlador=document.getElementById("linkControlador").value;
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarproductoswbzalando',
            propiedad
        },
        success: (respuesta) => {
            // console.log(respuesta);
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("datos consultados productos zalando =>>>>> ",respuestaJson)
        },
        error: () => {
        }
    });
    return datosPropiedad;
}

// asignadoles eventos a los elementos html
botonFiltroProducto.addEventListener("click", filtrarProductos);
nombreProducto.addEventListener("keyup", filtrarProductos);
obtenerProductos.addEventListener("click", mostrarModalSubirProductos);
botonSalirVistaSubirProducto.addEventListener("click", cerrarModalSubirProducto);
botonTestEnvio.addEventListener("click", enviarProductos)
// botonConsultarPedidos.addEventListener("click", coonsultarPedidos)
// botonConsultarCategoriasAso.addEventListener("click", consultarCategorias)
// botonConsultartallasAsociadasMasPais.addEventListener("click", coonsultarTallasProPais)
// ejecuciones de funciones al cargar el archivo
consultarProductos();


