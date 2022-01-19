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
            Configuration::deleteByName("WB_ZALANDO_END_POINT")  && 
            Configuration::deleteByName("WB_ZALANDO_ID_COMERCIANTE")  && 
            Configuration::deleteByName("WB_ZALANDO_CLIENTE_ID")  && 
            Configuration::deleteByName("WB_ZALANDO_CLIENTE_SECRET")  && 
            Configuration::deleteByName("WB_ZALANDO_TOKEN_ACCESO"));
    }

    public function instalarTablas(){
        $tablas=[
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

        // $SQL='CREATE TABLE IF NOT EXISTS '.$this->tablaModulo.'_esquemas(
        //     id int(11) NOT NULL AUTO_INCREMENT,
        //     fecha_registro date NOT NULL,
        //     esquemas_name_label JSON NOT NULL,
        //     esquemas_full JSON NOT NULL,
        //     PRIMARY KEY (`id`)
        // ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;';
        // return Db::getInstance()->execute($SQL);
    }

    public function desintalarTablas(){
        $tablas=[
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_simple_producto',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_configuracion_producto',
            'DROP TABLE IF EXISTS '.$this->tablaModulo.'_modelo_producto',
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
        // $SQL='DROP TABLE IF EXISTS '.$this->tablaModulo.'_esquemas';
        // return Db::getInstance()->execute($SQL);
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

        return $tab->save();
    }

    private function uninstallTab()
    {
        $tabId = (int) Tab::getIdFromClassName('ProductoController'); 
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
                $this->_path.'/views/css/producto.css'
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
        return $this->procesarFormulario() . $this->getFormulario();
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