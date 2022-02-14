<?php
include("curlController.php");
include("logger.php");
use Clases\CurlController;

class EliminarController extends ModuleAdminController{

    private $id_idioma;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = true;
        $this->id_idioma = $this->context->language->id;
    }

    public function init()
    {
        parent::init();
    }

    public function initContent(){
        parent::initContent();
        $linkDeControlador=$this->context->link->getAdminLink("Eliminar",true);
        $linkDeControladorProducto=$this->context->link->getAdminLink("Producto",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador,
            "linkDeControladorProducto" => $linkDeControladorProducto
        ];
        $this->context->smarty->assign($variablesSmarty);
        $this->setTemplate('/eliminar_producto/vista.tpl');
    }

    function ajaxProcessGetEliminarProducto($id){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->eliminar($_GET["id"]);
        if($respuestaDB){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "eliminacion cumpletada"
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error al eliminar"
            ];
        }
        print(json_encode($respuesta_servidor));
    }

    function eliminar($id){
        $SQL="DELETE FROM ps_wbzalando_modelo_producto WHERE id_modelo_producto ='".$id."';";
        return Db::getInstance()->execute($SQL);
    }


}