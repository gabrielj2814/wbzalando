
// botones
let botonRegistrar=document.getElementById("botonRegistrar");
let categoriasAsociadas=[]
let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")
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
    if(categoriasZalando.length>0){
        preloader.style.opacity="1"
        bodyPleloader.style.overflow="hidden"
        let contador=0;
        while(contador<idsCategoriaPresta.length){
            let jsonFormato={
                "id_categoria_asociacion":"",
                "id_category":"",
                "outline_name":"",
                "outline":""
            }
            if(categoriasZalando[contador]!=="null"){
                jsonFormato.id_category=idsCategoriaPresta[contador]
                jsonFormato.outline_name=categoriasZalando[contador].split("-")[0]
                jsonFormato.outline=categoriasZalando[contador].split("-")[1]
                arrayCatgorias.push(jsonFormato)
            }
            contador++
        }

        console.log("array final =>>>> ",arrayCatgorias)
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
                mostrarAlerta("alert-success","Asociación completada")
                // preloader.style.opacity="0"
                // bodyPleloader.style.overflow="auto"
                consultarTodos2()
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
}
function consultarTodos(){
    const linkControlador=document.getElementById("linkControlador").value;
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
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
            let json=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
            console.log("datos =>>>>",json)
            categoriasAsociadas=json.datos
            // let datos=JSON.parse(JSON.stringify(respuesta.datos))
            // console.log("productos filtrados =>>> ",datos)
            consultarEsquemasYCategorias()
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

function consultarTodos2(){
    const linkControlador=document.getElementById("linkControlador").value;
    // preloader.style.opacity="1"
    // bodyPleloader.style.overflow="hidden"
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
            let json=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
            console.log("datos =>>>>",json)
            categoriasAsociadas=json.datos
            // let datos=JSON.parse(JSON.stringify(respuesta.datos))
            // console.log("productos filtrados =>>> ",datos)
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

function consultarEsquemasYCategorias(a=1){
    let pagina=1;
    if(a!=1){
        pagina=(a.getAttribute("data-numero-pagina"))?a.getAttribute("data-numero-pagina"):1
    }
    const linkControlador=document.getElementById("linkControlador").value;
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultaresquemasycategorias',
            pagina

        },
        success: (respuesta) => {
            console.log(respuesta);
            let datos=JSON.parse(JSON.stringify(respuesta.respuestaServidor))
            crearElementosFormulario(datos)
            let paginaSig=document.getElementById("pagina-sig")
            let paginaAnt=document.getElementById("pagina-ant")
            if(datos.totalRegistros>20){
                paginaSig.style.display="block"
                paginaAnt.style.display="block"
                if(parseInt(pagina)===datos.totalDePagina){
                    paginaSig.setAttribute("data-numero-pagina",datos.totalDePagina)
                    paginaSig.style.display="none"
                }
                else if(parseInt(pagina)<datos.totalDePagina){
                    paginaSig.setAttribute("data-numero-pagina",(parseInt(pagina)+1))
                }
                if(parseInt(pagina)===1){
                    paginaAnt.setAttribute("data-numero-pagina",1)
                    paginaAnt.style.display="none"
                }
                else if(parseInt(pagina)<=datos.totalDePagina){
                    paginaAnt.setAttribute("data-numero-pagina",(parseInt(pagina)-1))
                }
                insertarBotonesPaginasPaginacion(pagina,datos.totalDePagina)
            }
            else{
                paginaSig.style.display="none"
                paginaAnt.style.display="none"
            }
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

function insertarBotonesPaginasPaginacion(pagina,totalDePagina){
    let minimoPagina=20
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
            boton+="<button onClick='consultarEsquemasYCategorias(this)' style='color: #1900e7 !important; text-decoration: underline;' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
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
            boton+="<button onClick='consultarEsquemasYCategorias(this)' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
        }
        if(paginaBoton===pagina-1 && paginaBoton!==0){
            boton+="<button onClick='consultarEsquemasYCategorias(this)' data-numero-pagina='"+paginaBoton+"'>"+paginaBoton+"</button>"
            htmlBotonesPaginacion+=boton;
        }
        contador++
    }
    if(totalDePagina>pagina && agregarUltimaPagina===false){
        htmlBotonesPaginacion+="<button onClick='consultarEsquemasYCategorias(this)' id='ultima-pagina' class='ultima-pagina' data-numero-pagina='"+totalDePagina+"'>"+totalDePagina+"</button>";
    }
    if(agregarPrimeraPagina){
        listaPaginas.insertAdjacentHTML("afterBegin","<button onClick='consultarEsquemasYCategorias(this)' id='primera-pagina' class='primera-pagina' data-numero-pagina='"+1+"'>"+1+"</button>")
    }
    listaPaginas.innerHTML+=htmlBotonesPaginacion;
}
 
function crearElementosFormulario(datos){
    let formularioCategoria=document.getElementById("formularioCategoria");
    let html="";
    let contador=0;
    for(let categoriasPrestashop of datos.categorias){
        let opciones="<option value='null'>seleccione</option>";
        for(let categoriaZalando of datos.esquemas){
            let label=categoriaZalando.split("-")[1];
            let name=categoriaZalando.split("-")[0];
            let busquedaCombinacion=categoriasAsociadas.find(combinacion => combinacion.id_category===categoriasPrestashop.id_category && combinacion.outline===label)
            if(busquedaCombinacion){
                opciones+="<option value='"+categoriaZalando+"' selected>"+name+"</option>"
            }
            else{
                opciones+="<option value='"+categoriaZalando+"'>"+name+"</option>"
            }
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
// consultarEsquemasYCategorias();
consultarTodos()
botonRegistrar.addEventListener("click",registrar)