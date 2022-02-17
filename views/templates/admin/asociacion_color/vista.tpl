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
        <select id='campoAtributo' name='campoAtributo'></select>
    </div>
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5'>
        <select id='campoPais' name='campoPais'></select>
    </div>
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5'>
        <button class="btn btn-primary" onClick="consultarColorPrestashop()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-funnel-fill" viewBox="0 0 16 16">
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
            </svg>
            Filtrar
        </button>
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