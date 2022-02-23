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
        // con esta line importo archivos externos
        require_once(_PS_MODULE_DIR_.$this->name.'/libs/setup.php');
        return (
            parent::install() &&
            SetupWbZalando::instalarTabs() && 
            SetupWbZalando::crearTablas($this->tablaModulo) && 
            $this->registerHook("displayBackOfficeHeader") && 
            SetupWbZalando::crearVariablesDeConfiguracion());
    }

    public function uninstall(){
        require_once(_PS_MODULE_DIR_.$this->name.'/libs/setup.php');
        return (
            parent::uninstall() &&
            SetupWbZalando::desintalarTabs() && 
            SetupWbZalando::eliminarTablas($this->tablaModulo) &&
            $this->unregisterHook("displayBackOfficeHeader") && 
            SetupWbZalando::eliminarVariablesDeConfiguracion());
    }

    public function hookDisplayBackOfficeHeader()
    {
        $this->context->controller->addCSS(array(
            $this->_path.'/views/css/producto.css',
            $this->_path.'/views/css/style_back_office.css',
            $this->_path.'/views/css/style_front_office.css'
        ));
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
                        'type'      => 'radio',                               
                        'label'     => $this->l('Environment'),        
                        'desc'      => $this->l('Environment de acceso ha Zalando Dev'),  
                        'name'      => 'rutaZolando',                             
                        'required'  => true,                                  
                        'class'     => 't documento-input',                                   
                        'is_bool'   => true,                                  
                        'values'    => [
                            [
                                'id'    => 'active_on',                           
                                'value' => "https://api-sandbox.merchants.zalando.com",                                        
                                'label' => $this->l('Sandbox')  
                            ],
                            [
                                'id'    => 'active_off',
                                'value' => "https://api.merchants.zalando.com",
                                'label' => $this->l('Live')
                            ]
                        ],
                    ],
                    // script
                    [
                        "type" => "html",
                        "html_content" => '<script type="text/javascript" src="'.$this->_path.'views/js/wbzalando.js"></script>'
                    ],
                    [
                        "type" => "html",
                        "html_content" => '<link rel="stylesheet" type="text/css"  href="'.$this->_path.'views/css/style_front_office.css"/>'
                    ]
                ],
                "submit" => [
                    "title" => $this->l("Guardar")
                ],
                [
                    "type" => "html",
                    "html_content" => '<link rel="stylesheet" type="text/css"  href="'.$this->_path.'views/css/style_front_office.css"/>'
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