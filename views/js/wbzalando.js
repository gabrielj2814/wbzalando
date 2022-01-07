let $botonVerificarToken=document.getElementById("botonVerificarToken")

function verificarToken(e){
    e.preventDefault();
    // alert(url_ajax)
    // alert(datoFormulario.get("rutaZolando"))git
    $.ajax({
        url: url_ajax,
        type  :"GET",
        success: (respuesta) => {
            alert("OK")
            let json=JSON.parse(respuesta)
            console.log(json)
        },
        error: () => {
            alert("error al conectar con el servidor")
        }
    });
}



$botonVerificarToken.addEventListener("click",verificarToken)

