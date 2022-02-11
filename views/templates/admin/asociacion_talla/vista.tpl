<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<input type="hidden" id="linkDeControladorAtributoTalla" value="{$linkDeControladorAtributoTalla}"/>
<!--
<h1>hola vista talla</h1>
<button id="botonRegistrar">registrar</button>
<button id="botonConsultarTodos">consultar todos</button>
<button id="botonConsultar">consultar</button>
<button id="botonActualizar">Actualizar</button>
<button id="botonEliminar">Eliminar</button>
<button id="botonConsultarTallas">consultar Tallas </button>
-->

<div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 btn-lg'> 
    <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-3'>
        <label>Atributo</label>
    </div>
    <div class='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xs-5'>
        <label>Categorias Tallas Zalando</label>
    </div>
    <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-3'>
        <label>Pais</label>
    </div>
</div>

<div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 well-sm'>
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-3'>
        <select id='campoAtributoTalla' name='campoAtributoTalla' onBlur='consultarConsultarTallaPorAtributoTalla()'></select>
    </div>
    <div class='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xs-5'>
        <select id='campoCategoriaTallasZalando' name='campoCategoriaTallasZalando' onBlur='consultarConsultarTallaPorAtributoTalla()'></select>
    </div>
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-3'>
        <select id='campoPais' name='campoPais' onBlur='consultarConsultarTallaPorAtributoTalla()'></select>
    </div>
</div>


<div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 btn-lg modal-header'> 
    <div class='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xs-5'>
        <label>Talla</label>
    </div>
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5'>
        <label>Tallas Zalando</label>
    </div>
</div>
<form id="formularioTalla" class="text-primary">

</form>

<div class="well-lg col-lg-12 blockquote-reverse col-xs-11">
    <button id="botonRegistrar" class="btn btn-primary" >registrar talla</button>
</div>

<script type="text/javascript" src="/modules/wbzalando/views/js/talla.js"></script>