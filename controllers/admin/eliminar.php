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
        $respuesta_servidor=["respuestaServidor" => []];
        $eliminarPrecioDB=$this->eliminarPrecio($_GET["ean"],$_GET["idPais"]);
        $eliminarStockDB=$this->eliminarStock($_GET["ean"],$_GET["idPais"]);
        $consultarExistenciaProductoDB=$this->consultarPrecioPorEan($_GET["ean"]);
        if(count($consultarExistenciaProductoDB)===0){
            $respustaEliminarConfig=$this->eliminarConfig($_GET["idConfig"]);
            $respuestaExistenciaConfigModelo=$this->consultarConfigPorModelo($_GET["idModelo"]);
            if(count($respuestaExistenciaConfigModelo)===0){
                $this->eliminarModelo($_GET["idModelo"]);
            }
            $respuesta_servidor["respuestaServidor"]=[
                "datos" => $consultarExistenciaProductoDB,
                "eliminarPrecioDB" => $eliminarPrecioDB,
                "eliminarStockDB" => $eliminarStockDB,
                "respustaEliminarConfig" => $respustaEliminarConfig
            ];
        }
        // $respuestaDB=$this->eliminar($_GET["id"]);
        // if($respuestaDB){
        //     $respuesta_servidor["respuestaServidor"]=[
        //         "mensaje" => "eliminacion cumpletada"
        //     ];
        // }
        // else{
        //     $respuesta_servidor["respuestaServidor"]=[
        //         "mensaje" => "error al eliminar"
        //     ];
        // }
        print(json_encode($respuesta_servidor));
    }

    // function eliminar($id){
    //     $SQL="DELETE FROM ps_wbzalando_modelo_producto WHERE id_modelo_producto ='".$id."';";
    //     return Db::getInstance()->execute($SQL);
    // }
    function eliminarPrecio($ean,$idPais){
        $SQL="DELETE FROM ps_wbzalando_precio WHERE ean='".$ean."' AND sales_channel_id ='".$idPais."';";
        return Db::getInstance()->execute($SQL);
    }
    
    function eliminarStock($ean,$idPais){
        $SQL="DELETE FROM ps_wbzalando_stock WHERE ean='".$ean."' AND sales_channel_id ='".$idPais."';";
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
        $minimoRegistros=2;
        $pagina=$_GET["pagina"];
        $respuestaDB=$this->consultarPrecio($_GET["codigoPais"]);
        $respuestaPaginadaDB=$this->paginarPrecio($pagina,$minimoRegistros,$_GET["codigoPais"]);
        for($contador=0;$contador<count($respuestaPaginadaDB);$contador++){
            $ean=$respuestaPaginadaDB[$contador]["ean"];
            $respuestaPaginadaDB[$contador]["datosStock"]=$this->consultarStock($ean,$_GET["codigoPais"]);
            $respuestaPaginadaDB[$contador]["detallesDelProdcuto"]=$this->consultarProductos($ean);
        }
        if(count($respuestaDB)>0){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consulta completada",
                "datos" => $respuestaPaginadaDB,
                "totalDePagina" => ceil(count($respuestaDB)/$minimoRegistros),
                "totalRegistros" => count($respuestaDB),
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
        $SQL="SELECT * FROM ps_wbzalando_precio WHERE sales_channel_id='".$pais."' ;";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    function paginarPrecio($pagina,$minimoRegistros,$pais){
        $empezarPor=($pagina-1) * $minimoRegistros;
        $SQL="SELECT * FROM ps_wbzalando_precio WHERE sales_channel_id='".$pais."' LIMIT ".$empezarPor.",".$minimoRegistros.";";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    function consultarStock($ean,$pais){
        $SQL="SELECT * FROM ps_wbzalando_stock WHERE sales_channel_id='".$pais."' AND ean='".$ean."' ;";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    function consultarPrecioPorEan($ean){
        $SQL="SELECT * FROM ps_wbzalando_precio WHERE ean='".$ean."';";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    function consultarConfigPorModelo($idModelo){
        $SQL="SELECT * FROM ps_wbzalando_configuracion_producto WHERE id_modelo_producto='".$idModelo."';";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    function eliminarConfig($idConfig){
        $SQL="DELETE FROM ps_wbzalando_configuracion_producto WHERE id_configuracion_producto='".$idConfig."';";
        return Db::getInstance()->execute($SQL);
    }
    
    function eliminarModelo($idModelo){
        $SQL="DELETE FROM ps_wbzalando_modelo_producto WHERE id_modelo_producto='".$idModelo."';";
        return Db::getInstance()->execute($SQL);
    }

    public function ajaxProcessPostModificarProductos(){
        $respuesta_servidor=["respuestaServidor" => [
            "precios" => $_POST["precios"], "stock" => $_POST["stocks"]
        ],"estatuRespuestaApi" => 0];
        print(json_encode($respuesta_servidor));
    }


}