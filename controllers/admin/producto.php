<?php
include("curlController.php");
include("logger.php");
use Clases\CurlController;
use PrestaShop\PrestaShop\Adapter\Entity\Module as EntityModule;

class ProductoController extends ModuleAdminController{

    private $id_idioma;
    private $nombreTabla;
    private $modulo;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = true;
        $this->id_idioma = $this->context->language->id;
        $this->nombreTabla="ps_wbzalando_esquemas"; 
        $this->modulo= EntityModule::getInstanceByName("wbzalando");
        $this->name = 'wbzalando';
        $this->context = Context::getContext();
    }

    public function init()
    {
        parent::init();
    }

    public function initContent(){
        // aqui se inicializa el controlador
        parent::initContent();
        $this->borrarImagenesBasuraReciduos();
        $esquemasDB=$this->chequearEsquemasDeHoyDB();
        if(count($esquemasDB)===0){
            $datosEsquemas=$this->consultarEsquemasDeProducto();
            if(count($datosEsquemas["esquemas_name_label"])>0){
                $respuestaResgistro=$this->registrarEsquemasDB($datosEsquemas);
            }
        }
        // generamos los links de los controladores 
        $linkDeControlador=$this->context->link->getAdminLink("Producto",true);
        $linkDeControladorTalla=$this->context->link->getAdminLink("Talla",true);
        $linkDeControladorCategoria=$this->context->link->getAdminLink("Categoria",true);
        $linkDeControladorColor=$this->context->link->getAdminLink("Color",true);
        $linkDeControladorGaleria=$this->context->link->getAdminLink("Galeria",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador,
            "linkDeControladorColor" => $linkDeControladorColor,
            "linkDeControladorCategoria" => $linkDeControladorCategoria,
            "linkDeControladorTalla" => $linkDeControladorTalla,
            "linkDeControladorGaleria" => $linkDeControladorGaleria
        ];
        // cargar mos marcas y categorias
        $variablesSmarty["categoriasProductos"]=$this->validarRespuestaBD($this->consultarCategoriasPrestashop());
        $variablesSmarty["marcasProductos"]=$this->validarRespuestaBD($this->consultarMarcasPrestashop());
        // asignamos las varibles que vamos a enviar
        $this->context->smarty->assign($variablesSmarty);
        // cargar plantilla
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
        ps_category.id_parent,
        ps_category_lang.name 
        FROM
        ps_category,
        ps_category_lang,
        ps_lang 
        WHERE 
        -- ps_category.id_parent<>0 AND 
        ps_category_lang.id_lang=".$this->id_idioma." AND 
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
        // en esta funcion se consulta los productos filtrado 
        // pero esta se divide en dos
        //  en una se se consulta por lo que seleccionaste en los filtros
        // pero tambien se puede filtrar por los productos que el usuario a seleccionado e
        $SQL1="";
        $SQL2="";
        $productos=[];
        $fracmetoConsulta=[];
        if(array_key_exists("categoriaProducto",$_POST)){
            if(count($_POST["categoriaProducto"])>0){
                $textoSQLCategoria="";
                $fracmentoCategoria=[];
                if(count($_POST["categoriaProducto"])>1){
                    foreach($_POST["categoriaProducto"] as $categoria){
                        $fracmentoCategoria[]="ps_category_product.id_category=".$categoria;
                    }
                    $textoSQLCategoria=" ( ".join(" OR ",$fracmentoCategoria)." ) ";
                }
                else{
                    $textoSQLCategoria=" ( "."ps_category_product.id_category=".$_POST["categoriaProducto"][0]." ) ";
                }
                $fracmetoConsulta[]=$textoSQLCategoria;
                // $fracmetoConsulta[]="ps_category_product.id_category=".$_POST["categoriaProducto"];
            }
        }
        // if($_POST["marcaProducto"]!="null"){
        //     $fracmetoConsulta[]="ps_product.id_manufacturer=".$_POST["marcaProducto"];
        // }
        if(array_key_exists("marcaProducto",$_POST)){
            if(count($_POST["marcaProducto"])>0){
                $textoSQLMarca="";
                $fracmentoMarca=[];
                if(count($_POST["marcaProducto"])>1){
                    foreach($_POST["marcaProducto"] as $marca){
                        $fracmentoMarca[]="ps_product.id_manufacturer=".$marca;
                    }
                    $textoSQLMarca=" ( ".join(" OR ",$fracmentoMarca)." ) ";
                }
                else{
                    $textoSQLMarca=" ( "."ps_product.id_manufacturer=".$_POST["marcaProducto"][0]." ) ";
                }
                $fracmetoConsulta[]=$textoSQLMarca;
                // $fracmetoConsulta[]="ps_product.id_manufacturer=".$_POST["marcaProducto"];
            }
        }
        
        if(array_key_exists("nombreProducto",$_POST)){
            if($_POST["nombreProducto"]!=""){
                $fracmetoConsulta[]="ps_product_lang.name LIKE '%".$_POST["nombreProducto"]."%'";
            }
        }
        $condicion="";
        if(count($fracmetoConsulta)>1){
            $condicion=join(" AND ",$fracmetoConsulta)." AND ";
        }
        else if(count($fracmetoConsulta)===1){
            $condicion= "(".$fracmetoConsulta[0].") AND ";
        }
        $minimoRegistros=$_POST["minimo"];
        $pagina=$_POST["pagina"];
        $empezarPor=($pagina-1) * $minimoRegistros;
        if(array_key_exists("productosSeleccionados",$_POST)){
            $textoSQLProducto="";
            if(count($_POST["productosSeleccionados"])>0){
                $fracmentoProducto=[];
                if(count($_POST["productosSeleccionados"])>1){
                    foreach($_POST["productosSeleccionados"] as $id_producto){
                        $fracmentoProducto[]="ps_product.id_product=".$id_producto;
                    }
                    $textoSQLProducto=" ( ".join(" OR ",$fracmentoProducto)." ) ";
                }
                else{
                    $textoSQLProducto=" ( "."ps_product.id_product=".$_POST["productosSeleccionados"][0]." ) ";
                }
            }

            $SQL1="
                SELECT 
                ps_product_lang.name,
                ps_product_lang.description,
                ps_product.id_product,
                ps_product.ean13,
                ps_product.price,
                ps_lang.iso_code
                FROM ps_product_lang,ps_product,ps_lang
                WHERE
                ".$textoSQLProducto." AND
                ps_product_lang.id_lang=".$this->id_idioma." AND
                ps_product_lang.id_lang=ps_lang.id_lang AND
                ps_product_lang.id_product=ps_product.id_product LIMIT ".$empezarPor.",".$minimoRegistros."";

                $SQL2="
                SELECT 
                ps_product_lang.name,
                ps_product_lang.description,
                ps_product.id_product,
                ps_product.ean13,
                ps_product.price,
                ps_lang.iso_code
                FROM ps_product_lang,ps_product,ps_lang
                WHERE
                ".$textoSQLProducto." AND
                ps_product_lang.id_lang=".$this->id_idioma." AND
                ps_product_lang.id_lang=ps_lang.id_lang AND
                ps_product_lang.id_product=ps_product.id_product";
        }
        else{
            if(array_key_exists("categoriaProducto",$_POST)){
            
                $SQL1="
                SELECT 
                ps_product_lang.name,
                ps_product_lang.description,
                ps_product.id_product,
                ps_product.ean13,
                ps_product.price,
                ps_lang.iso_code
                FROM 
                ps_category_product,ps_product_lang,ps_product,ps_lang
                WHERE
                ".$condicion."
                ps_product_lang.id_lang=".$this->id_idioma." AND
                ps_product.id_product=ps_category_product.id_product AND
                ps_product_lang.id_lang=ps_lang.id_lang AND
                ps_product_lang.id_product=ps_product.id_product LIMIT ".$empezarPor.",".$minimoRegistros."
                ";

                $SQL2="
                SELECT 
                ps_product_lang.name,
                ps_product_lang.description,
                ps_product.id_product,
                ps_product.ean13,
                ps_product.price,
                ps_lang.iso_code
                FROM 
                ps_category_product,ps_product_lang,ps_product,ps_lang
                WHERE
                ".$condicion."
                ps_product_lang.id_lang=".$this->id_idioma." AND
                ps_product.id_product=ps_category_product.id_product AND
                ps_product_lang.id_lang=ps_lang.id_lang AND
                ps_product_lang.id_product=ps_product.id_product";
            }
            else{
                
                $SQL1="
                SELECT 
                ps_product_lang.name,
                ps_product_lang.description,
                ps_product.id_product,
                ps_product.ean13,
                ps_product.price,
                ps_lang.iso_code
                FROM ps_product_lang,ps_product,ps_lang
                WHERE
                ".$condicion."
                ps_product_lang.id_lang=".$this->id_idioma." AND
                ps_product_lang.id_lang=ps_lang.id_lang AND
                ps_product_lang.id_product=ps_product.id_product LIMIT ".$empezarPor.",".$minimoRegistros."";

                $SQL2="
                SELECT 
                ps_product_lang.name,
                ps_product_lang.description,
                ps_product.id_product,
                ps_product.ean13,
                ps_product.price,
                ps_lang.iso_code
                FROM ps_product_lang,ps_product,ps_lang
                WHERE
                ".$condicion."
                ps_product_lang.id_lang=".$this->id_idioma." AND
                ps_product_lang.id_lang=ps_lang.id_lang AND
                ps_product_lang.id_product=ps_product.id_product";
                
            }
        }

        $productos=Db::getInstance()->executeS($SQL2);
        $productos=$this->generarUrlProducto($productos);
        $productosPaginados=Db::getInstance()->executeS($SQL1);
        $productosPaginados=$this->generarUrlProducto($productosPaginados);
        $contador=0;
        foreach($productosPaginados as $producto){
            $productosPaginados[$contador]["atributos_producto"]=$this->consultarEansProductosCombinacion($productosPaginados[$contador]["id_product"]);
            $contador++;
        }
        $contador2=0;
        foreach($productosPaginados as $producto){
            $buscar=["'","<p>","</p>","<\/p>","<br \/>"];
            $remplazar=[""];
            $speceText=str_replace($buscar,$remplazar,$productosPaginados[$contador2]["description"]);
            $productosPaginados[$contador2]["description"]=$speceText;
            $productosPaginados[$contador2]["traduccionesProducto"]=$this->consultarTraduccionesProducto($productosPaginados[$contador2]["id_product"]);
            $contador2++;
        }
        $contador3=0;
        foreach($productos as $producto){
            $buscar=["'","<p>","</p>","<\/p>","<br \/>"];
            $remplazar=[""];
            $speceText=str_replace($buscar,$remplazar,$productos[$contador3]["description"]);
            $productos[$contador3]["description"]=$speceText;
            $productos[$contador3]["traduccionesProducto"]=$this->consultarTraduccionesProducto($productos[$contador3]["id_product"]);
            $contador3++;
        }
        print(json_encode([
            "todosLosProductos" =>  $this->borrarProductosDuplicados($productos),
            "productosPaginados" =>  $productosPaginados,
            "totalDePagina" =>  ceil(count($productos)/$minimoRegistros),
            "totalRegistros" =>  count($productos),
        ]));
    }

    function borrarProductosDuplicados($productos){
        $productosHaRecorrer=$productos;
        $productosFinal=$productos;
        $listaDePosicionesHaEliminar=[];
        foreach($productosHaRecorrer as $productoHaRecorrer){
            $listaDePosicionesHaEliminar=[];
            foreach($productosFinal as $key => $productoFinal){
                if($productoHaRecorrer["id_product"]===$productoFinal["id_product"]){
                    $listaDePosicionesHaEliminar[]=$key;
                }
            }
            if(count($listaDePosicionesHaEliminar)>1){
                foreach($listaDePosicionesHaEliminar as $listaDePosicioneHaEliminar){
                    unset($productosFinal[$listaDePosicioneHaEliminar]);
                    $productosFinal=array_values($productosFinal);
                }
            }

        }
        return $productosFinal;
    }
    

    function consultarTraduccionesProducto($idProducto){
        $SQL="
        SELECT 
        ps_product_lang.name,
        ps_product_lang.description,
        ps_lang.iso_code
        FROM ps_product_lang,ps_lang
        WHERE
        ps_product_lang.id_product=$idProducto AND
        ps_product_lang.id_lang=ps_lang.id_lang";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    public function consultarEansProductosCombinacion($idProducto){
        $SQL="SELECT id_attribute,ean13 FROM
        ps_product_attribute,
        ps_product_attribute_combination
        WHERE 
        ps_product_attribute.id_product=".$idProducto." AND
        ps_product_attribute.ean13<>'' AND
        ps_product_attribute_combination.id_product_attribute=ps_product_attribute.id_product_attribute";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
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
        // esta funcion se utiliza para enviar los datos a zalando pero tambien se utliliza para registrar los 
        // datos en la base de datos
        require_once(_PS_MODULE_DIR_.$this->name.'/libs/utilidades.php');
        $utilidades=new Utilidades();
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
            // re asignar tipos de datos a las propiedades
            if(array_key_exists("material.upper_material_clothing",$producto["producto"]["product_model"]["product_configs"][0])){
                $producto["producto"]["product_model"]["product_configs"][0]["product_config_attributes"]["material.upper_material_clothing"]["material_percentage"]=(float)$producto["producto"]["product_model"]["product_configs"][0]["product_config_attributes"]["material.upper_material_clothing"]["material_percentage"];
            }
            for($contador=0;$contador<count($producto["precio"]["product_prices"]);$contador++){
                $producto["precio"]["product_prices"][$contador]["regular_price"]["amount"]=(float)$producto["precio"]["product_prices"][$contador]["regular_price"]["amount"];
                if(array_key_exists("promotional_price",$producto["precio"]["product_prices"][$contador])){
                    $producto["precio"]["product_prices"][$contador]["promotional_price"]["amount"]=(float)$producto["precio"]["product_prices"][$contador]["promotional_price"]["amount"];
                    $producto["precio"]["product_prices"][$contador]["scheduled_prices"][0]["regular_price"]["amount"]=(float)$producto["precio"]["product_prices"][$contador]["scheduled_prices"][0]["regular_price"]["amount"];
                    $producto["precio"]["product_prices"][$contador]["scheduled_prices"][0]["promotional_price"]["amount"]=(float)$producto["precio"]["product_prices"][$contador]["scheduled_prices"][0]["promotional_price"]["amount"];
                    $producto["precio"]["product_prices"][$contador]["ignore_warnings"]=(bool)$producto["precio"]["product_prices"][$contador]["ignore_warnings"];
                }
            }
            for($contador2=0;$contador2<count($producto["stock"]["items"]);$contador2++){
                $producto["stock"]["items"][$contador2]["quantity"]=(int)$producto["stock"]["items"][$contador2]["quantity"];
            }
            for($contador3=0;$contador3<count($producto["producto"]["product_model"]["product_configs"][0]["product_config_attributes"]["media"]);$contador3++){
                $producto["producto"]["product_model"]["product_configs"][0]["product_config_attributes"]["media"][$contador3]["media_sort_key"]=(int)$producto["producto"]["product_model"]["product_configs"][0]["product_config_attributes"]["media"][$contador3]["media_sort_key"];
            }
            foreach($producto["producto"]["product_model"]["product_configs"][0]["product_config_attributes"]["description"] as $isoCode => $descripcion){
                $texto=$producto["producto"]["product_model"]["product_configs"][0]["product_config_attributes"]["description"][$isoCode];
                $producto["producto"]["product_model"]["product_configs"][0]["product_config_attributes"]["description"][$isoCode]=$utilidades->removerElementos($utilidades->utf8_ansi($texto));
            }
            $name=$producto["producto"]["product_model"]["product_model_attributes"]["name"];
            $producto["producto"]["product_model"]["product_model_attributes"]["name"]=$utilidades->removerElementos($utilidades->utf8_ansi($name));
            // ==============================================================
            // set datos para el envio
            $curlController->setDatosPeticion($producto["producto"]);
            $curlController->setdatosCabezera($header);
            // enviar producto
            if($producto["enviar"]==="true"){
                // si es true se envia este producto a zalando
                $respuesta=$curlController->ejecutarPeticion("post",true);
                error_log("respuesta de zalando al subir el producto =>>>>  " . var_export($estadoDeProductos, true));
                $estadoDeProductos["productos_enviados"][]=[
                    "respuestaServidor" => $respuesta,
                    "estatuRespuestaApi" => $respuesta["estado"],
                    "envio"=> true
                ];
                // $estadoDeProductos["productos_enviados"][]=[
                //     "modeloProducto" => $producto["producto"]["product_model"]["merchant_product_model_id"],
                //     "respuestaServidor" => true,
                //     "estatuRespuestaApi" => true
                // ];
            }
            // se destructurar producto para luego guardarlo 
            $producto=$this->destructurarModeloDeProductoZalando($producto); 
            $respuestaModelo=$this->guardarModeloProducto($producto);
            $respuestaConfig=$this->guardarConfigProducto($producto);
            $respuestaSimple=$this->guardarSimpleProducto($producto);
            $respuestaPrecio=$this->guardarPrecioProducto($producto);
            $respuestaStock=$this->guardarStockProducto($producto);

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
                $product_precio=["product_prices" => []];
                $product_precio["product_prices"][]=$precio;
                $curlController->setDatosPeticion($product_precio);
                $curlController->setdatosCabezera($header);
                $respuesta=$curlController->ejecutarPeticion("post",true);
                error_log("respuesta de zalando al subir el precio =>>>>  " . var_export($respuesta, true));
                $respuestasSubidaPrecio[]=$respuesta["response"]->results[0];
            }
            else{
                $respuestasSubidaPrecio[$precio["ean"]]=false;
            }
        }
        return $respuestasSubidaPrecio;
    }

    public function guardarModeloProducto($producto){
        require_once(_PS_MODULE_DIR_.$this->name.'/libs/utilidades.php');
        $utilidades=new Utilidades();
        $SQL="
            INSERT INTO ps_wbzalando_modelo_producto(
                id_modelo_producto, 
                outline, 
                sales_channel_id, 
                nombre_imagen, 
                live_producto,
                json_modelo_producto
                ) 
            VALUES (
                '".$producto["merchant_product_model_id"]."',
                '".$producto["outline"]."',
                '".$producto["id_pais"]."',
                '-',
                '0',
                '".$utilidades->removerElementos($utilidades->utf8_ansi(json_encode($producto["product_model"])))."'
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
        require_once(_PS_MODULE_DIR_.$this->name.'/libs/utilidades.php');
        $utilidades=new Utilidades();
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
                    '".$utilidades->removerElementos($utilidades->utf8_ansi(json_encode($configuracionProducto["datos_product_configs"])))."'
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
                ean,
                json_simple_producto
                    ) 
                VALUES (
                    '". $simpleProducto["datos_product_simples"]["merchant_product_simple_id"]."',
                    '". $simpleProducto["merchant_product_config_id"]."',
                    '". $simpleProducto["datos_product_simples"]["product_simple_attributes"]["ean"]."',
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

    public function destructurarModeloDeProductoZalando($modeloProducto){
        // en esta funcion se desglosa el modelo de producto para acceder a los datod de forma mas comoda
        $merchant_product_model_id=null;
        $datosProducto=[
            "outline"=> null,
            "id_pais"=> null,
            "merchant_product_model_id"=> null,
            "product_model" => [],
            "product_configs" => [],
            "product_simples" => [],
            "precios" => [],
            "stocks" => []
        ];
        $datosProducto["id_pais"]=$modeloProducto["idPais"];
        $merchant_product_model_id=$modeloProducto["producto"]["product_model"]["merchant_product_model_id"];
        $datosProducto["outline"]=$modeloProducto["producto"]["outline"];
        $datosProducto["merchant_product_model_id"]=$modeloProducto["producto"]["product_model"]["merchant_product_model_id"];
        $datosProducto["product_model"]["merchant_product_model_id"]=$modeloProducto["producto"]["product_model"]["merchant_product_model_id"];
        $datosProducto["product_model"]["product_model_attributes"]=$modeloProducto["producto"]["product_model"]["product_model_attributes"];
        $datosProducto["precios"]=$modeloProducto["precio"]["product_prices"];
        $datosProducto["stocks"]=$modeloProducto["stock"]["items"];
        foreach($modeloProducto["producto"]["product_model"]["product_configs"] as $datosModeloProductoNivel3){
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
        $respuestaDB=$this->consultarModeloProducto();
        if(count($respuestaDB)>0){
            for($contador=0;$contador<count($respuestaDB);$contador++){
                $respuestaDB[$contador]["config"]=$this->consultarConfigProducto($respuestaDB[$contador]["id_modelo_producto"]);
                for($contador2=0;$contador2<count($respuestaDB[$contador]["config"]);$contador2++){
                    $respuestaDB[$contador]["config"][$contador2]["simple"]=$this->consultarSimpleProducto($respuestaDB[$contador]["config"][$contador2]["id_configuracion_producto"]);
                    for($contador3=0;$contador3<count($respuestaDB[$contador]["config"]);$contador3++){
                        $json=json_decode($respuestaDB[$contador]["config"][$contador2]["simple"][$contador3]["json_simple_producto"]);
                        $respuestaDB[$contador]["config"][$contador2]["stock"]=$this->consultarStock($json->product_simple_attributes->ean);
                        $respuestaDB[$contador]["config"][$contador2]["precio"]=$this->consultarPrecio($json->product_simple_attributes->ean);
                    }
                }
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

    function consultarModeloProducto(){
        $SQL="SELECT * FROM ps_wbzalando_modelo_producto";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    function consultarConfigProducto($idModelo){
        $SQL="SELECT * FROM ps_wbzalando_configuracion_producto WHERE id_modelo_producto='".$idModelo."';";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    function consultarSimpleProducto($idConfig){
        $SQL="SELECT * FROM ps_wbzalando_simple_producto WHERE id_configuracion_producto='".$idConfig."';";
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

    public function ajaxProcessPostSubirImagen(){
        $respuesta_servidor=["respuestaServidor" => []];
        if(array_key_exists("imagenProducto",$_FILES)){
            if($_FILES["imagenProducto"]["type"] == "image/jpeg" || $_FILES["imagenProducto"]["type"] == "image/jpg"){
                $dir=_PS_MODULE_DIR_.$this->modulo->name."/tmp/";
                $_FILES["imagenProducto"]["name"]=date("Y-m-d")."_".$_POST["NombreImagenTmp"].".".$_POST["extencion"];
                // move_uploaded_file($_FILES["imagenProducto"]["tmp_name"],$dir.$_FILES["imagenProducto"]["name"]);
                if(move_uploaded_file($_FILES["imagenProducto"]["tmp_name"],$dir.$_FILES["imagenProducto"]["name"])){
                    $respuesta_servidor["respuestaServidor"]=[
                        "estado" => true,
                        "NombreImagenTmp" => $_FILES["imagenProducto"]["name"],
                        "urlFull" => $dir.$_FILES["imagenProducto"]["name"]
                    ];
                }
            }
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "estado" => false
            ];
        }
        print(json_encode($respuesta_servidor));
        
    }

    public function copiarImagen($nombreImagen){
        return rename(_PS_MODULE_DIR_.$this->modulo->name."/tmp/".$nombreImagen,_PS_MODULE_DIR_.$this->modulo->name."/upload/".$nombreImagen);
    }

    
    public function borrarImagenesBasura($listaDeImagenes){
        $dir=_PS_MODULE_DIR_.$this->modulo->name."/tmp/";
        $totalDeArchivosEliminados=0;
        foreach($listaDeImagenes as $imagen){
            if(file_exists($dir.$imagen)){
                unlink($dir.$imagen);
            }
        }
    }

    public function borrarImagenesBasuraReciduos(){
        $totalDeArchivosEliminados=0;
        $dir=_PS_MODULE_DIR_.$this->modulo->name."/tmp/";
        $archivos=scandir($dir);
        foreach($archivos as $archivo){
            if($dir.$archivo!==$dir.".gitkeep"){
                if(is_file($dir.$archivo)){
                    $fechaHoy=strtotime(date("y-m-d"));
                    $fechaImagen=strtotime(date(explode("_",$archivo)[0]));
                    if($fechaHoy!==$fechaImagen){
                        if(unlink($dir.$archivo)){
                            $totalDeArchivosEliminados++;
                        }
                    }
                }
            }
        }
    }

    //==============
    //==============
    //==============
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

}

?>