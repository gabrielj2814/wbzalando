// variables globales
let listaProductos=[]
let paisesZalando=[]
let esquemasDeProducto=[];
let datosEsquemaDeProducto={}
// ------ referencia a elementos html
let botonFiltroProducto=document.getElementById("botonFiltroProducto") 
let nombreProducto=document.getElementById("nombreProducto") 
let obtenerProductos=document.getElementById("obtenerProductos") 
let botonSalirVistaSubirProducto=document.getElementById("botonSalirVistaSubirProducto")
let botonTestEnvio=document.getElementById("botonTestEnvio")
let botonConsultarPedidos=document.getElementById("botonConsultarPedidos")
let botonConsultarCategoriasAso=document.getElementById("botonConsultarCategoriasAso")
let botonConsultartallasAsociadasMasPais=document.getElementById("botonConsultartallasAsociadasMasPais")
// functiones
function mostrarModalSubirProductos(){
    let datosFormularioTabla=new FormData(document.getElementById("formTablaProductos"))
    let formularioSubirProducto=document.getElementById("contenedorVistaSubirProductos")
    let vistaInicial=document.querySelector(".vistaInicial")
    formularioSubirProducto.classList.toggle("mostrarVista")
    vistaInicial.classList.toggle("ocultar")
}

function cerrarModalSubirProducto(){
    let datosFormularioTabla=new FormData(document.getElementById("formTablaProductos"))
    let formularioSubirProducto=document.getElementById("contenedorVistaSubirProductos")
    let vistaInicial=document.querySelector(".vistaInicial")
    formularioSubirProducto.classList.toggle("mostrarVista")
    vistaInicial.classList.toggle("ocultar")
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
            let datos=JSON.parse(JSON.stringify(respuesta.datos))
            console.log("productos filtrados =>>> ",datos)
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
            let datos=JSON.parse(JSON.stringify(respuesta.datos))
            console.log("datos producto prestashop =>>> ",datos)
            insertarDatosTablaProducto(datos);
            consultarPaisesZalando();
        },
        error: () => {
        }
    });
}

function insertarDatosTablaProducto(datos){
    let tabla=document.getElementById("tablaProductos");
    tabla.innerHTML="";
    let filasTablas=""
    for(let producto of datos){
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
            let datos=JSON.parse(JSON.stringify(respuesta))
            if(datos.respuestaServidor.items){
                console.log("paises zalando =>>> ",datos)
                // insertarPaisesSelectFormulario(datos.respuestaServidor.items)
                // consultarEsquemasDeProductosZalando();
            }
            if(datos.respuestaServidor.status && datos.respuestaServidor.status==401){
                console.log("respuesta en 401 =>>>>> " ,datos.respuestaServidor)
            }
        },
        error: () => {
            // alert("error al conectar con el servidor");
        }
    });
}

function insertarPaisesSelectFormulario(paises){
    let paisesProducto=document.getElementById("paisesProducto")
    paisesProducto.innerHTML="";
    for(let pais of paises){
        let html="\
        <option value='"+pais.sales_channel_id+"'>"+pais.country_name+"</option>\
        "
        paisesProducto.innerHTML+=html
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
                            // ean: "152369874563",
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
                        // "ean": "152369874563",
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
                        // "ean": "152369874563",
                        "quantity": 25
                    }
                  ]
            }
          }
    ]
    console.log("datos de productos a enviar =>>>> ",productos)
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
            let datos=JSON.parse(JSON.stringify(respuesta))
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
            let datos=JSON.parse(JSON.stringify(respuesta))
            // console.log("pedidos consultados =>>> ",datos)
        },
        error: () => {
        }
    });
}

function consultarCategorias(){
    console.clear()
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
            console.log(respuesta);
            let json=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
            let categoria=json.datos[0]
            let jsonModeloProductoBase=JSON.parse(categoria.modelo);
            let jsonModeloProducto=JSON.parse(JSON.stringify(jsonModeloProductoBase));
            console.log("json de esquema de producto bag 2=>>>>> ",jsonModeloProducto)
            generarFormulario(jsonModeloProducto)
            // console.log("modelo esquema =>>> ",JSON.parse(json.respuestaServidor.datos[0].modelo))
        },
        error: () => {
        }
    });
}

async function generarFormulario(jsonModeloProducto){
    let formulario=[]
    let datosModeloAtributos=await datosCampoFormulario(jsonModeloProducto.product_model.product_model_attributes,"product_model_attributes")
    let datosModeloConfig=await datosCampoFormulario(jsonModeloProducto.product_model.product_configs[0].product_config_attributes,"product_config_attributes-0")
    let datosModeloConfigSimple=await datosCampoFormulario(jsonModeloProducto.product_model.product_configs[0].product_simples[0].product_simple_attributes,"product_simple_attributes-0")
    console.log("datos del modelo =>>>> ",datosModeloAtributos)
    console.log("datos del config =>>>> ",datosModeloConfig)
    console.log("datos del Simple =>>>> ",datosModeloConfigSimple)
    formulario=[...datosModeloAtributos,...datosModeloConfig,...datosModeloConfigSimple]
    console.log("datos formulario =>>>> ",formulario)

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
    let datosCamposFormulario=[]
    for(let propiedadModelo in nivelModelo){
            let datosInput=JSON.parse(JSON.stringify(plantillaDatos))
            // console.log("Inicio for nivel 1")
            let datosPropiedad=await consultarDatosPropiedad(propiedadModelo)
            let tipoDeDatoPropiedadModel=Object.prototype.toString.call(nivelModelo[propiedadModelo]);
            // console.log(propiedadModelo," =>>> ",Object.prototype.toString.call(nivelModelo[propiedadModelo]))
            // console.log("datos items =>>> ",datosPropiedad)
            console.log("=>>>>> ",propiedadModelo)
            datosInput.id=nombreNivel+"-"+propiedadModelo
            datosInput.name=nombreNivel+"-"+propiedadModelo
            datosInput.datos=datosPropiedad
            datosInput.label=propiedadModelo.split("_").join(" ")
            if(datosPropiedad!==null){
                if(datosPropiedad.length===0){
                    // [object Object] , [object String]
                    if(tipoDeDatoPropiedadModel==="[object Object]"){
                        datosInput.tipoInput="compuesto"
                        datosInput.padre=true
                        for(let propiedadModeloNivel2 in nivelModelo[propiedadModelo]){
                            let datosInput2=JSON.parse(JSON.stringify(plantillaDatos))
                            // console.log("inicio for nivel 2")
                            let tipoDeDatoPropiedadModel2=Object.prototype.toString.call(nivelModelo[propiedadModelo][propiedadModeloNivel2]);
                            let datosPropiedad2=await consultarDatosPropiedad(propiedadModeloNivel2)
                            datosInput2.id=nombreNivel+"-"+propiedadModelo+"-"+propiedadModeloNivel2
                            datosInput2.name=nombreNivel+"-"+propiedadModelo+"-"+propiedadModeloNivel2
                            datosInput2.datos=datosPropiedad2
                            datosInput2.label=propiedadModeloNivel2.split("_").join(" ")
                            // console.log(propiedadModeloNivel2," =>>> ",Object.prototype.toString.call(nivelModelo[propiedadModelo][propiedadModeloNivel2]))
                            // console.log("datos items =>>> ",datosPropiedad2)
                            // console.log("fin for nivel 2")
                            if(tipoDeDatoPropiedadModel2==="[object String]"){
                                datosInput2.tipoInput="text"
                            }
                            datosInput.camposHijos.push(datosInput2)
                        }
                    }
                    else{
                        datosInput.tipoInput="text"
                    }
                }
                else{
                    datosInput.tipoInput="select"
                    datosInput.padre=false
                }
            }
            else{
                // esto se ejecuta para casos especiales, en el caso de que la propiedad retorne un null en vez de un array vacio
                if(tipoDeDatoPropiedadModel==="[object Object]"){
                    datosInput.tipoInput="compuesto"
                    datosInput.padre=true
                    for(let propiedadModeloNivel2 in nivelModelo[propiedadModelo]){
                        let datosInput2=JSON.parse(JSON.stringify(plantillaDatos))
                        let tipoDeDatoPropiedadModel2=Object.prototype.toString.call(nivelModelo[propiedadModelo][propiedadModeloNivel2]);
                        let datosPropiedad2=await consultarDatosPropiedad(propiedadModeloNivel2)
                        datosInput2.id=nombreNivel+"-"+propiedadModelo+"-"+propiedadModeloNivel2
                        datosInput2.name=nombreNivel+"-"+propiedadModelo+"-"+propiedadModeloNivel2
                        datosInput2.datos=datosPropiedad2
                        datosInput2.label=propiedadModeloNivel2.split("_").join(" ")
                        if(tipoDeDatoPropiedadModel2==="[object String]"){
                            datosInput2.tipoInput="text"
                        }
                        datosInput.camposHijos.push(datosInput2)
                    }
                }
                else{
                    datosInput.tipoInput="text"
                }
            }
            datosCamposFormulario.push(datosInput);
        
    }
    return datosCamposFormulario;
}

async function consultarDatosPropiedad(propiedad){
    let datosPropiedad=null
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
            let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
            if(respuestaJson.estado===200){
                datosPropiedad=respuestaJson.datos
            }
        },
        error: () => {
        }
    });
    return datosPropiedad;
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

// asignadoles eventos a los elementos html
botonFiltroProducto.addEventListener("click", filtrarProductos)
nombreProducto.addEventListener("keyup", filtrarProductos)
obtenerProductos.addEventListener("click", mostrarModalSubirProductos)
botonSalirVistaSubirProducto.addEventListener("click", cerrarModalSubirProducto)
botonTestEnvio.addEventListener("click", enviarProductos)
botonConsultarPedidos.addEventListener("click", coonsultarPedidos)
botonConsultarCategoriasAso.addEventListener("click", consultarCategorias)
botonConsultartallasAsociadasMasPais.addEventListener("click", coonsultarTallasProPais)
// ejecuciones de funciones al cargar el archivo
consultarProductos();

