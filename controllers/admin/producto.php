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
        ps_product.id_product=".$idProducto." AND
        ps_product_lang.id_lang=2 AND
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
        ps_product.id_manufacturer=".$idMarca." AND
        ps_product_lang.id_lang=2 AND
        ps_product_lang.id_lang=ps_lang.id_lang AND
        ps_product_lang.id_product=ps_product.id_product");
    }
    
    public function consultarProductosPorCategoria($idCategoria){
        return Db::getInstance()->executeS("
        SELECT 
        ps_product_lang.name,
        ps_product.id_product,
        ps_product.ean13
        FROM ps_category_product,ps_product_lang,ps_product,ps_lang
        WHERE
        ps_category_product.id_category=".$idCategoria." AND
        ps_product_lang.id_lang=2 AND
        ps_product.id_product=ps_category_product.id_product AND
        ps_product_lang.id_lang=ps_lang.id_lang AND
        ps_product_lang.id_product=ps_product.id_product");
    }
    
    public function consultarProductosPorCategoriaYMarca($idCategoria,$idMarca){
        return Db::getInstance()->executeS("
        SELECT 
        ps_product_lang.name,
        ps_product.id_product,
        ps_product.ean13
        FROM ps_category_product,ps_product_lang,ps_product,ps_lang
        WHERE
        ps_category_product.id_category=".$idCategoria." AND
        ps_product.id_manufacturer=".$idMarca." AND
        ps_product_lang.id_lang=2 AND
        ps_product.id_product=ps_category_product.id_product AND
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
        ps_product.id_product=".$idProducto." AND
        ps_product.id_manufacturer=".$idMarca." AND
        ps_product_lang.id_lang=2 AND
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
    }

    public function ajaxProcessGetConsultarProductoConFiltros(){
        $SQL="";
        $productos=[];
        // if($_POST["categoriaProducto"]!="null" AND $_POST["marcaProducto"]!="null"){
        //     $productos=$this->validarRespuestaBD($this->consultarProductosPorCategoriaYMarca($_POST["categoriaProducto"],$_POST["marcaProducto"]));
        //     $productos=$this->generarUrlProducto($productos);
        // }
        // else if($_POST["categoriaProducto"]!="null"){
        //     $productos=$this->validarRespuestaBD($this->consultarProductosPorCategoria($_POST["categoriaProducto"]));
        //     $productos=$this->generarUrlProducto($productos);
        // }
        // else if($_POST["marcaProducto"]!="null"){
        //     $productos=$this->validarRespuestaBD($this->consultarProductosPorMarca($_POST["marcaProducto"]));
        //     $productos=$this->generarUrlProducto($productos);
        // }
        // else{
        //     $productos=$this->validarRespuestaBD($this->consultarProductosPrestashop());
        //     $productos=$this->generarUrlProducto($productos);
        // }
        $fracmetoConsulta=[];
        if($_POST["categoriaProducto"]!="null"){
            $fracmetoConsulta[]="ps_category_product.id_category=".$_POST["categoriaProducto"];
        }
        if($_POST["marcaProducto"]!="null"){
            $fracmetoConsulta[]="ps_product.id_manufacturer=".$_POST["marcaProducto"];
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
            ps_product_lang.id_lang=2 AND
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
            ps_product_lang.id_lang=2 AND
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


}




?>