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
let botonRegistrar=document.getElementById("botonRegistrar");
// let botonConsultarTodos=document.getElementById("botonConsultarTodos");
// let botonConsultar=document.getElementById("botonConsultar");
// let botonActualizar=document.getElementById("botonActualizar");
// let botonEliminar=document.getElementById("botonEliminar");

function registrar(){
    const linkControlador=document.getElementById("linkControlador").value;
    let datosFormulario=$("#formularioCategoria").serializeArray()
    let arrayCatgorias=[]
    let idsCategoriaPresta=[]
    let categoriasZalando=[]
    for(let categoria of datosFormulario){
        if(categoria.name==="array_categoria_zalando[]"){
            categoriasZalando.push(categoria.value);
        }
        if(categoria.name==="array_categoria_prestashop[]"){
            idsCategoriaPresta.push(categoria.value);
        }
    }
    let contador=0;
    while(contador<idsCategoriaPresta.length){
        let jsonFormato={
            "id_categoria_asociacion":"",
            "id_category":"",
            "outline_name":"",
            "outline":""
        }
        jsonFormato.id_category=idsCategoriaPresta[contador]
        jsonFormato.outline_name=categoriasZalando[contador].split("-")[0]
        jsonFormato.outline=categoriasZalando[contador].split("-")[1]
        arrayCatgorias.push(jsonFormato)
        contador++
    }
    // console.log("array final =>>>> ",arrayCatgorias)
    
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'postguardarasociacion',
            asociacion:arrayCatgorias
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
            <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 well-sm'><div class='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xs-5'><h4>"+categoriasPrestashop.name+"</h4></div>\
            <input type='hidden' name='array_categoria_prestashop[]' id='categoria_prestashop_"+categoriasPrestashop.id_category+"' value='"+categoriasPrestashop.id_category+"'/>\
            <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5'><select id='asociacion-n-"+contador+"' name='array_categoria_zalando[]'>"+opciones+"</select></div></div>\
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
botonRegistrar.addEventListener("click",registrar)
// botonConsultarTodos.addEventListener("click",consultarTodos)
// botonConsultar.addEventListener("click",consultar)
// botonActualizar.addEventListener("click",actualizar)
// botonEliminar.addEventListener("click",eliminar)