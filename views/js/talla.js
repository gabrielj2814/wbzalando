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
let tallasAsociadas=[]

// botones
let botonRegistrar=document.getElementById("botonRegistrar");
// let botonConsultarTodos=document.getElementById("botonConsultarTodos");
// let botonConsultar=document.getElementById("botonConsultar");
// let botonActualizar=document.getElementById("botonActualizar");
// let botonEliminar=document.getElementById("botonEliminar");
// let botonConsultarTallas=document.getElementById("botonConsultarTallas");
let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")
function registrar(){
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
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
            // preloader.style.opacity="0"
            // bodyPleloader.style.overflow="auto"
            console.log(respuesta);
            mostrarAlerta("alert-success","Tallas registradas")
            consultarTallasAsociadas()
            // let datos=JSON.parse(JSON.stringify(respuesta.datos))
            // console.log("productos filtrados =>>> ",datos)
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
        preloader.style.opacity="1"
        bodyPleloader.style.overflow="hidden"
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
            success: (respuesta) => {
                let json=JSON.parse(JSON.stringify(respuesta))
                console.log("datos atributos =>>>> ",json);
                let tallasPrestashop=json.respuestaServidor.datos
                traerTallas(tallasPrestashop,campoPais.value,campoCategoriaTallasZalando.value);
                // crearElementosFormulario(tallasPrestashop,campoCategoriaTallasZalando.value,tallasZalandoFiltrdas,campoPais.value)
                
            },
            error: () => {
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
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
            let busquedaCombinacion=tallasAsociadas.filter(combinacion => combinacion.id_attribute===talla.id_attribute && combinacion.codigo_pais===pais && combinacion.codigo_size_group===codigoDeGrupoTallaZalando && combinacion.talla_zalando===tallaZalando)
            // console.log("talla encontrada =>>>>> ",busquedaCombinacion)
            if(busquedaCombinacion.length>0){
                opciones+="<option value='"+tallaZalando+"' selected >"+tallaZalando+"</option>"
            }
            else{
                opciones+="<option value='"+tallaZalando+"'>"+tallaZalando+"</option>"
            }
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

async function consultarTodosAtributos(){
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    const linkDeControladorAtributoTalla=document.getElementById("linkDeControladorAtributoTalla").value;
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkDeControladorAtributoTalla, 
        data: {
            ajax: true,
            action: 'getconsultartodo'
        },
        success: (respuesta) => {
            let json=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
            cargarAtributosTalla(json.datos)
            console.log("datos attributo talla =>>> ",respuesta);
            consultarCategoriasTalla();
            // cargarCategoriasTallasZalando(categoriasTallasZalando)
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
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
        success: (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta));
            categoriaTallas=datos.respuestaServidor;
            console.log("categorias de tallas filtrados =>>> ",categoriaTallas);
            cargarCategoriasTallasZalando(categoriaTallas)
            consultarTallasAsociadas();
            // consultarPaises();
            // preloader.style.opacity="0"
            // bodyPleloader.style.overflow="auto"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
        }
    });
    return categoriaTallas
}


async function consultarTallasAsociadas(){
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    const linkControlador=document.getElementById("linkControlador").value;
    let categoriaTallas=[];
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultartodo'
        },
        success: (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta.respuestaServidor));
            console.log("tallas asociadas =>>> ",datos.datos)
            tallasAsociadas=datos.datos
            // consultarPaises();
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
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

function traerTallas(tallasPrestashop,codigoPais,codigoTalla){
    const linkControlador=document.getElementById("linkControlador").value;
    let tallas=[];
    $.ajax({
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
            crearElementosFormulario(tallasPrestashop,campoCategoriaTallasZalando.value,tallas,codigoPais)
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
    return tallas;

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

consultarTodosAtributos();
botonRegistrar.addEventListener("click",registrar)
