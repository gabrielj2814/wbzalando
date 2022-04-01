let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")

function cargarImagenProducto(a){
    // a.preventDefault()
    // imagenCliente
    let $inputFile=document.getElementById("files_imagen")
    let imagen=document.getElementById("imagen")
    // console.log("input file =>>>> ",$inputFile.files[0])
    if($inputFile.files.length>0){
        preloader.style.opacity="1"
        bodyPleloader.style.overflow="hidden"
        let datosImagen=$inputFile.files[0]
        let extencion=null;
        if(datosImagen.type==="image/jpeg"){
            extencion="jpeg"
        }
        if(datosImagen.type==="image/jpg"){
            extencion="jpg"
        }
        const linkControlador=document.getElementById("linkControlador").value;
        let formularioImagen=document.getElementById("formulario_imagen")
        let formtoFormularioImagen=new FormData(formularioImagen)
        console.log("datos formulario imagen =>>>> ",formtoFormularioImagen.get("imagenProducto"))
        formtoFormularioImagen.set("ajax",true)
        formtoFormularioImagen.set("action","postsubirimagen")
        formtoFormularioImagen.set("NombreImagenTmp",moment().format("x"))
        formtoFormularioImagen.set("extencion",extencion)
        $.ajax({
            url:linkControlador,
            type: 'post',
            data: formtoFormularioImagen,
            contentType: false,
            processData: false,
            success: function(respuesta) {
                console.log(respuesta)
                let respuestaJson=JSON.parse(respuesta).respuestaServidor
                if(respuestaJson.estado===true){

                    if(datosImagen.type==="image/jpeg" || datosImagen.type==="image/jpg"){
                        let objctURL=URL.createObjectURL(datosImagen)
                        console.log("URL IMAGEN =>>>> ",objctURL)
                        let nombre_tmp=document.getElementById("nombre_tmp")
                        nombre_tmp.value=respuestaJson.urlFull
                        nombre_tmp.setAttribute("data-nombre-tmp",respuestaJson.NombreImagenTmp)
                        nombre_tmp.setAttribute("data-extencion",datosImagen.type)
                        imagen.src=objctURL
                        imagen.style.display="block"
                    }
                    else{
                        alert("extención de imagen invalido")
                    }
                }
                else{
                    alert("error al subir la imagen")
                }
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
            },
            error:() => {
                alert("error al subir el archivo")
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
            }
        });
        
        
    }
    else{
        alert("no hay imagen selccionada")
        imagen.style.display="none"
    }

}

function guardarImagen(){
    const linkControlador=document.getElementById("linkControlador").value;
    preloader.style.opacity="1"
    bodyPleloader.style.overflow="hidden"

    let nombre_imagen_db=document.getElementById("nombre_imagen_db")
    let nombre_tmp=document.getElementById("nombre_tmp")
    // alert(nombre_imagen_db.value)
    // alert(nombre_tmp.value)

    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'postguardarimagen',
            nombre_imagen_db:nombre_imagen_db.value,
            nombre_tmp:nombre_tmp.getAttribute("data-nombre-tmp"),
            extencion:nombre_tmp.getAttribute("data-extencion"),
            url:nombre_tmp.value,
        },
        success: (respuesta) => {
            let responseJson=respuesta.respuestaServidor
            console.log("datos =>>>>>> ",responseJson)
            let imagen=document.getElementById("imagen")
            imagen.src=""
            imagen.style.display="none"
            consultarTodo()
            // mostrarAlerta("alert-success","El precio a sido enviado correctamente")
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            // mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
        }
    });
}

function consultarTodo(){
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
            let responseJson=respuesta.respuestaServidor
            console.log("consultar todos =>>>>>> ",responseJson)
            mostrarImagenes(responseJson.datos)
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            // mostrarAlerta("alert-success","El precio a sido enviado correctamente")
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            // mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
        }
    });
}

function mostrarImagenes(imagenes){
    let filaImagenProducto=document.getElementById("filaImagenProducto")
    let listaImagenes=""
    filaImagenProducto.innerHTML=""
    for(let imagen of imagenes){
        listaImagenes+="\
        <div class='col-auto'>\
            <img id='"+imagen.id_imagen+"' src='"+imagen.url_imagen+"' alt='"+imagen.nombre_imagen+"' style='display:block;height: 240px;width: 200px;margin-bottom: 10px;'/>\
            <button class='btn btn-danger btn-block' id='"+imagen.id_imagen+"' onClick='borrarImagen(this)'>Borrar</button>\
        </div>\
        "
    }
    filaImagenProducto.innerHTML=listaImagenes
}

function borrarImagen(a){
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
            action: 'getborrar',
            id: a.id
        },
        success: (respuesta) => {
            let responseJson=respuesta.respuestaServidor
            console.log("consultar todos =>>>>>> ",responseJson)
            consultarTodo()
            // mostrarAlerta("alert-success","El precio a sido enviado correctamente")
        },
        error: () => {
            preloader.style.opacity="0"
            bodyPleloader.style.overflow="auto"
            // mostrarAlerta("alert-danger","conexion deficiente intente ota vez")
        }
    });
}

consultarTodo()