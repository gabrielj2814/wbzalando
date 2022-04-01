<?php
include("curlController.php");
include("logger.php");
// use Clases\CurlController;
use PrestaShop\PrestaShop\Adapter\Entity\Module as EntityModule;
use Symfony\Component\Validator\Constraints\Count;

class GaleriaController extends ModuleAdminController{

    private $id_idioma;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = true;
        $this->id_idioma = $this->context->language->id;
        $this->modulo= EntityModule::getInstanceByName("wbzalando"); 
        $this->name = 'wbzalando';
    }

    public function init()
    {
        parent::init();
    }

    public function initContent(){
        parent::initContent();
        $this->borrarImagenesBasuraReciduos();
        $linkDeControlador=$this->context->link->getAdminLink("Galeria",true);
        $variablesSmarty=[
            "linkControlador" => $linkDeControlador
        ];
        $this->context->smarty->assign($variablesSmarty);
        $this->setTemplate('/galeria_imagen/vista.tpl');
    }

    public function validarRespuestaBD($respuesta){
        if(is_array($respuesta)){
            return $respuesta;
        }
        return [];
    }
    // ========
    // ========
    // ========

    public function ajaxProcessPostSubirImagen(){
        $respuesta_servidor=["respuestaServidor" => []];
        if(array_key_exists("imagenProducto",$_FILES)){
            if($_FILES["imagenProducto"]["type"] == "image/jpeg" || $_FILES["imagenProducto"]["type"] == "image/jpg"){
                $dir=_PS_MODULE_DIR_.$this->modulo->name."/tmp/";
                $_FILES["imagenProducto"]["name"]=date("Y-m-d")."_".$_POST["NombreImagenTmp"].".".$_POST["extencion"];
                // move_uploaded_file($_FILES["imagenProducto"]["tmp_name"],$dir.$_FILES["imagenProducto"]["name"]);
                if(move_uploaded_file($_FILES["imagenProducto"]["tmp_name"],$dir.$_FILES["imagenProducto"]["name"])){
                    $respuesta_servidor["respuestaServidor"]=[
                        "estado" => true,
                        "NombreImagenTmp" => $_FILES["imagenProducto"]["name"],
                        "urlFull" => $dir.$_FILES["imagenProducto"]["name"]
                    ];
                }
            }
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "estado" => false
            ];
        }
        print(json_encode($respuesta_servidor));
        
    }

    public function copiarImagen($nombreImagen){
        if(rename(_PS_MODULE_DIR_.$this->modulo->name."/tmp/".$nombreImagen,_PS_MODULE_DIR_.$this->modulo->name."/upload/".$nombreImagen)){
            $path="";
            $http="";
            if (array_key_exists("HTTPS",$_SERVER)) {
                $http="https://";
            } else {
                $http="http://";
            }
            $path=$http.$_SERVER["HTTP_HOST"]."/modules/".$this->name."/upload/".$nombreImagen;
            return $path;
        }
        else{
            return NULL;
        }
    }

    
    public function borrarImagenesBasura($listaDeImagenes){
        $dir=_PS_MODULE_DIR_.$this->modulo->name."/tmp/";
        $totalDeArchivosEliminados=0;
        foreach($listaDeImagenes as $imagen){
            if(file_exists($dir.$imagen)){
                unlink($dir.$imagen);
            }
        }
    }

    public function borrarImagenesBasuraReciduos(){
        $totalDeArchivosEliminados=0;
        $dir=_PS_MODULE_DIR_.$this->modulo->name."/tmp/";
        $archivos=scandir($dir);
        foreach($archivos as $archivo){
            if($dir.$archivo!==$dir.".gitkeep"){
                if(is_file($dir.$archivo)){
                    $fechaHoy=strtotime(date("y-m-d"));
                    $fechaImagen=strtotime(date(explode("_",$archivo)[0]));
                    if($fechaHoy!==$fechaImagen){
                        if(unlink($dir.$archivo)){
                            $totalDeArchivosEliminados++;
                        }
                    }
                }
            }
        }
    }
    


    public function ajaxProcessPostGuardarImagen(){
        $respuesta_servidor=["respuestaServidor" => []];
        $pathUrlImagen=$this->copiarImagen($_POST["nombre_tmp"]);
        $resultImagen=$this->registrarImagen($_POST,$pathUrlImagen);
        if($resultImagen){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "imagen guardada con existo",
                "estado" => true
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error al guardar la imagen",
                "estado" => false
            ];
        }
        print_r(json_encode($respuesta_servidor));
    }

    public function registrarImagen($datos,$url){
        $fecha=date("y-m-d");
        $extencion=explode("/",$datos["extencion"])[1];
        $SQL="INSERT INTO ps_wbzalando_imagen_producto(
            nombre_imagen,
            nombre_id,
            extencion_imagen,
            url_imagen,
            fecha_subida
        )
        VALUES(
            '".$datos["nombre_imagen_db"]."',
            '".$datos["nombre_tmp"]."',
            '".$extencion."',
            '$url',
            '$fecha'
        );";
        return Db::getInstance()->execute($SQL);
    }

    public function ajaxProcessGetConsultarTodo(){
        $respuesta_servidor=["respuestaServidor" => []];
        $resultImagen=$this->consultarTodo();
        if(Count($resultImagen)>0){
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "consultar todo",
                "estado" => true,
                "datos" => $resultImagen
            ];
        }
        else{
            $respuesta_servidor["respuestaServidor"]=[
                "mensaje" => "error al consultar",
                "estado" => false,
                "datos" => []
            ];
        }
        print_r(json_encode($respuesta_servidor));
    }
    
    public function consultarTodo(){
        $SQL="SELECT * FROM ps_wbzalando_imagen_producto ORDER BY id_imagen DESC;";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }
    


    public function ajaxProcessGetBorrar(){
        $respuesta_servidor=["respuestaServidor" => []];
        $resultImagenConsulta=$this->consultar($_GET["id"]);
        if(Count($resultImagenConsulta)>0){
            $resultImagen=$this->borrar($_GET["id"]);
            $estadoEliminarImagen=$this->borrarImageneProducto($resultImagenConsulta[0]);
            if($resultImagen && $estadoEliminarImagen){
                $respuesta_servidor["respuestaServidor"]=[
                    "mensaje" => "consultar todo",
                    "estado" => true
                ];
            }
            else{
                $respuesta_servidor["respuestaServidor"]=[
                    "mensaje" => "error al consultar",
                    "estado" => false
                ];
            }
        }
        print_r(json_encode($respuesta_servidor));
    }

    public function borrar($id){
        $SQL="DELETE FROM ps_wbzalando_imagen_producto WHERE id_imagen=$id;";
        return Db::getInstance()->execute($SQL);
    }

    public function consultar($id){
        $SQL="SELECT * FROM ps_wbzalando_imagen_producto WHERE id_imagen=$id;";
        return $this->validarRespuestaBD(Db::getInstance()->executeS($SQL));
    }

    public function borrarImageneProducto($datosImagen){
        $dir=_PS_MODULE_DIR_.$this->modulo->name."/upload/";
        if(is_file($dir.$datosImagen["nombre_id"])){
            if(unlink($dir.$datosImagen["nombre_id"])){
                return true;
            }
        }
        else{
            return false;
        }
    }

}