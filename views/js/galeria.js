let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")


function cargarImagenProducto(a){
    // a.preventDefault()
    // imagenCliente
    let imagensTmp=document.getElementById("imagensTmp")
    let $inputFile=document.getElementById("files_imagen")
    let imagen=document.getElementById("imagen")
    imagensTmp.innerHTML=""
    console.log("input file =>>>> ",$inputFile.files)
    if($inputFile.files.length>0){
        preloader.style.opacity="1"
        bodyPleloader.style.overflow="hidden"
        let contador=0
        for(let file of $inputFile.files){
            // console.log("archvio imagen =>>>> ",file)
            let datosImagen=file
            let extencion=null;
            if(datosImagen.type==="image/jpeg"){
                extencion="jpeg"
            }
            if(datosImagen.type==="image/jpg"){
                extencion="jpg"
            }
            const linkControlador=document.getElementById("linkControlador").value;
            let formularioImagen=document.getElementById("formulario_imagen")
            // let formtoFormularioImagen=new FormData(formularioImagen)
            let formtoFormularioImagen=new FormData()
            console.log("=========")
            formtoFormularioImagen.set("ajax",true)
            formtoFormularioImagen.set("action","postsubirimagen")
            formtoFormularioImagen.set("NombreImagenTmp",moment().format("x")+contador)
            formtoFormularioImagen.set("extencion",extencion)
            formtoFormularioImagen.set("imagenProducto",file)
            console.log(file)
            $.ajax({
                url:linkControlador,
                type: 'post',
                data: formtoFormularioImagen,
                // data: {
                //     ajax:true,
                //     action:"postsubirimagen",
                //     NombreImagenTmp:moment().format("x")+contador,
                //     extencion:extencion,
                //     imagenProducto:file
                // },
                contentType: false,
                processData: false,
                success: function(respuesta) {
                    console.log(respuesta)
                    let respuestaJson=JSON.parse(respuesta).respuestaServidor
                    
                    if(respuestaJson.estado===true){
                        let inptuHiddenHtml="\
                        <input type='hidden' id='nombre_tmp' name='nombre_tmp' data-nombre-tmp='"+respuestaJson.NombreImagenTmp+"' data-extencion='"+adatosImagen.type+"'/>\
                        "
                        imagensTmp.innerHTML=inptuHiddenHtml
                    }
                    // if(respuestaJson.estado===true){
                    
                    //     if(datosImagen.type==="image/jpeg" || datosImagen.type==="image/jpg"){
                    //         let objctURL=URL.createObjectURL(datosImagen)
                    //         console.log("URL IMAGEN =>>>> ",objctURL)
                    //         let nombre_tmp=document.getElementById("nombre_tmp")
                    //         nombre_tmp.value=respuestaJson.urlFull
                    //         nombre_tmp.setAttribute("data-nombre-tmp",respuestaJson.NombreImagenTmp)
                    //         nombre_tmp.setAttribute("data-extencion",datosImagen.type)
                    //         imagen.src=objctURL
                    //         imagen.style.display="block"
                    //     }
                    //     else{
                    //         alert("extención de imagen invalido")
                    //     }
                    // }
                    // else{
                    //     alert("error al subir la imagen")
                    // }
                    preloader.style.opacity="0"
                    bodyPleloader.style.overflow="auto"
                },
                error:() => {
                    alert("error al subir el archivo")
                    // preloader.style.opacity="0"
                    // bodyPleloader.style.overflow="auto"
                }
            });
        contador++
        }
            


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
    let nombre_tmp=document.getElementById("nombre_tmp")
    // alert(nombre_tmp.value)

    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'postguardarimagen',
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