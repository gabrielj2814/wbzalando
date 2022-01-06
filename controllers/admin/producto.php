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
                $variablesSmarty["categoriasProductos"]=$this->consultarCategoriasPrestashop();
                $variablesSmarty["productos"]=$this->consultarProductoPrestashop();
                // print_r($variablesSmarty["categoriasProductos"]);
                $variablesSmarty["productos"]=$this->generarUrlProducto($variablesSmarty["productos"]);
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

    public function consultarProductoPrestashop(){
        return Db::getInstance()->executeS("SELECT ps_product_lang.name,ps_product.id_product,ps_product.ean13 FROM ps_product_lang,ps_product,ps_lang WHERE ps_product_lang.id_lang=2 AND ps_product_lang.id_lang=ps_lang.id_lang AND ps_product_lang.id_product=ps_product.id_product;");
    }
    
    public function consultarCategoriasPrestashop(){
        return Db::getInstance()->executeS("SELECT ps_category.id_category,ps_category_lang.name  FROM ps_category,ps_category_lang,ps_lang WHERE ps_category_lang.id_lang=2 AND ps_category_lang.id_category=ps_category.id_category AND ps_category_lang.id_lang=ps_lang.id_lang");
    }

    public function consultarProductoConFiltrosPrestashop($categoria){

    }

    private function generarUrlProducto($arrayProductos){
        $lista=[];
        foreach($arrayProductos as $producto){
            $id_image = Product::getCover((int)$producto["id_product"]);
            if (sizeof($id_image) > 0) {
                $image = new Image($id_image['id_image']);
                $image_url = _PS_BASE_URL_._THEME_PROD_DIR_.$image->getExistingImgPath().".jpg";
            }
            $producto["urlImagen"]=$image_url;
            $lista[]=$producto;
        }
        return $lista;
        // print_r($lista);
    }

    public function ajaxProcessMensaje(){
        echo json_encode("hola mundo");
    }
    

}




?>