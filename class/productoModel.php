<?php


namespace zalando\modelos;

use PrestaShop\PrestaShop\Adapter\Entity\Db;

class ProductoModel {


    public function consultarProductosPrestashop(){
        return Db::getInstance()->executeS("SELECT * FROM ps_product_lang,ps_product,ps_lang WHERE ps_product_lang.id_lang=2 AND ps_product_lang.id_lang=ps_lang.id_lang AND ps_product_lang.id_product=ps_product.id_product;");
    }



}


?>