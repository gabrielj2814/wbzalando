console.log("print('hola en mundo en python pero es realmente en javascript XD')")


function consultarPedidosZalando(){
    const linkControlador=document.getElementById("linkControlador").value;
    $.ajax({
        type: 'GET',
        cache: false,
        dataType: 'json',
        url: linkControlador, 
        data: {
            ajax: true,
            action: 'getconsultarpedidoszalando'
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

consultarPedidosZalando()