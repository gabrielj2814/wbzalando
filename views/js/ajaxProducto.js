function testAjax(e){
    e.preventDefault();
    let botonFiltro=document.getElementById("botonFiltroProducto");
    let urlAjaxProducto=botonFiltro.getAttribute("data-url-ajax")
    let datosFiltro=new FormData(document.getElementById("formularioFiltros"))
    alert(urlAjaxProducto)
    // alert(datosFiltro.get("categoriaProducto"))
    $.ajax({
        type: 'POST',
        cache: false,
        dataType: 'json',
        url: urlAjaxProducto, 
        data: {
            ajax: true,
            action: 'mensaje'//lowercase with action name
        },
        success: (respuesta) => {
            alert("OK")
            console.log(respuesta)
        },
        error: () => {
            alert("error al conectar con el servidor")
        }
    });
}

botonFiltroProducto.addEventListener("click", testAjax)