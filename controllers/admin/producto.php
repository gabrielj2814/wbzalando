<?php
include("curlController.php");
include("logger.php");
use Clases\CurlController;

class ProductoController extends ModuleAdminController{

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
        $linkDeControlador=$this->context->link->getAdminLink("Producto",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador
        ];
        if(array_key_exists("vista",$_GET)){
            if($_GET["vista"]==="formulario"){
                $variablesSmarty["categoriasProductos"]=$this->validarRespuestaBD($this->consultarCategoriasPrestashop());
                $variablesSmarty["marcasProductos"]=$this->validarRespuestaBD($this->consultarMarcasPrestashop());
                $this->context->smarty->assign($variablesSmarty);
                $this->setTemplate('/producto/formulario.tpl');
            }
            else if($_GET["vista"]==="inicio"){
                $this->context->smarty->assign($variablesSmarty);
                $this->setTemplate('/producto/inicio.tpl');
            }
        }
        else{
            $this->context->smarty->assign($variablesSmarty);
            $this->setTemplate('/producto/inicio.tpl');
        }
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
        return Db::getInstance()->executeS("
        SELECT 
        ps_product_lang.name,
        ps_product.id_product,
        ps_product.ean13 
        FROM ps_product_lang,ps_product,ps_lang
        WHERE
        ps_product.id_product=".$idProducto." AND
        ps_product_lang.id_lang=".$this->id_idioma." AND
        ps_product_lang.id_lang=ps_lang.id_lang AND
        ps_product_lang.id_product=ps_product.id_product");
    }

    public function consultarCategoriasPrestashop(){
        return Db::getInstance()->executeS("SELECT ps_category.id_category,ps_category_lang.name  FROM ps_category,ps_category_lang,ps_lang WHERE ps_category_lang.id_lang=".$this->id_idioma." AND ps_category_lang.id_category=ps_category.id_category AND ps_category_lang.id_lang=ps_lang.id_lang");
    }
    
    public function consultarMarcasPrestashop(){
        return Db::getInstance()->executeS("SELECT ps_manufacturer.id_manufacturer,ps_manufacturer.name  FROM ps_manufacturer,ps_manufacturer_lang,ps_lang WHERE ps_manufacturer_lang.id_lang=".$this->id_idioma." AND ps_manufacturer_lang.id_manufacturer=ps_manufacturer.id_manufacturer AND ps_manufacturer_lang.id_lang=ps_lang.id_lang");
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
    
    public function ajaxProcessGetConsultarProductos(){
        $listaDeProductos=$this->consultarProductosPrestashop();
        $listaDeProductos=$this->generarUrlProducto($listaDeProductos);
        print(json_encode(["datos" => $listaDeProductos]));
    }

    public function ajaxProcessGetConsultarPaisesZalando(){
        $respuesta_servidor=["respuestaServidor" => [], "codigo_respuesta" => 0];
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
        if(property_exists($Paises,"items")){
            $respuesta_servidor["respuestaServidor"]= $respuesta["response"];
            $respuesta_servidor["estadoRespuesta"]= $respuesta["estado"];
        }
        else{
            $respuesta_servidor["respuestaServidor"]= $respuesta;
        }
        print(json_encode($respuesta_servidor));
    }

    public function ajaxProcessPostEnviarProductos(){
        $respuesta_servidor=["respuestaServidor" => [], "codigo_respuesta" => 0];
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $datosProductosHaEnviar=[];
        // foreach($_POST["productos"] as $productos){
        //     $datosProducto=[];
        //     $datosProducto["outline"]="bag";
        //     $datosProducto["product_model"]=[];
        //     $datosProducto["product_model"]["merchant_product_model_id"]="modelo_producto_".$productos["id_product"];
        //     $datosProducto["product_model"]["product_model_attributes"]=[];
        //     $datosProducto["product_model"]["product_model_attributes"]["name"]="nombre test";
        //     $datosProducto["product_model"]["product_model_attributes"]["brand_code"]="5FX";
        //     $datosProducto["product_model"]["product_model_attributes"]["size_group"]=[];
        //     $datosProducto["product_model"]["product_model_attributes"]["size_group"]["size"]="2MAE000A2A";
        //     $datosProducto["product_model"]["product_model_attributes"]["target_genders"]=[];
        //     $datosProducto["product_model"]["product_model_attributes"]["target_genders"][]="target_gender_female";
        //     $datosProducto["product_model"]["product_model_attributes"]["target_age_groups"]=[];
        //     $datosProducto["product_model"]["product_model_attributes"]["target_age_groups"][]="target_age_group_kid";
        //     $datosProducto["product_model"]["product_configs"]=[];
        //     $datosProducto["product_model"]["product_configs"][]=[
        //         "merchant_product_config_id"=> "11111",
        //         "product_config_attributes" => [
        //             "color_code" => "802",
        //             "season_code" => "",
        //             "media" => []
        //         ],
        //         "product_simples" => [
        //             [
        //                 "merchant_product_simple_id"=> "1",
        //                 "product_simple_attributes" => [
        //                     "ean" => $productos["ean"],
        //                     "size_codes" => []
        //                 ]
        //             ]
        //         ]
        //     ];
        //     $datosProductosHaEnviar[]=$datosProducto;
        // }

        $url=$endPoint."/merchants/".$idComerciante."/product-submissions";
        $curlController=new CurlController($url);
        $header = array(
            'Content-Type: application/json',
            'Authorization: '.'Bearer '. $token
        );
        $respuesta=null;
        $estadoDeProductos=[];
        // $_POST["productos"][0]["product_model"]["product_configs"][0]["product_config_attributes"]["media"][0]["media_sort_key"]=(int)$_POST["productos"][0]["product_model"]["product_configs"][0]["product_config_attributes"]["media"][0]["media_sort_key"];
        foreach($_POST["productos"] as $producto ){
            $producto["product_model"]["product_configs"][0]["product_config_attributes"]["media"][0]["media_sort_key"]=(int)$producto["product_model"]["product_configs"][0]["product_config_attributes"]["media"][0]["media_sort_key"];
            $curlController->setDatosPeticion($producto);
            $curlController->setdatosCabezera($header);
            $respuesta=$curlController->ejecutarPeticion("post",true);
            $estadoDeProductos["codigo_estado"]=$respuesta["estado"];
            $estadoDeProductos["datos_producto_enviado"]=$producto;
            $estadoDeProductos["respuesta_zalando"]=$respuesta;
            error_log("respuesta de zalando al subir el producto =>>>>  " . var_export($estadoDeProductos, true));
        }
        print(json_encode(["respuesta" =>  $estadoDeProductos]));
    }

    public function ajaxProcessGetConsultarEsquemasProducto(){
        $respuesta_servidor=["respuestaServidor" => [], "codigo_respuesta" => 0];
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
        foreach($respuesta["response"]->items as $esquema){
            $outline[]=$esquema->name->en."-".$esquema->label;
        }
        $respuesta_servidor["respuestaServidor"]=$outline;
        $respuesta_servidor["codigo_respuesta"]=$respuesta["estado"];
        print json_encode($respuesta_servidor);
    }

    public function ajaxProcessGetConsultarEsquemaProducto(){
        $respuesta_servidor=["respuestaServidor" => [], "codigo_respuesta" => 0];
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $url=$endPoint."/merchants/".$idComerciante."/outlines/".$_POST["esquema"];
        $curlController=new CurlController($url);
        $header = array(
            'Authorization: '.'Bearer '. $token
        );
        $curlController->setdatosCabezera($header);
        $respuesta=$curlController->ejecutarPeticion("get",false);
        // $respuesta["response"]->tiers->model->mandatory_types
        $respuesta_servidor["respuestaServidor"]=[
            "model"=> [
                "mandatory_types" =>$respuesta["response"]->tiers->model->mandatory_types,
                "optional_types" =>$respuesta["response"]->tiers->model->optional_types
            ],
            "config"=> [
                "mandatory_types" =>$respuesta["response"]->tiers->config->mandatory_types,
                "optional_types" =>$respuesta["response"]->tiers->config->optional_types
            ],
            "simple"=> [
                "mandatory_types" =>$respuesta["response"]->tiers->simple->mandatory_types,
                "optional_types" =>$respuesta["response"]->tiers->simple->optional_types
            ]
        ];
        $respuesta_servidor["codigo_respuesta"]=$respuesta["estado"];
        print(json_encode($respuesta_servidor));
    }
    
}





?>