<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

if (!defined('_PS_VERSION_')) {
    exit;
}

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
            $this->installDB() && 
            $this->registerHook("displayBackOfficeHeader") && 
            Configuration::updateValue("WB_ZALANDO_END_POINT","Sin ruta de acceso") && 
            Configuration::updateValue("WB_ZALANDO_CLIENTE_ID","Sin cliente id") && 
            Configuration::updateValue("WB_ZALANDO_CLIENTE_SECRET","Sin cliente secret") && 
            Configuration::updateValue("WB_ZALANDO_TOKEN_ACCESO","Sin token"));
    }

    public function uninstall(){
        return (
            parent::uninstall() && 
            $this->uninstallTab() && 
            $this->uninstallDB() && 
            $this->unregisterHook("displayBackOfficeHeader") && 
            Configuration::deleteByName("WB_ZALANDO_END_POINT")  && 
            Configuration::deleteByName("WB_ZALANDO_CLIENTE_ID")  && 
            Configuration::deleteByName("WB_ZALANDO_CLIENTE_SECRET")  && 
            Configuration::deleteByName("WB_ZALANDO_TOKEN_ACCESO"));
    }

    private function installTab()
    {
        $lang = Language::getLanguages(); 
        $tab = new Tab();
        $tab->class_name = 'Pais'; 
        $tab->module = 'wbzalando';
        $tab->id_parent = (int) Tab::getIdFromClassName('CONFIGURE'); 
        foreach ($lang as $l) {
            $tab->name[$l['id_lang']] = $this->l('Pais'); 
        }

        return $tab->save();
    }

    private function uninstallTab()
    {
        $tabId = (int) Tab::getIdFromClassName('MainController'); 
        if (!$tabId) {
            return true;
        }

        $tab = new Tab($tabId);

        return $tab->delete(); 
    }

    public function installDB(){
        // string table sql
        $sqlTablaPais="
        CREATE TABLE IF NOT EXISTS "._DB_PREFIX_."tpais(
            id_pais int(11) NOT NULL AUTO_INCREMENT,
            sales_channel_id varchar(255) UNIQUE NOT NULL,
            nombre_pais varchar(255) NOT NULL,
            codigo_pais varchar(1) NOT NULL,
            por_defecto varchar(1) NOT NULL,
            PRIMARY KEY (`id_Pais`)
        ) ENGINE="._MYSQL_ENGINE_." DEFAULT CHARSET=utf8;";

        $tablaPais=Db::getInstance()->execute($sqlTablaPais);
        return $tablaPais;
        
    }
    
    public function uninstallDB(){
        $tablaPais=Db::getInstance()->execute("DROP TABLE IF EXISTS "._DB_PREFIX_."tpais;");
        return $tablaPais;
    }

    public function hookDisplayBackOfficeHeader()
    {
        $this->context->controller->addCSS(array(
            $this->_path.'/views/css/pais.css',
            $this->_path.'/views/css/generico.css'
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
        // $helper->fields_value["tokenZolando"]=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");

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
                        // 'lang' => trues
                    ],
                    [
                        "type" => "text",
                        "label" => $this->l("Cliente Secret"),
                        "desc" => $this->l(""),
                        'hint' => $this->l(''),
                        'name' => 'clienteSecretZolando',
                        'required'  => true
                        // 'lang' => trues
                    ],
                    [
                        "type" => "text",
                        "label" => $this->l("Ruta de acceso"),
                        "desc" => $this->l("Ruta de acceso ha Zalando"),
                        'hint' => $this->l(''),
                        'name' => 'rutaZolando',
                        'required'  => true
                        // 'lang' => trues
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

            $fields_string = http_build_query($fields);;   
            
            curl_setopt($curl, CURLOPT_URL, $rutaEndPoint."/auth/token");
            curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);                                                                     
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS,$fields_string);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_HTTPHEADER, $header);

            $response = curl_exec($curl);
            $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

            curl_close($curl);

            // print(http_response_code($status));
            $tokenInfo=(object)json_decode($response);
            if(property_exists($tokenInfo,"access_token")){
                Configuration::updateValue("WB_ZALANDO_TOKEN_ACCESO",$tokenInfo->access_token);
                $salida=$this->displayConfirmation($this->l("La sesion con Zalando ha sido creada con éxito"));
            }
            else{
                $salida=$this->displayError($this->l("Zalnado ha tardado en responde porfavor intente de nuevo"));
            }
            return $salida;
        }
            
            
            
    }
    
} 
        
?>