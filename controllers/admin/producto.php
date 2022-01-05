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
        $linkDeControlador=$this->context->link->getAdminLink("Producto");
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador
        ];
        // $context=ContextCore::getContext();
        // $vista=ToolsCore::getValue("vista");
        if(array_key_exists("vista",$_GET)){
            if($_GET["vista"]==="formulario"){
                $variablesSmarty["productos"]=$this->consultarProductoPrestashop();
                // print_r($variablesSmarty["productos"]);
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
    

}




?>