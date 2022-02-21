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

//  let span1 = document.querySelector('.documento-input-1')
//  let span2 = document.querySelector('.documento-input-2')

//     span1.innerHTML = '<label><input type="radio" name="rutaZolando" id="active_on" value="https://api-sandbox.merchants.zalando.com" checked="checked">Sandbox</label> <span class="checkmark"></span>'
//     span2.innerHTML = '<label><input type="radio" name="rutaZolando" id="active_off" value="https://api.merchants.zalando.com">Live</label> <span class="checkmark"></span>'

//     let span12 = document.querySelector('.documento-input-1').children[1]
//     console.log(span12)

// div.innerHTML = 'DOM - <span>hahahsda<span>'


// let btnPrev = document.querySelector('.slick-prev').className += " btn btn-primary";     
// let btnNext = document.querySelector('.slick-next').className += " btn btn-primary";