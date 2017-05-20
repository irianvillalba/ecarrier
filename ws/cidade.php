<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Irian
 * Date: 11/02/17
 * Time: 14:20
 * To change this template use File | Settings | File Templates.
 */
include_once 'lib/cors.php';
include_once 'lib/model/Cidade.php';

try {
    $cidade = new Cidade();

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $rows = $cidade->getFromQuery("select id_cidade, nome from cidade where id_estado = {$request->uf} order by nome");

    echo json_encode($rows);

} catch (Exception $e) {
    echo false;
}

?>