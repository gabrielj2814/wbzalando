<?php
include("curlController.php");
include("logger.php");
use Clases\CurlController;

class AtributotallaController extends ModuleAdminController{

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
        $linkDeControlador=$this->context->link->getAdminLink("Atributotalla",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador
        ];
        $this->context->smarty->assign($variablesSmarty);
        $this->setTemplate('/atributo_talla/vista.tpl');
    }

    public function validarRespuestaBD($respuesta){
        if(is_array($respuesta)){
            return $respuesta;
        }
        return [];
    }

    public function ajaxProcessGetConsultarAtributosPrestashop(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->consultarAtributosPrestashop();
        $respuesta_servidor["respuestaServidor"] = $respuestaDB;
        print(json_encode($respuesta_servidor));
    }

    public function consultarAtributosPrestashop(){
        $SQL="SELECT * FROM 
        ps_attribute_group,
        ps_attribute_group_lang 
        WHERE 
        ps_attribute_group_lang.id_lang=".$this->id_idioma." AND 
        ps_attribute_group_lang.id_attribute_group=ps_attribute_group.id_attribute_group 
        ;";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    public function ajaxProcessPostGuardarAtributoTalla(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->registrarAtributo($_POST["id_attribute"]);
        if($respuestaDB){
            $tallaNoAsociadas[]=[
                "mensaje" => "registro completado"
            ];
        }
        else{
            $tallaNoAsociadas[]=[
                "mensaje" => "error al registrar"
            ];
        }
        print(json_encode($respuesta_servidor));
    }

    public function registrarAtributo($id_attribute){
        $SQL="INSERT INTO ps_wbzalando_atributo_talla(id_attribute) VALUES(".$id_attribute.");";
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
        $SQL="SELECT * FROM 
        ps_wbzalando_atributo_talla,
        ps_attribute_group,
        ps_attribute_group_lang 
        WHERE 
        ps_wbzalando_atributo_talla.id_attribute=ps_attribute_group.id_attribute_group  AND 
        ps_attribute_group_lang.id_lang=".$this->id_idioma." AND 
        ps_attribute_group_lang.id_attribute_group=ps_attribute_group.id_attribute_group 
        ";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    public function ajaxProcessGetConsultar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->consultar($_GET["id_atributo_talla"]);
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
    
    public function consultar($id_atributo_talla){
        $SQL="SELECT * FROM 
        ps_wbzalando_atributo_talla,
        ps_attribute_group,
        ps_attribute_group_lang 
        WHERE 
        ps_wbzalando_atributo_talla.id_atributo_talla=".$id_atributo_talla." AND
        ps_wbzalando_atributo_talla.id_attribute=ps_attribute_group.id_attribute_group  AND 
        ps_attribute_group_lang.id_lang=".$this->id_idioma." AND 
        ps_attribute_group_lang.id_attribute_group=ps_attribute_group.id_attribute_group 
        ;";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    public function ajaxProcessGetEliminar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->eliminar($_POST["id_atributo_talla"]);
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
    
    public function eliminar($id_atributo_talla){
        $SQL="DELETE FROM ps_wbzalando_atributo_talla WHERE id_atributo_talla=".$id_atributo_talla.";";
        return Db::getInstance()->execute($SQL);
    }


}