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

let coloresZalandoDatos={}
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
    let datosFormulario=$("#formularioColor").serializeArray()
    console.log("datos formulario =>>> ",datosFormulario)
    let arraysColores=[]
    let idsColorPrestashop=[]
    let idsColorZalando=[]
    for(let colores of datosFormulario){
        if(colores.name==="array_id_color_prestashop[]"){
            idsColorPrestashop.push(colores.value);
        }
        if(colores.name==="array_color_zalando[]"){
            idsColorZalando.push(colores.value);
        }
    }
    let campoPais=document.getElementById("campoPais")
    let contador=0
    while(contador<idsColorPrestashop.length){
        let json={
            "id_color_asociacion":"",
            "id_attribute":idsColorPrestashop[contador],
            "codigo_color":idsColorZalando[contador], 
            "codigo_pais":campoPais.value,
            "color_zalando":coloresZalandoDatos[idsColorZalando[contador]],
        }
        arraysColores.push(json)
        contador++
    }
    // console.log("datos formulario =>>>> ",arraysColores)
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'postguardarasociacion',
            asociacion:arraysColores
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
        success: async (respuesta) => {
            // console.log(respuesta);
            // paises=respuesta;
            let datos=JSON.parse(JSON.stringify(respuesta))
            let colores=datos["respuestaServidor"]
            cargarAtributosPrestashop(colores);
            // console.log("colores prestashop filtrados =>>> ",datos)
            let paises=await consultarPaises();
            cargarPaisesZalando(paises);
        },
        error: () => {
        }
    });
}

function cargarAtributosPrestashop(datos){
    let campoAtributo=document.getElementById("campoAtributo")
    let option="<option value='null' >Seleccione</option>";
    for(let atributo of datos){
        option+="<option value='"+atributo.id_attribute_group+"' >"+atributo.name+"</option>";
    }
    campoAtributo.innerHTML=option
}

function cargarPaisesZalando(paises){
    let campoPais=document.getElementById("campoPais")
    let option="<option value='null' >Seleccione</option>";
    for(let pais of paises){
        option+="<option value='"+pais.country_code+"' >"+pais.country_name+"</option>";
    }
    campoPais.innerHTML=option
}

function consultarColorPrestashop(){
    const linkControlador=document.getElementById("linkControlador").value;
    let campoAtributo=document.getElementById("campoAtributo")
    let campoPais=document.getElementById("campoPais")
    if(campoAtributo.value!=="null" && campoPais.value!=="null"){
        $.ajax({
            type: 'GET',
            cache: false,
            dataType: 'json',
            url: linkControlador, 
            data: {
                ajax: true,
                action: 'getconsultarcoloresprestashop',
                id_attribute:campoAtributo.value
            },
            success: async (respuesta) => {
                let datos=JSON.parse(JSON.stringify(respuesta))
                let colores=datos["respuestaServidor"].datos
                console.log("colores prestashop filtrados =>>> ",colores)
                let coloresZalando=await consultarColoresZalando(campoPais.value);
                console.log("colors zalando =>>> ",coloresZalando)
                crearElementosFormulario(colores,coloresZalando,campoPais.value)
            },
            error: () => {
            }
        });
    }
    else{
        let formularioColor=document.getElementById("formularioColor");
        formularioColor.innerHTML=""
    }
}

function crearElementosFormulario(colores,coloresZalando,pais){
    coloresZalandoDatos={}
    let formularioColor=document.getElementById("formularioColor");
    let html="";
    let contador=0;
    for(let color of colores){
        let opciones="";
        for(let codigoColorZalando in coloresZalando){
            coloresZalandoDatos[codigoColorZalando]=coloresZalando[codigoColorZalando]
            opciones+="<option value='"+codigoColorZalando+"'>"+coloresZalando[codigoColorZalando]+"</option>"
        }
        let selectColoreZalando="\
            <div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 well-sm'><div class='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xs-5'><h4>"+color.name+"</h4></div>\
            <input type='hidden' name='array_id_color_prestashop[]' id='array_id_color_prestashop"+color.id_attribute+"' value='"+color.id_attribute+"'/>\
            <input type='hidden' name='array_pais_color_zalando[]' id='array_pais_color_zalando"+pais+"' value='"+pais+"'/>\
            <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5'><select id='asociacion-n-"+contador+"' name='array_color_zalando[]'>"+opciones+"</select></div></div>\
        ";
        html+=selectColoreZalando;
        contador++;
    }
    formularioColor.innerHTML=html;
}

async function consultarPaises(){
    const linkControlador=document.getElementById("linkControlador").value;
    let paises=[]
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
            // console.log(respuesta);
            // paises=respuesta;
            let datos=JSON.parse(JSON.stringify(respuesta));
            // paises=datos["respuestaServidor"]["items"]
            paises=datos["respuestaServidor"]["items"];
            console.log("paises =>>> ",datos);
        },
        error: () => {
        }
    });
    return paises;
}

async function consultarColoresZalando(pais){
    const linkControlador=document.getElementById("linkControlador").value;
    let colorZalando=[]
    await $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarcoloreszalando',
            codigo_pais:pais
        },
        success: (respuesta) => {
            let datos=JSON.parse(JSON.stringify(respuesta));
            colores=datos["respuestaServidor"];
            colorZalando=colores;
            // console.log("colores filtrados =>>> ",datos)
            // consultarColorPrestashop()
        },
        error: () => {
        }
    });
    return colorZalando;
}

consultarAtributosPrestashop()


botonRegistrar.addEventListener("click",registrar)
// botonConsultarTodos.addEventListener("click",consultarTodos)
// botonConsultar.addEventListener("click",consultar)
// botonActualizar.addEventListener("click",actualizar)
// botonEliminar.addEventListener("click",eliminar)