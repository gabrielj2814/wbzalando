<?php

use PrestaShop\PrestaShop\Adapter\Entity\Context;

class ProductoController extends ModuleAdminController{

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = true;
    }

    public function init()
    {
        parent::init();
    }

    public function initContent(){
        parent::initContent();
        // $context=ContextCore::getContext();
        // $this->context->smarty->assign([
        //     'msj' => "holamundo"
        // ]);
        // print(ToolsCore::getValue("nombrePais"));
        $this->setTemplate('producto.tpl');
    }
    

}




?>