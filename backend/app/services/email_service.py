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

    
    @staticmethod
    def send_invite_email(to_email: str, invite_link: str, role: str):

        url = "https://api.resend.com/emails"

        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "from": "FaceTrack <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "You're Invited to Join FaceTrack",
            "html": f"""
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
        }

        requests.post(url, json=data, headers=headers)