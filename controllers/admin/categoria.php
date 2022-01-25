<?php
include("curlController.php");
include("logger.php");
use Clases\CurlController;

class CategoriaController extends ModuleAdminController{

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
        $esquemasDB=$this->chequearEsquemasDeHoyDB();
        if(count($esquemasDB)===0){
            $datosEsquemas=$this->consultarEsquemasDeProducto();
            if(count($datosEsquemas["esquemas_name_label"])>0){
                $respuestaResgistro=$this->registrarEsquemasDB($datosEsquemas);
            }
        }
        $linkDeControlador=$this->context->link->getAdminLink("Producto",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador
        ];
        $this->context->smarty->assign($variablesSmarty);
        $this->setTemplate('/asociacion_categoria/vista.tpl');
    }

    public function chequearEsquemasDeHoyDB(){
        $fechaHoy=date("Y-m-d");
        $SQL="SELECT * FROM ps_wbzalando_esquemas WHERE fecha_registro='$fechaHoy'";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    public function consultarEsquemasDeProducto(){
        $respuestaZalando=["respuestaServidor" => [],"estatuRespuestaApi" => 0,"esquemas_name_label"=>[],"esquemas_full" => []];
        $idComerciante=Configuration::get("WB_ZALANDO_ID_COMERCIANTE");
        $endPoint=Configuration::get("WB_ZALANDO_END_POINT");
        $token=Configuration::get("WB_ZALANDO_TOKEN_ACCESO");
        $url=$endPoint."/merchants/".$idComerciante."/outlines";
        $curlController=new CurlController($url);
        $header = array(
            'Authorization: '.'Bearer '. $token
        );
        $curlController->setdatosCabezera($header);
        $respuesta=$curlController->ejecutarPeticion("get",false);
        $outline =[];
        error_log("respuesta al consultar los esquema de producto zalando =>>>>  " . var_export($respuesta["response"], true));
        if(is_object($respuesta["response"])){
            if(property_exists($respuesta["response"],"items")){
                foreach($respuesta["response"]->items as $esquema){
                    $outline[]=$esquema->name->en."-".$esquema->label;
                }
            }
            if(count($outline)>0){
                $respuestaZalando["esquemas_name_label"] = $outline;
                $respuestaZalando["esquemas_full"] = $respuesta["response"]->items;
            }
        }
        else{
            $respuestaZalando["respuestaServidor"]= $respuesta["response"];
            $respuestaZalando["estatuRespuestaApi"]= $respuesta["estado"];
        }
        return $respuestaZalando;
    }

    public function registrarEsquemasDB($datos){
        $fechaHoy=date("Y-m-d");
        $jsonEsquemasNameLabel=json_encode($datos["esquemas_name_label"]);
        $jsonEsquemasFull=json_encode($datos["esquemas_full"]);
        $SQL="INSERT INTO ps_wbzalando_esquemas(
            fecha_registro,
            esquemas_name_label,
            esquemas_full
            )
            VALUES(
                '".$fechaHoy."',
                '".$jsonEsquemasNameLabel."',
                '".$jsonEsquemasFull."'
            );";
        return Db::getInstance()->execute($SQL);
    }

    public function validarRespuestaBD($respuesta){
        if(is_array($respuesta)){
            return $respuesta;
        }
        return [];
    }

    // -------------------------------

    public function ajaxProcessPostGuardarAsociacion(){
        $respuesta_servidor=["respuestaServidor" => []];
        $jsonFake=["msj" => "hola mundo"];
        $repuestaDB=$this->registrar($_POST["id_category"],$_POST["outline"],$_POST["outline_name"],$jsonFake);
        if($repuestaDB){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "registro completado",
                "estado" => 200
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error al registrar",
                "estado" => 500
            ];
        }
        print(json_encode($respuesta_servidor));

    }

    public function registrar($idCategoria,$outline,$outline_name,$modeloJson){
        $SQL="INSERT INTO ps_wbzalando_asociacion_categoria(
            id_category,
            outline,
            outline_name,
            modelo
        )
        VALUES(
            ".$idCategoria.",
            '".$outline."',
            '".$outline_name."',
            '".$modeloJson."'
        )";
        return Db::getInstance()->execute($SQL);
    }

    public function ajaxProcessGetConsultarTodo(){
        $respuesta_servidor=["respuestaServidor" => []];
        $repuestaDB=$this->consultarTodo();
        if(count($repuestaDB)>0){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consulta completada",
                "estado" => 200
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "no hay asociaciones registradas",
                "estado" => 404
            ];
        }
        print(json_encode($respuesta_servidor));
    }

    public function consultarTodo(){
        $SQL="SELECT * FROM ps_wbzalando_asociacion_categoria;";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    public function ajaxProcessGetConsultar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $repuestaDB=$this->consultar($_GET["id_categoria_asociacion"]);
        if(count($repuestaDB)>0){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consulta completada",
                "estado" => 200
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error no se ha encontrado el recuros solicitado",
                "estado" => 404
            ];
        }
        print(json_encode($respuesta_servidor));
    }

    public function consultar($id){
        $SQL="SELECT * FROM ps_wbzalando_asociacion_categoria WHERE id_categoria_asociacion=".$id.";";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    
    public function ajaxProcessGetEliminar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $repuestaDB=$this->eliminar($_GET["id_categoria_asociacion"]);
        if($repuestaDB){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "eliminación existosa",
                "estado" => 200
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error no se ha encontrado el recuros",
                "estado" => 404
            ];
        }
        print(json_encode($respuesta_servidor));
    }

    public function eliminar($id){
        $SQL="DELETE FROM ps_wbzalando_asociacion_categoria WHERE id_categoria_asociacion=".$id.";";
        return Db::getInstance()->execute($SQL);
    }

    public function ajaxProcessPostActualizarAsociacion(){
        $respuesta_servidor=["respuestaServidor" => []];
        $jsonFake=["msj" => "hola mundo"];
        $repuestaDB=$this->actualizar($_POST["id_categoria_asociacion"],$_POST["id_category"],$_POST["outline"],$_POST["outline_name"],$jsonFake);
        if($repuestaDB){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "actualización completada",
                "estado" => 200
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error al actualizar",
                "estado" => 500
            ];
        }
        print(json_encode($respuesta_servidor));

    }

    public function actualizar($idAsocicaionCategoria,$idCategoria,$outline,$outline_name,$modeloJson){
        $SQL="UPDATE ps_wbzalando_asociacion_categoria SET
            id_category=".$idCategoria.",
            outline='".$outline."',
            outline_name='".$outline_name."',
            modelo='".$modeloJson."'
            WHERE id_categoria_asociacion=".$idAsocicaionCategoria.";";
        return Db::getInstance()->execute($SQL);
    }

}