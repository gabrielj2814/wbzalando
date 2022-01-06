<?php
use PrestaShop\PrestaShop\Adapter\Entity\Context;

class ProductoController extends ModuleAdminController{

    private $productoModel;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = true;
        // $this->productoModel=new zalando\modelos\ProductoModel();
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
        // $context=ContextCore::getContext();
        // $vista=ToolsCore::getValue("vista");
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
        ps_product_lang.id_lang=2 AND
        ps_product_lang.id_lang=ps_lang.id_lang AND
        ps_product_lang.id_product=ps_product.id_product");
    }
    
    public function consultarProducto($idProducto){
        return Db::getInstance()->executeS("
        SELECT 
        ps_product_lang.name,
        ps_product.id_product,
        ps_product.ean13 
        FROM ps_product_lang,ps_product,ps_lang
        WHERE
        ps_product_lang.id_lang=2 AND
        ps_product.id_product=".$idProducto." AND
        ps_product_lang.id_lang=ps_lang.id_lang AND
        ps_product_lang.id_product=ps_product.id_product");
    }
    
    public function consultarProductosPorMarca($idMarca){
        return Db::getInstance()->executeS("
        SELECT 
        ps_product_lang.name,
        ps_product.id_product,
        ps_product.ean13
        FROM ps_product_lang,ps_product,ps_lang
        WHERE
        ps_product_lang.id_lang=2 AND
        ps_product.id_manufacturer=".$idMarca." AND
        ps_product_lang.id_lang=ps_lang.id_lang AND
        ps_product_lang.id_product=ps_product.id_product");
    }
    
    public function consultarProductoPorMarca($idProducto,$idMarca){
        return Db::getInstance()->executeS("
        SELECT 
        ps_product_lang.name,
        ps_product.id_product,
        ps_product.ean13
        FROM ps_product_lang,ps_product,ps_lang
        WHERE
        ps_product_lang.id_lang=2 AND
        ps_product.id_product=".$idProducto." AND
        ps_product.id_manufacturer=".$idMarca." AND
        ps_product_lang.id_lang=ps_lang.id_lang AND
        ps_product_lang.id_product=ps_product.id_product");
    }

    public function consultarCategoriasPrestashop(){
        return Db::getInstance()->executeS("SELECT ps_category.id_category,ps_category_lang.name  FROM ps_category,ps_category_lang,ps_lang WHERE ps_category_lang.id_lang=2 AND ps_category_lang.id_category=ps_category.id_category AND ps_category_lang.id_lang=ps_lang.id_lang");
    }
    
    public function consultarMarcasPrestashop(){
        return Db::getInstance()->executeS("SELECT ps_manufacturer.id_manufacturer,ps_manufacturer.name  FROM ps_manufacturer,ps_manufacturer_lang,ps_lang WHERE ps_manufacturer_lang.id_lang=2 AND ps_manufacturer_lang.id_manufacturer=ps_manufacturer.id_manufacturer AND ps_manufacturer_lang.id_lang=ps_lang.id_lang");
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
        // print_r($lista);
    }

    public function ajaxProcessGetConsultarProductoConFiltros(){
        $SQL="";
        $productos=[];
        if($_POST["categoriaProducto"]!="null" AND $_POST["marcaProducto"]!="null"){
            $SQL="SELECT * FROM ps_category_product WHERE ps_category_product.id_category=".$_POST["categoriaProducto"];
            $respuesta_1=$this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
            if(count($respuesta_1)>0){
                foreach($respuesta_1 as $categoria){
                    $respuesta_2=$this->validarRespuestaBD($this->consultarProductoPorMarca($categoria["id_product"],$_POST["marcaProducto"]));
                    if(count($respuesta_2)>0){
                        $productos[]=$respuesta_2[0];
                    }
                }
                $productos=$this->generarUrlProducto($productos);
            }
        }
        else if($_POST["categoriaProducto"]!="null"){
            $SQL="SELECT * FROM ps_category_product WHERE ps_category_product.id_category=".$_POST["categoriaProducto"];
            $respuesta_1=$this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
            if(count($respuesta_1)>0){
                foreach($respuesta_1 as $categoria){
                    $respuesta_2=$this->validarRespuestaBD($this->consultarProducto($categoria["id_product"]))[0];
                    $productos[]=$respuesta_2;
                }
                $productos=$this->generarUrlProducto($productos);
            }
        }
        else if($_POST["marcaProducto"]!="null"){
            $productos=$this->consultarProductosPorMarca($_POST["marcaProducto"]);
            $productos=$this->generarUrlProducto($productos);
        }
        else{
            $productos=$this->validarRespuestaBD($this->consultarProductosPrestashop());
            $productos=$this->generarUrlProducto($productos);
        }
        print(json_encode(["datos" => $productos]));
    }
    
    public function ajaxProcessGetConsultarProductos(){
        $listaDeProductos=$this->consultarProductosPrestashop();
        $listaDeProductos=$this->generarUrlProducto($listaDeProductos);
        print(json_encode(["datos" => $listaDeProductos]));
    }

}




?>