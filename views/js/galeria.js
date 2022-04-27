let preloader=document.getElementById("preloader")
let bodyPleloader=document.querySelector("body")


function cargarImagenProducto(a){
    //  con esta funcion cargamos todas las imagenes al servidor
    let $inputFile=document.getElementById("files_imagen")
    if($inputFile.files.length>=1){
        let imagensTmp=document.getElementById("imagensTmp")
        imagensTmp.innerHTML=""
        let imagenesTotalesSubidas=document.getElementById("imagenesTotalesSubidas")
        imagenesTotalesSubidas.innerHTML="0"
        let totalDeImagenesHaSubir=document.getElementById("totalDeImagenesHaSubir")
        totalDeImagenesHaSubir.textContent=$inputFile.files.length.toString()
        subirImagen($inputFile.files.length,0)
    }
    else{
        alert("no hay imaganes seleccionadas, como minimo tiene que seleccionar 1 imagen")
    }

}

function subirImagen(totalImagenes,indice){
    // esta funcion es concurente, se llama asi misma y por cada llamada se sube una imagen y no para hasta que todas las imagenes se haya subido al servidor 
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
                    <input class='imagenes-subidas' value='"+respuestaJson.urlFull+"' type='hidden' id='nombre_tmp_"+indice+"' name='nombre_tmp' data-nombre-tmp='"+respuestaJson.NombreImagenTmp+"' data-extencion='"+file.type+"'/>\
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
}

function guardarImagen(){
    // en esta funcion ya guardamos todas las imagenes subida
    const linkControlador=document.getElementById("linkControlador").value;
    let $inputFile=document.getElementById("files_imagen")
    if($inputFile.files.length>=1){
        let imagenesSubidas=document.querySelectorAll(".imagenes-subidas")
        if(imagenesSubidas.length>0){
            preloader.style.opacity="1"
            bodyPleloader.style.overflow="hidden"
            let listaJsonImagenes=[]
            for(let datosImagen of imagenesSubidas){
                let jsonImagen={
                    nombre_tmp:datosImagen.getAttribute("data-nombre-tmp"),
                    url:datosImagen.value,
                    extencion:datosImagen.getAttribute("data-extencion")
                }
                listaJsonImagenes.push(JSON.stringify(jsonImagen))
            }
            console.log("json iomagenes enviar =>>>>> ",listaJsonImagenes)
            $.ajax({
                type: 'POST',
                cache: false,
                dataType: 'json',
                url: linkControlador, 
                data: {
                    ajax: true,
                    action: 'postguardarimagen',
                    listaJsonImagenes
                },
                success: (respuesta) => {
                    let responseJson=respuesta.respuestaServidor
                    console.log("datos =>>>>>> ",responseJson)
                    let imagenesTotalesSubidas=document.getElementById("imagenesTotalesSubidas")
                    imagenesTotalesSubidas.innerHTML="0"
                    let totalDeImagenesHaSubir=document.getElementById("totalDeImagenesHaSubir")
                    totalDeImagenesHaSubir.textContent="0"
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
        else{
            alert("no hay imaganes cargas en el servidor, como minimo tiene que cargar 1 imagen")
        }
    }
    else{
        alert("no hay imaganes seleccionadas, como minimo tiene que seleccionar 1 imagen")
    }
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
        <div class='col-auto' style='margin-bottom: 30px;margin-left: 10px;margin-right: 10px;'>\
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