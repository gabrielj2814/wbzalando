<?php
include("curlController.php");
include("logger.php");
use Clases\CurlController;

class ProductoController extends ModuleAdminController{

    private $id_idioma;
    private $nombreTabla;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = true;
        $this->id_idioma = $this->context->language->id;
        $this->nombreTabla="ps_wbzalando_esquemas"; 
    }

    public function init()
    {
        parent::init();
    }

    public function initContent(){
        parent::initContent();
        $esquemasDB=$this->chequearEsquemasDeHoyDB();
        if(count($esquemasDB)===0){
            $datosEsquemas=$this->consultarEsquemasDeProducto();
            if(count($datosEsquemas["esquemas_name_label"])>0){
                $respuestaResgistro=$this->registrarEsquemasDB($datosEsquemas);
            }
        }
        $linkDeControlador=$this->context->link->getAdminLink("Producto",true);
        $linkDeControladorTalla=$this->context->link->getAdminLink("Talla",true);
        $linkDeControladorCategoria=$this->context->link->getAdminLink("Categoria",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador,
            "linkDeControladorCategoria" => $linkDeControladorCategoria,
            "linkDeControladorTalla" => $linkDeControladorTalla
        ];
        $variablesSmarty["categoriasProductos"]=$this->validarRespuestaBD($this->consultarCategoriasPrestashop());
        $variablesSmarty["marcasProductos"]=$this->validarRespuestaBD($this->consultarMarcasPrestashop());
        $this->context->smarty->assign($variablesSmarty);
        $this->setTemplate('/producto/formulario.tpl');
    }

    public function validarRespuestaBD($respuesta){
        if(is_array($respuesta)){
            return $respuesta;
        }
        return [];
    }

    public function consultarProductosPrestashop(){
        return Db::getInstance()->executeS("
        SELECT 
        ps_product_lang.name,
        ps_product.id_product,
        ps_product.ean13 
        FROM ps_product_lang,ps_product,ps_lang
        WHERE
        ps_product_lang.id_lang=".$this->id_idioma." AND
        ps_product_lang.id_lang=ps_lang.id_lang AND
        ps_product_lang.id_product=ps_product.id_product");
    }
    
    public function consultarProductoPrestashop($idProducto){
        $SQL="
        SELECT 
        ps_product_lang.name,
        ps_product.id_product,
        ps_product.ean13 
        FROM ps_product_lang,ps_product,ps_lang
        WHERE
        ps_product.id_product=".$idProducto." AND
        ps_product_lang.id_lang=".$this->id_idioma." AND
        ps_product_lang.id_lang=ps_lang.id_lang AND
        ps_product_lang.id_product=ps_product.id_product
        ";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    public function consultarCategoriasPrestashop(){
        return Db::getInstance()->executeS("
        SELECT 
        ps_category.id_category,
        ps_category_lang.name  FROM ps_category,
        ps_category_lang,
        ps_lang 
        WHERE ps_category_lang.id_lang=".$this->id_idioma." AND 
        ps_category_lang.id_category=ps_category.id_category AND 
        ps_category_lang.id_lang=ps_lang.id_lang");
    }
    
    public function consultarMarcasPrestashop(){
        return Db::getInstance()->executeS("
        SELECT ps_manufacturer.id_manufacturer,
        ps_manufacturer.name  FROM ps_manufacturer,
        ps_manufacturer_lang,
        ps_lang 
        WHERE 
        ps_manufacturer_lang.id_lang=".$this->id_idioma." AND 
        ps_manufacturer_lang.id_manufacturer=ps_manufacturer.id_manufacturer AND 
        ps_manufacturer_lang.id_lang=ps_lang.id_lang");
    }

    private function generarUrlProducto($arrayProductos){
        $lista=[];
        foreach($arrayProductos as $producto){
            $id_image = Product::getCover((int)$producto["id_product"]);
            if (is_array($id_image)) {
                if(sizeof($id_image) >0){
                    $image = new Image($id_image['id_image']);
                    $image_url = _PS_BASE_URL_._THEME_PROD_DIR_.$image->getExistingImgPath().".jpg";
                }
                $producto["urlImagen"]=$image_url;
                $lista[]=$producto;
            }
        }
        return $lista;
    }

    public function ajaxProcessGetConsultarProducto(){
        $respuesta_servidor=["respuestaServidor" => [],"estatuRespuestaApi" => 0];
        $respuesta=$this->consultarProductoPrestashop($_GET["id_producto"]);
        if(count($respuesta)>0){
            $respuesta_servidor["respuestaServidor"]=[
                "datos" => $respuesta,
                "mensaje" => "consulta completada"
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "datos" =>[],
                "mensaje" => "error al consultar"
            ];
        }
        print(json_encode($respuesta_servidor));
    }

    public function ajaxProcessGetConsultarProductoConFiltros(){
        $SQL="";
        $productos=[];
        $fracmetoConsulta=[];
        if($_POST["categoriaProducto"]!="null"){
            $fracmetoConsulta[]="ps_category_product.id_category=".$_POST["categoriaProducto"];
        }
        if($_POST["marcaProducto"]!="null"){
            $fracmetoConsulta[]="ps_product.id_manufacturer=".$_POST["marcaProducto"];
        }
        if($_POST["nombreProducto"]!=""){
            $fracmetoConsulta[]="ps_product_lang.name LIKE '%".$_POST["nombreProducto"]."%'";
        }
        $condicion="";
        if(count($fracmetoConsulta)>1){
            $condicion=join(" AND ",$fracmetoConsulta)." AND ";
        }
        else if(count($fracmetoConsulta)===1){
            $condicion= "(".$fracmetoConsulta[0].") AND ";
        }

        if($_POST["categoriaProducto"]!="null"){
            $SQL="
            SELECT 
            ps_product_lang.name,
            ps_product.id_product,
            ps_product.ean13
            FROM ps_category_product,ps_product_lang,ps_product,ps_lang
            WHERE
            ".$condicion."
            ps_product_lang.id_lang=".$this->id_idioma." AND
            ps_product.id_product=ps_category_product.id_product AND
            ps_product_lang.id_lang=ps_lang.id_lang AND
            ps_product_lang.id_product=ps_product.id_product";
        }
        else{
            $SQL="
            SELECT 
            ps_product_lang.name,
            ps_product.id_product,
            ps_product.ean13
            FROM ps_product_lang,ps_product,ps_lang
            WHERE
            ".$condicion."
            ps_product_lang.id_lang=".$this->id_idioma." AND
            ps_product_lang.id_lang=ps_lang.id_lang AND
            ps_product_lang.id_product=ps_product.id_product";
            
        }
        $productos=Db::getInstance()->executeS($SQL);
        $productos=$this->generarUrlProducto($productos);
        print(json_encode(["datos" =>  $productos]));
    }

    public function ajaxProcessConsultarPorCategoriasAsociadas(){
        $SQL="";
        $productos=[];
        $fracmetoConsulta=[];
        if($_GET["categoriaProducto"]!="null"){
            $fracmetoConsulta[]="ps_category_product.id_category=".$_GET["categoriaProducto"];
        }
        $condicion="";
        if(count($fracmetoConsulta)===1){
            $condicion= "(".$fracmetoConsulta[0].") AND ";
        }
        if($_GET["categoriaProducto"]!="null"){
            $SQL="
            SELECT 
            ps_product_lang.name,
            ps_product.id_product,
            ps_product.ean13
            FROM ps_category_product,ps_product_lang,ps_product,ps_lang
            WHERE
            ".$condicion."
            ps_product_lang.id_lang=".$this->id_idioma." AND
            ps_product.id_product=ps_category_product.id_product AND
            ps_product_lang.id_lang=ps_lang.id_lang AND
            ps_product_lang.id_product=ps_product.id_product";
        }
        if($_GET["categoriaProducto"]!="null"){
            $productos=Db::getInstance()->executeS($SQL);
            $productos=$this->generarUrlProducto($productos);
            print(json_encode(["datos" =>  $productos]));
        }
        else{
            print(json_encode(["datos" =>  $productos]));
        }
        
    }
    
    public function ajaxProcessGetConsultarProductos(){
        $listaDeProductos=$this->consultarProductosPrestashop();
        $listaDeProductos=$this->generarUrlProducto($listaDeProductos);
        print(json_encode(["datos" => $listaDeProductos]));
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

    public function ajaxProcessPostEnviarProductos(){
       print(json_encode( $this->enviarProducto($_POST["productos"])));
    }

    public function enviarProducto($productos){
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $url=$endPoint."/merchants/".$idComerciante."/product-submissions";
        $curlController=new CurlController($url);
        $header = array(
            'Content-Type: application/json',
            'Authorization: '.'Bearer '. $token
        );
        $respuesta=null;
        $estadoDeProductos=[
            "productos_guardados_db" => [],
            "productos_enviados" =>[]
        ];
        foreach($productos as $producto ){
            // enviar productos a zalando
            // $producto["product_model"]["product_configs"][0]["product_config_attributes"]["media"][0]["media_sort_key"]=(int)$producto["product_model"]["product_configs"][0]["product_config_attributes"]["media"][0]["media_sort_key"];
            // $curlController->setDatosPeticion($producto);
            // $curlController->setdatosCabezera($header);
            // $respuesta=$curlController->ejecutarPeticion("post",true);
            // error_log("respuesta de zalando al subir el producto =>>>>  " . var_export($estadoDeProductos, true));
            $producto=$this->destructurarModeloDeProductoZalando($producto);
            // // subir stocks de producto
            // $stocksSubidos=$this->subirStock($producto["stocks"]);
            // // subir precios de producto
            // $preciosSubidos=$this->subirPrecio($producto["precios"]);
            // // captura de respuestas de la api de zalandos 
            // $estadoDeProductos["productos_enviados"][]=[
            //     "respuestaServidor" => $respuesta,
            //     "estatuRespuestaApi" => $respuesta["estado"]
            // ];

            // verificando existencia de producto en la base de datos
            $respuestaExistenciaProducto=$this->consultarModeloProductoDB($producto["merchant_product_model_id"]);
            if(count($respuestaExistenciaProducto)===1){
                // este codigo se encargar de cuando un producto ya exista 
                // lo que haces es que actualiza los precios del producto
                // o en caso de que sean precios o stocks nuevos los agrega a la base de datos 
                $datosNuevos=["stocks" =>[], "precios" =>[]];
                foreach($producto["stocks"] as $stockProducto){
                    if(count($this->consultarStockProducto($stockProducto["ean"]))){
                        $this->actualizarStockProducto($stockProducto);
                    }
                    else{
                        $datosNuevos["stocks"][]=$stockProducto;
                    }
                }
                foreach($producto["precios"] as $precioProducto){
                    if(count($this->consultarPrecioProducto($precioProducto["ean"]))){
                        $this->actualizarPrecioProducto($precioProducto);
                    }
                    else{
                        $datosNuevos["precios"][]=$precioProducto;
                    }
                }
                $respuestaStock=$this->guardarStockProducto($datosNuevos);
                $respuestaPrecio=$this->guardarPrecioProducto($datosNuevos);
            }
            else{
                // guardar el producto en la base de datos
                $respuestaModelo=$this->guardarModeloProducto($producto);
                $respuestaConfig=$this->guardarConfigProducto($producto);
                $respuestaSimple=$this->guardarSimpleProducto($producto);
                $respuestaPrecio=$this->guardarPrecioProducto($producto);
                $respuestaStock=$this->guardarStockProducto($producto);
            }

            $estadoDeProductos["productos_guardados_db"][]=$producto;
        }
        return $estadoDeProductos;
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

    public function guardarModeloProducto($producto){
        $SQL="
            INSERT INTO ps_wbzalando_modelo_producto(
                id_modelo_producto, 
                outline, 
                json_modelo_producto
                ) 
            VALUES (
                '".$producto["merchant_product_model_id"]."',
                '".$producto["outline"]."',
                '".json_encode($producto["product_model"])."'
            );
        ";
        return Db::getInstance()->execute($SQL);
    }

    public function consultarModeloProductoDB($idModeloProducto){
        $SQL="SELECT * FROM ps_wbzalando_modelo_producto WHERE id_modelo_producto='".$idModeloProducto."';";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    public function guardarConfigProducto($producto){
        $estado=true;
        foreach($producto["product_configs"] as $configuracionProducto){
            $SQL="
            INSERT INTO ps_wbzalando_configuracion_producto(
                    id_configuracion_producto,
                    id_modelo_producto,
                    json_configuracion_producto
                    ) 
                VALUES (
                    '". $configuracionProducto["datos_product_configs"]["merchant_product_config_id"]."',
                    '". $configuracionProducto["merchant_product_model_id"]."',
                    '".json_encode($configuracionProducto["datos_product_configs"])."'
                );
            ";
            if(!Db::getInstance()->execute($SQL)){
                $estado=false;
                break;
            }
        }
        return $estado;
    }
    
    public function guardarSimpleProducto($producto){
        $estado=true;
        foreach($producto["product_simples"] as $simpleProducto){
            $SQL="
            INSERT INTO ps_wbzalando_simple_producto(
                id_simple_producto,
                id_configuracion_producto,
                json_simple_producto
                    ) 
                VALUES (
                    '". $simpleProducto["datos_product_simples"]["merchant_product_simple_id"]."',
                    '". $simpleProducto["merchant_product_config_id"]."',
                    '".json_encode($simpleProducto["datos_product_simples"])."'
                );
            ";
            if(!Db::getInstance()->execute($SQL)){
                $estado=false;
                break;
            }
        }
        return $estado;
    }

    public function guardarPrecioProducto($producto){
        $estado=true;
        foreach($producto["precios"] as $precioProducto){
            $SQL="
            INSERT INTO ps_wbzalando_precio(
                ean,
                sales_channel_id,
                json_precio
                    ) 
                VALUES (
                    '". $precioProducto["ean"]."',
                    '". $precioProducto["sales_channel_id"]."',
                    '".json_encode($precioProducto)."'
                );
            ";
            if(!Db::getInstance()->execute($SQL)){
                $estado=false;
                break;
            }
        }
        return $estado;
    }

    public function guardarStockProducto($producto){
        $estado=true;
        foreach($producto["stocks"] as $stockProducto){
            $SQL="
            INSERT INTO ps_wbzalando_stock(
                ean,
                sales_channel_id,
                quantity
                ) 
                VALUES (
                    '". $stockProducto["ean"]."',
                    '". $stockProducto["sales_channel_id"]."',
                    ". $stockProducto["quantity"]."
                );
            ";
            if(!Db::getInstance()->execute($SQL)){
                $estado=false;
                break;
            }
        }
        return $estado;
    }

    public function consultarStockProducto($ean){
        $SQL="SELECT * FROM ps_wbzalando_stock WHERE ean='".$ean."';";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    public function consultarPrecioProducto($ean){
        $SQL="SELECT * FROM ps_wbzalando_precio WHERE ean='".$ean."';";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    public function actualizarStockProducto($producto){
        $SQL="UPDATE ps_wbzalando_stock SET 
            sales_channel_id='".$producto["sales_channel_id"]."',
            quantity=".$producto["quantity"]."  
            WHERE ean='".$producto["ean"]."';";
        return Db::getInstance()->execute($SQL);
    }

    public function actualizarPrecioProducto($producto){
        $SQL="UPDATE ps_wbzalando_precio SET 
            sales_channel_id='".$producto["sales_channel_id"]."',
            json_precio='".json_encode($producto)."'  
            WHERE ean='".$producto["ean"]."';";
        return Db::getInstance()->execute($SQL);
    }

    public function destructurarModeloDeProductoZalando($modeloProducto){
        $merchant_product_model_id=null;
        $datosProducto=[
            "outline"=> null,
            "merchant_product_model_id"=> null,
            "product_model" => [],
            "product_configs" => [],
            "product_simples" => [],
            "precios" => [],
            "stocks" => []
        ];
        $merchant_product_model_id=$modeloProducto["product_model"]["merchant_product_model_id"];
        $datosProducto["outline"]=$modeloProducto["outline"];
        $datosProducto["merchant_product_model_id"]=$modeloProducto["product_model"]["merchant_product_model_id"];
        $datosProducto["product_model"]["merchant_product_model_id"]=$modeloProducto["product_model"]["merchant_product_model_id"];
        $datosProducto["product_model"]["product_model_attributes"]=$modeloProducto["product_model"]["product_model_attributes"];
        $datosProducto["precios"]=$modeloProducto["precio"]["product_prices"];
        $datosProducto["stocks"]=$modeloProducto["stock"]["items"];
        foreach($modeloProducto["product_model"]["product_configs"] as $datosModeloProductoNivel3){
            $configModelo=[];
            foreach($datosModeloProductoNivel3 as $key2 => $datosModeloProductoNivel4){
                if($key2!=="product_simples"){
                    $configModelo[$key2]=$datosModeloProductoNivel3[$key2];
                }
                else{
                    foreach($datosModeloProductoNivel3["product_simples"] as $datosModeloProductoNivel5){
                        $simpleConfig=[];
                        foreach($datosModeloProductoNivel5 as $key3 => $datosModeloProductoNivel6){
                            $simpleConfig[$key3]=$datosModeloProductoNivel5[$key3];
                        }
                        $datosProducto["product_simples"][]=[
                            "merchant_product_config_id" => $datosModeloProductoNivel3["merchant_product_config_id"],
                            "datos_product_simples" => $simpleConfig
                        ];
                    }
                }
            }
            $datosProducto["product_configs"][]=[
                "merchant_product_model_id" => $merchant_product_model_id,
                "datos_product_configs" => $configModelo
            ];
        }
        return $datosProducto;
    }

    public function chequearEsquemasDeHoyDB(){
        $fechaHoy=date("Y-m-d");
        $SQL="SELECT * FROM ps_wbzalando_esquemas WHERE fecha_registro='$fechaHoy'";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    public function consultarEsquemasDeProducto(){
        $respuestaZalando=["respuestaServidor" => [],"estatuRespuestaApi" => 0,"esquemas_name_label"=>[],"esquemas_full" => []];
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $url=$endPoint."/merchants/".$idComerciante."/outlines";
        $curlController=new CurlController($url);
        $header = array(
            'Authorization: '.'Bearer '. $token
        );
        $curlController->setdatosCabezera($header);
        $respuesta=$curlController->ejecutarPeticion("get",false);
        $outline =[];
        error_log("respuesta al consultar los esquema de producto zalando =>>>>  " . var_export($respuesta["response"], true));
        if(is_object($respuesta["response"])){
            if(property_exists($respuesta["response"],"items")){
                foreach($respuesta["response"]->items as $esquema){
                    $outline[]=$esquema->name->en."-".$esquema->label;
                }
            }
            if(count($outline)>0){
                $respuestaZalando["esquemas_name_label"] = $outline;
                $respuestaZalando["esquemas_full"] = $respuesta["response"]->items;
            }
        }
        else{
            $respuestaZalando["respuestaServidor"]= $respuesta["response"];
            $respuestaZalando["estatuRespuestaApi"]= $respuesta["estado"];
        }
        return $respuestaZalando;
    }

    public function registrarEsquemasDB($datos){
        $fechaHoy=date("Y-m-d");
        $jsonEsquemasNameLabel=json_encode($datos["esquemas_name_label"]);
        $jsonEsquemasFull=json_encode($datos["esquemas_full"]);
        $SQL="INSERT INTO ps_wbzalando_esquemas(
            fecha_registro,
            esquemas_name_label,
            esquemas_full
            )
            VALUES(
                '".$fechaHoy."',
                '".$jsonEsquemasNameLabel."',
                '".$jsonEsquemasFull."'
            );";
        return Db::getInstance()->execute($SQL);
    }

    public function ajaxProcessGetConsultarEsquemasProducto(){
        $respuesta_servidor=["respuestaServidor" => []];
        $resultEsquemas=$this->chequearEsquemasDeHoyDB();
        if(count($resultEsquemas)>0){
            $respuesta_servidor["respuestaServidor"]=$resultEsquemas[0]["esquemas_name_label"];
        }
        print(json_encode($respuesta_servidor));

    }

    public function ajaxProcessGetConsultarPedidosZalando(){
        $respuesta_servidor=["respuestaServidor" => [],"estatuRespuestaApi" => 0];
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $url=$endPoint."/merchants/".$idComerciante."/orders";
        $curlController=new CurlController($url);
        $header = array(
            'Authorization: '.'Bearer '. $token
        );
        $curlController->setdatosCabezera($header);
        $respuesta=$curlController->ejecutarPeticion("get",false);
        $respuesta_servidor["respuestaServidor"]=$respuesta["response"];
        $respuesta_servidor["estatuRespuestaApi"]=$respuesta["estado"];
        print(json_encode($respuesta));
    }

    public function consultarTipoDeDatoModeloZalando($propiedad){
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $url=$endPoint."/merchants/".$idComerciante."/attribute-types/".$propiedad;
        $curlController=new CurlController($url);
        $header = array(
            'Authorization: '.'Bearer '. $token
        );
        $curlController->setdatosCabezera($header);
        return $curlController->ejecutarPeticion("get",false);
    }

    function ajaxProcessGetConsultarProductosWBZalando(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->consultarProductosWBZalando();
        if(count($respuestaDB)>0){
            for($contador=0;$contador<count($respuestaDB);$contador++){
                $jsonSimple=json_decode($respuestaDB[$contador]["json_simple_producto"]);
                $respuestaDB[$contador]["precio"]=$this->consultarPrecio($jsonSimple->product_simple_attributes->ean)[0];
                $respuestaDB[$contador]["stock"]=$this->consultarStock($jsonSimple->product_simple_attributes->ean)[0];
            }
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consulta completada",
                "datos" => $respuestaDB
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error al consultar",
                "datos" => []
            ];
        }
        print(json_encode($respuesta_servidor));

    }

    function consultarProductosWBZalando(){
        $SQL="SELECT * FROM 
        ps_wbzalando_modelo_producto,
        ps_wbzalando_configuracion_producto,
        ps_wbzalando_simple_producto 
        WHERE 
        ps_wbzalando_configuracion_producto.id_configuracion_producto=ps_wbzalando_simple_producto.id_configuracion_producto AND
        ps_wbzalando_modelo_producto.id_modelo_producto=ps_wbzalando_configuracion_producto.id_modelo_producto
        ";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    function consultarPrecio($ean){
        $SQL="SELECT * FROM ps_wbzalando_precio WHERE ean='".$ean."';";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    function consultarStock($ean){
        $SQL="SELECT * FROM ps_wbzalando_stock WHERE ean='".$ean."';";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
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

?>