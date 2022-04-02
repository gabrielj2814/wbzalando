let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")


function cargarImagenProducto(a){
    // a.preventDefault()
    // imagenCliente
    // let imagensTmp=document.getElementById("imagensTmp")
    let $inputFile=document.getElementById("files_imagen")
    if($inputFile.files.length>0){
        let imagensTmp=document.getElementById("imagensTmp")
        imagensTmp.innerHTML=""
        let imagenesTotalesSubidas=document.getElementById("imagenesTotalesSubidas")
        imagenesTotalesSubidas.innerHTML="0"
        let totalDeImagenesHaSubir=document.getElementById("totalDeImagenesHaSubir")
        totalDeImagenesHaSubir.textContent=$inputFile.files.length.toString()
        subirImagen($inputFile.files.length,0)
    }

}


function subirImagen(totalImagenes,indice){
    if(indice<totalImagenes){
        let $inputFile=document.getElementById("files_imagen")
        let imagensTmp=document.getElementById("imagensTmp")
        console.log("input file recorido concurencia =>>>> ",$inputFile.files[indice])
        let file=$inputFile.files[indice]
        let extencion=null;
        if(file.type==="image/jpeg"){
            extencion="jpeg"
        }
        if(file.type==="image/jpg"){
            extencion="jpg"
        }
        const linkControlador=document.getElementById("linkControlador").value;
        let formtoFormularioImagen=new FormData()
        console.log("=========")
        formtoFormularioImagen.set("ajax",true)
        formtoFormularioImagen.set("action","postsubirimagen")
        formtoFormularioImagen.set("NombreImagenTmp",moment().format("x")+indice)
        formtoFormularioImagen.set("extencion",extencion)
        formtoFormularioImagen.set("imagenProducto",file)
        console.log(file)
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
                    let inptuHiddenHtml="\
                    <input type='hidden' id='nombre_tmp_"+indice+"' name='nombre_tmp' data-nombre-tmp='"+respuestaJson.NombreImagenTmp+"' data-extencion='"+file.type+"'/>\
                    "
                    imagensTmp.innerHTML+=inptuHiddenHtml
                }
                indice+=1
                let imagenesTotalesSubidas=document.getElementById("imagenesTotalesSubidas")
                imagenesTotalesSubidas.innerHTML=indice.toString()
                subirImagen(totalImagenes,indice)
            },
            error:() => {
                alert("error al subir el archivo")
                preloader.style.opacity="0"
                bodyPleloader.style.overflow="auto"
            }
        });
    }
    else{

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