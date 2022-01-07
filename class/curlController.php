<?php

class CurlController{
    private $datosPeticion;
    private $datosCabezera;
    private $url;

    public function __construct($url)
    {
        $this->url=$url;
        
    }
    
    public function setDatosPeticion($datosPeticion,$datosCabezera){
        $this->datosPeticion=$datosPeticion;
    }
    
    public function setdatosCabezera($datosCabezera){
        $this->datosCabezera=$datosCabezera;
    }

    public function ejecutarPeticion($tipo){
        $curl = curl_init();   
        curl_setopt($curl, CURLOPT_URL,$this->url);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);        
        if($tipo==="post"){
            curl_setopt($curl, CURLOPT_POST, 1);
        }
        curl_setopt($curl, CURLOPT_POSTFIELDS,$this->construirHttpQuery());
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $this->crearCabezera());

        $response = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);
    }

    public function construirHttpQuery(){
        // formato array [ ["nombre" => "nombre de la propiedad", "valor" => "valor de la propiedad"] ]
        $listaPropiedades=[];
        foreach($this->datosPeticion as $propiedad){
            $listaPropiedades[$propiedad["nombre"]]=$propiedad["valor"];
        }
        return http_build_query($listaPropiedades);
    }

    public function crearCabezera(){
        $listaEncabezado=[];
        foreach($this->datosCabezera as $datoCabezera){
            $listaEncabezado[]=$datoCabezera;
        }
        return $listaEncabezado;
    }
}


?>