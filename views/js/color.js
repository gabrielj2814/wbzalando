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
let coloresAsociados=[]
// botones
let botonRegistrar=document.getElementById("botonRegistrar");
let botonConsultarTodos=document.getElementById("botonConsultarTodos");
let botonConsultar=document.getElementById("botonConsultar");
let botonActualizar=document.getElementById("botonActualizar");
let botonEliminar=document.getElementById("botonEliminar");
let botonConsultarTallas=document.getElementById("botonConsultarTallas");

let paises=[];
let colores=[];

let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")
function registrar(){
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
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
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-success","Color asociado")
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
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
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
            let datos=JSON.parse(JSON.stringify(respuesta))
            let colores=datos["respuestaServidor"]
            cargarAtributosPrestashop(colores);
            // consultarPaises();
            consultarTodoLosColoresAsociados()
            // preloader.style.opacity="0"
            // bodyPleloader.style.overflow="auto"
            
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            mostrarAlerta("alert-danger","conexion deficiente intente otra vez")
        }
    });
}

function consultarTodoLosColoresAsociados(){
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
            let datos=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
            console.log("datos =>>> ",datos)
            coloresAsociados=datos.datos
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
}

function cargarAtributosPrestashop(datos){
    let campoAtributo=document.getElementById("campoAtributo")
    let option="<option value='null' >Seleccione</option>";
    for(let atributo of datos){
        option+="<option value='"+atributo.id_attribute_group+"' >"+atributo.name+"</option>";
    }
    campoAtributo.innerHTML=option
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
        preloader.style.opacity="1"
        bodyPleloader.style.overflow="hidden"
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
            success: (respuesta) => {
                let respuestaJson=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
                let colores=respuestaJson.datos
                console.log("colores prestashop filtrados =>>> ",colores)
                consultarColoresZalando(colores,campoPais.value);
                if(respuestaJson.totalRegistros>2){
                    insertarControlesPaginacion();
                    let paginaAnt=document.getElementById("pagina-ant")
                    let paginaSig=document.getElementById("pagina-sig")
                    paginaSig.style.display="block"
                    paginaAnt.style.display="block"
                    if(parseInt(pagina)===respuestaJson.totalDePagina){
                        paginaSig.setAttribute("data-numero-pagina",respuestaJson.totalDePagina)
                        paginaSig.style.display="none"
                    }
                    else if(parseInt(pagina)<respuestaJson.totalDePagina){
                        paginaSig.setAttribute("data-numero-pagina",(parseInt(pagina)+1))
                    }
                    if(parseInt(pagina)===1){
                        paginaAnt.setAttribute("data-numero-pagina",1)
                        paginaAnt.style.display="none"
                    }
                    else if(parseInt(pagina)<=respuestaJson.totalDePagina){
                        paginaAnt.setAttribute("data-numero-pagina",(parseInt(pagina)-1))
                    }
                    insertarBotonesPaginasPaginacion(pagina,respuestaJson.totalDePagina)
                }
            },
            error: () => {
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
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
        <div class='estructura-paginador'>\
        <button id='pagina-ant' onClick='consultarColorPrestashop(this)'>\
            <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' class='bi bi-arrow-left-circle-fill' viewBox='0 0 16 16'>\
            <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z'/>\
            </svg>\
        </button>\
        <div id='lista-paginas'></div>\
        <button id='pagina-sig' onClick='consultarColorPrestashop(this)'>\
        <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' class='bi bi-arrow-right-circle-fill' viewBox='0 0 16 16'>\
        <path d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z'/>\
        </svg>\
        </button></div>"
    controlesPaginacion.innerHTML=html;
}

function insertarBotonesPaginasPaginacion(pagina,totalDePagina){
    let minimoPagina=5
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
            boton+="<button onClick='consultarColorPrestashop(this)' style='color: #1900e7 !important; text-decoration: underline;' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
            if((totalDePagina-1)===pagina){
                agregarUltimaPagina=true
            }
            if(pagina>2){
                agregarPrimeraPagina=true
            }
            else{
                if(document.getElementById("primera-pagina")){
                    let primeraPagina=document.getElementById("primera-pagina")
                    primeraPagina.remove()
                }
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
        htmlBotonesPaginacion+="<button onClick='consultarColorPrestashop(this)' id='ultima-pagina' class='ultima-pagina' data-numero-pagina='"+totalDePagina+"'>"+totalDePagina+"</button>";
    }
    if(agregarPrimeraPagina){
        listaPaginas.insertAdjacentHTML("afterBegin","<button onClick='consultarColorPrestashop(this)' id='primera-pagina' class='primera-pagina' data-numero-pagina='"+1+"'>"+1+"</button>")
    }
    listaPaginas.innerHTML+=htmlBotonesPaginacion;
}

function crearElementosFormulario(colores,coloresZalando,pais){
    coloresZalandoDatos={}
    let formularioColor=document.getElementById("formularioColor");
    let html="";
    let contador=0;
    for(let color of colores){
        let opciones="";
        for(let codigoColorZalando in coloresZalando){
            let buscarCombinacion=coloresAsociados.filter(combinacion => codigoColorZalando===combinacion.codigo_color && color.id_attribute===combinacion.id_attribute)
            console.log("selected =>>> ",buscarCombinacion)
            coloresZalandoDatos[codigoColorZalando]=coloresZalando[codigoColorZalando]
            if(buscarCombinacion.length>0){
                opciones+="<option value='"+codigoColorZalando+"' selected>"+coloresZalando[codigoColorZalando]+"</option>"
            }
            else{
                opciones+="<option value='"+codigoColorZalando+"'>"+coloresZalando[codigoColorZalando]+"</option>"
            }

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

function consultarColoresZalando(coloresPrestashop,pais){
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    const linkControlador=document.getElementById("linkControlador").value;
    let colorZalando=[]
    $.ajax({
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
            bodyPleloader.style.overflow="auto"
            let datos=JSON.parse(JSON.stringify(respuesta));
            let colores=datos["respuestaServidor"];
            // console.log("colores filtrados =>>> ",datos)
            // consultarColorPrestashop()
            crearElementosFormulario(coloresPrestashop,colores,pais)
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
        }
    });
    return colorZalando;
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

consultarAtributosPrestashop()


botonRegistrar.addEventListener("click",registrar)
// botonConsultarTodos.addEventListener("click",consultarTodos)
// botonConsultar.addEventListener("click",consultar)
// botonActualizar.addEventListener("click",actualizar)
// botonEliminar.addEventListener("click",eliminar)
