<?php
/**
 * Classe de conexão ao banco de dados usando PDO no padrão Singleton.
 * Modo de Usar:
 * require_once './Database.class.php';
 * $db = Database::conexao();
 * E agora use as funções do PDO (prepare, query, exec) em cima da variável $db.
 */
class Database
{
    # Variável que guarda a conexão PDO.
    protected static $db;
    # Private construct - garante que a classe só possa ser instanciada internamente.
    private function __construct()
    {
        # Informações sobre o banco de dados:

        $db_host = "127.0.0.1";
        $db_nome = "lembranca";
        $db_usuario = "postgres";
        $db_senha = "admin";
        $db_driver = "pgsql";

        /*$db_host = "179.188.16.205";
        $db_nome = "bdiparty";
        $db_usuario = "bdiparty";
        $db_senha = "qwe123";
        $db_driver = "mysql";*/

        # Informações sobre o sistema:
        $sistema_titulo = "tueddin";
        $sistema_email = "contato@tueddin.com.br";

        try
        {
            # Atribui o objeto PDO à variável $db.
            self::$db = new PDO("$db_driver:host=$db_host; dbname=$db_nome", $db_usuario, $db_senha);
            # Garante que o PDO lance exceções durante erros.
            self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            # Garante que os dados sejam armazenados com codificação UFT-8.
            self::$db->exec("SET NAMES 'UTF8'");
        }
        catch (PDOException $e)
        {
            # Envia um e-mail para o e-mail oficial do sistema, em caso de erro de conexão.
            //mail($sistema_email, "PDOException em $sistema_titulo", $e->getMessage());
            # Então não carrega nada mais da página.
            die("Connection Error: " . $e->getMessage());
        }
    }
    # Método estático - acessível sem instanciação.
    public static function conexao()
    {
        # Garante uma única instância. Se não existe uma conexão, criamos uma nova.
        if (!self::$db)
        {
            new Database();
        }
        # Retorna a conexão.
        return self::$db;
    }
}

?>
