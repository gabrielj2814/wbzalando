<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

include_once("controllers/admin/curlController.php");
use Clases\CurlController;
class WbZalando extends Module{

    public function __construct(){
        $this->name = 'wbzalando';
        $this->version = '1.00.0';
        $this->author = 'wild branders';
        $this->displayName = $this->l('WB Zalando');
        $this->description = $this->l('WB Zalando');
        $this->controllers = array('default');
        $this->bootstrap = 1;
        $this->tablaModulo=_DB_PREFIX_."wbzalando";
        // ----- traducciones
        $this->todosLenguajes=Language::getLanguages();
        parent::__construct();
    }

    public function install(){
        
        return (
            parent::install() && 
            $this->installTab() && 
            $this->instalarTablas() && 
            $this->registerHook("displayBackOfficeHeader") && 
            Configuration::updateValue("WB_ZALANDO_ID_TALLA_PS","NULL") && 
            Configuration::updateValue("WB_ZALANDO_END_POINT","Sin ruta de acceso") && 
            Configuration::updateValue("WB_ZALANDO_ID_COMERCIANTE","NULL") && 
            Configuration::updateValue("WB_ZALANDO_CLIENTE_ID","Sin cliente id") && 
            Configuration::updateValue("WB_ZALANDO_CLIENTE_SECRET","Sin cliente secret") && 
            Configuration::updateValue("WB_ZALANDO_TOKEN_ACCESO","Sin token"));
    }

    public function uninstall(){
        return (
            parent::uninstall() && 
            $this->uninstallTab() && 
            $this->desintalarTablas() && 
            $this->unregisterHook("displayBackOfficeHeader") && 
            Configuration::deleteByName("WB_ZALANDO_ID_TALLA_PS")  && 
            Configuration::deleteByName("WB_ZALANDO_END_POINT")  && 
            Configuration::deleteByName("WB_ZALANDO_ID_COMERCIANTE")  && 
            Configuration::deleteByName("WB_ZALANDO_CLIENTE_ID")  && 
            Configuration::deleteByName("WB_ZALANDO_CLIENTE_SECRET")  && 
            Configuration::deleteByName("WB_ZALANDO_TOKEN_ACCESO"));
    }

    public function instalarTablas(){
        $tablas=[
            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_asociacion_categoria(
                id_categoria_asociacion int(11) NOT NULL AUTO_INCREMENT,
                id_category INTEGER NOT NULL,
                outline VARCHAR(150) NOT NULL,
                outline_name VARCHAR(150) NOT NULL,
                modelo JSON NOT NULL,
                PRIMARY KEY (`id_categoria_asociacion`)
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
            
            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_propiedad_modelo(
                id_propiedad_modelo int(11) NOT NULL AUTO_INCREMENT,
                nombre_propiedad VARCHAR(150) NOT NULL,
                tipo_de_dato_propiedad_modelo VARCHAR(150) NOT NULL,
                PRIMARY KEY (`id_propiedad_modelo`)
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
            
            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_datos_propiedad(
                id_datos_propiedad int(11) NOT NULL AUTO_INCREMENT,
                id_propiedad_modelo int(11) NOT NULL,
                json_datos_propiedad JSON NOT NULL,
                PRIMARY KEY (`id_datos_propiedad`),
                CONSTRAINT `FK_id_propiedad_modelo` FOREIGN KEY (id_propiedad_modelo) REFERENCES '.$this->tablaModulo.'_propiedad_modelo(id_propiedad_modelo) ON UPDATE CASCADE ON DELETE CASCADE
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',

            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_atributo_talla(
                id_atributo_talla int(11) NOT NULL AUTO_INCREMENT,
                id_attribute INTEGER NOT NULL,
                PRIMARY KEY (`id_atributo_talla`)
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',

            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_asociacion_talla(
                id_talla_asociacion int(11) NOT NULL AUTO_INCREMENT,
                id_attribute INTEGER NOT NULL,
                codigo_size_group VARCHAR(20) NOT NULL,
                codigo_pais VARCHAR(4) NOT NULL,
                talla_zalando VARCHAR(10) NOT NULL,
                PRIMARY KEY (`id_talla_asociacion`)
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',
            
            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_asociacion_color(
                id_color_asociacion int(11) NOT NULL AUTO_INCREMENT,
                id_attribute INTEGER NOT NULL,
                codigo_color VARCHAR(20) NOT NULL,
                codigo_pais VARCHAR(4) NOT NULL,
                color_zalando VARCHAR(150) NOT NULL,
                PRIMARY KEY (`id_color_asociacion`)
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',

            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_esquemas(
                id int(11) NOT NULL AUTO_INCREMENT,
                fecha_registro date NOT NULL,
                esquemas_name_label JSON NOT NULL,
                esquemas_full JSON NOT NULL,
                PRIMARY KEY (`id`)
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',

            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_modelo_producto(
                id_modelo_producto VARCHAR(150) NOT NULL,
                outline VARCHAR(150) NOT NULL,
                json_modelo_producto JSON NOT NULL,
                PRIMARY KEY (`id_modelo_producto`)
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',

            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_configuracion_producto(
                id_configuracion_producto VARCHAR(150) NOT NULL,
                id_modelo_producto VARCHAR(150) NOT NULL,
                json_configuracion_producto JSON NOT NULL,
                PRIMARY KEY (`id_configuracion_producto`),
                CONSTRAINT `FK_id_modelo_producto` FOREIGN KEY (id_modelo_producto) REFERENCES '.$this->tablaModulo.'_modelo_producto(id_modelo_producto) ON UPDATE CASCADE ON DELETE CASCADE
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',

            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_simple_producto(
                id_simple_producto VARCHAR(150) NOT NULL,
                id_configuracion_producto VARCHAR(150) NOT NULL,
                json_simple_producto JSON NOT NULL,
                PRIMARY KEY (`id_simple_producto`),
                CONSTRAINT `FK_id_configuracion_producto` FOREIGN KEY (id_configuracion_producto) REFERENCES '.$this->tablaModulo.'_configuracion_producto(id_configuracion_producto) ON UPDATE CASCADE ON DELETE CASCADE
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',

            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_stock(
                id_stock int(11) NOT NULL AUTO_INCREMENT,
                ean VARCHAR(150) NOT NULL,
                sales_channel_id VARCHAR(150) NOT NULL,
                quantity int(11) NOT NULL,
                PRIMARY KEY (`id_stock`)
            ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;',

            'CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_precio(
                id_precio int(11) NOT NULL AUTO_INCREMENT,
                ean VARCHAR(150) NOT NULL,
                sales_channel_id VARCHAR(150) NOT NULL,
                json_precio JSON NOT NULL,
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

    public function desintalarTablas(){
        $tablas=[
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_stock',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_precio',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_simple_producto',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_configuracion_producto',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_modelo_producto',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_asociacion_categoria',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_datos_propiedad',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_propiedad_modelo',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_atributo_talla',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_asociacion_talla',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_asociacion_color',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_esquemas'
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

    private function installTab()
    {
        $lang = Language::getLanguages(); 
        $tab = new Tab();
        $tab->class_name = 'Producto'; 
        $tab->module = 'wbzalando';
        $tab->id_parent = (int) Tab::getIdFromClassName('CONFIGURE'); 
        foreach ($lang as $l) {
            $tab->name[$l['id_lang']] = $this->l('Productos'); 
        }

        $tab->save();

        $lang = Language::getLanguages(); 
        $tab = new Tab();
        $tab->class_name = 'Color'; 
        $tab->module = 'wbzalando';
        $tab->id_parent = (int) Tab::getIdFromClassName('CONFIGURE'); 
        foreach ($lang as $l) {
            $tab->name[$l['id_lang']] = $this->l('Color'); 
        }

        $tab->save();

        $lang = Language::getLanguages(); 
        $tab = new Tab();
        $tab->class_name = 'Talla'; 
        $tab->module = 'wbzalando';
        $tab->id_parent = (int) Tab::getIdFromClassName('CONFIGURE'); 
        foreach ($lang as $l) {
            $tab->name[$l['id_lang']] = $this->l('Talla'); 
        }

        $tab->save();
        
        $lang = Language::getLanguages(); 
        $tab = new Tab();
        $tab->class_name = 'Atributotalla'; 
        $tab->module = 'wbzalando';
        $tab->id_parent = (int) Tab::getIdFromClassName('CONFIGURE'); 
        foreach ($lang as $l) {
            $tab->name[$l['id_lang']] = $this->l('Atributo Talla'); 
        }

        $tab->save();

        $lang = Language::getLanguages(); 
        $tab = new Tab();
        $tab->class_name = 'categoria'; 
        $tab->module = 'wbzalando';
        $tab->id_parent = (int) Tab::getIdFromClassName('CONFIGURE'); 
        foreach ($lang as $l) {
            $tab->name[$l['id_lang']] = $this->l('Cetegorias'); 
        }

        return $tab->save();
    }

    private function uninstallTab()
    {
        $tabId = (int) Tab::getIdFromClassName('ProductoController'); 
        if (!$tabId) {
            return true;
        }

        $tab = new Tab($tabId);
        
        $tabId = (int) Tab::getIdFromClassName('ColorController'); 
        if (!$tabId) {
            return true;
        }

        $tab = new Tab($tabId);

        $tab->delete(); 

        $tabId = (int) Tab::getIdFromClassName('TallaController'); 
        if (!$tabId) {
            return true;
        }

        $tab = new Tab($tabId);

        $tab->delete(); 
        
        $tabId = (int) Tab::getIdFromClassName('AtributotallaController'); 
        if (!$tabId) {
            return true;
        }

        $tab = new Tab($tabId);

        $tab->delete();

        $tabId = (int) Tab::getIdFromClassName('CategoriaController'); 
        if (!$tabId) {
            return true;
        }

        $tab = new Tab($tabId);

        return $tab->delete(); 
    }

    public function hookDisplayBackOfficeHeader()
    {
        if(Tools::getValue("controller")==="Producto"){
            $this->context->controller->addCSS(array(
                $this->_path.'/views/css/producto.css',
                $this->_path.'/views/css/style_back_office.css',
                $this->_path.'/views/css/style_front_office.css'
            ));
        }
        $shop = new Shop((int)$this->context->shop->id);
        $base_url = $shop->getBaseURL();
        $ajax = $base_url.'modules/'.$this->name.'/ajax.php?token='.Tools::encrypt($this->name.'/ajax.php');
        $this->context->smarty->assign(array(
            'url_ajax' => $ajax
        ));

        return $this->display(__FILE__, 'views/templates/admin/header.tpl');
    }

    public function getContent(){
        return $this->alertasCron().$this->procesarFormulario() . $this->getFormulario();
    }

    public function alertasCron(){
        $alertas="";
        $http="";
        if (array_key_exists("HTTPS",$_SERVER)) {
            $http="https://";
        } else {
            $http="http://";
        }
        $linkModuloCronEsquema=$http.$_SERVER["HTTP_HOST"]."/modules/".$this->name."/cron_esquema.php";
        $linkModuloCronToken=$http.$_SERVER["HTTP_HOST"]."/modules/".$this->name."/cron_token.php";
        $textoAlertaCronEsquema="Puedes establecer una tarea programada que consultara los esquema de producto utilizando la siguiente URL: </br>"."<b>".$linkModuloCronEsquema."</b>";
        $textoAlertaCronToken="Puedes establecer una tarea programada que actualizara el token de sesion de zalando utilizando la siguiente URL: </br>"."<b>".$linkModuloCronToken."</b>";
        $alertas.=$this->displayInformation($textoAlertaCronEsquema);
        $alertas.=$this->displayInformation($textoAlertaCronToken);
        return $alertas;
    }

    public function getFormulario(){
        $helper = new HelperForm();
        $helper->module = $this;
        $helper->name_controller = $this->name;
        $helper->identifier = $this->identifier;
        $helper->token = Tools::getAdminTokenLite('AdminModules');
        $helper->languages = $this->context->controller->getLanguages();
        $helper->currentIndex = AdminController::$currentIndex . '&configure=' . $this->name;
        $helper->default_form_language = $this->context->controller->default_form_language;
        $helper->allow_employee_form_lang = $this->context->controller->allow_employee_form_lang;
        $helper->title = $this->displayName;

        $helper->submit_action = $this->name;
        
        $helper->fields_value["clienteIdZolando"]=Configuration::get("WB_ZALANDO_CLIENTE_ID");
        $helper->fields_value["clienteSecretZolando"]=Configuration::get("WB_ZALANDO_CLIENTE_SECRET");
        $helper->fields_value["rutaZolando"]=Configuration::get("WB_ZALANDO_END_POINT");

        $this->form[0]=[
            "form" => [
                "legend" => [
                    "title" => "Zalando"
                ],
                "input" =>[
                    [
                        "type" => "text",
                        "label" => $this->l("Cliente ID"),
                        "desc" => $this->l(""),
                        'hint' => $this->l(''),
                        'name' => 'clienteIdZolando',
                        'required'  => true
                    ],
                    [
                        "type" => "text",
                        "label" => $this->l("Cliente Secret"),
                        "desc" => $this->l(""),
                        'hint' => $this->l(''),
                        'name' => 'clienteSecretZolando',
                        'required'  => true
                    ],
                    [
                        "type" => "text",
                        "label" => $this->l("Ruta de acceso"),
                        "desc" => $this->l("Ruta de acceso ha Zalando"),
                        'hint' => $this->l(''),
                        'name' => 'rutaZolando',
                        'required'  => true
                        // 'lang' => trues
                    ],
                    // script
                    [
                        "type" => "html",
                        "html_content" => '<script type="text/javascript" src="'.$this->_path.'views/js/wbzalando.js"></script>'
                    ]
                ],
                "submit" => [
                    "title" => $this->l("Guardar")
                ]
            ]
        ];

        return $helper->generateForm($this->form);


    }

    public function procesarFormulario(){
        $salida="";
        if(Tools::getValue("rutaZolando")){
            $clienteIdZolando=Tools::getValue("clienteIdZolando");
            $clienteSecretZolando=Tools::getValue("clienteSecretZolando");
            $rutaEndPoint=Tools::getValue("rutaZolando");
            Configuration::updateValue("WB_ZALANDO_CLIENTE_ID",$clienteIdZolando);
            Configuration::updateValue("WB_ZALANDO_CLIENTE_SECRET",$clienteSecretZolando);
            Configuration::updateValue("WB_ZALANDO_END_POINT",$rutaEndPoint);
            
            $header = array('Authorization: '.'Basic '. base64_encode($clienteIdZolando.':'.$clienteSecretZolando));

            $curl = curl_init();

            $fields = array(
                "grant_type" => "client_credentials"
            );

            $fields_string = http_build_query($fields);   
            
            curl_setopt($curl, CURLOPT_URL, $rutaEndPoint."/auth/token");
            curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);                                                                     
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS,$fields_string);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

            $response = curl_exec($curl);
            $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

            curl_close($curl);
            $tokenInfo=(object)json_decode($response);
            if(property_exists($tokenInfo,"access_token")){
                Configuration::updateValue("WB_ZALANDO_TOKEN_ACCESO",$tokenInfo->access_token);
                $salida=$this->displayConfirmation($this->l("Sean guardado las credenciales y el punto de acceso de la api con exito"));
                $this->autenticarSesionZalando();
            }
            else{
                $salida=$this->displayError($this->l("Zalando ha tardado en responde porfavor intente de nuevo"));
            }
            return $salida;
        }
            
    }

    public function autenticarSesionZalando(){
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $rutaEndPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $header = array('Authorization: '.'Bearer '. $token);
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $rutaEndPoint."/auth/me");
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        $response = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        $tokenInfo=(object)json_decode($response);
        Configuration::updateValue("WB_ZALANDO_ID_COMERCIANTE",$tokenInfo->bpids[0]);
        return $tokenInfo;
    }
    
} 
        
?>