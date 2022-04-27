<?php
//  no borrar este controlador este controlador se usa para crear el sub menu
class AdminzalandoController extends ModuleAdminController{

    private $id_idioma;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = true;
        $this->id_idioma = $this->context->language->id;
    }
}

?>