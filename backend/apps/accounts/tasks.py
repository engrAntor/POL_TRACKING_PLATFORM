from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_verification_email(email, first_name, verify_link):
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding:40px 20px;">
            <tr>
                <td align="center">
                    <table width="500" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding:30px 40px; text-align:center;">
                                <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:1px;">POL Tracking</h1>
                                <p style="margin:5px 0 0; color:#a0aec0; font-size:13px;">Petroleum Oil &amp; Lubricant Management</p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding:40px;">
                                <h2 style="margin:0 0 10px; color:#1a1a2e; font-size:20px;">Verify Your Email</h2>
                                <p style="margin:0 0 25px; color:#4a5568; font-size:15px; line-height:1.6;">
                                    Hi <strong>{first_name}</strong>,<br><br>
                                    Welcome to POL Tracking Platform! Please confirm your email address by clicking the button below.
                                </p>

                                <!-- Button -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding:10px 0 30px;">
                                            <a href="{verify_link}"
                                               style="display:inline-block; background-color:#3b82f6; color:#ffffff; text-decoration:none;
                                                      padding:14px 40px; border-radius:8px; font-size:16px; font-weight:600;
                                                      letter-spacing:0.5px; box-shadow:0 4px 12px rgba(59,130,246,0.4);">
                                                Confirm Email
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin:0 0 15px; color:#718096; font-size:13px; line-height:1.6;">
                                    This link will expire in <strong>24 hours</strong>.
                                </p>
                                <p style="margin:0; color:#718096; font-size:13px; line-height:1.6;">
                                    If you didn't create an account, you can safely ignore this email.
                                </p>

                                <!-- Divider -->
                                <hr style="margin:30px 0 20px; border:none; border-top:1px solid #e2e8f0;">

                                <p style="margin:0; color:#a0aec0; font-size:11px; line-height:1.6;">
                                    If the button doesn't work, copy and paste this link into your browser:<br>
                                    <a href="{verify_link}" style="color:#3b82f6; word-break:break-all;">{verify_link}</a>
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#f7fafc; padding:20px 40px; text-align:center; border-top:1px solid #e2e8f0;">
                                <p style="margin:0; color:#a0aec0; font-size:12px;">
                                    &copy; 2026 POL Tracking Platform. All rights reserved.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    send_mail(
        subject='POL Tracking - Verify Your Email',
        message=(
            f"Hi {first_name},\n\n"
            f"Welcome to POL Tracking Platform!\n\n"
            f"Please verify your email by clicking the link below:\n\n"
            f"{verify_link}\n\n"
            f"This link expires in 24 hours.\n\n"
            f"If you did not create this account, please ignore this email."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=html_message,
        fail_silently=False,
    )


@shared_task
def send_otp_email(email, otp_code, purpose='reset'):
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding:40px 20px;">
            <tr>
                <td align="center">
                    <table width="500" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding:30px 40px; text-align:center;">
                                <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:1px;">POL Tracking</h1>
                                <p style="margin:5px 0 0; color:#a0aec0; font-size:13px;">Petroleum Oil &amp; Lubricant Management</p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding:40px;">
                                <h2 style="margin:0 0 10px; color:#1a1a2e; font-size:20px;">Password Reset OTP</h2>
                                <p style="margin:0 0 25px; color:#4a5568; font-size:15px; line-height:1.6;">
                                    Your one-time password for resetting your account password is:
                                </p>

                                <!-- OTP Code -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding:10px 0 30px;">
                                            <div style="display:inline-block; background-color:#f0f4ff; border:2px dashed #3b82f6;
                                                        padding:16px 40px; border-radius:10px; font-size:32px; font-weight:700;
                                                        color:#1a1a2e; letter-spacing:8px;">
                                                {otp_code}
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin:0 0 15px; color:#718096; font-size:13px; line-height:1.6;">
                                    This code will expire in <strong>{settings.OTP_EXPIRY_MINUTES} minutes</strong>.
                                </p>
                                <p style="margin:0; color:#718096; font-size:13px; line-height:1.6;">
                                    If you didn't request a password reset, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#f7fafc; padding:20px 40px; text-align:center; border-top:1px solid #e2e8f0;">
                                <p style="margin:0; color:#a0aec0; font-size:12px;">
                                    &copy; 2026 POL Tracking Platform. All rights reserved.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    send_mail(
        subject='POL Tracking - Password Reset OTP',
        message=(
            f'Your OTP for password reset is: {otp_code}\n\n'
            f'This code will expire in {settings.OTP_EXPIRY_MINUTES} minutes.\n'
            f'If you did not request this, please ignore this email.'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=html_message,
        fail_silently=False,
    )
