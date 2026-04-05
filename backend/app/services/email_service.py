import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 465))


class EmailService:

    @staticmethod
    def _send_email(to_email: str, subject: str, html_content: str):
        try:
            msg = MIMEMultipart()
            msg["From"] = SMTP_EMAIL
            msg["To"] = to_email
            msg["Subject"] = subject

            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
                server.login(SMTP_EMAIL, SMTP_PASSWORD)
                server.send_message(msg)

            print(f"📧 Email sent to {to_email}")

        except Exception as e:
            print(f"❌ Email failed for {to_email}: {str(e)}")

    # ---------------- RESET PASSWORD ---------------- #

    @staticmethod
    def send_reset_email(to_email: str, reset_link: str):
        subject = "Reset Your Password"

        html = f"""
            <h2>Password Reset</h2>
            <p>Click below to reset your password:</p>
            <a href="{reset_link}">Reset Password</a>
            <p>This link expires in 15 minutes.</p>
        """

        EmailService._send_email(to_email, subject, html)

    # ---------------- INVITE EMAIL ---------------- #

    @staticmethod
    def send_invite_email(to_email: str, invite_link: str, role: str):
        subject = "You're Invited to Join FaceTrack"

        html = f"""
            <h2>You're Invited!</h2>
            <p>You have been invited to join <b>FaceTrack</b> as a <b>{role}</b>.</p>
            
            <p>Click the button below to complete your registration:</p>
            
            <a href="{invite_link}" 
               style="
                    display:inline-block;
                    padding:10px 20px;
                    background-color:#4CAF50;
                    color:white;
                    text-decoration:none;
                    border-radius:5px;
               ">
               Accept Invite
            </a>

            <p>This link will expire in 30 minutes.</p>

            <p>If you did not expect this invite, you can ignore this email.</p>
        """

        EmailService._send_email(to_email, subject, html)

    # ---------------- NOTIFICATION EMAIL ---------------- #

    @staticmethod
    def send_notification_email(to_email: str, subject: str, message: str):
        html = f"""
            <h3>{subject}</h3>
            <p>{message}</p>
            <hr />
            <p style="font-size:12px;color:gray;">
                This is an automated notification from FaceTrack.
            </p>
        """

        EmailService._send_email(to_email, subject, html)