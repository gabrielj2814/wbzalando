let $botonVerificarToken=document.getElementById("botonVerificarToken")

function verificarToken(e){
    e.preventDefault();
    let rutaZolando=document.getElementById("rutaZolando").value
    let tokenZolando=document.getElementById("tokenZolando").value
    if(document.getElementById("tokenZolando") && document.getElementById("rutaZolando")){
        // alert(rutaZolando+" - "+tokenZolando)
        let rutaCompleta=rutaZolando+"/auth/me"
        // alert(rutaCompleta)
        $.ajax({
            url: rutaCompleta,
            // url: "https://jsonplaceholder.typicode.com/posts",
            type  :"GET",
            headers: { 'Authorization': "Bearer "+tokenZolando },
            success: (respuesta) => {
                alert("OK")
                console.log(respuesta)
            },
            error: () => {
                alert("error al conectar con el servidor")
            }
        });
    }
}



$botonVerificarToken.addEventListener("click",verificarToken)

