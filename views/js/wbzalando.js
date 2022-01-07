let $botonVerificarToken=document.getElementById("botonVerificarToken")

function verificarToken(){
    $.ajax({
        url: url_ajax,
        type  :"GET",
        success: (respuesta) => {
            let json=JSON.parse(respuesta)
            console.log(json)
        },
        error: () => {
            alert("error al conectar con el servidor")
        }
    });
}


// verificarToken()
// $botonVerificarToken.addEventListener("click",verificarToken)

