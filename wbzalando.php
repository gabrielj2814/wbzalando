<?php
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
        
        return (parent::install() && Configuration::updateValue("WB_ZALANDO_API_KEY","Sin api key"));
    }

    public function uninstall(){
        return (parent::uninstall() && Configuration::deleteByName("WB_ZALANDO_API_KEY"));
    }

    private function installTab()
    {
        $lang = Language::getLanguages(); 
        $tab = new Tab();
        $tab->class_name = 'Demo'; 
        $tab->module = 'customfieldmini';
        $tab->id_parent = (int) Tab::getIdFromClassName('ShopParameters'); 
        foreach ($lang as $l) {
            $tab->name[$l['id_lang']] = $this->l('Zalando'); 
        }

        return $tab->save();
    }

    private function uninstallTab()
    {
        $tabId = (int) Tab::getIdFromClassName('ZalandoController'); 
        if (!$tabId) {
            return true;
        }

        $tab = new Tab($tabId);

        return $tab->delete(); 
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
        
        $helper->fields_value["apiKeyZalando"]=Configuration::get("WB_ZALANDO_API_KEY");

        $this->form[0]=[
            "form" => [
                "legend" => [
                    "title" => "Zalando"
                ],
                "input" =>[
                    [
                        "type" => "text",
                        "label" => $this->l("Api Key"),
                        "desc" => $this->l("Api Key de acceso ha Zalando"),
                        'hint' => $this->l(''),
                        'name' => 'apiKeyZalando',
                        'required'  => true
                        // 'lang' => trues
                    ],
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
        if(Tools::getValue("apiKeyZalando")){
            $salida=$this->displayConfirmation($this->l(Tools::getValue("apiKeyZalando")));
        }
        
        return $salida;
    }



}


?>