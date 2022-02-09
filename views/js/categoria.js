// datos test
let datosTest=[
    {
        "id_categoria_asociacion":"",
        "id_category":"3",
        "outline_name":"Bag",
        "outline":"bag"
    },
    {
        "id_categoria_asociacion":"",
        "id_category":"2",
        "outline_name":"other accessoires",
        "outline":"other_accessoires"
    }
]
// botones
// let botonRegistrar=document.getElementById("botonRegistrar");
// let botonConsultarTodos=document.getElementById("botonConsultarTodos");
// let botonConsultar=document.getElementById("botonConsultar");
// let botonActualizar=document.getElementById("botonActualizar");
// let botonEliminar=document.getElementById("botonEliminar");

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
            id_categoria_asociacion:1

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

function consultarEsquemasYCategorias(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultaresquemasycategorias',

        },
        success: (respuesta) => {
            console.log(respuesta);
            let datos=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
            crearElementosFormulario(datos)
            // console.log("productos filtrados =>>> ",datos)
        },
        error: () => {
        }
    });
}


function crearElementosFormulario(datos){
    let formularioCategoria=document.getElementById("formularioCategoria");
    let html="";
    let contador=0;
    for(let categoriasPrestashop of datos.categorias){
        let opciones="";
        for(let categoriaZalando of datos.esquemas){
            let label=categoriaZalando.split("-")[1];
            let name=categoriaZalando.split("-")[0];
            opciones+="<option value='"+categoriaZalando+"'>"+name+"</option>"
        }
        let selectCategoriasZalando="\
            <span>"+categoriasPrestashop.name+"</span>\
            <input type='hidden' name='array_categoria_prestashop[]' id='categoria_prestashop_"+categoriasPrestashop.id_category+"' value='"+categoriasPrestashop.id_category+"'/>\
            <select id='asociacion-n-"+contador+"' name='array_categoria_zalando[]'>"+opciones+"</select>\
        ";
        html+=selectCategoriasZalando;
        contador++;
    }
    formularioCategoria.innerHTML=html;
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
            action: 'postactualizarasociacion',
            asociacion: {
                "id_categoria_asociacion":2,
                "id_category":"1",
                "outline_name":"puta",
                "outline":"bag",
            }

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
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'geteliminar',
            id_categoria_asociacion:2

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
consultarEsquemasYCategorias();
// botonRegistrar.addEventListener("click",registrar)
// botonConsultarTodos.addEventListener("click",consultarTodos)
// botonConsultar.addEventListener("click",consultar)
// botonActualizar.addEventListener("click",actualizar)
// botonEliminar.addEventListener("click",eliminar)