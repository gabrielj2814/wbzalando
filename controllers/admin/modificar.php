<?php
include("curlController.php");
include("logger.php");
use Clases\CurlController;
use PrestaShop\PrestaShop\Adapter\Entity\Module as EntityModule;

class ModificarController extends ModuleAdminController{

    private $id_idioma;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = true;
        $this->id_idioma = $this->context->language->id;
        $this->modulo= EntityModule::getInstanceByName("wbzalando");
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
        $linkDeControlador=$this->context->link->getAdminLink("Modificar",true);
        $linkDeControladorProducto=$this->context->link->getAdminLink("Producto",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador,
            "linkDeControladorProducto" => $linkDeControladorProducto
        ];
        $this->context->smarty->assign($variablesSmarty);
        $this->setTemplate('/modificar/vista.tpl');
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
        $minimoRegistros=10;
        $pagina=$_GET["pagina"];
        $respuestaProductoModeloFull=$this->consultarProductosModeloProPaisFull($_GET["codigoPais"]);
        $respuestaProductoModelo=$this->consultarProductosModeloProPais($pagina,$minimoRegistros,$_GET["codigoPais"]);
        if(count($respuestaProductoModeloFull)>0){
            for($contador=0;$contador<count($respuestaProductoModelo);$contador++){
                $respuestaProductoConfig=$this->consultarConfigPorModelo($respuestaProductoModelo[$contador]["id_modelo_producto"]);
                $respuestaProductoSimples=$this->consultarSimplePorConfig($respuestaProductoConfig[0]["id_configuracion_producto"]);
                for($contador2=0;$contador2<count($respuestaProductoSimples);$contador2++){
                    $respuestaProductoPrecios=$this->consultarPrecio($_GET["codigoPais"],$respuestaProductoSimples[$contador2]["ean"]);
                    $respuestaProductoSimples[$contador2]["precio"]=$respuestaProductoPrecios[0];
                }
                for($contador3=0;$contador3<count($respuestaProductoSimples);$contador3++){
                    $respuestaProductoStock=$this->consultarStock($respuestaProductoSimples[$contador3]["ean"],$_GET["codigoPais"]);
                    $respuestaProductoSimples[$contador3]["stock"]=$respuestaProductoStock[0];
                }
                $respuestaProductoModelo[$contador]["config"]=$respuestaProductoConfig[0];
                $respuestaProductoModelo[$contador]["simples"]=$respuestaProductoSimples;
            }
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consulta completada",
                "datos" => []
            ];
        }
        $respuesta_servidor["respuestaServidor"]=[
            "mensaje" => "consulta completada",
            "datos" => $respuestaProductoModelo
        ];
        echo json_encode($respuesta_servidor);
    }

    function consultarProductos($ean){
        $SQL="SELECT 
        ps_wbzalando_modelo_producto.sales_channel_id,
        ps_wbzalando_modelo_producto.id_modelo_producto,
        ps_wbzalando_modelo_producto.json_modelo_producto,
        ps_wbzalando_simple_producto.json_simple_producto,
        ps_wbzalando_configuracion_producto.id_configuracion_producto
        FROM 
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

    function consultarProductosModeloProPaisFull($pais){
        $SQL="SELECT * FROM 
        ps_wbzalando_modelo_producto 
        WHERE 
        sales_channel_id='$pais';
        ";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    function consultarProductosModeloProPais($pagina,$minimoRegistros,$pais){
        $empezarPor=($pagina-1) * $minimoRegistros;
        $SQL="SELECT * FROM 
        ps_wbzalando_modelo_producto 
        WHERE 
        sales_channel_id='$pais' LIMIT ".$empezarPor.",".$minimoRegistros.";
        ";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    // function consultarPrecio($pais){
    //     $SQL="SELECT * FROM ps_wbzalando_precio WHERE sales_channel_id='".$pais."' ;";
    //     return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    // }
    
    function paginarPrecio($pagina,$minimoRegistros,$pais){
        $empezarPor=($pagina-1) * $minimoRegistros;
        $SQL="SELECT * FROM ps_wbzalando_precio WHERE sales_channel_id='".$pais."' LIMIT ".$empezarPor.",".$minimoRegistros.";";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    function consultarPrecio($pais,$ean){
        $SQL="SELECT * FROM ps_wbzalando_precio WHERE sales_channel_id='".$pais."' AND ean='$ean'";
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
    
    function consultarSimplePorConfig($idCondfig){
        $SQL="SELECT * FROM ps_wbzalando_simple_producto WHERE id_configuracion_producto ='".$idCondfig."';";
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
        $resuestaModificarPrecioProductoZalando=false;
        $resuestaModificarStockProducto=false;
        $resuestaModificarStockProductoZalando=false;
        if(array_key_exists("precios",$_POST)){
            $resuestaModificarPrecioProducto=$this->editarPrecioProducto($_POST["precios"]);
            // $resuestaModificarPrecioProductoZalando=$this->subirPrecio($_POST["precios"]);
        }
        if(array_key_exists("stocks",$_POST)){
            $resuestaModificarStockProducto=$this->editarStockProducto($_POST["stocks"]);
            // $resuestaModificarStockProductoZalando=$this->subirStock($_POST["stocks"]);
        }
        $respuesta_servidor["respuestaServidor"]=[
            "precio" => $resuestaModificarPrecioProducto,
            "precioZalando" => $resuestaModificarPrecioProductoZalando,
            "stock" => $resuestaModificarStockProducto,
            "stockZalando" => $resuestaModificarStockProductoZalando,
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
            $objStock=json_decode($stock);
            $respuestaExistencia= $this->verificarExistenciaProducto($objStock->ean);
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
                $items["items"][]=[
                    "sales_channel_id"=> $objStock->sales_channel_id,
                    "ean"=> $objStock->ean,
                    "quantity"=> (int)$objStock->quantity
                ];
                $curlController->setDatosPeticion($items);
                $curlController->setdatosCabezera($header);
                $respuesta=$curlController->ejecutarPeticion("post",true);
                error_log("respuesta de zalando al subir el stock =>>>>  " . var_export($respuesta, true));
                $respuestasSubidaStocks[]=$respuesta["response"]->results[0];
            }
            else{
                $respuestasSubidaStocks[$objStock->ean]=false;
            }
        }
        return $respuestasSubidaStocks;
        
    }
    public function subirPrecio($precios){
        $respuestasSubidaPrecio=[];
        foreach($precios as $precio){
            $objPrecio=json_decode($precio);
            $respuestaExistencia= $this->verificarExistenciaProducto($objPrecio->ean);
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
                $precioEnviar=[
                    "ean"=> $objPrecio->ean,
                    "sales_channel_id"=> $objPrecio->sales_channel_id,
                    "regular_price"=> [
                        "amount"=> (float)$objPrecio->regular_price->amount,
                        "currency"=> $objPrecio->regular_price->currency
                    ],
                    "promotional_price"=> [
                        "amount"=> (float)$objPrecio->promotional_price->amount,
                        "currency"=> $objPrecio->promotional_price->currency,
                    ],
                    "scheduled_prices"=> [
                        [
                            "regular_price"=> [
                                "amount"=> (float)$objPrecio->regular_price->amount,
                                "currency"=> $objPrecio->regular_price->currency
                            ],
                            "promotional_price"=> [
                                "amount"=> (float)$objPrecio->promotional_price->amount,
                                "currency"=> $objPrecio->promotional_price->currency,
                            ],
                            "start_time"=> $objPrecio->scheduled_prices[0]->start_time,
                            "end_time"=> $objPrecio->scheduled_prices[0]->end_time
                        ]
                    ],
                    "ignore_warnings"=> $objPrecio->ignore_warnings
                ];
                $product_precio=["product_prices" => []];
                $product_precio["product_prices"][]=$precioEnviar;
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

    public function ajaxProcessPostEliminarProducto(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaEliminarProducto=$this->eliminarProducto($_POST["id_modelo"]);
        if($respuestaEliminarProducto){
            $nombreImagen=$_POST["nombre_imagen"];
            $dir=_PS_MODULE_DIR_.$this->modulo->name."/upload/";
            if(file_exists($dir.$nombreImagen)){
                unlink($dir.$nombreImagen);
            }
        }
        if($respuestaEliminarProducto){
            foreach($_POST["eans"] as $ean){
                $this->eliminarStock($ean["ean"],$ean["idPais"]);
                $this->eliminarPrecio($ean["ean"],$ean["idPais"]);
            }
        }
        $respuesta_servidor["respuestaServidor"]=[
            "producto_eliminada" => $respuestaEliminarProducto
        ];
        print(json_encode($respuesta_servidor));
    }

    function eliminarProducto($id){
        $SQL="DELETE FROM ps_wbzalando_modelo_producto WHERE id_modelo_producto ='".$id."';";
        return Db::getInstance()->execute($SQL);
    }

    function eliminarPrecio($ean,$idPais){
        $SQL="DELETE FROM ps_wbzalando_precio WHERE ean='".$ean."' AND sales_channel_id ='".$idPais."';";
        return Db::getInstance()->execute($SQL);
    }
    
    function eliminarStock($ean,$idPais){
        $SQL="DELETE FROM ps_wbzalando_stock WHERE ean='".$ean."' AND sales_channel_id ='".$idPais."';";
        return Db::getInstance()->execute($SQL);
    }
    


}