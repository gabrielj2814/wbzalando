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
                // paisesZalando=JSON.parse(JSON.stringify(datos.respuestaServidor))
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
                            etc:"hola"
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
                            // ean: "4038671015234",
                            ean: "4038671015222",
                            size_codes: {
                                size: "XL"
                        }
                      }
                    },
                    {
                        merchant_product_simple_id: "WTC741-XL1",
                        product_simple_attributes: {
                            // ean: "4038671015234",
                            ean: "4038671015111",
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
                        "ean": "4038671015222",
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
                        "ean": "4038671015111",
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
                    }
                  ]
            },
            stock:{
                items: [
                    {
                        "sales_channel_id": "01924c48-49bb-40c2-9c32-ab582e6db6f4",
                        "ean": "4038671015222",
                        "quantity": 25
                    },
                    {
                        "sales_channel_id": "733af55a-4133-4d7c-b5f3-d64d42c135fe",
                        "ean": "4038671015111",
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

function consultarEsquemasDeProductosZalando(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultaresquemasproducto'
        },
        success: (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta))
            let jsonDatosEsquemas=JSON.parse(datos.respuestaServidor)
            console.log("esquemas consultados =>>>>>>",jsonDatosEsquemas);
            let listaEsquemaProducto=[]
            for(let esquemasString of jsonDatosEsquemas){
                let nombre=esquemasString.split("-")[0]
                let label=esquemasString.split("-")[1]
                listaEsquemaProducto.push({nombre,label})
            }
            console.log("datos parsiados =>>>>> ", listaEsquemaProducto);
            consultarEsquemaDeProductoZalando()
        },
        error: () => {
            // alert("error al conectar con el servidor");
        }
    });
    
}

function consultarEsquemaDeProductoZalando(esquema="bag"){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultaresquemaproducto',
            esquema
        },
        success: (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta))
            console.log("esquema seleccionado =>>>> ",datos)
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

function coonsultarCategorias(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultartodocategoriasasociadas'
        },
        success: (respuesta) => {
            console.log(respuesta);
            // let json=JSON.parse(JSON.stringify(respuesta))
            // console.log("modelo esquema =>>> ",JSON.parse(json.respuestaServidor.datos[0].modelo))
        },
        error: () => {
        }
    });
}

function coonsultarTallasProPais(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
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
botonConsultarCategoriasAso.addEventListener("click", coonsultarCategorias)
botonConsultartallasAsociadasMasPais.addEventListener("click", coonsultarTallasProPais)
// ejecuciones de funciones al cargar el archivo
consultarProductos();

