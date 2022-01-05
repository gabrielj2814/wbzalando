let $botonVerificarToken=document.getElementById("botonVerificarToken")

function verificarToken(e){
    e.preventDefault();
    // alert(url_ajax)
    // alert(datoFormulario.get("rutaZolando"))
    $.ajax({
        url: url_ajax,
        type  :"GET",
        success: (respuesta) => {
            alert("OK")
            console.log(respuesta)
        },
        error: () => {
            alert("error al conectar con el servidor")
        }
    });
}



$botonVerificarToken.addEventListener("click",verificarToken)

