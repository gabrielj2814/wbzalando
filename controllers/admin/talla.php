<?php
include("curlController.php");
include("logger.php");
use Clases\CurlController;

class TallaController extends ModuleAdminController{

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
        $linkDeControlador=$this->context->link->getAdminLink("Talla",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador
        ];
        $this->context->smarty->assign($variablesSmarty);
        $this->setTemplate('/asociacion_talla/vista.tpl');
    }

    public function validarRespuestaBD($respuesta){
        if(is_array($respuesta)){
            return $respuesta;
        }
        return [];
    }

    public function ajaxProcessPostGuardarAsociacion(){
        $respuesta_servidor=["respuestaServidor" => []];
        $tallaNoAsociadas=[];
        foreach($_POST["asociacion"] as $talla){
            $respuestaDB=$this->registrar($talla["id_attribute"],$talla["codigo_pais"],$talla["talla_zalando"]);
            if(!$respuestaDB){
                $tallaNoAsociadas[]=$talla;
            }
        }
        $respuesta_servidor["respuestaServidor"]["tallaNoAsociadas"]=$tallaNoAsociadas;
        print(json_encode($respuesta_servidor));
    }

    public function registrar($id_attribute,$codigo_pais,$talla_zalando){
        $SQL="INSERT INTO ps_wbzalando_asociacion_talla(
            id_attribute,
            codigo_pais,
            talla_zalando
        )
        VALUES(
            ".$id_attribute.",
            '".$codigo_pais."',
            '".$talla_zalando."'
        )";
        return Db::getInstance()->execute($SQL);
    }

    public function ajaxProcessGetConsultarTodo(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->consultarTodo();
        if(count($respuestaDB)>0){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consulta completada",
                "datos" => $respuestaDB
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error al consultar",
                "datos" => []
            ];
        }
        print(json_encode($respuesta_servidor));
    }
    
    public function consultarTodo(){
        $SQL="SELECT * FROM ps_wbzalando_asociacion_talla,ps_attribute_lang WHERE ps_attribute_lang.id_attribute=ps_wbzalando_asociacion_talla.id_attribute AND ps_attribute_lang.id_lang=".$this->id_idioma.";";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    public function ajaxProcessGetConsultar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->consultar($_GET["id_talla_asociacion"]);
        if(count($respuestaDB)>0){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consulta completada",
                "datos" => $respuestaDB
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error al consultar",
                "datos" => []
            ];
        }
        print(json_encode($respuesta_servidor));
    }
    
    public function consultar($id_talla_asociacion){
        $SQL="SELECT * FROM ps_wbzalando_asociacion_talla,ps_attribute_lang WHERE ps_attribute_lang.id_lang=".$this->id_idioma." AND ps_attribute_lang.id_attribute=ps_wbzalando_asociacion_talla.id_attribute AND ps_wbzalando_asociacion_talla.id_talla_asociacion=".$id_talla_asociacion.";";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    public function ajaxProcessGetEliminar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->eliminar($_POST["id_talla_asociacion"]);
        if($respuestaDB){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "eliminación completada",
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error al eliminar"
            ];
        }
        print(json_encode($respuesta_servidor));
    }
    
    public function eliminar($id_talla_asociacion){
        $SQL="DELETE FROM ps_wbzalando_asociacion_talla WHERE id_talla_asociacion=".$id_talla_asociacion.";";
        return Db::getInstance()->execute($SQL);
    }

    public function ajaxProcessPostActualizar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $tallaNoActualizadas=[];
        foreach($_POST["asociacion"] as $talla){
            $respuestaDB=$this->actualizar($talla["id_talla_asociacion"],$talla["id_attribute"],$talla["codigo_pais"],$talla["talla_zalando"]);
            if(!$respuestaDB){
                $tallaNoActualizadas[]=$talla;
            }
        }
        $respuesta_servidor["respuestaServidor"]["tallaNoActualizadas"]=$tallaNoActualizadas;
        print(json_encode($respuesta_servidor));
    }
    
    public function actualizar($id_talla_asociacion,$id_attribute,$codigo_pais,$talla_zalando){
        $SQL="UPDATE ps_wbzalando_asociacion_talla SET
            id_attribute=".$id_attribute.",
            codigo_pais='".$codigo_pais."',
            talla_zalando='".$talla_zalando."'
            WHERE 
            id_talla_asociacion=".$id_talla_asociacion.";

        ";
        return Db::getInstance()->execute($SQL);
    }

    public function ajaxProcessGetConsultarPaisesZalando(){
        $respuesta_servidor=["respuestaServidor" => [],"estatuRespuestaApi" => 0];
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $url=$endPoint."/sales-channels";
        $curlController=new CurlController($url);
        $datosGet=[
            "merchant_ids" => $idComerciante
        ];
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $header = array('Authorization: '.'Bearer '. $token);
        $curlController->setDatosPeticion($datosGet);
        $curlController->setdatosCabezera($header);
        $respuesta=$curlController->ejecutarPeticion("get",false);
        $Paises=(Object)$respuesta["response"];
        error_log("respuesta al consultar los paises a zalando =>>>>  " . var_export($respuesta["response"], true));
        $respuesta_servidor["respuestaServidor"]= $respuesta["response"];
        $respuesta_servidor["estatuRespuestaApi"]= $respuesta["estado"];
        print(json_encode($respuesta_servidor));
    }
    
    public function ajaxProcessGetConsultarCateogriasQueTienenTallaZalando(){
        $respuesta_servidor=["respuestaServidor" => [],"estatuRespuestaApi" => 0];
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $url=$endPoint."/merchants/".$idComerciante."/attribute-types/size/attributes";
        $curlController=new CurlController($url);
        $datosGet=[
            "merchant_ids" => $idComerciante
        ];
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $header = array('Authorization: '.'Bearer '. $token);
        $curlController->setDatosPeticion($datosGet);
        $curlController->setdatosCabezera($header);
        $respuesta=$curlController->ejecutarPeticion("get",false);
        $Categorias=(Object)$respuesta["response"];
        // error_log("respuesta al consultar los paises a zalando =>>>>  " . var_export($respuesta["response"], true));
        $categoria=[];
        foreach($Categorias->items as $item){
            if(!array_key_exists($item->_meta->dimension->category,$categoria)){
                $categoria[$item->_meta->dimension->category]=$item->_meta->dimension->category;
            }
        }
        $respuesta_servidor["respuestaServidor"]= $categoria;
        $respuesta_servidor["estatuRespuestaApi"]= $respuesta["estado"];
        print(json_encode($respuesta_servidor));
    }
    
    public function ajaxProcessGetConsultarTallasZalando(){
        $respuesta_servidor=["respuestaServidor" => [],"estatuRespuestaApi" => 0];
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $url=$endPoint."/merchants/".$idComerciante."/attribute-types/size/attributes";
        $curlController=new CurlController($url);
        $datosGet=[
            "merchant_ids" => $idComerciante
        ];
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $header = array('Authorization: '.'Bearer '. $token);
        $curlController->setDatosPeticion($datosGet);
        $curlController->setdatosCabezera($header);
        $respuesta=$curlController->ejecutarPeticion("get",false);
        $Categorias=(Object)$respuesta["response"];
        // error_log("respuesta al consultar los paises a zalando =>>>>  " . var_export($respuesta["response"], true));
        $tallas=[];
        $tallas[$_GET["codigo_pais"]]=[];
        foreach($Categorias->items as $item){
            if($_GET["categoria"]===$item->_meta->dimension->category){
                $sizes=$item->_meta->sizes;
                foreach($sizes as $size){
                    $conversions=$size->conversions;
                    foreach($conversions as $conversion){
                        if($_GET["codigo_pais"]===$conversion->cluster){
                            $tallas[$_GET["codigo_pais"]][]=$conversion->raw;
                        }
                    }
                }
            }
        }
        $respuesta_servidor["respuestaServidor"]=  $tallas;
        $respuesta_servidor["estatuRespuestaApi"]= $respuesta["estado"];
        print(json_encode($respuesta_servidor));
    }

}