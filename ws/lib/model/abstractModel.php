<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Irian Villalba
 * Date: 24/02/16
 * Time: 14:03
 * To change this template use File | Settings | File Templates.
 */

include_once 'Database.php';

class AbstractModel {

    private $db;

    /**
     * construtor gera a conexão com o banco de dados
     */
    public function __construct() {
        $this->db = Database::conexao();
    }

    /**
     * @public function getAll retorna todos os registros de uma determinada tabela
     * @param $tabela string nome da tabela que será consultada
     * @param null $campos array vetor que contem os campos a serem consultados
     * @return array vetor com os registros das consultas
     */
    public function getAll($tabela, $campos = null, $where = null, $order = null) {

        try {
            if ($where) {
                $where = 'WHERE ' . $where;
            }
            if ($campos) {
                $c = "";
                for ($x = 0; $x < count($campos); $x++) {
                    $c .= "{$campos[$x]},";
                }
                $c = substr($c, 0, -1);
                $sql = "SELECT $c FROM $tabela $where $order";
            } else {
                $sql = "SELECT * FROM $tabela $where $order";
            }

            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            var_dump($sql);
            echo $e;
        }

    }

    /**
     * @function public getFromQuery executa uma query de consulta na base de dados
     * @param $sql query a ser consultada
     * @return array retorna o vetor com os dados da consulta
     */
    public function getFromQuery($sql) {
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $rows[0];
        } catch (PDOException $e) {
            var_dump($sql);
            echo $e;
        }
    }

    /**
     * @function public execQuery executa uma ação na base de dados
     * @param $sql query a ser executada na base
     * @return boolean retorna verdadeiro caso tenha sido executado com sucesso
     */
    public function execQuery($sql) {
        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute();
        } catch (PDOException $e) {
            var_dump($sql);
            echo $e;
        }
    }

    /**
     * @function getRow
     * @param $tabela
     * @param $where
     * @param null $campos
     * @return mixedï
     */
    public function getRow($tabela, $where, $campos = null) {
        try {
            if ($campos) {
                $c = "";
                for ($x = 0; $x < count($campos); $x++) {
                    $c .= "{$campos[$x]},";
                }
                $c = substr($c, 0, -1);
                $sql = "SELECT $c FROM $tabela  WHERE $where";
            } else {
                $sql = "SELECT * FROM $tabela  WHERE $where";
            }

            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            var_dump($sql);
            echo $e;
        }
    }

    /**
     * @function updateRow atualiza os dados de um registro na tabela
     * @param $tabela tabela em que será atualizado o registro
     * @param $dados dados para atualização do registro
     * @param $where id do registro a ser atualizado
     * @return boolean retorna verdadeiro caso tenha sido atualizado com sucesso
     */
    public function updateRow($tabela, $dados, $where) {
        try {
            $campos = "";

            for ($x = 0; $x < count($dados); $x++) {
                $campos .= "{$dados[$x]},";
            }

            $campos = substr($campos, 0, -1);
            $sql = "UPDATE  $tabela SET $campos WHERE $where";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute();
        } catch (PDOException $e) {
            var_dump($sql);
            echo $e;
        }


    }

    /**
     * @function deleteRow exclui um registro da tabela
     * @param $tabela tabela que será excluido o registro
     * @param $where campo da tabela que será excluida
     * @return boolean verdadeiro caso tenha excluido
     */
    public function deleteRow($tabela, $where) {
        try {
            $sql = "DELETE FROM $tabela WHERE $where";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute();
        } catch (PDOException $e) {
            var_dump($sql);
            echo $e;
        }
    }

    /**
     * @function insertRow inserir um registro em uma tabela
     * @param $tabela tabela em que deseja inserir o registro
     * @param $campos campos da tabela que serão preenchidos
     * @param $valores valores dos campos que serão preenchidos
     * @return boolean retorna verdadeiro caso tenha sucesso falso se não funcionar
     */
    public function insertRow($tabela, $campos, $valores) {

        try {
            $c = "";
            $v = "";

            for ($x = 0; $x < count($campos); $x++) {
                $c .= "{$campos[$x]},";
            }

            for ($x = 0; $x < count($valores); $x++) {
                if ($valores[$x] == '') {
                    $v .= "null,";
                } else {
                    $v .= "'{$valores[$x]}',";
                }

            }

            $c = substr($c, 0, -1);
            $v = substr($v, 0, -1);

            $sql = "INSERT INTO $tabela ($c) VALUES ($v)";

            $stmt = $this->db->prepare($sql);
            return $stmt->execute();
        } catch (PDOException $e) {
            var_dump($sql);
            echo $e;
        }

    }

    /**
     * @function lastInsertId retorna o id do último registro inserido
     * @param $id string campo sequencial
     * @return mixed id do último registrado inserido
     */
    public function lastInsertId($id) {
        try {
            return $this->db->lastInsertId($id);
         } catch (PDOException $e) {
            echo $e;
        }

    }

    public function countRows($tabela, $where = null) {

        if (isset($where))
            $sql = "select count(*) as total from $tabela where $where";
        else
            $sql = "select count(*) as total from $tabela";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    public function deleteLogicRow($tabela, $where) {
        try {
            $sql = "UPDATE $tabela SET situacao = 'excluido' $where";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo $e;
        }

    }

}