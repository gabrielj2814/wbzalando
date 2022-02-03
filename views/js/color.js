let datosTest=[
    {
        "id_color_asociacion":"1",
        "id_attribute":"5",
        "codigo_color":"102", 
        "codigo_pais":"fr",
        "color_zalando":"gris",
    },
    {
        "id_color_asociacion":"2",
        "id_attribute":"5",
        "codigo_color":"102", 
        "codigo_pais":"fr",
        "color_zalando":"gris",
    },
    {
        "id_color_asociacion":"3",
        "id_attribute":"5",
        "codigo_color":"102", 
        "codigo_pais":"fr",
        "color_zalando":"gris",
    },
]
// botones
let botonRegistrar=document.getElementById("botonRegistrar");
let botonConsultarTodos=document.getElementById("botonConsultarTodos");
let botonConsultar=document.getElementById("botonConsultar");
let botonActualizar=document.getElementById("botonActualizar");
let botonEliminar=document.getElementById("botonEliminar");
let botonConsultarTallas=document.getElementById("botonConsultarTallas");

let paises=[];
let colores=[];

function registrar(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'postguardarasociacion',
            asociacion:datosTest
        },
        success: (respuesta) => {
            console.log(respuesta);
            // let datos=JSON.parse(JSON.stringify(respuesta.datos))
            // console.log("productos filtrados =>>> ",datos)
        },
        error: () => {
        }
    });
}
function consultarTodos(){
    const linkControlador=document.getElementById("linkControlador").value;
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
            console.log(respuesta);
            // let datos=JSON.parse(JSON.stringify(respuesta.datos))
            // console.log("productos filtrados =>>> ",datos)
        },
        error: () => {
        }
    });
}

function consultar(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultar',
            id_color_asociacion:1

        },
        success: (respuesta) => {
            console.log(respuesta);
            // let datos=JSON.parse(JSON.stringify(respuesta.datos))
            // console.log("productos filtrados =>>> ",datos)
        },
        error: () => {
        }
    });
}

function actualizar(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'postactualizar',
            asociacion: datosTest

        },
        success: (respuesta) => {
            console.log(respuesta);
            // let datos=JSON.parse(JSON.stringify(respuesta.datos))
            // console.log("productos filtrados =>>> ",datos)
        },
        error: () => {
        }
    });
}

function eliminar(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'posteliminar',
            id_color_asociacion:2

        },
        success: (respuesta) => {
            console.log(respuesta);
            // let datos=JSON.parse(JSON.stringify(respuesta.datos))
            // console.log("productos filtrados =>>> ",datos)
        },
        error: () => {
        }
    });
}

function actualizar(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'postactualizar',
            asociacion: datosTest

        },
        success: (respuesta) => {
            console.log(respuesta);
            // let datos=JSON.parse(JSON.stringify(respuesta.datos))
            // console.log("productos filtrados =>>> ",datos)
        },
        error: () => {
        }
    });
}

function consultarPaises(){
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
            // console.log(respuesta);
            // paises=respuesta;
            let datos=JSON.parse(JSON.stringify(respuesta))
            paises=datos["respuestaServidor"]["items"]
            console.log("paises =>>> ",datos)
            consultarAtributosPrestashop()
        },
        error: () => {
        }
    });
}

function consultarColoresZalando(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarcoloreszalando',
            codigo_pais:paises[2].country_code
        },
        success: (respuesta) => {
            // console.log(respuesta);
            // paises=respuesta;
            let datos=JSON.parse(JSON.stringify(respuesta))
            colores=datos["respuestaServidor"]
            console.log("colores filtrados =>>> ",datos)
            consultarColorPrestashop()
        },
        error: () => {
        }
    });
}

function consultarColorPrestashop(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarcoloresprestashop',
            id_attribute:2
        },
        success: (respuesta) => {
            // console.log(respuesta);
            // paises=respuesta;
            let datos=JSON.parse(JSON.stringify(respuesta))
            colores=datos["respuestaServidor"]
            console.log("colores prestashop filtrados =>>> ",datos)
        },
        error: () => {
        }
    });
}

function consultarAtributosPrestashop(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultaratributosprestashop'
        },
        success: (respuesta) => {
            // console.log(respuesta);
            // paises=respuesta;
            let datos=JSON.parse(JSON.stringify(respuesta))
            colores=datos["respuestaServidor"]
            console.log("colores prestashop filtrados =>>> ",datos)
            consultarColoresZalando()
        },
        error: () => {
        }
    });
}
consultarPaises();

botonRegistrar.addEventListener("click",registrar)
botonConsultarTodos.addEventListener("click",consultarTodos)
botonConsultar.addEventListener("click",consultar)
botonActualizar.addEventListener("click",actualizar)
botonEliminar.addEventListener("click",eliminar)