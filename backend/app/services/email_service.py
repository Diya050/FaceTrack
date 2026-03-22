import requests
import os

RESEND_API_KEY = os.getenv("RESEND_API_KEY")


class EmailService:

    @staticmethod
    def send_reset_email(to_email: str, reset_link: str):

        url = "https://api.resend.com/emails"

        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "from": "FaceTrack <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "Reset Your Password",
            "html": f"""
                <h2>Password Reset</h2>
                <p>Click below to reset your password:</p>
                <a href="{reset_link}">Reset Password</a>
                <p>This link expires in 15 minutes.</p>
            """
        }

        requests.post(url, json=data, headers=headers)