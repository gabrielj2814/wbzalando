// datos test
let datosTest=[
    {
        "id_talla_asociacion":"1",
        "id_attribute":"1",
        codigo_size_group:"1ME2000E0A", 
        "codigo_pais":"fr",
        "talla_zalando":"22.5",
    },
]

let paises=[];
let categoriaTallas=[];
let tallas=[];

// botones
let botonRegistrar=document.getElementById("botonRegistrar");
// let botonConsultarTodos=document.getElementById("botonConsultarTodos");
// let botonConsultar=document.getElementById("botonConsultar");
// let botonActualizar=document.getElementById("botonActualizar");
// let botonEliminar=document.getElementById("botonEliminar");
// let botonConsultarTallas=document.getElementById("botonConsultarTallas");

function registrar(){
    let preloader=document.getElementById("preloader")
    preloader.style.opacity="1"
    const linkControlador=document.getElementById("linkControlador").value;
    let campoCategoriaTallasZalando=document.getElementById("campoCategoriaTallasZalando")
    let campoPais=document.getElementById("campoPais")
    let datosFormulario=$("#formularioTalla").serializeArray()
    let arrayTallas=[]
    let arrayIdsTallasPrestashop=[]
    let arrayTallasZalando=[]
    for(let datosTalla of datosFormulario){
        if(datosTalla.name==="array_talla_zalando[]"){
            arrayTallasZalando.push(datosTalla.value)
        }
        if(datosTalla.name==="array_id_talla_prestashop[]"){
            arrayIdsTallasPrestashop.push(datosTalla.value)
        }
    }
    let contador=0;
    while(contador<arrayIdsTallasPrestashop.length){
        let json={
            "id_talla_asociacion":"",
            "id_attribute":arrayIdsTallasPrestashop[contador],
            "codigo_size_group":campoCategoriaTallasZalando.value, 
            "codigo_pais":campoPais.value,
            "talla_zalando":arrayTallasZalando[contador],
        }
        arrayTallas.push(json)
        contador++
    }
    // console.log("datos finales formulario =>>> ",arrayTallas)
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'postguardarasociacion',
            asociacion:arrayTallas
        },
        success: (respuesta) => {
            preloader.style.opacity="0"
            console.log(respuesta);
            // let datos=JSON.parse(JSON.stringify(respuesta.datos))
            // console.log("productos filtrados =>>> ",datos)
        },
        error: () => {
            preloader.style.opacity="0"
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

function consultarConsultarTallaPorAtributoTalla(){
    const linkControlador=document.getElementById("linkControlador").value;
    let campoAtributoTalla=document.getElementById("campoAtributoTalla")
    let campoCategoriaTallasZalando=document.getElementById("campoCategoriaTallasZalando")
    let campoPais=document.getElementById("campoPais")
    if(campoAtributoTalla.value!=="null" && campoCategoriaTallasZalando.value!=="null" && campoPais.value!=="null"){
        let preloader=document.getElementById("preloader")
        preloader.style.opacity="1"
        $.ajax({
            type: 'GET',
            cache: false,
            dataType: 'json',
            url: linkControlador, 
            data: {
                ajax: true,
                action: 'getconsultartallasprestaporatributoTalla',
                id_attribute:campoAtributoTalla.value
    
            },
            success: async (respuesta) => {
                let json=JSON.parse(JSON.stringify(respuesta))
                console.log("datos atributos =>>>> ",json);
                let tallasZalandoFiltrdas=await traerTallas(campoPais.value,campoCategoriaTallasZalando.value);
                crearElementosFormulario(json.respuestaServidor.datos,campoCategoriaTallasZalando.value,tallasZalandoFiltrdas,campoPais.value)
                preloader.style.opacity="0"
            },
            error: () => {
                preloader.style.opacity="0"
            }
        });
    }
    
}

function crearElementosFormulario(tallasAtributos,codigoDeGrupoTallaZalando,tallasZalandoFiltrdas,pais){
    let formularioTalla=document.getElementById("formularioTalla");
    let html="";
    let contador=0;
    for(let talla of tallasAtributos){
        let opciones="";
        for(let tallaZalando of tallasZalandoFiltrdas){
            opciones+="<option value='"+tallaZalando+"'>"+tallaZalando+"</option>"
        }
        let selectTallaZalando="\
            <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 well-sm'><div class='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xs-5'><h4>"+talla.name+"</h4></div>\
            <input type='hidden' name='array_codigo_de_grupo_talla_zalando[]' id='array_codigo_de_grupo_talla_zalando"+codigoDeGrupoTallaZalando+"' value='"+codigoDeGrupoTallaZalando+"'/>\
            <input type='hidden' name='array_id_talla_prestashop[]' id='array_id_talla_prestashop"+talla.id_attribute+"' value='"+talla.id_attribute+"'/>\
            <input type='hidden' name='array_pais_zalando[]' id='array_pais_zalando"+pais+"' value='"+pais+"'/>\
            <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5'><select id='asociacion-n-"+contador+"' name='array_talla_zalando[]'>"+opciones+"</select></div></div>\
        ";
        html+=selectTallaZalando;
        contador++;
    }
    formularioTalla.innerHTML=html;
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
            id_talla_asociacion:1

        },
        success: (respuesta) => {
            console.log(respuesta);
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
            action: 'geteliminar',
            id_talla_asociacion:2

        },
        success: (respuesta) => {
            console.log(respuesta);
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
        },
        error: () => {
        }
    });
}

function consultarTodosAtributos(){
    let preloader=document.getElementById("preloader")
    preloader.style.opacity="1"
    const linkDeControladorAtributoTalla=document.getElementById("linkDeControladorAtributoTalla").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorAtributoTalla, 
        data: {
            ajax: true,
            action: 'getconsultartodo'
        },
        success: async (respuesta) => {
            let json=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
            cargarAtributosTalla(json.datos)
            console.log("datos attributo talla =>>> ",respuesta);
            let paises=await consultarPaises();
            cargarPaisesZalando(paises)
            let categoriasTallasZalando=await consultarCategoriasTalla();
            cargarCategoriasTallasZalando(categoriasTallasZalando);
            preloader.style.opacity="0"
        },
        error: () => {
            preloader.style.opacity="0"
        }
    });
}

function cargarAtributosTalla(datos){
    let campoAtributoTalla=document.getElementById("campoAtributoTalla")
    let option="<option value='null' >Seleccione</option>";
    for(let talla of datos){
        option+="<option value='"+talla.id_attribute+"' >"+talla.name+"</option>";
    }
    campoAtributoTalla.innerHTML=option
}

async function consultarCategoriasTalla(){
    let preloader=document.getElementById("preloader")
    preloader.style.opacity="1"
    const linkControlador=document.getElementById("linkControlador").value;
    let categoriaTallas=[];
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarcateogriasquetienentallazalando'
        },
        success: async (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta));
            categoriaTallas=datos.respuestaServidor;
            console.log("categorias de tallas filtrados =>>> ",categoriaTallas);
            preloader.style.opacity="0"
        },
        error: () => {
            preloader.style.opacity="0"
        }
    });
    return categoriaTallas
}

function cargarCategoriasTallasZalando(datos){
    let campoCategoriaTallasZalando=document.getElementById("campoCategoriaTallasZalando")
    let option="<option value='null' >Seleccione</option>";
    for(let categoriaTallaZalando of datos){
        option+="<option value='"+categoriaTallaZalando.codigo_size_group+"' >"+categoriaTallaZalando.nombreGrupo+"</option>";
    }
    campoCategoriaTallasZalando.innerHTML=option
}

async function consultarPaises(){
    let preloader=document.getElementById("preloader")
    preloader.style.opacity="1"
    const linkControlador=document.getElementById("linkControlador").value;
    let paises=[];
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarpaiseszalando'
        },
        success: (respuesta) => {
            console.log(respuesta);
            let datos=JSON.parse(JSON.stringify(respuesta))
            paises=datos["respuestaServidor"]["items"]
            preloader.style.opacity="0"
        },
        error: () => {
            preloader.style.opacity="0"
        }
    });
    return paises
}

// function cargarAtributosPrestashop(datos){
//     let campoAtributo=document.getElementById("campoAtributo")
//     let option="<option value='null' >Seleccione</option>";
//     for(let atributo of datos){
//         option+="<option value='"+atributo.id_attribute_group+"' >"+atributo.name+"</option>";
//     }
//     campoAtributo.innerHTML=option
// }

function cargarPaisesZalando(paises){
    let campoPais=document.getElementById("campoPais")
    let option="<option value='null' >Seleccione</option>";
    for(let pais of paises){
        option+="<option value='"+pais.country_code+"' >"+pais.country_name+"</option>";
    }
    campoPais.innerHTML=option
}

async function traerTallas(codigoPais,codigoTalla){
    const linkControlador=document.getElementById("linkControlador").value;
    let tallas=[];
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultartallaszalando',
            codigo_pais:codigoPais,
            codigo_size_group:codigoTalla, 
        },
        success: (respuesta) => {
            // console.log(respuesta);
            let datos=JSON.parse(JSON.stringify(respuesta))
            tallas=datos.respuestaServidor.datos
            console.log("tallas =>>> ",tallas)
        },
        error: () => {
        }
    });
    return tallas;
}

consultarTodosAtributos();
// consultarCategoriasTalla();
botonRegistrar.addEventListener("click",registrar)
// botonConsultarTodos.addEventListener("click",consultarTodos)
// botonConsultar.addEventListener("click",consultar)
// botonActualizar.addEventListener("click",actualizar)
// botonEliminar.addEventListener("click",eliminar)
// botonConsultarTallas.addEventListener("click",traerTallas)
