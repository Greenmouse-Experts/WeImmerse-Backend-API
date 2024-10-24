// utils/emailTemplates.ts

import Admin from "../models/admin";
import User from "../models/user";

export const emailTemplates = {
  verifyEmail: (user: User, code: string): string => {
    const logoUrl: string | undefined = process.env.LOGO_URL;

    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${process.env.APP_NAME}</title>
    <style>
    * { 
        margin:0;
        padding:0;
        font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; 
        font-size: 100%;
        line-height: 1.6;
    }
    
    img { 
        max-width: 100%; 
    }
    
    body {
        -webkit-font-smoothing:antialiased; 
        -webkit-text-size-adjust:none; 
        width: 100%!important; 
        height: 100%;
    }
    
    a { 
        color: #348eda;
    }
    
    .btn-primary{
        text-decoration:none;
        color: #FFF;
        background-color: #348eda;
        border:solid #348eda;
        border-width:10px 20px;
        line-height:2;
        font-weight:bold;
        margin-right:10px;
        text-align:center;
        cursor:pointer;
        display: inline-block;
        border-radius: 25px;
    }
    
    .btn-secondary {
        text-decoration:none;
        color: #FFF;
        background-color: #aaa;
        border:solid #aaa;
        border-width:10px 20px;
        line-height:2;
        font-weight:bold;
        margin-right:10px;
        text-align:center;
        cursor:pointer;
        display: inline-block;
        border-radius: 25px;
    }
    
    .last { 
        margin-bottom: 0;
    }
    
    .first{
        margin-top: 0;
    }
    
    .padding{
        padding:10px 0;
    }
    
    table.body-wrap { 
        width: 100%;
        padding: 20px;
    }
    
    table.body-wrap .container{
        border: 1px solid #f0f0f0;
    }
    
    table.footer-wrap { 
        width: 100%;	
        clear:both!important;
    }
    
    .footer-wrap .container p {
        font-size:12px;
        color:#666;
    }
    
    table.footer-wrap a{
        color: #999;
    }
    
    h1,h2,h3{
        font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
        line-height: 1.1; 
        margin-bottom:15px; 
        color:#000;
        margin: 40px 0 10px;
        line-height: 1.2;
        font-weight:200; 
    }
    
    h1 {
        font-size: 36px;
    }
    h2 {
        font-size: 28px;
        text-align:center;
    }
    h3 {
        font-size: 22px;
    }
    
    p, ul, ol { 
        margin-bottom: 10px; 
        font-weight: normal; 
        font-size:15px;
    }
    
    ul li, ol li {
        margin-left:5px;
        list-style-position: inside;
    }
    
    strong{
        font-size:18px;
        font-weight:normal;
    }
    
    .container {
        display:block!important;
        max-width:600px!important;
        margin:0 auto!important; 
        clear:both!important;
    }
    
    .body-wrap .container{
        padding:20px;
    }
    
    .content {
        max-width:600px;
        margin:0 auto;
        display:block; 
    }
    
    .content table { 
        width: 100%; 
    }
    
    .center{
        text-align:center;
    }
    
    .left{
        text-align:left;
    }
    
    .logo{
        display:inline-block;
        width:399px;
        height:85px;
        max-width:90%;
    }
    
    .footnote{
        font-size:14px;
        color:#444;
    }
    
    @media all and (min-resolution: 192dpi), (-webkit-min-device-pixel-ratio: 2), (min--moz-device-pixel-ratio: 2), (-o-min-device-pixel-ratio: 2/1), (min-device-pixel-ratio: 2), (min-resolution: 2dppx){
        .logo{
            background-image:url(chartblocks@2x.png);
            background-size:100% auto;
            background-repeat:no-repeat;
        }
        .logo img{
            visibility:hidden;
        }
    }
    
    </style>
    </head>
    
    <body bgcolor="#f6f6f6">
    
    <!-- body -->
    <table class="body-wrap">
        <tr>
            <td></td>
            <td class="container" bgcolor="#FFFFFF">
                <div class="content">
                <table>
                    <tr>
                        <td class="center">
                            <div class="logo">
                                <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2>Activate your account</h2>
                            <p>Hi ${user.firstName} ${user.lastName},</p>
                            <p>Thank you for creating an account on ${process.env.APP_NAME}. To complete the registration and use ${user.email} to log in, please verify your email by using the code below:</p>
                            <table>
                                <tr>
                                    <td class="padding left">
                                        <p><strong>${code}</strong></p>
                                    </td>
                                </tr>
                            </table>
                            <p>This code is valid for one hour from the time this message was sent.</p>
                            <p>Thank you,<br> The ${process.env.APP_NAME} Support Team.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="footnote">If you encounter any issues, please contact our support team at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a> and we will assist you as soon as possible.</p>
                        </td>
                    </tr>
                </table>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
    
    <!-- footer -->
    <table class="footer-wrap">
        <tr>
            <td></td>
            <td class="container">
                <div class="content">
                    <table>
                        <tr>
                            <td align="center">
                                <script>
                    document.write(new Date().getFullYear())
                    </script> © <a href="#">${process.env.APP_NAME}</a>.
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
    
    </body>
    </html>
    
      `;
  },

  forgotPassword: (user: User, code: string): string => {
    const logoUrl: string | undefined = process.env.LOGO_URL;

    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${process.env.APP_NAME}</title>
    <style>
    * { 
        margin:0;
        padding:0;
        font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; 
        font-size: 100%;
        line-height: 1.6;
    }
    
    img { 
        max-width: 100%; 
    }
    
    body {
        -webkit-font-smoothing:antialiased; 
        -webkit-text-size-adjust:none; 
        width: 100%!important; 
        height: 100%;
    }
    
    a { 
        color: #348eda;
    }
    
    .btn-primary{
        text-decoration:none;
        color: #FFF;
        background-color: #348eda;
        border:solid #348eda;
        border-width:10px 20px;
        line-height:2;
        font-weight:bold;
        margin-right:10px;
        text-align:center;
        cursor:pointer;
        display: inline-block;
        border-radius: 25px;
    }
    
    .last { 
        margin-bottom: 0;
    }
    
    .first{
        margin-top: 0;
    }
    
    .padding{
        padding:10px 0;
    }
    
    table.body-wrap { 
        width: 100%;
        padding: 20px;
    }
    
    table.body-wrap .container{
        border: 1px solid #f0f0f0;
    }
    
    table.footer-wrap { 
        width: 100%;	
        clear:both!important;
    }
    
    .footer-wrap .container p {
        font-size:12px;
        color:#666;
    }
    
    table.footer-wrap a{
        color: #999;
    }
    
    h1,h2,h3{
        font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
        line-height: 1.1; 
        margin-bottom:15px; 
        color:#000;
        margin: 40px 0 10px;
        line-height: 1.2;
        font-weight:200; 
    }
    
    h1 {
        font-size: 36px;
    }
    h2 {
        font-size: 28px;
        text-align:center;
    }
    h3 {
        font-size: 22px;
    }
    
    p, ul, ol { 
        margin-bottom: 10px; 
        font-weight: normal; 
        font-size:15px;
    }
    
    .container {
        display:block!important;
        max-width:600px!important;
        margin:0 auto!important; 
        clear:both!important;
    }
    
    .body-wrap .container{
        padding:20px;
    }
    
    .content {
        max-width:600px;
        margin:0 auto;
        display:block; 
    }
    
    .content table { 
        width: 100%; 
    }
    
    .center{
        text-align:center;
    }
    
    .left{
        text-align:left;
    }
    
    .logo{
        display:inline-block;
        width:399px;
        height:85px;
        max-width:90%;
    }
    
    .footnote{
        font-size:14px;
        color:#444;
    }
    </style>
    </head>
    
    <body bgcolor="#f6f6f6">
    
    <!-- body -->
    <table class="body-wrap">
        <tr>
            <td></td>
            <td class="container" bgcolor="#FFFFFF">
                <div class="content">
                <table>
                    <tr>
                        <td class="center">
                            <div class="logo">
                                <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2>Password Reset Request</h2>
                            <p>Hi ${user.firstName} ${user.lastName},</p>
                            <p>We received a request to reset the password for your ${process.env.APP_NAME} account. If you made this request, use the code below to reset your password:</p>
                            <table>
                                <tr>
                                    <td class="padding left">
                                        <p><strong>${code}</strong></p>
                                    </td>
                                </tr>
                            </table>
                            <p>This code is valid for one hour from the time this message was sent. If you did not request a password reset, please ignore this email.</p>
                            <p>Thank you,<br> The ${process.env.APP_NAME} Support Team.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="footnote">If you have any questions or need assistance, feel free to contact our support team at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
                        </td>
                    </tr>
                </table>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
    
    <!-- footer -->
    <table class="footer-wrap">
        <tr>
            <td></td>
            <td class="container">
                <div class="content">
                    <table>
                        <tr>
                            <td align="center">
                                <script>
                    document.write(new Date().getFullYear())
                    </script> © <a href="#">${process.env.APP_NAME}</a>.
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
    
    </body>
    </html>
    
      `;
  },

  passwordResetNotification: (user: User): string => {
    const logoUrl: string | undefined = process.env.LOGO_URL;

    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${process.env.APP_NAME}</title>
    <style>
    * { 
        margin:0;
        padding:0;
        font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; 
        font-size: 100%;
        line-height: 1.6;
    }
    
    img { 
        max-width: 100%; 
    }
    
    body {
        -webkit-font-smoothing:antialiased; 
        -webkit-text-size-adjust:none; 
        width: 100%!important; 
        height: 100%;
    }
    
    a { 
        color: #348eda;
    }
    
    .btn-primary{
        text-decoration:none;
        color: #FFF;
        background-color: #348eda;
        border:solid #348eda;
        border-width:10px 20px;
        line-height:2;
        font-weight:bold;
        margin-right:10px;
        text-align:center;
        cursor:pointer;
        display: inline-block;
        border-radius: 25px;
    }
    
    .last { 
        margin-bottom: 0;
    }
    
    .first{
        margin-top: 0;
    }
    
    .padding{
        padding:10px 0;
    }
    
    table.body-wrap { 
        width: 100%;
        padding: 20px;
    }
    
    table.body-wrap .container{
        border: 1px solid #f0f0f0;
    }
    
    table.footer-wrap { 
        width: 100%;	
        clear:both!important;
    }
    
    .footer-wrap .container p {
        font-size:12px;
        color:#666;
    }
    
    table.footer-wrap a{
        color: #999;
    }
    
    h1,h2,h3{
        font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
        line-height: 1.1; 
        margin-bottom:15px; 
        color:#000;
        margin: 40px 0 10px;
        line-height: 1.2;
        font-weight:200; 
    }
    
    h1 {
        font-size: 36px;
    }
    h2 {
        font-size: 28px;
        text-align:center;
    }
    h3 {
        font-size: 22px;
    }
    
    p, ul, ol { 
        margin-bottom: 10px; 
        font-weight: normal; 
        font-size:15px;
    }
    
    .container {
        display:block!important;
        max-width:600px!important;
        margin:0 auto!important; 
        clear:both!important;
    }
    
    .body-wrap .container{
        padding:20px;
    }
    
    .content {
        max-width:600px;
        margin:0 auto;
        display:block; 
    }
    
    .content table { 
        width: 100%; 
    }
    
    .center{
        text-align:center;
    }
    
    .left{
        text-align:left;
    }
    
    .logo{
        display:inline-block;
        width:399px;
        height:85px;
        max-width:90%;
    }
    
    .footnote{
        font-size:14px;
        color:#444;
    }
    </style>
    </head>
    
    <body bgcolor="#f6f6f6">
    
    <!-- body -->
    <table class="body-wrap">
        <tr>
            <td></td>
            <td class="container" bgcolor="#FFFFFF">
                <div class="content">
                <table>
                    <tr>
                        <td class="center">
                            <div class="logo">
                                <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2>Password Reset Successful</h2>
                            <p>Hi ${user.firstName} ${user.lastName},</p>
                            <p>We wanted to let you know that your password has been successfully reset for your ${process.env.APP_NAME} account.</p>
                            <p>If you didn't make this change or suspect unauthorized access to your account, please contact our support team immediately.</p>
                            <p>Thank you,<br> The ${process.env.APP_NAME} Support Team.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="footnote">For any questions or concerns, feel free to contact our support team at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
                        </td>
                    </tr>
                </table>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
    
    <!-- footer -->
    <table class="footer-wrap">
        <tr>
            <td></td>
            <td class="container">
                <div class="content">
                    <table>
                        <tr>
                            <td align="center">
                                <script>
                    document.write(new Date().getFullYear())
                    </script> © <a href="#">${process.env.APP_NAME}</a>.
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
    
    </body>
    </html>
    
      `;
  },

  adminPasswordResetNotification: (admin: Admin): string => {
    const logoUrl: string | undefined = process.env.LOGO_URL;

    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${process.env.APP_NAME}</title>
    <style>
    * { 
        margin:0;
        padding:0;
        font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; 
        font-size: 100%;
        line-height: 1.6;
    }
    
    img { 
        max-width: 100%; 
    }
    
    body {
        -webkit-font-smoothing:antialiased; 
        -webkit-text-size-adjust:none; 
        width: 100%!important; 
        height: 100%;
    }
    
    a { 
        color: #348eda;
    }
    
    .btn-primary{
        text-decoration:none;
        color: #FFF;
        background-color: #348eda;
        border:solid #348eda;
        border-width:10px 20px;
        line-height:2;
        font-weight:bold;
        margin-right:10px;
        text-align:center;
        cursor:pointer;
        display: inline-block;
        border-radius: 25px;
    }
    
    .last { 
        margin-bottom: 0;
    }
    
    .first{
        margin-top: 0;
    }
    
    .padding{
        padding:10px 0;
    }
    
    table.body-wrap { 
        width: 100%;
        padding: 20px;
    }
    
    table.body-wrap .container{
        border: 1px solid #f0f0f0;
    }
    
    table.footer-wrap { 
        width: 100%;	
        clear:both!important;
    }
    
    .footer-wrap .container p {
        font-size:12px;
        color:#666;
    }
    
    table.footer-wrap a{
        color: #999;
    }
    
    h1,h2,h3{
        font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
        line-height: 1.1; 
        margin-bottom:15px; 
        color:#000;
        margin: 40px 0 10px;
        line-height: 1.2;
        font-weight:200; 
    }
    
    h1 {
        font-size: 36px;
    }
    h2 {
        font-size: 28px;
        text-align:center;
    }
    h3 {
        font-size: 22px;
    }
    
    p, ul, ol { 
        margin-bottom: 10px; 
        font-weight: normal; 
        font-size:15px;
    }
    
    .container {
        display:block!important;
        max-width:600px!important;
        margin:0 auto!important; 
        clear:both!important;
    }
    
    .body-wrap .container{
        padding:20px;
    }
    
    .content {
        max-width:600px;
        margin:0 auto;
        display:block; 
    }
    
    .content table { 
        width: 100%; 
    }
    
    .center{
        text-align:center;
    }
    
    .left{
        text-align:left;
    }
    
    .logo{
        display:inline-block;
        width:399px;
        height:85px;
        max-width:90%;
    }
    
    .footnote{
        font-size:14px;
        color:#444;
    }
    </style>
    </head>
    
    <body bgcolor="#f6f6f6">
    
    <!-- body -->
    <table class="body-wrap">
        <tr>
            <td></td>
            <td class="container" bgcolor="#FFFFFF">
                <div class="content">
                <table>
                    <tr>
                        <td class="center">
                            <div class="logo">
                                <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2>Password Reset Successful</h2>
                            <p>Hi ${admin.name},</p>
                            <p>We wanted to let you know that your password has been successfully reset for your ${process.env.APP_NAME} account.</p>
                            <p>If you didn't make this change or suspect unauthorized access to your account, please contact our support team immediately.</p>
                            <p>Thank you,<br> The ${process.env.APP_NAME} Support Team.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="footnote">For any questions or concerns, feel free to contact our support team at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
                        </td>
                    </tr>
                </table>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
    
    <!-- footer -->
    <table class="footer-wrap">
        <tr>
            <td></td>
            <td class="container">
                <div class="content">
                    <table>
                        <tr>
                            <td align="center">
                                <script>
                    document.write(new Date().getFullYear())
                    </script> © <a href="#">${process.env.APP_NAME}</a>.
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
            <td></td>
        </tr>
    </table>
    
    </body>
    </html>
    
      `;
  },

  resendCode: (user: User, code: string, newEmail: string): string => {
    const logoUrl: string | undefined = process.env.LOGO_URL;

    return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${process.env.APP_NAME} - Verify Your New Email</title>
        <style>
        * { 
            margin:0;
            padding:0;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; 
            font-size: 100%;
            line-height: 1.6;
        }

        img { 
            max-width: 100%; 
        }

        body {
            -webkit-font-smoothing:antialiased; 
            -webkit-text-size-adjust:none; 
            width: 100%!important; 
            height: 100%;
        }

        a { 
            color: #348eda;
        }

        .btn-primary{
            text-decoration:none;
            color: #FFF;
            background-color: #348eda;
            border:solid #348eda;
            border-width:10px 20px;
            line-height:2;
            font-weight:bold;
            margin-right:10px;
            text-align:center;
            cursor:pointer;
            display: inline-block;
            border-radius: 25px;
        }

        .last { 
            margin-bottom: 0;
        }

        .first{
            margin-top: 0;
        }

        .padding{
            padding:10px 0;
        }

        table.body-wrap { 
            width: 100%;
            padding: 20px;
        }

        table.body-wrap .container{
            border: 1px solid #f0f0f0;
        }

        table.footer-wrap { 
            width: 100%;	
            clear:both!important;
        }

        .footer-wrap .container p {
            font-size:12px;
            color:#666;
        }

        table.footer-wrap a{
            color: #999;
        }

        h1,h2,h3{
            font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
            line-height: 1.1; 
            margin-bottom:15px; 
            color:#000;
            margin: 40px 0 10px;
            line-height: 1.2;
            font-weight:200; 
        }

        h1 {
            font-size: 36px;
        }
        h2 {
            font-size: 28px;
            text-align:center;
        }
        h3 {
            font-size: 22px;
        }

        p, ul, ol { 
            margin-bottom: 10px; 
            font-weight: normal; 
            font-size:15px;
        }

        ul li, ol li {
            margin-left:5px;
            list-style-position: inside;
        }

        .container {
            display:block!important;
            max-width:600px!important;
            margin:0 auto!important; 
            clear:both!important;
        }

        .body-wrap .container{
            padding:20px;
        }

        .content {
            max-width:600px;
            margin:0 auto;
            display:block; 
        }

        .content table { 
            width: 100%; 
        }

        .center{
            text-align:center;
        }

        .left{
            text-align:left;
        }

        .logo{
            display:inline-block;
            width:399px;
            height:85px;
            max-width:90%;
        }

        .footnote{
            font-size:14px;
            color:#444;
        }
        </style>
        </head>

        <body bgcolor="#f6f6f6">

        <!-- body -->
        <table class="body-wrap">
            <tr>
                <td></td>
                <td class="container" bgcolor="#FFFFFF">
                    <div class="content">
                    <table>
                        <tr>
                            <td class="center">
                                <div class="logo">
                                    <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2>Verify Your New Email Address</h2>
                                <p>Hi ${user.firstName} ${user.lastName},</p>
                                <p>We received a request to change the email address associated with your ${process.env.APP_NAME} account. To confirm this email address (${newEmail}), please enter the code below to complete the process:</p>
                                <table>
                                    <tr>
                                        <td class="padding left">
                                            <p><strong>${code}</strong></p>
                                        </td>
                                    </tr>
                                </table>
                                <p>This verification code is valid for one hour.</p>
                                <p>If you did not request this change, please ignore this email or contact our support team immediately.</p>
                                <p>Thank you,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">If you encounter any issues, please contact our support team at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a> and we will assist you.</p>
                            </td>
                        </tr>
                    </table>
                    </div>
                </td>
                <td></td>
            </tr>
        </table>

        <!-- footer -->
        <table class="footer-wrap">
            <tr>
                <td></td>
                <td class="container">
                    <div class="content">
                        <table>
                            <tr>
                                <td align="center">
                                    <script>
                        document.write(new Date().getFullYear())
                        </script> © <a href="#">${process.env.APP_NAME}</a>.
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
                <td></td>
            </tr>
        </table>

        </body>
        </html>

    `;
  },

  emailAddressChanged: (user: User): string => {
    const logoUrl: string | undefined = process.env.LOGO_URL;

    return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${process.env.APP_NAME} - Email Address Changed</title>
        <style>
        * { 
            margin:0;
            padding:0;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; 
            font-size: 100%;
            line-height: 1.6;
        }

        img { 
            max-width: 100%; 
        }

        body {
            -webkit-font-smoothing:antialiased; 
            -webkit-text-size-adjust:none; 
            width: 100%!important; 
            height: 100%;
        }

        a { 
            color: #348eda;
        }

        .btn-primary{
            text-decoration:none;
            color: #FFF;
            background-color: #348eda;
            border:solid #348eda;
            border-width:10px 20px;
            line-height:2;
            font-weight:bold;
            margin-right:10px;
            text-align:center;
            cursor:pointer;
            display: inline-block;
            border-radius: 25px;
        }

        .last { 
            margin-bottom: 0;
        }

        .first{
            margin-top: 0;
        }

        .padding{
            padding:10px 0;
        }

        table.body-wrap { 
            width: 100%;
            padding: 20px;
        }

        table.body-wrap .container{
            border: 1px solid #f0f0f0;
        }

        table.footer-wrap { 
            width: 100%;	
            clear:both!important;
        }

        .footer-wrap .container p {
            font-size:12px;
            color:#666;
        }

        table.footer-wrap a{
            color: #999;
        }

        h1,h2,h3{
            font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
            line-height: 1.1; 
            margin-bottom:15px; 
            color:#000;
            margin: 40px 0 10px;
            line-height: 1.2;
            font-weight:200; 
        }

        h1 {
            font-size: 36px;
        }
        h2 {
            font-size: 28px;
            text-align:center;
        }
        h3 {
            font-size: 22px;
        }

        p, ul, ol { 
            margin-bottom: 10px; 
            font-weight: normal; 
            font-size:15px;
        }

        ul li, ol li {
            margin-left:5px;
            list-style-position: inside;
        }

        .container {
            display:block!important;
            max-width:600px!important;
            margin:0 auto!important; 
            clear:both!important;
        }

        .body-wrap .container{
            padding:20px;
        }

        .content {
            max-width:600px;
            margin:0 auto;
            display:block; 
        }

        .content table { 
            width: 100%; 
        }

        .center{
            text-align:center;
        }

        .left{
            text-align:left;
        }

        .logo{
            display:inline-block;
            width:399px;
            height:85px;
            max-width:90%;
        }

        .footnote{
            font-size:14px;
            color:#444;
        }
        </style>
        </head>

        <body bgcolor="#f6f6f6">

        <!-- body -->
        <table class="body-wrap">
            <tr>
                <td></td>
                <td class="container" bgcolor="#FFFFFF">
                    <div class="content">
                    <table>
                        <tr>
                            <td class="center">
                                <div class="logo">
                                    <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2>Your Email Address Has Been Changed</h2>
                                <p>Hi ${user.firstName} ${user.lastName},</p>
                                <p>This is a confirmation that your email address for your ${process.env.APP_NAME} account has been successfully updated to ${user.email}.</p>
                                <p>If you did not make this request or you believe this is a mistake, please contact our support team immediately at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
                                <p>Thank you,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">If you encounter any issues, please contact our support team at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a> and we will assist you as soon as possible.</p>
                            </td>
                        </tr>
                    </table>
                    </div>
                </td>
                <td></td>
            </tr>
        </table>

        <!-- footer -->
        <table class="footer-wrap">
            <tr>
                <td></td>
                <td class="container">
                    <div class="content">
                        <table>
                            <tr>
                                <td align="center">
                                    <script>
                        document.write(new Date().getFullYear())
                        </script> © <a href="#">${process.env.APP_NAME}</a>.
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
                <td></td>
            </tr>
        </table>

        </body>
        </html>

    `;
  },

  phoneNumberUpdated: (user: User): string => {
    const logoUrl: string | undefined = process.env.LOGO_URL;

    return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${process.env.APP_NAME} - Phone Number Updated</title>
        <style>
        * { 
            margin:0;
            padding:0;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; 
            font-size: 100%;
            line-height: 1.6;
        }

        img { 
            max-width: 100%; 
        }

        body {
            -webkit-font-smoothing:antialiased; 
            -webkit-text-size-adjust:none; 
            width: 100%!important; 
            height: 100%;
        }

        a { 
            color: #348eda;
        }

        .btn-primary{
            text-decoration:none;
            color: #FFF;
            background-color: #348eda;
            border:solid #348eda;
            border-width:10px 20px;
            line-height:2;
            font-weight:bold;
            margin-right:10px;
            text-align:center;
            cursor:pointer;
            display: inline-block;
            border-radius: 25px;
        }

        .last { 
            margin-bottom: 0;
        }

        .first{
            margin-top: 0;
        }

        .padding{
            padding:10px 0;
        }

        table.body-wrap { 
            width: 100%;
            padding: 20px;
        }

        table.body-wrap .container{
            border: 1px solid #f0f0f0;
        }

        table.footer-wrap { 
            width: 100%;	
            clear:both!important;
        }

        .footer-wrap .container p {
            font-size:12px;
            color:#666;
        }

        table.footer-wrap a{
            color: #999;
        }

        h1,h2,h3{
            font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
            line-height: 1.1; 
            margin-bottom:15px; 
            color:#000;
            margin: 40px 0 10px;
            line-height: 1.2;
            font-weight:200; 
        }

        h1 {
            font-size: 36px;
        }
        h2 {
            font-size: 28px;
            text-align:center;
        }
        h3 {
            font-size: 22px;
        }

        p, ul, ol { 
            margin-bottom: 10px; 
            font-weight: normal; 
            font-size:15px;
        }

        ul li, ol li {
            margin-left:5px;
            list-style-position: inside;
        }

        .container {
            display:block!important;
            max-width:600px!important;
            margin:0 auto!important; 
            clear:both!important;
        }

        .body-wrap .container{
            padding:20px;
        }

        .content {
            max-width:600px;
            margin:0 auto;
            display:block; 
        }

        .content table { 
            width: 100%; 
        }

        .center{
            text-align:center;
        }

        .left{
            text-align:left;
        }

        .logo{
            display:inline-block;
            width:399px;
            height:85px;
            max-width:90%;
        }

        .footnote{
            font-size:14px;
            color:#444;
        }
        </style>
        </head>

        <body bgcolor="#f6f6f6">

        <!-- body -->
        <table class="body-wrap">
            <tr>
                <td></td>
                <td class="container" bgcolor="#FFFFFF">
                    <div class="content">
                    <table>
                        <tr>
                            <td class="center">
                                <div class="logo">
                                    <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2>Phone Number Updated</h2>
                                <p>Hi ${user.firstName} ${user.lastName},</p>
                                <p>We wanted to inform you that the phone number associated with your ${process.env.APP_NAME} account has been successfully updated.</p>
                                <p>If you did not request this change or believe this was done in error, please contact our support team immediately.</p>
                                <p>Thank you for using ${process.env.APP_NAME}. We are here to ensure your account's security at all times.</p>
                                <p>Thank you,<br>The ${process.env.APP_NAME} Support Team</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">If you have any questions, please contact our support team at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a> and we will assist you as soon as possible.</p>
                            </td>
                        </tr>
                    </table>
                    </div>
                </td>
                <td></td>
            </tr>
        </table>

        <!-- footer -->
        <table class="footer-wrap">
            <tr>
                <td></td>
                <td class="container">
                    <div class="content">
                        <table>
                            <tr>
                                <td align="center">
                                    <script>
                        document.write(new Date().getFullYear())
                        </script> © <a href="#">${process.env.APP_NAME}</a>.
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
                <td></td>
            </tr>
        </table>

        </body>
        </html>

    `;
  },

  subAdminCreated: (subAdmin: Admin, temporaryPassword: string): string => {
    const logoUrl: string | undefined = process.env.LOGO_URL;

    return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${process.env.APP_NAME} - Sub-Admin Login Details</title>
        <style>
        * { 
            margin:0;
            padding:0;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; 
            font-size: 100%;
            line-height: 1.6;
        }

        img { 
            max-width: 100%; 
        }

        body {
            -webkit-font-smoothing:antialiased; 
            -webkit-text-size-adjust:none; 
            width: 100%!important; 
            height: 100%;
        }

        a { 
            color: #348eda;
        }

        .btn-primary{
            text-decoration:none;
            color: #FFF;
            background-color: #348eda;
            border:solid #348eda;
            border-width:10px 20px;
            line-height:2;
            font-weight:bold;
            margin-right:10px;
            text-align:center;
            cursor:pointer;
            display: inline-block;
            border-radius: 25px;
        }

        .last { 
            margin-bottom: 0;
        }

        .first{
            margin-top: 0;
        }

        .padding{
            padding:10px 0;
        }

        table.body-wrap { 
            width: 100%;
            padding: 20px;
        }

        table.body-wrap .container{
            border: 1px solid #f0f0f0;
        }

        table.footer-wrap { 
            width: 100%;	
            clear:both!important;
        }

        .footer-wrap .container p {
            font-size:12px;
            color:#666;
        }

        table.footer-wrap a{
            color: #999;
        }

        h1,h2,h3{
            font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
            line-height: 1.1; 
            margin-bottom:15px; 
            color:#000;
            margin: 40px 0 10px;
            line-height: 1.2;
            font-weight:200; 
        }

        h1 {
            font-size: 36px;
        }
        h2 {
            font-size: 28px;
            text-align:center;
        }
        h3 {
            font-size: 22px;
        }

        p, ul, ol { 
            margin-bottom: 10px; 
            font-weight: normal; 
            font-size:15px;
        }

        ul li, ol li {
            margin-left:5px;
            list-style-position: inside;
        }

        .container {
            display:block!important;
            max-width:600px!important;
            margin:0 auto!important; 
            clear:both!important;
        }

        .body-wrap .container{
            padding:20px;
        }

        .content {
            max-width:600px;
            margin:0 auto;
            display:block; 
        }

        .content table { 
            width: 100%; 
        }

        .center{
            text-align:center;
        }

        .left{
            text-align:left;
        }

        .logo{
            display:inline-block;
            width:399px;
            height:85px;
            max-width:90%;
        }

        .footnote{
            font-size:14px;
            color:#444;
        }
        </style>
        </head>

        <body bgcolor="#f6f6f6">

        <!-- body -->
        <table class="body-wrap">
            <tr>
                <td></td>
                <td class="container" bgcolor="#FFFFFF">
                    <div class="content">
                    <table>
                        <tr>
                            <td class="center">
                                <div class="logo">
                                    <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h2>Sub-Admin Account Created</h2>
                                <p>Hi ${subAdmin.name},</p>
                                <p>Your sub-admin account has been created on the ${process.env.APP_NAME} platform. You can use the login details provided below to access your account:</p>
                                <table>
                                    <tr>
                                        <td class="padding left">
                                            <p><strong>Login Details:</strong></p>
                                            <p>Email: <strong>${subAdmin.email}</strong></p>
                                            <p>Password: <strong>${temporaryPassword}</strong></p>
                                            <p>Link: <a href="${process.env.ADMIN_LINK}">${process.env.ADMIN_LINK}</a></p>
                                        </td>
                                    </tr>
                                </table>
                                <p>Please log in to your account and change your password after your first login.</p>
                                <p>If you encounter any issues, feel free to reach out to our support team.</p>
                                <p>Thank you,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">If you encounter any issues, please contact our support team at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a> and we will assist you.</p>
                            </td>
                        </tr>
                    </table>
                    </div>
                </td>
                <td></td>
            </tr>
        </table>

        <!-- footer -->
        <table class="footer-wrap">
            <tr>
                <td></td>
                <td class="container">
                    <div class="content">
                        <table>
                            <tr>
                                <td align="center">
                                    <script>
                        document.write(new Date().getFullYear())
                        </script> © <a href="#">${process.env.APP_NAME}</a>.
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
                <td></td>
            </tr>
        </table>

        </body>
        </html>
    `;
  }
  // Add more templates as needed
};
