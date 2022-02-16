<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<!--
<h1>hola vista color</h1>
<button id="botonRegistrar">registrar</button>
<button id="botonConsultarTodos">consultar todos</button>
<button id="botonConsultar">consultar</button>
<button id="botonActualizar">Actualizar</button>
<button id="botonEliminar">Eliminar</button>
-->

<div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 btn-lg'> 
    <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-5'>
        <label>Atributo</label>
    </div>
    <div class='col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xs-5'>
        <label>Pais</label>
    </div>
</div>

<div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 well-sm'>
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5'>
        <select id='campoAtributo' name='campoAtributo' onBlur='consultarColorPrestashop()'></select>
    </div>
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5'>
        <select id='campoPais' name='campoPais' onBlur='consultarColorPrestashop()'></select>
    </div>
</div>

<div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 btn-lg modal-header'> 
    <div class='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xs-5'>
        <label>Color</label>
    </div>
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5'>
        <label>Color Zalando</label>
    </div>
</div>
<form id="formularioColor" class="text-primary">

</form>

<div class="well-lg col-lg-12 blockquote-reverse col-xs-11">
    <button id="botonRegistrar" class="btn btn-primary" >registrar color</button>
</div>

<div class="col-12 fat-pre"  id="preloader">
    <div class="pre-loader">
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>
<script type="text/javascript" src="/modules/wbzalando/views/js/color.js"></script>