<?php

namespace Clases;

class CurlController{
    private $datosPeticion;
    private $datosCabezera;
    private $url;

    public function __construct($url)
    {
        $this->url=$url;
        $this->datosPeticion=[];
        $this->datosCabezera=[];
        
    }
    
    public function setDatosPeticion($datosPeticion){
        $this->datosPeticion=$datosPeticion;
    }
    
    public function setdatosCabezera($datosCabezera){
        $this->datosCabezera=$datosCabezera;
    }

    public function ejecutarPeticion($tipo,$requestJson){
        $curl = curl_init();   
        if($tipo==="post"){
            curl_setopt($curl, CURLOPT_URL,$this->url);
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
            // curl_setopt($curl, CURLOPT_POSTFIELDS,$this->construirHttpQuery());
            if($requestJson){
                curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($this->datosPeticion));
            }
            else{
                curl_setopt($curl, CURLOPT_POSTFIELDS,$this->construirHttpQuery());
            }
        }
        else if($tipo==="get"){
            // print($this->url.$this->construirHttpQuery());
            curl_setopt($curl, CURLOPT_URL,$this->url."?".$this->construirHttpQuery());
        }
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);        
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $this->crearCabezera());

        $response = curl_exec($curl);
        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);
        return json_decode($response);
    }

    public function construirHttpQuery(){
        // formato array [ ["nombre" => "nombre de la propiedad", "valor" => "valor de la propiedad"] ]
        $listaPropiedades=[];
        foreach($this->datosPeticion as $key => $valor){
            $listaPropiedades[$key]=$valor;
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
// print("hola");
// $peticion=new CurlController("https://jsonplaceholder.typicode.com/posts");
// print(json_encode($peticion->ejecutarPeticion("get")));

?>