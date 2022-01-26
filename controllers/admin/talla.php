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

}