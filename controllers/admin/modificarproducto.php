<?php
include("curlController.php");
include("logger.php");
use Clases\CurlController;

class ModificarproductoController extends ModuleAdminController{

    private $id_idioma;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = true;
        $this->id_idioma = $this->context->language->id;
    }

    public function init()
    {
        parent::init();
    }

    public function initContent(){
        parent::initContent();
        $linkDeControlador=$this->context->link->getAdminLink("Modificarproducto",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador,
        ];
        $this->context->smarty->assign($variablesSmarty);
        $this->setTemplate('/modificar_producto/vista.tpl');
    }


    public function renderForm()
    {
        $features = MassEditTools::getFeatures($this->context->language->id, true, 1, true);

        $input_product_name_type_search = array(
            'name' => 'product_name_type_search',
            'values' => array(
                array(
                    'id' => 'exact_match',
                    'text' => $this->l('Exact match'),
                ),
                array(
                    'id' => 'occurrence',
                    'text' => $this->l('Search for occurrence'),
                ),
            ),
            'default_id' => 'exact_match',
        );

        $attribute_groups = AttributeGroup::getAttributesGroups($this->context->language->id);
        if (is_array($attribute_groups) && count($attribute_groups)) {
            foreach ($attribute_groups as &$attribute_group) {
                $attribute_group['attributes'] = AttributeGroup::getAttributes(
                    $this->context->language->id,
                    (int)$attribute_group['id_attribute_group']
                );
            }
        }

        $tpl_vars = array(
            'categories' => Category::getCategories($this->context->language->id, false),
            'manufacturers' => Manufacturer::getManufacturers(
                false,
                0,
                false,
                false,
                false,
                false,
                true
            ),
            'suppliers' => Supplier::getSuppliers(
                false,
                0,
                false,
                false,
                false,
                false
            ),
            'carriers' => Carrier::getCarriers(
                false,
                0,
                false,
                false,
                false,
                false
            ),
            'features' => $features,
            'languages' => ToolsModuleMEP::getLanguages(false),
            'default_form_language' => $this->context->language->id,
            'input_product_name_type_search' => $input_product_name_type_search,
            'upload_file_dir' => _MODULE_DIR_ . $this->module->name . '/lib/redactor/file_upload.php',
            'upload_image_dir' => _MODULE_DIR_ . $this->module->name . '/lib/redactor/image_upload.php',
            'link_on_tab_module' => HelperModuleMEP::getModuleTabAdminLink(),
            'templates_products' => TemplateProductsMEP::getAll(true),
            'tabs' => $this->getTabs(),
            'attribures_groups' => $attribute_groups
        );

        $this->tpl_form_vars = array_merge($this->tpl_form_vars, $tpl_vars);
        $this->fields_form = array(
            'legend' => array(
                'title' => 'tree_custom.tpl',
            ),
        );

        if (version_compare(_PS_VERSION_, '1.6.0', '<')) {
            $this->context->controller->addCSS($this->module->getPathURI() . 'views/css/admin-theme.css');
        }

        if (_PS_VERSION_ > 1.6) {
            $this->context->controller->addCSS($this->module->getPathURI() . 'views/css/admin-theme1_7.css');
        }

        return parent::renderForm();
    }


}





?>
<?php

