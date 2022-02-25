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
        //  $_POST["precios"] $_POST["stocks"]
        $respuesta_servidor=["respuestaServidor" => []];
        $resuestaModificarPrecioProducto=false;
        $resuestaModificarStockProducto=false;
        if(array_key_exists("precios",$_POST)){
            $resuestaModificarPrecioProducto=$this->editarPrecioProducto($_POST["precios"]);
        }
        if(array_key_exists("stocks",$_POST)){
            $resuestaModificarStockProducto=$this->editarStockProducto($_POST["stocks"]);
        }
        $respuesta_servidor["respuestaServidor"]=[
            "precio" => $resuestaModificarPrecioProducto,
            "stock" => $resuestaModificarStockProducto
        ];
        print(json_encode($respuesta_servidor));
    }

    public function editarPrecioProducto($precios){
        $estado=true;
        foreach($precios as $precio){
            $objPrecio=json_decode($precio);
            $SQL="
            UPDATE ps_wbzalando_precio SET
                json_precio='".$precio."'
                WHERE 
                ean='".$objPrecio->ean."' AND 
                sales_channel_id='".$objPrecio->sales_channel_id."';
            ";
            if(!Db::getInstance()->execute($SQL)){
                $estado=false;
                break;
            }
        }
        return $estado;
    }

    public function editarStockProducto($stocks){
        $estado=true;
        foreach($stocks as $stock){
            $objStock=json_decode($stock);
            $SQL="
            UPDATE ps_wbzalando_stock SET
                ean='".$objStock->ean."',
                sales_channel_id='".$objStock->sales_channel_id."',
                quantity=".$objStock->quantity."
                WHERE 
                ean='".$objStock->ean."' AND 
                sales_channel_id='".$objStock->sales_channel_id."';
            ";
            if(!Db::getInstance()->execute($SQL)){
                $estado=false;
                break;
            }
        }
        return $estado;
    }

    public function verificarExistenciaProducto($ean){
        // verificar existencia de producto mediante el ean
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $url=$endPoint."/products/identifiers/".$ean;
        $curlController=new CurlController($url);
        $header = array(
            'Authorization: '.'Bearer '. $token
        );
        $respuesta=null;
        $curlController->setdatosCabezera($header);
        return $curlController->ejecutarPeticion("get",false);
    }

    public function subirStock($stocks){
        $respuestasSubidaStocks=[];
        foreach($stocks as $stock){
            $respuestaExistencia= $this->verificarExistenciaProducto($stock["ean"]);
            if($respuestaExistencia["estado"]===200){
                $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
                $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
                $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
                $url=$endPoint."/merchants/".$idComerciante."/stocks";
                $curlController=new CurlController($url);
                $header = array(
                    'Content-Type: application/json',
                    'Authorization: '.'Bearer '. $token
                );
                $items=["items" => []];
                $items["items"][]=$stock;
                $curlController->setDatosPeticion($items);
                $curlController->setdatosCabezera($header);
                $respuesta=$curlController->ejecutarPeticion("post",true);
                error_log("respuesta de zalando al subir el stock =>>>>  " . var_export($respuesta, true));
                $respuestasSubidaStocks[]=$respuesta;
            }
            else{
                $respuestasSubidaStocks[$stock["ean"]]=false;
            }
        }
        return $respuestasSubidaStocks;
        
    }
    public function subirPrecio($precios){
        $respuestasSubidaPrecio=[];
        foreach($precios as $precio){
            $respuestaExistencia= $this->verificarExistenciaProducto($precio["ean"]);
            if($respuestaExistencia["estado"]===200){
                $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
                $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
                $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
                $url=$endPoint."/merchants/".$idComerciante."/prices";
                $curlController=new CurlController($url);
                $header = array(
                    'Content-Type: application/json',
                    'Authorization: '.'Bearer '. $token
                );
                if($precio["ignore_warnings"]==="true"){
                    $precio["ignore_warnings"]=true;
                }
                else if($precio["ignore_warnings"]==="false"){
                    $precio["ignore_warnings"]=false;
                }
                $product_precio=["product_prices" => []];
                $product_precio["product_prices"][]=$precio;
                $curlController->setDatosPeticion($product_precio);
                $curlController->setdatosCabezera($header);
                $respuesta=$curlController->ejecutarPeticion("post",true);
                error_log("respuesta de zalando al subir el precio =>>>>  " . var_export($respuesta, true));
                $respuestasSubidaPrecio[]=$respuesta["response"]->results[0]->description;
            }
            else{
                $respuestasSubidaPrecio[$precio["ean"]]=false;
            }
        }
        return $respuestasSubidaPrecio;
    }

    


}