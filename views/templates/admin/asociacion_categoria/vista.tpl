<input type="hidden" id="linkControlador" value="{$linkControlador}"/>
<div id="contenedorAlerta"></div>
<!--
<button id="botonConsultarTodos">consultar todos</button>
<button id="botonConsultar">consultar</button>
<button id="botonActualizar">Actualizar</button>
<button id="botonEliminar">Eliminar</button>
-->

<div class='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xs-12 btn-lg modal-header'> 
    <div class='col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xs-5'>
        <label>Categorias</label>
    </div>
    <div class='col-2 col-sm-3 col-md-3 col-lg-2 col-xl-2 col-xs-5'>
        <label>Categoria Zalando</label>
    </div>
</div>
<form id="formularioCategoria" class="text-primary">

</form>

<div class="estructura-paginador">
    <button id="pagina-ant" onClick="consultarEsquemasYCategorias(this)">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
        </svg>
    </button>
    <div id="lista-paginas"></div>
    <button id="pagina-sig" onClick="consultarEsquemasYCategorias(this)">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
        </svg>
    </button>
</div>

<div class="well-lg col-lg-12 blockquote-reverse col-xs-11">
    <button id="botonRegistrar" class="btn btn-primary" >registrar categoria</button>
</div>

<div class="col-12 fat-pre"  id="preloader">
    <div class="pre-loader">
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>
<script type="text/javascript" src="/modules/wbzalando/views/js/categoria.js"></script>