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
    let preloader=document.getElementById("preloader")
    preloader.style.opacity="1"
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
            preloader.style.opacity="0"
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
    let preloader=document.getElementById("preloader")
    preloader.style.opacity="1"
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
            let datos=JSON.parse(JSON.stringify(respuesta))
            let colores=datos["respuestaServidor"]
            cargarAtributosPrestashop(colores);
            let paises=await consultarPaises();
            cargarPaisesZalando(paises);
            preloader.style.opacity="0"
        },
        error: () => {
            preloader.style.opacity="0"
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

function consultarColorPrestashop(a){
    let pagina=1;
    if(a!=1){
        pagina=(a.getAttribute("data-numero-pagina"))?a.getAttribute("data-numero-pagina"):1
    }
    const linkControlador=document.getElementById("linkControlador").value;
    let campoAtributo=document.getElementById("campoAtributo")
    let campoPais=document.getElementById("campoPais")
    if(campoAtributo.value!=="null" && campoPais.value!=="null"){
        let controlesPaginacion=document.getElementById("controlesPaginacion")
        controlesPaginacion.innerHTML="";
        let preloader=document.getElementById("preloader")
        preloader.style.opacity="1"
        $.ajax({
            type: 'GET',
            cache: false,
            dataType: 'json',
            url: linkControlador, 
            data: {
                ajax: true,
                action: 'getconsultarcoloresprestashop',
                id_attribute:campoAtributo.value,
                pagina
            },
            success: async (respuesta) => {
                let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
                let colores=respuestaJson.datos
                console.log("colores prestashop filtrados =>>> ",colores)
                let coloresZalando=await consultarColoresZalando(campoPais.value);
                console.log("colors zalando =>>> ",coloresZalando)
                crearElementosFormulario(colores,coloresZalando,campoPais.value)
                if(respuestaJson.totalRegistros>20){
                    insertarControlesPaginacion();
                    let primeraPag=document.getElementById("primera-pag")
                    let ultimaPag=document.getElementById("ultima-pag")
                    primeraPag.setAttribute("data-numero-pagina",((respuestaJson.totalDePagina-respuestaJson.totalDePagina)+1))
                    ultimaPag.setAttribute("data-numero-pagina",respuestaJson.totalDePagina)
                    insertarBotonesPaginasPaginacion(pagina,respuestaJson.totalDePagina)
                }
                preloader.style.opacity="0"
            },
            error: () => {
                preloader.style.opacity="0"
            }
        });
    }
    else{
        let formularioColor=document.getElementById("formularioColor");
        formularioColor.innerHTML=""
    }
}

function insertarControlesPaginacion(){
    let controlesPaginacion=document.getElementById("controlesPaginacion")
    // controlesPaginacion.innerHTML="";
    let html="\
        <button id='primera-pag' onClick='consultarColorPrestashop(this)'>\
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-left-circle-fill' viewBox='0 0 16 16'>\
            <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z'/>\
            </svg>\
        </button>\
        <div id='lista-paginas'></div>\
        <button id='ultima-pag' onClick='consultarColorPrestashop(this)'>\
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-arrow-right-circle-fill' viewBox='0 0 16 16'>\
        <path d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z'/>\
        </svg>\
        </button>"
    controlesPaginacion.innerHTML=html;
}

function insertarBotonesPaginasPaginacion(pagina,totalDePagina){
    let minimoPagina=3
    pagina=parseInt(pagina)
    let listaPaginas=document.getElementById("lista-paginas")
    listaPaginas.innerHTML=""
    let contador=0;
    let htmlBotonesPaginacion="";
    let agregarPrimeraPagina=false
    let agregarUltimaPagina=false
    while(contador<totalDePagina){
        let paginaBoton=(contador+1)
        let boton=""
        if(paginaBoton===pagina){
            boton+="<button onClick='consultarColorPrestashop(this)' style='background-color:red;' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
            if((totalDePagina-1)===pagina){
                agregarUltimaPagina=true
            }
            if(((totalDePagina-totalDePagina)+2)<pagina){
                agregarPrimeraPagina=true
            }
        }
        if(paginaBoton===pagina+1){
            boton+="<button onClick='consultarColorPrestashop(this)' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
        }
        if(paginaBoton===pagina-1 && paginaBoton!==0){
            boton+="<button onClick='consultarColorPrestashop(this)' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
        }
        contador++
    }
    if(totalDePagina>pagina && agregarUltimaPagina===false){
        htmlBotonesPaginacion+="...<button onClick='consultarColorPrestashop(this)' data-numero-pagina='"+totalDePagina+"'>"+totalDePagina+"</button>";
    }
    if(agregarPrimeraPagina){
        listaPaginas.insertAdjacentHTML("beforebegin","<button onClick='consultarColorPrestashop(this)' data-numero-pagina='"+1+"'>"+1+"</button>...")
        // htmlBotonesPaginacion+="";
    }
    listaPaginas.innerHTML=htmlBotonesPaginacion;
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
    let preloader=document.getElementById("preloader")
    preloader.style.opacity="1"
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
            preloader.style.opacity="0"
            // console.log(respuesta);
            // paises=respuesta;
            let datos=JSON.parse(JSON.stringify(respuesta));
            // paises=datos["respuestaServidor"]["items"]
            paises=datos["respuestaServidor"]["items"];
            console.log("paises =>>> ",datos);
        },
        error: () => {
            preloader.style.opacity="0"
        }
    });
    return paises;
}

async function consultarColoresZalando(pais){
    let preloader=document.getElementById("preloader")
    preloader.style.opacity="1"
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
            preloader.style.opacity="0"
            let datos=JSON.parse(JSON.stringify(respuesta));
            colores=datos["respuestaServidor"];
            colorZalando=colores;
            // console.log("colores filtrados =>>> ",datos)
            // consultarColorPrestashop()
        },
        error: () => {
            preloader.style.opacity="0"
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