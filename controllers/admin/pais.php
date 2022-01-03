<?php

use PrestaShop\PrestaShop\Adapter\Module\Module;

class PaisController extends ModuleAdminController{

    public function init(){
        parent::init();
    }

    public function initContent(){
        parent::initContent();
        $this->setTemplate('pais.tpl');
    }

}




?>