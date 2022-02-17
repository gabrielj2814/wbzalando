<?php
if (!class_exists("SetupWbZalando")) {
    class SetupWbZalando{

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
                    "nombre" => "Modificar productos",
                    "nombreControladorFull" => "ModificarproductoController",
                    "nombreControlador" => "Modificarproducto",
                ],
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
                    "nombre" => "Eliminar de productos",
                    "nombreControladorFull" => "EliminarController",
                    "nombreControlador" => "Eliminar",
                ],
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

    }
}

?>