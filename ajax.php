<?php
include(dirname(__FILE__).'/../../config/config.inc.php');
include(dirname(__FILE__).'/../../init.php');


$module_name = 'wbzalando';

$token = pSQL(Tools::encrypt($module_name.'/ajax.php'));
$token_url = pSQL(Tools::getValue('token'));

if ($token != $token_url || !Module::isInstalled($module_name)) {
    die('Error al ejecutar el ajax');
}

$module = Module::getInstanceByName($module_name);
if ($module->active) {
	// $search = pSQL(Tools::getValue('search'));
    // if ($search != '') {
    //     echo json_encode($module->searchProducts($search));
    // }
    // $pais=new PaisController();
    // print($pais->mensaje());
    print(json_encode($module->autenticarSesionZalando()));
}

?>