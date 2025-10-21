# backend/app/services/email.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from jinja2 import Environment, BaseLoader
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = settings.EMAIL_HOST
        self.smtp_port = settings.EMAIL_PORT
        self.username = settings.EMAIL_USER
        self.password = settings.EMAIL_PASSWORD
        self.from_email = settings.EMAIL_FROM
        self.from_name = settings.EMAIL_FROM_NAME

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """Send an email"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email

            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)

            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)

            logger.info(f"Email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_verification_email(self, to_email: str, verification_token: str) -> bool:
        """Send email verification"""
        verification_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
        
        html_template = """
        <html>
        <body>
            <h2>Verify Your Email Address</h2>
            <p>Thank you for signing up for CallCenter SaaS!</p>
            <p>Please click the link below to verify your email address:</p>
            <a href="{verification_link}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">Verify Email</a>
            <p>If you didn't create an account, please ignore this email.</p>
            <p>The verification link will expire in 24 hours.</p>
        </body>
        </html>
        """.format(verification_link=verification_link)

        text_content = f"""
        Verify Your Email Address
        
        Thank you for signing up for CallCenter SaaS!
        Please visit the following link to verify your email address:
        {verification_link}
        
        If you didn't create an account, please ignore this email.
        The verification link will expire in 24 hours.
        """

        return await self.send_email(
            to_email=to_email,
            subject="Verify Your Email - CallCenter SaaS",
            html_content=html_template,
            text_content=text_content
        )

    async def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        """Send password reset email"""
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        
        html_template = """
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>You requested a password reset for your CallCenter SaaS account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="{reset_link}" style="background-color: #f44336; color: white; padding: 14px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>The reset link will expire in 1 hour.</p>
        </body>
        </html>
        """.format(reset_link=reset_link)

        text_content = f"""
        Password Reset Request
        
        You requested a password reset for your CallCenter SaaS account.
        Please visit the following link to reset your password:
        {reset_link}
        
        If you didn't request this, please ignore this email.
        The reset link will expire in 1 hour.
        """

        return await self.send_email(
            to_email=to_email,
            subject="Password Reset - CallCenter SaaS",
            html_content=html_template,
            text_content=text_content
        )

email_service = EmailService()