using MimeKit;
using System.Net;
using System.Net.Mail;

namespace apiServer.services
{
    public class MailService
    {

        //locahost
        public static async Task<string> SendMail(MailContent mailContent)
        {
            var email = new MimeMessage();
            email.Sender = new MailboxAddress("Blog Website","lungbaphe772003@gmail.com");
            email.From.Add(new MailboxAddress("Blog Website", "lungbaphe772003@gmail.com"));

            email.To.Add(new MailboxAddress(mailContent.To, mailContent.To));
            email.Subject = mailContent.Subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = mailContent.Body;

            email.Body = builder.ToMessageBody();

            using var smtp = new MailKit.Net.Smtp.SmtpClient();

            try
            {
                await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync("lungbaphe772003@gmail.com", "hhvb isiq rqtb mmza");
                await smtp.SendAsync(email);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return "send Email Error";
            }
            smtp.Disconnect(true);
            return "send Email successful";
        }
    }
    public class MailContent
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}