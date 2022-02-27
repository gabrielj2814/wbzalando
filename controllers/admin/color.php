<?php
include("curlController.php");
include("logger.php");
use Clases\CurlController;

class ColorController extends ModuleAdminController{

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
        $linkDeControlador=$this->context->link->getAdminLink("Color",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador,
        ];
        $this->context->smarty->assign($variablesSmarty);
        $this->setTemplate('/asociacion_color/vista.tpl');
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
    
    public function ajaxProcessGetConsultarColoresZalando(){
        $respuesta_servidor=["respuestaServidor" => [],"estatuRespuestaApi" => 0];
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $url=$endPoint."/merchants/".$idComerciante."/attribute-types/color_code/attributes";
        $curlController=new CurlController($url);
        $datosGet=[
            "merchant_ids" => $idComerciante
        ];
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $header = array('Authorization: '.'Bearer '. $token);
        $curlController->setDatosPeticion($datosGet);
        $curlController->setdatosCabezera($header);
        $respuesta=$curlController->ejecutarPeticion("get",false);
        $Colores=(Object)$respuesta["response"];
        error_log("respuesta al consultar colores zalando =>>>>  " . var_export($respuesta["response"], true));
        $colores=[];
        foreach($Colores->items as $colorZalando){
            $codigoColor=$colorZalando->label;
            $coloreZalandoIdioma=get_object_vars($colorZalando->value->localized);
            $colores[$codigoColor]= $coloreZalandoIdioma[$_GET["codigo_pais"]];
        }
        $respuesta_servidor["respuestaServidor"]=  $colores;
        $respuesta_servidor["estatuRespuestaApi"]= $respuesta["estado"];
        print(json_encode($respuesta_servidor));
    }

    public function ajaxProcessPostGuardarAsociacion(){
        $respuesta_servidor=["respuestaServidor" => []];
        $colorNoAsociados=[];
        foreach($_POST["asociacion"] as $color){
            $respuestaDB=$this->registrar($color["id_attribute"],$color["codigo_color"],$color["codigo_pais"],$color["color_zalando"]);
            if(!$respuestaDB){
                $colorNoAsociados[]=$color;
            }
        }
        $respuesta_servidor["respuestaServidor"]["colorNoAsociados"]=$colorNoAsociados;
        print(json_encode($respuesta_servidor));
    }

    public function registrar($id_attribute,$codigo_color,$codigo_pais,$color_zalando){
        $SQL="INSERT INTO ps_wbzalando_asociacion_color(
            id_attribute,
            codigo_color,
            codigo_pais,
            color_zalando
        )
        VALUES(
            ".$id_attribute.",
            '".$codigo_color."',
            '".$codigo_pais."',
            '".$color_zalando."'
        )";
        return Db::getInstance()->execute($SQL);
    }

    public function validarRespuestaBD($respuesta){
        if(is_array($respuesta)){
            return $respuesta;
        }
        return [];
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
        $SQL="SELECT * FROM ps_wbzalando_asociacion_color,ps_attribute_lang WHERE ps_attribute_lang.id_attribute=ps_wbzalando_asociacion_color.id_attribute AND ps_attribute_lang.id_lang=".$this->id_idioma.";";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    public function ajaxProcessGetConsultarTodoPorPais(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->consultarTodoPorPais($_GET["isoCode"]);
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
    
    public function consultarTodoPorPais($isoCode){
        $SQL="SELECT * FROM ps_wbzalando_asociacion_color,ps_attribute_lang WHERE ps_wbzalando_asociacion_color.codigo_pais='".$isoCode."' AND ps_attribute_lang.id_attribute=ps_wbzalando_asociacion_color.id_attribute AND ps_attribute_lang.id_lang=".$this->id_idioma.";";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    public function ajaxProcessGetConsultar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->consultar($_GET["id_color_asociacion"]);
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
    
    public function consultar($id_color_asociacion){
        $SQL="SELECT * FROM ps_wbzalando_asociacion_color,ps_attribute_lang WHERE ps_attribute_lang.id_lang=".$this->id_idioma." AND ps_attribute_lang.id_attribute=ps_wbzalando_asociacion_color.id_attribute AND ps_wbzalando_asociacion_color.id_color_asociacion=".$id_color_asociacion.";";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    public function ajaxProcessPostActualizar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $colorNoActualizadas=[];
        foreach($_POST["asociacion"] as $color){
            $respuestaDB=$this->actualizar($color["id_color_asociacion"],$color["id_attribute"],$color["codigo_color"],$color["codigo_pais"],$color["color_zalando"]);
            if(!$respuestaDB){
                $colorNoActualizadas[]=$color;
            }
        }
        $respuesta_servidor["respuestaServidor"]["colorNoActualizadas"]=$colorNoActualizadas;
        print(json_encode($respuesta_servidor));
    }
    
    public function actualizar($id_color_asociacion,$id_attribute,$codigo_color,$codigo_pais,$color_zalando){
        $SQL="UPDATE ps_wbzalando_asociacion_color SET
            id_attribute=".$id_attribute.",
            codigo_color='".$codigo_color."',
            codigo_pais='".$codigo_pais."',
            color_zalando='".$color_zalando."'
            WHERE 
            id_color_asociacion=".$id_color_asociacion.";

        ";
        return Db::getInstance()->execute($SQL);
    }

    public function ajaxProcessPostEliminar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $respuestaDB=$this->eliminar($_POST["id_color_asociacion"]);
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
    
    public function eliminar($id_color_asociacion){
        $SQL="DELETE FROM ps_wbzalando_asociacion_color WHERE id_color_asociacion=".$id_color_asociacion.";";
        return Db::getInstance()->execute($SQL);
    }

    public function ajaxProcessGetConsultarColoresPrestashop(){
        $respuesta_servidor=["respuestaServidor" => []];
        $minimoRegistros=5;
        $pagina=$_GET["pagina"];
        $respuestaDB=$this->consultarColoresPrestashop($_GET["id_attribute"]);
        $respuestaPaginadaDB=$this->paginadoColoresPrestashop($_GET["id_attribute"],$pagina,$minimoRegistros);
        if(count($respuestaDB)>0){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consulta completada",
                "datos" => $respuestaPaginadaDB,
                "totalDePagina" => ceil(count($respuestaDB)/$minimoRegistros),
                "totalRegistros" => count($respuestaDB),
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error al consultar"
            ];
        }
        print(json_encode($respuesta_servidor));
    }

    public function consultarColoresPrestashop($id_attribute){
        $SQL="SELECT * FROM 
        ps_attribute,
        ps_attribute_lang
        WHERE 
        ps_attribute.id_attribute_group = ".$id_attribute." AND
        ps_attribute_lang.id_attribute =ps_attribute.id_attribute AND 
        ps_attribute_lang.id_lang=".$this->id_idioma.";";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    public function paginadoColoresPrestashop($id_attribute,$pagina,$minimoRegistros){
        $empezarPor=($pagina-1) * $minimoRegistros;
        $SQL="SELECT * FROM 
        ps_attribute,
        ps_attribute_lang
        WHERE 
        ps_attribute.id_attribute_group = ".$id_attribute." AND
        ps_attribute_lang.id_attribute =ps_attribute.id_attribute AND 
        ps_attribute_lang.id_lang=".$this->id_idioma." LIMIT ".$empezarPor.",".$minimoRegistros.";";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
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

}




?>