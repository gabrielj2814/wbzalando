<?php
// este archivo se utiliza para hacer todo lo relacionado 
// con la instalción y desintalación de las variables de configuracion 
// , tablas y creación del sub menu
if (!class_exists("SetupWbZalando")) {
    class SetupWbZalando{

        public static function crearVariablesDeConfiguracion(){
            return (
            Configuration::updateValue("WB_ZALANDO_ID_TALLA_PS","NULL") && 
            Configuration::updateValue("WB_ZALANDO_END_POINT","Sin ruta de acceso") && 
            Configuration::updateValue("WB_ZALANDO_ID_COMERCIANTE","NULL") && 
            Configuration::updateValue("WB_ZALANDO_CLIENTE_ID","Sin cliente id") && 
            Configuration::updateValue("WB_ZALANDO_CLIENTE_SECRET","Sin cliente secret") && 
            Configuration::updateValue("WB_ZALANDO_TOKEN_ACCESO","Sin token") );
        }
        
        public static function eliminarVariablesDeConfiguracion (){
            return (
            Configuration::deleteByName("WB_ZALANDO_ID_TALLA_PS","NULL") && 
            Configuration::deleteByName("WB_ZALANDO_END_POINT","Sin ruta de acceso") && 
            Configuration::deleteByName("WB_ZALANDO_ID_COMERCIANTE","NULL") && 
            Configuration::deleteByName("WB_ZALANDO_CLIENTE_ID","Sin cliente id") && 
            Configuration::deleteByName("WB_ZALANDO_CLIENTE_SECRET","Sin cliente secret") && 
            Configuration::deleteByName("WB_ZALANDO_TOKEN_ACCESO","Sin token") );
        }

        public static function getTabSubMenu(){
            return [
                "nombre" => "Zalando",
                "nombreControladorFull" => "AdminzalandoController",
                "nombreControlador" => "Adminzalando",
            ];
        }


        public static function getTabs(){
            return [
                [
                    "nombre" => "Envio de productos",
                    "nombreControladorFull" => "ProductoController",
                    "nombreControlador" => "Producto",
                ],
                [
                    "nombre" => "Galeria",
                    "nombreControladorFull" => "GaleriaController",
                    "nombreControlador" => "Galeria",
                ],
                // [
                //     "nombre" => "Modificar productos",
                //     "nombreControladorFull" => "ModificarproductoController",
                //     "nombreControlador" => "Modificarproducto",
                // ],
                [
                    "nombre" => "Estatus de pedidos",
                    "nombreControladorFull" => "PedidoController",
                    "nombreControlador" => "Pedido",
                ],
                [
                    "nombre" => "Gestión color",
                    "nombreControladorFull" => "ColorController",
                    "nombreControlador" => "Color",
                ],
                [
                    "nombre" => "Gestión talla",
                    "nombreControladorFull" => "TallaController",
                    "nombreControlador" => "Talla",
                ],
                [
                    "nombre" => "Atributo Talla",
                    "nombreControladorFull" => "AtributotallaController",
                    "nombreControlador" => "Atributotalla",
                ],
                [
                    "nombre" => "Gestión categorias",
                    "nombreControladorFull" => "CategoriaController",
                    "nombreControlador" => "categoria",
                ],
                [
                    "nombre" => "Modificar productos",
                    "nombreControladorFull" => "ModificarController",
                    "nombreControlador" => "Modificar",
                ],
                // [
                //     "nombre" => "Precios & Stock en espera",
                //     "nombreControladorFull" => "PendienteController",
                //     "nombreControlador" => "Pendiente",
                // ],
            ];
        }

        public static function instalarTabs(){
            $tagSubMenu=self::getTabSubMenu();
            $lang = Language::getLanguages(); 
            $tab1 = new Tab();
            $tab1->class_name = $tagSubMenu["nombreControlador"];
            $tab1->module = 'wbzalando';
            $tab1->id_parent = (int) Tab::getIdFromClassName('CONFIGURE'); 
            foreach ($lang as $l) {
                $tab1->name[$l['id_lang']] = Context::getContext()->getTranslator()->trans($tagSubMenu["nombre"],[],"Modules.Adminzalando.Admin"); 
            }
            if ($tab1->save()) {
    
                $id_parent = $tab1->id;
                # insert icon for tab
                Db::getInstance()->execute(' UPDATE `'._DB_PREFIX_.'tab` SET `icon` = "tab" WHERE `id_tab` = "'.(int)$tab1->id.'"');
    
                foreach (self::getTabs() as $tab) {
                    $tab1 = new Tab();
                    $tab1->class_name = $tab['nombreControlador'];
                    $tab1->id_parent = $id_parent;
                    $tab1->module = 'wbzalando';
                    foreach (Language::getLanguages() as $l) {
                        $tab1->name[$l['id_lang']] = Context::getContext()->getTranslator()->trans($tab["nombre"],[],"Modules.Adminzalando.Admin");
                    }
                    $tab1->save();
                }
                return true;
            }
            else{
                return false;
            }
        }
        
        public static function desintalarTabs(){
            $estado=true;
            $tagSubMenu=self::getTabSubMenu();
            $id = Tab::getIdFromClassName($tagSubMenu["nombreControladorFull"]);
            if ($id) {
                $tab = new Tab($id);
                $tab->delete();
            }
            foreach(self::getTabs() as $controlado){
                $tabId = (int) Tab::getIdFromClassName($controlado["nombreControladorFull"]); 
                if (!$tabId) {
                    return true;
                    break;
                }

                $tab = new Tab($tabId);
                if(!$tab->delete()){
                    $estado=false;
                    break;
                }
            }

            return $estado;
        }

        public static function crearTablas($prefijoTabla){
            $tablas=[
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_asociacion_categoria(
                    id_categoria_asociacion int(11) NOT NULL AUTO_INCREMENT,
                    id_category INTEGER NOT NULL,
                    outline VARCHAR(150) NOT NULL,
                    outline_name VARCHAR(150) NOT NULL,
                    modelo LONGTEXT NOT NULL,
                    PRIMARY KEY (`id_categoria_asociacion`)
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
                
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_propiedad_modelo(
                    id_propiedad_modelo int(11) NOT NULL AUTO_INCREMENT,
                    nombre_propiedad VARCHAR(150) NOT NULL,
                    tipo_de_dato_propiedad_modelo VARCHAR(150) NOT NULL,
                    PRIMARY KEY (`id_propiedad_modelo`)
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
                
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_datos_propiedad(
                    id_datos_propiedad int(11) NOT NULL AUTO_INCREMENT,
                    id_propiedad_modelo int(11) NOT NULL,
                    json_datos_propiedad LONGTEXT NOT NULL,
                    traduccion_es VARCHAR(350) NULL,
                    PRIMARY KEY (`id_datos_propiedad`),
                    CONSTRAINT `FK_id_propiedad_modelo` FOREIGN KEY (id_propiedad_modelo) REFERENCES '.$prefijoTabla.'_propiedad_modelo(id_propiedad_modelo) ON UPDATE CASCADE ON DELETE CASCADE
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
    
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_atributo_talla(
                    id_atributo_talla int(11) NOT NULL AUTO_INCREMENT,
                    id_attribute INTEGER NOT NULL,
                    PRIMARY KEY (`id_atributo_talla`)
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
    
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_asociacion_talla(
                    id_talla_asociacion int(11) NOT NULL AUTO_INCREMENT,
                    id_attribute INTEGER NOT NULL,
                    codigo_size_group VARCHAR(20) NOT NULL,
                    codigo_pais VARCHAR(4) NOT NULL,
                    talla_zalando VARCHAR(10) NOT NULL,
                    PRIMARY KEY (`id_talla_asociacion`)
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
                
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_asociacion_color(
                    id_color_asociacion int(11) NOT NULL AUTO_INCREMENT,
                    id_attribute INTEGER NOT NULL,
                    codigo_color VARCHAR(20) NOT NULL,
                    codigo_pais VARCHAR(4) NOT NULL,
                    color_zalando VARCHAR(150) NOT NULL,
                    PRIMARY KEY (`id_color_asociacion`)
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
    
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_esquemas(
                    id int(11) NOT NULL AUTO_INCREMENT,
                    fecha_registro date NOT NULL,
                    esquemas_name_label LONGTEXT NOT NULL,
                    esquemas_full LONGTEXT NOT NULL,
                    PRIMARY KEY (`id`)
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',

                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_imagen_producto(
                    id_imagen int(11) NOT NULL AUTO_INCREMENT,
                    nombre_id VARCHAR(250) NOT NULL,
                    extencion_imagen VARCHAR(250) NOT NULL,
                    url_imagen VARCHAR(3000) NOT NULL,
                    fecha_subida DATE NOT NULL,
                    PRIMARY KEY (`id_imagen`)
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
    
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_modelo_producto(
                    id_modelo_producto VARCHAR(150) NOT NULL,
                    outline VARCHAR(150) NOT NULL,
                    sales_channel_id VARCHAR(150) NOT NULL,
                    nombre_imagen VARCHAR(150) NOT NULL,
                    live_producto VARCHAR(1) NOT NULL,
                    json_modelo_producto LONGTEXT NOT NULL,
                    PRIMARY KEY (`id_modelo_producto`)
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
    
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_configuracion_producto(
                    id_configuracion_producto VARCHAR(150) NOT NULL,
                    id_modelo_producto VARCHAR(150) NOT NULL,
                    json_configuracion_producto LONGTEXT NOT NULL,
                    PRIMARY KEY (`id_configuracion_producto`),
                    CONSTRAINT `FK_id_modelo_producto` FOREIGN KEY (id_modelo_producto) REFERENCES '.$prefijoTabla.'_modelo_producto(id_modelo_producto) ON UPDATE CASCADE ON DELETE CASCADE
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
    
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_simple_producto(
                    id_simple_producto VARCHAR(150) NOT NULL,
                    id_configuracion_producto VARCHAR(150) NOT NULL,
                    ean VARCHAR(150) NOT NULL,
                    json_simple_producto LONGTEXT NOT NULL,
                    PRIMARY KEY (`id_simple_producto`),
                    CONSTRAINT `FK_id_configuracion_producto` FOREIGN KEY (id_configuracion_producto) REFERENCES '.$prefijoTabla.'_configuracion_producto(id_configuracion_producto) ON UPDATE CASCADE ON DELETE CASCADE
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
    
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_stock(
                    id_stock int(11) NOT NULL AUTO_INCREMENT,
                    ean VARCHAR(150) NOT NULL,
                    sales_channel_id VARCHAR(150) NOT NULL,
                    quantity int(11) NOT NULL,
                    PRIMARY KEY (`id_stock`)
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
    
                'CREATE TABLE IF NOT EXISTS '.$prefijoTabla.'_precio(
                    id_precio int(11) NOT NULL AUTO_INCREMENT,
                    ean VARCHAR(150) NOT NULL,
                    sales_channel_id VARCHAR(150) NOT NULL,
                    json_precio LONGTEXT NOT NULL,
                    PRIMARY KEY (`id_precio`)
                ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;'
            ];
            $estado=true;
            foreach($tablas as $tabla){
                if(!Db::getInstance()->execute($tabla)){
                    $estado=false;
                    break;
                }
            }
            return $estado;
        }

        public static function eliminarTablas($prefijoTabla){
            $tablas=[
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_stock',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_precio',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_simple_producto',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_configuracion_producto',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_modelo_producto',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_imagen_producto',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_asociacion_categoria',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_datos_propiedad',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_propiedad_modelo',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_atributo_talla',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_asociacion_talla',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_asociacion_color',
                'DROP TABLE IF EXISTS '.$prefijoTabla.'_esquemas'
            ];
            $estado=true;
            foreach($tablas as $tabla){
                if(!Db::getInstance()->execute($tabla)){
                    $estado=false;
                    break;
                }
            }
            return $estado;
        }

    }
}

?>