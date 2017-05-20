<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Irian Villalba
 * Date: 04/04/16
 * Time: 10:33
 * To change this template use File | Settings | File Templates.
 */

include_once "mail/class.phpmailer.php";

class Email {
    public function enviarEmail($email, $assunto, $mensagem, $from = null) {
        try {
            // Inicia a classe PHPMailer
            $mail = new PHPMailer();
            $mail->isSMTP();
            $mail->Host = "smtp.inovaprint.net"; // Endereço do servidor SMTP (caso queira utilizar a autenticação, utilize o host smtp.seudomínio.com.br)
            $mail->SMTPAuth = true; // Usar autenticação SMTP (obrigatório para smtp.seudomínio.com.br)
            $mail->Port  = '587';
            $mail->Charset   = 'utf8_decode()';
            $mail->Username = 'contato@inovaprint.net'; // Usuário do servidor SMTP (endereço de email)
            $mail->Password = 'inovap85'; // Senha do servidor SMTP (senha do email usado)

            $mail->setFrom("contato@inovaprint.net", 'Cliente'); // Seu e-mail
            $mail->Sender = "contato@inovaprint.net"; // Seu e-mail
            if (isset($from))
                $mail->FromName = $from; // Seu nome
            else
            $mail->FromName = "E-Carrier"; // Seu nome

            $mail->AddAddress($email);

            $mail->IsHTML(true); // Define que o e-mail será enviado como HTML
            $mail->CharSet = 'utf-8'; // Charset da mensagem (opcional)

            $emailcorpo = "$mensagem";

            $mail->Subject  = $assunto; // Assunto da mensagem
            $mail->Body     = $emailcorpo;

            $enviado = $mail->Send();

            $mail->ClearAllRecipients();
            $mail->ClearAttachments();

            if ($enviado) {
                //echo "E-mail enviado com sucesso!";
            } else {
                //echo "Não foi possível enviar o e-mail.";
                //echo "Informações do erro: " . $mail->ErrorInfo;
            }

        } catch (Exception $e) {
            echo false;
        }
    }

}