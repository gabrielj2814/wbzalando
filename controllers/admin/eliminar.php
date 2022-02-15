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

    public function validarRespuestaBD($respuesta){
        if(is_array($respuesta)){
            return $respuesta;
        }
        return [];
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

    function ajaxProcessGetEliminarProducto(){
        // codigo pais, ean 
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

    public function ajaxProcessGetConsultarPaisesZalando(){
        $respuesta_servidor=["respuestaServidor" => [],"estatuRespuestaApi" => 0];
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $url=$endPoint."/sales-channels";
        $curlController=new CurlController($url);
        $datosGet=[
            "merchant_ids" => $idComerciante
        ];
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $header = array('Authorization: '.'Bearer '. $token);
        $curlController->setDatosPeticion($datosGet);
        $curlController->setdatosCabezera($header);
        $respuesta=$curlController->ejecutarPeticion("get",false);
        $Paises=(Object)$respuesta["response"];
        error_log("respuesta al consultar los paises a zalando =>>>>  " . var_export($respuesta["response"], true));
        $respuesta_servidor["respuestaServidor"]= $respuesta["response"];
        $respuesta_servidor["estatuRespuestaApi"]= $respuesta["estado"];
        print(json_encode($respuesta_servidor));
    }

    public function ajaxProcessGetConsultarProductosPorPais(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->consultarPrecio($_GET["codigoPais"]);
        for($contador=0;$contador<count($respuestaDB);$contador++){
            $ean=$respuestaDB[$contador]["ean"];
            $respuestaDB[$contador]["detallesDelProdcuto"]=$this->consultarProductos($ean);
            $contador++;
        }
        if(count($respuestaDB)>0){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consulta completada",
                "datos" => $respuestaDB
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consulta completada",
                "datos" => []
            ];
        }
        print(json_encode($respuesta_servidor));
    }

    function consultarProductos($ean){
        $SQL="SELECT * FROM 
        ps_wbzalando_modelo_producto,
        ps_wbzalando_configuracion_producto,
        ps_wbzalando_simple_producto 
        WHERE 
        ps_wbzalando_simple_producto.ean='".$ean."' AND
        ps_wbzalando_configuracion_producto.id_configuracion_producto=ps_wbzalando_simple_producto.id_configuracion_producto AND
        ps_wbzalando_modelo_producto.id_modelo_producto =ps_wbzalando_configuracion_producto.id_modelo_producto
        
        ;";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    function consultarPrecio($pais){
        $SQL="SELECT * FROM ps_wbzalando_precio,ps_wbzalando_stock WHERE ps_wbzalando_precio.sales_channel_id='".$pais."' AND ps_wbzalando_stock.sales_channel_id=ps_wbzalando_precio.sales_channel_id;";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    


}