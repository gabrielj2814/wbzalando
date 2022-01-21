<?php
class WbZalandoCronTokenModuleFrontController extends ModuleFrontController
{
    /** @var bool If set to true, will be redirected to authentication page */
    public $auth = false;

    /** @var bool */
    public $ajax;

    public function display()
    {
        $this->ajax = 1;

        if (php_sapi_name() !== 'cli') {
            $this->ajaxRender('Forbidden call.');
        }

        // Additional token checks

        // ...

        $this->ajaxRender("hola mundo\n");
    }
}


?>