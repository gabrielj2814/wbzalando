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

// let div = document.querySelectorAll('.documento-input')
// let span = document.createElement('span')


// div.innerHTML = 'DOM - <span>hahahsda<span>'


// let btnPrev = document.querySelector('.slick-prev').className += " btn btn-primary";     
// let btnNext = document.querySelector('.slick-next').className += " btn btn-primary";