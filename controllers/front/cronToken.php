<?php
// include("controllers/admin/curlController.php");
include("controllers/admin/logger.php");
use Clases\CurlController;

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
        $this->actualizarToken();
    }

    public function actualizarToken(){
            $clienteIdZolando=Configuration::get("WB_ZALANDO_CLIENTE_ID");
            $clienteSecretZolando=Configuration::get("WB_ZALANDO_CLIENTE_SECRET");
            $rutaEndPoint=Configuration::get("WB_ZALANDO_END_POINT");
            $fields = array(
                "grant_type" => "client_credentials"
            );
            $url=$rutaEndPoint."/auth/token";
            $curlController=new CurlController($url);
            $header = array('Authorization: '.'Basic '. base64_encode($clienteIdZolando.':'.$clienteSecretZolando));
            $curlController->setdatosCabezera($header);
            $curlController->setDatosPeticion($fields);
            $respuesta=$curlController->ejecutarPeticion("post",false);
            $tokenInfo=(object)$respuesta["response"];
            if(property_exists($tokenInfo,"access_token")){
                $this->ajaxRender("Token de acceso creado existosamente ");
                Configuration::updateValue("WB_ZALANDO_TOKEN_ACCESO",$tokenInfo->access_token);
                $this->autenticarSesionZalando();
            }
    }

    public function autenticarSesionZalando(){
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $rutaEndPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $url=$rutaEndPoint."/auth/me";
        $header = array('Authorization: '.'Bearer '. $token);
        $curlController=new CurlController($url);
        $curlController->setdatosCabezera($header);
        $respuesta=$curlController->ejecutarPeticion("get",false);
        $tokenInfo=(object)$respuesta["response"];
        Configuration::updateValue("WB_ZALANDO_ID_COMERCIANTE",$tokenInfo->bpids[0]);
        $this->ajaxRender("id de comerciante creado existosamente");
        return $tokenInfo;
    }
}


?>