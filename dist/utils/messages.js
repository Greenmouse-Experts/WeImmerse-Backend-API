"use strict";
// utils/emailTemplates.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
const withdrawalrequest_1 = require("../models/withdrawalrequest");
const helpers_1 = require("./helpers");
const moment_1 = __importDefault(require("moment"));
exports.emailTemplates = {
    verifyEmail: (user, code) => {
        const logoUrl = process.env.LOGO_URL;
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
        color: #7008fa;
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
                            <p>Hi ${user.name},</p>
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
    forgotPassword: (user, code) => {
        const logoUrl = process.env.LOGO_URL;
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
        color: #7008fa;
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
                            <p>Hi ${user.name},</p>
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
    passwordResetNotification: (user) => {
        const logoUrl = process.env.LOGO_URL;
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
        color: #7008fa;
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
                            <p>Hi ${user.name},</p>
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
    adminPasswordResetNotification: (admin) => {
        const logoUrl = process.env.LOGO_URL;
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
        color: #7008fa;
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
    resendCode: (user, code, newEmail) => {
        const logoUrl = process.env.LOGO_URL;
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
            color: #7008fa;
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
                                <p>Hi ${user.name},</p>
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
    emailAddressChanged: (user) => {
        const logoUrl = process.env.LOGO_URL;
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
            color: #7008fa;
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
                                <p>Hi ${user.name},</p>
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
    phoneNumberUpdated: (user) => {
        const logoUrl = process.env.LOGO_URL;
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
            color: #7008fa;
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
                                <p>Hi ${user.name},</p>
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
    subAdminCreated: (subAdmin, temporaryPassword) => {
        const logoUrl = process.env.LOGO_URL;
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
            color: #7008fa;
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
    },
    kycStatusUpdate: (user, isApproved, adminNote) => {
        const logoUrl = process.env.LOGO_URL;
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${process.env.APP_NAME} - KYC Notification</title>
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
                color: #7008fa;
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
                                <h2>KYC Status Update</h2>
                                <p>Hi ${user.name},</p>
                                <p>Your KYC submission has been reviewed.</p>
                                <p>Status: <strong>${isApproved ? 'Approved' : 'Rejected'}</strong></p>
                                ${!isApproved
            ? `<p>Note: ${adminNote ||
                'No additional notes provided.'}</p>`
            : ''}
                                <p>Thank you for your cooperation!</p>
                                <p>If you have any questions, feel free to reach out to our support team.</p>
                                <p>Best regards,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">For assistance, please contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
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
                                © <script>document.write(new Date().getFullYear())</script> <a href="#">${process.env.APP_NAME}</a>.
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
    applicantNotify: (job, user, application) => {
        const logoUrl = process.env.LOGO_URL;
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${process.env.APP_NAME} - Application Confirmation</title>
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
                color: #7008fa;
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
                                <h2>Application Confirmation</h2>
                                <p>Hi ${user.name},</p>
                                <p>Your application was sent to ${job.company}</p>
                                <p><strong>${job.title}</strong></p>
                                <p><strong>${job.location}</strong></p>
                                <p><strong>${new Date(application.createdAt).toLocaleString()}</strong></p>
                                <p>We will notify you of any updates regarding your application.</p>
                                <p>If you have any questions, feel free to reach out to our support team.</p>
                                <p>Best regards,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">For assistance, please contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
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
                                © <script>document.write(new Date().getFullYear())</script> <a href="#">${process.env.APP_NAME}</a>.
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
    jobOwnerMailData: (job, creator, user, application) => {
        const logoUrl = process.env.LOGO_URL;
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${process.env.APP_NAME} - New Job Application</title>
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
                color: #7008fa;
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
                                <h2>Application Confirmation</h2>
                                <p>Hi ${creator.name},</p>
                                <p>A new application has been received for the position of ${job.title}.</p>
                                <p>Below are the applicant details:</p>
                                <p>Name: <strong>${user.name}</strong></p>
                                <p>Email: <strong>${application.emailAddress}</strong></p>
                                <table>
                                    <tr>
                                        <td class="padding left">
                                            <p><a href="${application.resume}">Download Resume</a></p>                                      </td>
                                    </tr>
                                </table>
                                <p>Please review the application and proceed accordingly.</p>
                                <p>If you have any questions, feel free to reach out to our support team.</p>
                                <p>Best regards,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">For assistance, please contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
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
                                © <script>document.write(new Date().getFullYear())</script> <a href="#">${process.env.APP_NAME}</a>.
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
    notifyApplicant: (job, creator, user) => {
        const logoUrl = process.env.LOGO_URL;
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                color: #7008fa;
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
                                <h2>Your application was viewed!</h2>
                                <p>Hi ${user.name},</p>
                                <p>
                                    <img src="${job.logo}" alt="${job.company}" width="70">
                                </p>
                                <p><strong>${job.title}</strong></p>
                                <p><strong>${job.company} . ${job.location}</strong></p>
                                <hr>
                                <p>Job posted by</p>
                                <p>
                                    <img src="${creator.photo}" alt="${creator.name}" width="70">
                                </p>
                                <p><strong>${creator.name}</strong></p>
                                <p>You are receiving ${process.env.APP_NAME} notification emails</p>
                                <p>Best regards,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">For assistance, please contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
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
                                © <script>document.write(new Date().getFullYear())</script> <a href="#">${process.env.APP_NAME}</a>.
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
    applicantRejection: (job, creator, user, application) => {
        const logoUrl = process.env.LOGO_URL;
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                color: #7008fa;
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
                                <h2>Your update from ${job.company}</h2>
                                <p>Hi ${user.name},</p>
                                <p>Thank you for applying to the position of <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>
                                <p>We regret to inform you that your application has not been successful at this time.</p>
                                <p>
                                    <img src="${job.logo}" alt="${job.company}" width="70">
                                </p>
                                <p><strong>${job.title} [${job.jobType}]</strong></p>
                                <p><strong>Applied on ${new Date(application.createdAt).toLocaleString()}</strong></p>
                                <p>We wish you the best of luck in your future endeavors.</p>
                                <p>Best regards,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">For assistance, please contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.</p>
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
                                © <script>document.write(new Date().getFullYear())</script> <a href="#">${process.env.APP_NAME}</a>.
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
    vettedAccount: (user, status, reason, verification_url) => {
        const logoUrl = process.env.LOGO_URL;
        const details = status === helpers_1.AccountVettingStatus.APPROVED
            ? `
    <p>Congratulations! Your account is now verified, and you have full access to all features.</p>
    `
            : `<p>It looks like we couldn’t approve your verification because:</p>
    <p>Reason:<br/><b>${reason}</b></p>
    <p>You can update your details and try again here: <a href="${verification_url}">👉🏼 Click here</a></p>`;
        return `
<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${process.env.APP_NAME}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
            font-size: 100%;
            line-height: 1.6;
        }

        img {
            max-width: 100%;
        }

        body {
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: none;
            width: 100% !important;
            height: 100%;
        }

        a {
            color: #348eda;
        }

        .btn-primary {
            text-decoration: none;
            color: #FFF;
            background-color: #348eda;
            border: solid #348eda;
            border-width: 10px 20px;
            line-height: 2;
            font-weight: bold;
            margin-right: 10px;
            text-align: center;
            cursor: pointer;
            display: inline-block;
            border-radius: 25px;
        }

        .btn-secondary {
            text-decoration: none;
            color: #FFF;
            background-color: #aaa;
            border: solid #aaa;
            border-width: 10px 20px;
            line-height: 2;
            font-weight: bold;
            margin-right: 10px;
            text-align: center;
            cursor: pointer;
            display: inline-block;
            border-radius: 25px;
        }

        .last {
            margin-bottom: 0;
        }

        .first {
            margin-top: 0;
        }

        .padding {
            padding: 10px 0;
        }

        table.body-wrap {
            width: 100%;
            padding: 20px;
        }

        table.body-wrap .container {
            border: 1px solid #f0f0f0;
        }

        table.footer-wrap {
            width: 100%;
            clear: both !important;
        }

        .footer-wrap .container p {
            font-size: 12px;
            color: #666;
        }

        table.footer-wrap a {
            color: #999;
        }

        h1,
        h2,
        h3 {
            font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
            line-height: 1.1;
            margin-bottom: 15px;
            color: #000;
            margin: 40px 0 10px;
            line-height: 1.2;
            font-weight: 200;
        }

        h1 {
            font-size: 36px;
        }

        h2 {
            font-size: 28px;
            text-align: center;
            color: #7008fa;
        }

        h3 {
            font-size: 22px;
        }

        p,
        ul,
        ol {
            margin-bottom: 10px;
            font-weight: normal;
            font-size: 15px;
        }

        ul li,
        ol li {
            margin-left: 5px;
            list-style-position: inside;
        }

        strong {
            font-size: 18px;
            font-weight: normal;
        }

        .container {
            display: block !important;
            max-width: 600px !important;
            margin: 0 auto !important;
            clear: both !important;
        }

        .body-wrap .container {
            padding: 20px;
        }

        .content {
            max-width: 600px;
            margin: 0 auto;
            display: block;
        }

        .content table {
            width: 100%;
        }

        .center {
            text-align: center;
        }

        .left {
            text-align: left;
        }

        .logo {
            display: inline-block;
            width: 399px;
            height: 85px;
            max-width: 90%;
        }

        .footnote {
            font-size: 14px;
            color: #444;
        }

        @media all and (min-resolution: 192dpi),
        (-webkit-min-device-pixel-ratio: 2),
        (min--moz-device-pixel-ratio: 2),
        (-o-min-device-pixel-ratio: 2/1),
        (min-device-pixel-ratio: 2),
        (min-resolution: 2dppx) {
            .logo {
                background-image: url(chartblocks@2x.png);
                background-size: 100% auto;
                background-repeat: no-repeat;
            }

            .logo img {
                visibility: hidden;
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
                            <td>
                                <div class="logo" style="margin-bottom: 30px;">
                                    <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Dear ${user.name},</p>

                                <p>${details}</p>

                                <p>Best regards,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">If you encounter any issues, please contact our support team at <a
                                        href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a> and
                                    we will assist you as soon as possible.</p>
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
    vettedJob: (user, job) => {
        const logoUrl = process.env.LOGO_URL;
        const status_ = job.status === 'active' ? 'published' : 'closed';
        return `
<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${process.env.APP_NAME}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
            font-size: 100%;
            line-height: 1.6;
        }

        img {
            max-width: 100%;
        }

        body {
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: none;
            width: 100% !important;
            height: 100%;
        }

        a {
            color: #348eda;
        }

        .btn-primary {
            text-decoration: none;
            color: #FFF;
            background-color: #348eda;
            border: solid #348eda;
            border-width: 10px 20px;
            line-height: 2;
            font-weight: bold;
            margin-right: 10px;
            text-align: center;
            cursor: pointer;
            display: inline-block;
            border-radius: 25px;
        }

        .btn-secondary {
            text-decoration: none;
            color: #FFF;
            background-color: #aaa;
            border: solid #aaa;
            border-width: 10px 20px;
            line-height: 2;
            font-weight: bold;
            margin-right: 10px;
            text-align: center;
            cursor: pointer;
            display: inline-block;
            border-radius: 25px;
        }

        .last {
            margin-bottom: 0;
        }

        .first {
            margin-top: 0;
        }

        .padding {
            padding: 10px 0;
        }

        table.body-wrap {
            width: 100%;
            padding: 20px;
        }

        table.body-wrap .container {
            border: 1px solid #f0f0f0;
        }

        table.footer-wrap {
            width: 100%;
            clear: both !important;
        }

        .footer-wrap .container p {
            font-size: 12px;
            color: #666;
        }

        table.footer-wrap a {
            color: #999;
        }

        h1,
        h2,
        h3 {
            font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
            line-height: 1.1;
            margin-bottom: 15px;
            color: #000;
            margin: 40px 0 10px;
            line-height: 1.2;
            font-weight: 200;
        }

        h1 {
            font-size: 36px;
        }

        h2 {
            font-size: 28px;
            text-align: center;
            color: #7008fa;
        }

        h3 {
            font-size: 22px;
        }

        p,
        ul,
        ol {
            margin-bottom: 10px;
            font-weight: normal;
            font-size: 15px;
        }

        ul li,
        ol li {
            margin-left: 5px;
            list-style-position: inside;
        }

        strong {
            font-size: 18px;
            font-weight: normal;
        }

        .container {
            display: block !important;
            max-width: 600px !important;
            margin: 0 auto !important;
            clear: both !important;
        }

        .body-wrap .container {
            padding: 20px;
        }

        .content {
            max-width: 600px;
            margin: 0 auto;
            display: block;
        }

        .content table {
            width: 100%;
        }

        .center {
            text-align: center;
        }

        .left {
            text-align: left;
        }

        .logo {
            display: inline-block;
            width: 399px;
            height: 85px;
            max-width: 90%;
        }

        .footnote {
            font-size: 14px;
            color: #444;
        }

        @media all and (min-resolution: 192dpi),
        (-webkit-min-device-pixel-ratio: 2),
        (min--moz-device-pixel-ratio: 2),
        (-o-min-device-pixel-ratio: 2/1),
        (min-device-pixel-ratio: 2),
        (min-resolution: 2dppx) {
            .logo {
                background-image: url(chartblocks@2x.png);
                background-size: 100% auto;
                background-repeat: no-repeat;
            }

            .logo img {
                visibility: hidden;
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
                            <td>
                                <div class="logo" style="margin-bottom: 30px;">
                                    <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Dear ${user.name},</p>

                                <p>Your job post titled <strong>${job.title}</strong> has been <span class="status">${status_}</span>.</p>

                                <p>Best regards,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">If you encounter any issues, please contact our support team at <a
                                        href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a> and
                                    we will assist you as soon as possible.</p>
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
    kycStatusEmail: (user, kycDocument) => {
        const logoUrl = process.env.LOGO_URL;
        const statusText = kycDocument.vettingStatus === 'approved' ? 'approved' : 'rejected';
        return `
<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${process.env.APP_NAME}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
            font-size: 100%;
            line-height: 1.6;
        }

        img {
            max-width: 100%;
        }

        body {
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: none;
            width: 100% !important;
            height: 100%;
        }

        a {
            color: #348eda;
        }

        .btn-primary {
            text-decoration: none;
            color: #FFF;
            background-color: #348eda;
            border: solid #348eda;
            border-width: 10px 20px;
            line-height: 2;
            font-weight: bold;
            margin-right: 10px;
            text-align: center;
            cursor: pointer;
            display: inline-block;
            border-radius: 25px;
        }

        .btn-secondary {
            text-decoration: none;
            color: #FFF;
            background-color: #aaa;
            border: solid #aaa;
            border-width: 10px 20px;
            line-height: 2;
            font-weight: bold;
            margin-right: 10px;
            text-align: center;
            cursor: pointer;
            display: inline-block;
            border-radius: 25px;
        }

        .last {
            margin-bottom: 0;
        }

        .first {
            margin-top: 0;
        }

        .padding {
            padding: 10px 0;
        }

        table.body-wrap {
            width: 100%;
            padding: 20px;
        }

        table.body-wrap .container {
            border: 1px solid #f0f0f0;
        }

        table.footer-wrap {
            width: 100%;
            clear: both !important;
        }

        .footer-wrap .container p {
            font-size: 12px;
            color: #666;
        }

        table.footer-wrap a {
            color: #999;
        }

        h1,
        h2,
        h3 {
            font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
            line-height: 1.1;
            margin-bottom: 15px;
            color: #000;
            margin: 40px 0 10px;
            line-height: 1.2;
            font-weight: 200;
        }

        h1 {
            font-size: 36px;
        }

        h2 {
            font-size: 28px;
            text-align: center;
            color: #7008fa;
        }

        h3 {
            font-size: 22px;
        }

        p,
        ul,
        ol {
            margin-bottom: 10px;
            font-weight: normal;
            font-size: 15px;
        }

        ul li,
        ol li {
            margin-left: 5px;
            list-style-position: inside;
        }

        strong {
            font-size: 18px;
            font-weight: normal;
        }

        .container {
            display: block !important;
            max-width: 600px !important;
            margin: 0 auto !important;
            clear: both !important;
        }

        .body-wrap .container {
            padding: 20px;
        }

        .content {
            max-width: 600px;
            margin: 0 auto;
            display: block;
        }

        .content table {
            width: 100%;
        }

        .center {
            text-align: center;
        }

        .left {
            text-align: left;
        }

        .logo {
            display: inline-block;
            width: 399px;
            height: 85px;
            max-width: 90%;
        }

        .footnote {
            font-size: 14px;
            color: #444;
        }

        @media all and (min-resolution: 192dpi),
        (-webkit-min-device-pixel-ratio: 2),
        (min--moz-device-pixel-ratio: 2),
        (-o-min-device-pixel-ratio: 2/1),
        (min-device-pixel-ratio: 2),
        (min-resolution: 2dppx) {
            .logo {
                background-image: url(chartblocks@2x.png);
                background-size: 100% auto;
                background-repeat: no-repeat;
            }

            .logo img {
                visibility: hidden;
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
                            <td>
                                <div class="logo" style="margin-bottom: 30px;">
                                    <img src="${logoUrl}" alt="Logo of ${process.env.APP_NAME}" width="150px">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>    
                                <p>Dear ${user.name},</p>
        <p>Your KYC document (<strong>${kycDocument.documentType.replace('_', ' ')}</strong>) has been <span class="status">${statusText}</span>.</p>
        ${kycDocument.vettingStatus === 'rejected'
            ? '<p>Please update your document and try again.</p>'
            : '<p>You can now proceed with using our platform.</p>'}

        ${kycDocument.reason &&
            `<p>Reason: <br/> ${kycDocument.reason}</p><br/>`}
                                
                                <p>Best regards,<br> The ${process.env.APP_NAME} Support Team.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p class="footnote">If you encounter any issues, please contact our support team at <a
                                        href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a> and
                                    we will assist you as soon as possible.</p>
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
    withdrawalRequestEmail: (user, withdrawal) => {
        const adminPanelUrl = `${process.env.ADMIN_LINK}/admin/`;
        const logoUrl = process.env.LOGO_URL;
        return `
    <!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Withdrawal Request Notification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f6f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
      }
      .content {
        font-size: 16px;
        color: #555;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        background-color: #000;
        color: #ffffff !important;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        margin-top: 20px;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body >
    <div class="container" style="background-color: #f6f6f6;">
      <div class="logo" style="margin-bottom: 40px; text-align: center;">
        <img
          src="${logoUrl}"
          alt="Logo of ${process.env.APP_NAME}"
          width="150px"
        />
      </div>
      <div class="content">
        <p>Dear Admin,</p>
        <p>A new withdrawal request has been submitted.</p>
        <p>
          <strong>User:</strong> ${user.name} <br />
          <strong>Email:</strong> ${user.email} <br />
          <strong>Amount:</strong> ${(0, helpers_1.formatMoney)(withdrawal.amount, withdrawal.currency)} <br />
          <strong>Payment Method:</strong> ${withdrawal.paymentProvider}
        </p>
        <p>Please review and take the necessary actions.</p>
        <a href="${adminPanelUrl}" class="button">Review Request</a>
      </div>
      <div class="footer">
        &copy;
        <script>
          document.write(new Date().getFullYear());
        </script>
        ${process.env.APP_NAME}. All rights reserved.
      </div>
    </div>
  </body>
</html>
    `;
    },
    withdrawalRequestVettingEmail: (user, withdrawal) => {
        const logoUrl = process.env.LOGO_URL;
        return `
    <!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Withdrawal Request Notification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f6f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
      }
      .content {
        font-size: 16px;
        color: #555;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        background-color: #000;
        color: #ffffff !important;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        margin-top: 20px;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body >
    <div class="container" style="background-color: #f6f6f6;">
      <div class="logo" style="margin-bottom: 40px; text-align: center;">
        <img
          src="${logoUrl}"
          alt="Logo of ${process.env.APP_NAME}"
          width="150px"
        />
      </div>
      <div class="content">
        <p>Dear ${user.name},</p>
        <p>Your withdrawal request of
          <strong>${(0, helpers_1.formatMoney)(withdrawal.amount, withdrawal.currency)}</strong>
          via <strong>${withdrawal.paymentProvider}</strong> has been
          <strong>${withdrawal.status}</strong>.</p>
        <p>
        ${withdrawal.status === withdrawalrequest_1.WithdrawalStatus.APPROVED
            ? `<p>Your funds will be processed shortly.</p>`
            : ''}
        </p>
        <p>If you have any questions, please reach out to our support team.</p>
      </div>
      <div class="footer">
        &copy;
        <script>
          document.write(new Date().getFullYear());
        </script>
        ${process.env.APP_NAME}. All rights reserved.
      </div>
    </div>
  </body>
</html>
    `;
    },
    withdrawalSuccessEmail: (withdrawalHistory) => {
        const { user } = withdrawalHistory;
        const { wallet } = user;
        const logoUrl = process.env.LOGO_URL;
        const walletUrl = `${process.env.CLIENT_URL}/auth/login?redirect_url=/dashboard/transactions`;
        return `
    <!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Withdrawal Request Notification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f6f6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
      }
      .content {
        font-size: 16px;
        color: #555;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        background-color: #000;
        color: #ffffff !important;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        margin-top: 20px;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #888;
        text-align: center;
      }
    </style>
  </head>
  <body >
    <div class="container" style="background-color: #f6f6f6;">
      <div class="logo" style="margin-bottom: 40px; text-align: center;">
        <img
          src="${logoUrl}"
          alt="Logo of ${process.env.APP_NAME}"
          width="150px"
        />
      </div>
      <div class="content">
        <p>Dear ${user.name},</p>
        <p>
        We’re excited to inform you that a transfer has been successfully credited to your wallet. Below are the details:
        <p>
        <ul>
            <li>Amount: ${(0, helpers_1.formatMoney)(withdrawalHistory.amount, withdrawalHistory.currency)}</li>
            <li>Transaction ID: ${withdrawalHistory.id}</li>
            <li>Date: ${(0, moment_1.default)(withdrawalHistory.createdAt).format('LLL')}</li>
        </ul>

        <p>Your updated wallet balance is ${(0, helpers_1.formatMoney)(wallet.balance, wallet.currency)}.</p>
        
        <p>You can view your transaction history or use your balance for purchases by logging into your account.</p>

        <a href='${walletUrl}'>View your transactions</a>
        </p>
        <p>If you have any questions, please reach out to our support team.</p>
      </div>
      <div class="footer">
        &copy;
        <script>
          document.write(new Date().getFullYear());
        </script>
        ${process.env.APP_NAME}. All rights reserved.
      </div>
    </div>
  </body>
</html>
    `;
    },
    // Helper functions for emails (would be in a separate file)
    sendSubscriptionConfirmation: (subscription) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, plan } = subscription;
        const logoUrl = process.env.LOGO_URL;
        const subscriptionUrl = `${process.env.CLIENT_URL}/auth/login?redirect_url=/dashboard/subscriptions`;
        const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Subscription Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f6f6f6;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-bottom: 20px;
            }
            .content {
              font-size: 16px;
              color: #555;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              background-color: #000;
              color: #ffffff !important;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #888;
              text-align: center;
            }
            .details {
              background: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container" style="background-color: #f6f6f6;">
            <div class="logo" style="margin-bottom: 40px; text-align: center;">
              <img
                src="${logoUrl}"
                alt="Logo of ${process.env.APP_NAME}"
                width="150px"
              />
            </div>
            <div class="content">
              <p>Dear ${user.name},</p>
              <p>Thank you for subscribing to ${plan.name}!</p>
              
              <div class="details">
                <h3>Subscription Details:</h3>
                <ul>
                  <li>Plan: ${plan.name}</li>
                  <li>Start Date: ${(0, moment_1.default)(subscription.startDate).format('LLL')}</li>
                  <li>End Date: ${(0, moment_1.default)(subscription.endDate).format('LLL')}</li>
                  <li>Status: ${subscription.status}</li>
                  <li>Auto-renew: ${subscription.isAutoRenew ? 'Yes' : 'No'}</li>
                  <li>Payment Method: ${subscription.paymentMethod}</li>
                </ul>
              </div>
  
              <p>You can manage your subscription at any time from your account dashboard.</p>
              
              <a href="${subscriptionUrl}" class="button">View My Subscription</a>
              
              <p>If you have any questions about your subscription, please contact our support team.</p>
            </div>
            <div class="footer">
              &copy;
              <script>
                document.write(new Date().getFullYear());
              </script>
              ${process.env.APP_NAME}. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
        return emailContent;
        // Implementation would use your email service
        // await emailService.sendEmail(...)
    }),
    sendSubscriptionExpiredNotification: (subscription) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, plan } = subscription;
        const logoUrl = process.env.LOGO_URL;
        const subscriptionUrl = `${process.env.CLIENT_URL}/auth/login?redirect_url=/dashboard/subscriptions`;
        const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <!-- Same style as previous email -->
        </head>
        <body>
          <div class="container" style="background-color: #f6f6f6;">
            <div class="logo" style="margin-bottom: 40px; text-align: center;">
              <img
                src="${logoUrl}"
                alt="Logo of ${process.env.APP_NAME}"
                width="150px"
              />
            </div>
            <div class="content">
              <p>Dear ${user.name},</p>
              <p>Your ${plan.name} subscription has expired on ${(0, moment_1.default)(subscription.endDate).format('LLL')}.</p>
              
              <div class="details">
                <h3>Subscription Details:</h3>
                <ul>
                  <li>Plan: ${plan.name}</li>
                  <li>Start Date: ${(0, moment_1.default)(subscription.startDate).format('LLL')}</li>
                  <li>End Date: ${(0, moment_1.default)(subscription.endDate).format('LLL')}</li>
                </ul>
              </div>
  
              <p>To continue enjoying our services, please renew your subscription.</p>
              
              <a href="${subscriptionUrl}" class="button">Renew Subscription</a>
              
              <p>If you have any questions, our support team is here to help.</p>
            </div>
            <div class="footer">
              &copy;
              <script>
                document.write(new Date().getFullYear());
              </script>
              ${process.env.APP_NAME}. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
        return emailContent;
        // Implementation would use your email service
    }),
    sendSubscriptionRenewalConfirmation: (subscription) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, plan } = subscription;
        const logoUrl = process.env.LOGO_URL;
        const subscriptionUrl = `${process.env.CLIENT_URL}/auth/login?redirect_url=/dashboard/subscriptions`;
        const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <!-- Same style as previous email -->
        </head>
        <body>
          <div class="container" style="background-color: #f6f6f6;">
            <div class="logo" style="margin-bottom: 40px; text-align: center;">
              <img
                src="${logoUrl}"
                alt="Logo of ${process.env.APP_NAME}"
                width="150px"
              />
            </div>
            <div class="content">
              <p>Dear ${user.name},</p>
              <p>Your ${plan.name} subscription has been successfully renewed!</p>
              
              <div class="details">
                <h3>Renewal Details:</h3>
                <ul>
                  <li>Plan: ${plan.name}</li>
                  <li>New End Date: ${(0, moment_1.default)(subscription.endDate).format('LLL')}</li>
                  <li>Payment Method: ${subscription.paymentMethod}</li>
                  <li>Transaction ID: ${subscription.transactionId}</li>
                </ul>
              </div>
  
              <p>You can manage your subscription at any time from your account dashboard.</p>
              
              <a href="${subscriptionUrl}" class="button">View My Subscription</a>
              
              <p>Thank you for continuing with us!</p>
            </div>
            <div class="footer">
              &copy;
              <script>
                document.write(new Date().getFullYear());
              </script>
              ${process.env.APP_NAME}. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
        return emailContent;
        // Implementation would use your email service
    }),
    sendPaymentFailureNotification: (subscription) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, plan } = subscription;
        const logoUrl = process.env.LOGO_URL;
        const paymentUrl = `${process.env.CLIENT_URL}/auth/login?redirect_url=/dashboard/billing`;
        const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <!-- Same style as previous email -->
        </head>
        <body>
          <div class="container" style="background-color: #f6f6f6;">
            <div class="logo" style="margin-bottom: 40px; text-align: center;">
              <img
                src="${logoUrl}"
                alt="Logo of ${process.env.APP_NAME}"
                width="150px"
              />
            </div>
            <div class="content">
              <p>Dear ${user.name},</p>
              <p>We encountered an issue processing your payment for the ${plan.name} subscription.</p>
              
              <div class="details">
                <h3>Subscription Details:</h3>
                <ul>
                  <li>Plan: ${plan.name}</li>
                  <li>Next Payment Due: ${(0, moment_1.default)(subscription.endDate).format('LLL')}</li>
                  <li>Payment Method: ${subscription.paymentMethod}</li>
                </ul>
              </div>
  
              <p>Please update your payment information to avoid service interruption.</p>
              
              <a href="${paymentUrl}" class="button">Update Payment Method</a>
              
              <p>If you believe this is an error or need assistance, please contact our support team immediately.</p>
              
              <p><strong>Note:</strong> Your subscription will be suspended if the payment is not processed within 3 days.</p>
            </div>
            <div class="footer">
              &copy;
              <script>
                document.write(new Date().getFullYear());
              </script>
              ${process.env.APP_NAME}. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;
        return emailContent;
        // Implementation would use your email service
    }),
    //   sendPurchaseConfirmation: (data: {
    //     user: User;
    //     productName: string;
    //     productType: string;
    //     amount: number;
    //     currency: string;
    //     transactionId: string;
    //     paymentMethod: string;
    //   }) => {
    //     const {
    //       user,
    //       productName,
    //       productType,
    //       amount,
    //       currency,
    //       transactionId,
    //       paymentMethod,
    //     } = data;
    //     const logoUrl = process.env.LOGO_URL;
    //     const dashboardUrl = `${process.env.CLIENT_URL}/dashboard`;
    //     return `
    //       <!DOCTYPE html>
    //       <html>
    //       <head>
    //         <style>
    //           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    //           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    //           .header { text-align: center; margin-bottom: 30px; }
    //           .logo { margin-bottom: 20px; }
    //           .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
    //           .details { margin: 20px 0; }
    //           .button {
    //             display: inline-block;
    //             padding: 10px 20px;
    //             background-color: #4CAF50;
    //             color: white;
    //             text-decoration: none;
    //             border-radius: 5px;
    //             margin: 20px 0;
    //           }
    //           .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
    //         </style>
    //       </head>
    //       <body>
    //         <div class="container">
    //           <div class="header">
    //             <div class="logo">
    //               <img src="${logoUrl}" alt="Company Logo" width="150">
    //             </div>
    //             <h1>Purchase Confirmation</h1>
    //           </div>
    //           <div class="content">
    //             <p>Dear ${user.name},</p>
    //             <p>Thank you for your purchase! Here are the details of your transaction:</p>
    //             <div class="details">
    //               <h3>Purchase Details:</h3>
    //               <ul>
    //                 <li><strong>Product:</strong> ${productName} (${productType})</li>
    //                 <li><strong>Amount:</strong> ${currency} ${amount.toFixed(
    //       2
    //     )}</li>
    //                 <li><strong>Transaction ID:</strong> ${transactionId}</li>
    //                 <li><strong>Payment Method:</strong> ${paymentMethod}</li>
    //                 <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
    //               </ul>
    //             </div>
    //             <p>You can view your purchase in your dashboard:</p>
    //             <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
    //             <p>If you have any questions about your purchase, please contact our support team.</p>
    //           </div>
    //           <div class="footer">
    //             <p>&copy; ${new Date().getFullYear()} ${
    //       process.env.APP_NAME
    //     }. All rights reserved.</p>
    //           </div>
    //         </div>
    //       </body>
    //       </html>
    //     `;
    //   },
    sendPurchaseConfirmation: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, items, totalAmount, originalAmount, currency, transactionId, paymentMethod, coupon, } = data;
        const logoUrl = process.env.LOGO_URL;
        const dashboardUrl = `${process.env.CLIENT_URL}/dashboard`;
        const hasDiscount = coupon && originalAmount !== totalAmount;
        // Format currency
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency ? (0, helpers_1.CurrencySymbol)(currency) : 'NGN',
            }).format(amount);
        };
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { margin-bottom: 20px; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
          .details { margin: 20px 0; }
          .product-list { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .product-list th, .product-list td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .product-list th { background-color: #f2f2f2; }
          .totals { margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
          .discount { color: #4CAF50; }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoUrl}" alt="Company Logo" width="150">
            </div>
            <h1>Purchase Confirmation</h1>
            <p>Order #${transactionId}</p>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Thank you for your purchase! Here are the details of your order:</p>
            
            <div class="details">
              <h3>Order Summary:</h3>
              <table class="product-list">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
            .map((item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.type}</td>
                      <td>${item.quantity}</td>
                      <td>${formatCurrency(item.price)}</td>
                    </tr>
                  `)
            .join('')}
                </tbody>
              </table>
  
              <div class="totals">
                ${hasDiscount
            ? `
                  <p><strong>Subtotal:</strong> ${formatCurrency(originalAmount)}</p>
                  <p class="discount">
                    <strong>Discount (${coupon === null || coupon === void 0 ? void 0 : coupon.code}):</strong> -${formatCurrency((coupon === null || coupon === void 0 ? void 0 : coupon.discountAmount) || 0)}
                  </p>
                `
            : ''}
                <p><strong>Total Amount:</strong> ${formatCurrency(totalAmount)}</p>
              </div>
  
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p>You can view your order details in your dashboard:</p>
            <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
            
            <p>If you have any questions about your order, please contact our support team.</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }),
    // Send course publish request email
    sendCoursePublishRequestNotification: (adminEmail, courseTitle) => __awaiter(void 0, void 0, void 0, function* () {
        const logoUrl = process.env.LOGO_URL;
        const dashboardUrl = `${process.env.CLIENT_URL}/admin/courses`;
        const currentYear = new Date().getFullYear();
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .logo { 
            margin-bottom: 20px; 
          }
          .logo img {
            max-height: 60px;
          }
          .content { 
            background-color: #f9f9f9; 
            padding: 30px; 
            border-radius: 8px;
            border: 1px solid #eaeaea;
          }
          h1, h2, h3 {
            color: #2d3748;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #718096; 
          }
          .course-details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #EFF6FF;
            color: #1E40AF;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoUrl}" alt="Company Logo">
            </div>
            <h1>Course publish request sent successfully</h1>
          </div>
          
          <div class="content">
            <p>Hello there,</p>
            <p>This is to inform you that your course has been successfully submitted for review!</p>
            
            <div class="course-details">
              <h3>${courseTitle}</h3>
              <div class="status-badge">Under Review</div>
            </div>
            
            <p>Our team will review your course content and get back to you within 2-3 business days. You'll receive another notification once the review is complete.</p>
            
            <p>You can view it in your dashboard:</p>
            <a href="${dashboardUrl}" class="button">View in Dashboard</a>
           
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return html;
    }),
    // Send course publish email
    sendCoursePublishedNotification: (creatorEmail, courseTitle) => __awaiter(void 0, void 0, void 0, function* () {
        const logoUrl = process.env.LOGO_URL;
        const dashboardUrl = `${process.env.CLIENT_URL}/creator/courses`;
        const currentYear = new Date().getFullYear();
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .logo { 
            margin-bottom: 20px; 
          }
          .logo img {
            max-height: 60px;
          }
          .content { 
            background-color: #f9f9f9; 
            padding: 30px; 
            border-radius: 8px;
            border: 1px solid #eaeaea;
          }
          h1, h2, h3 {
            color: #2d3748;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #718096; 
          }
          .course-details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #EFF6FF;
            color: #1E40AF;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoUrl}" alt="Company Logo">
            </div>
            <h1>Course Published Successfully</h1>
          </div>
          
          <div class="content">
            <p>Hello there,</p>
            <p>We're excited to let you know that your course has been successfully submitted for review!</p>
            
            <div class="course-details">
              <h3>${courseTitle}</h3>
              <div class="status-badge">Under Review</div>
            </div>
            
            <p>Our team will review your course content and get back to you within 2-3 business days. You'll receive another notification once the review is complete.</p>
            
            <p>You can check the status of your course at any time in your creator dashboard:</p>
            <a href="${dashboardUrl}" class="button">View in Dashboard</a>
            
            <p>If you have any questions about the review process, please don't hesitate to contact our support team.</p>
            
            <p>Happy teaching!<br>The ${process.env.APP_NAME} Team</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return html;
    }),
    // Send course unpublish email
    sendCourseUnpublishedNotification: (creatorEmail, courseTitle) => __awaiter(void 0, void 0, void 0, function* () {
        const logoUrl = process.env.LOGO_URL;
        const dashboardUrl = `${process.env.CLIENT_URL}/dashboard/courses`;
        const currentYear = new Date().getFullYear();
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .logo { 
            margin-bottom: 20px; 
          }
          .logo img {
            max-height: 60px;
          }
          .content { 
            background-color: #f9f9f9; 
            padding: 30px; 
            border-radius: 8px;
            border: 1px solid #eaeaea;
          }
          h1, h2, h3 {
            color: #2d3748;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #718096; 
          }
          .course-details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #EFF6FF;
            color: #1E40AF;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoUrl}" alt="Company Logo">
            </div>
            <h1>Course Published Successfully</h1>
          </div>
          
          <div class="content">
            <p>Hello there,</p>
            <p>We're excited to let you know that your course has been unpublished!</p>
            
            <div class="course-details">
              <h3>${courseTitle}</h3>
              <div class="status-badge">Unpublished</div>
            </div>
            
            <p>You can check the status of your course at any time in your creator dashboard:</p>
            <a href="${dashboardUrl}" class="button">View in Dashboard</a>
            
            <p>If you have any questions about the review process, please don't hesitate to contact our support team.</p>
            
            <p>Happy teaching!<br>The ${process.env.APP_NAME} Team</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return html;
    }),
    // Send digital asset publish request email
    sendDigitalAssetPublishRequestNotification: (adminEmail, digitalAssetTitle) => __awaiter(void 0, void 0, void 0, function* () {
        const logoUrl = process.env.LOGO_URL;
        const dashboardUrl = `${process.env.CLIENT_URL}/super-admin/digitalAssets`;
        const currentYear = new Date().getFullYear();
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .logo { 
            margin-bottom: 20px; 
          }
          .logo img {
            max-height: 60px;
          }
          .content { 
            background-color: #f9f9f9; 
            padding: 30px; 
            border-radius: 8px;
            border: 1px solid #eaeaea;
          }
          h1, h2, h3 {
            color: #2d3748;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #718096; 
          }
          .course-details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #EFF6FF;
            color: #1E40AF;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoUrl}" alt="Company Logo">
            </div>
            <h1>Course publish request sent successfully</h1>
          </div>
          
          <div class="content">
            <p>Hello there,</p>
            <p>This is to inform you that a creator's digital asset has been successfully submitted for review!</p>
            
            <div class="course-details">
              <h3>${digitalAssetTitle}</h3>
              <div class="status-badge">Under Review</div>
            </div>

             <p>You can view it in your dashboard:</p>
            <a href="${dashboardUrl}" class="button">View in Dashboard</a>
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return html;
    }),
    // Send digital asset publish email
    sendDigitalAssetPublishedNotification: (creatorEmail, digitalAssetTitle) => __awaiter(void 0, void 0, void 0, function* () {
        const logoUrl = process.env.LOGO_URL;
        const dashboardUrl = `${process.env.CLIENT_URL}/creator/assets`;
        const currentYear = new Date().getFullYear();
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .logo { 
            margin-bottom: 20px; 
          }
          .logo img {
            max-height: 60px;
          }
          .content { 
            background-color: #f9f9f9; 
            padding: 30px; 
            border-radius: 8px;
            border: 1px solid #eaeaea;
          }
          h1, h2, h3 {
            color: #2d3748;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #718096; 
          }
          .course-details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #EFF6FF;
            color: #1E40AF;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoUrl}" alt="Company Logo">
            </div>
            <h1>Digital asset Published Successfully</h1>
          </div>
          
          <div class="content">
            <p>Hello there,</p>
            <p>We're excited to let you know that your digital asset has been successfully submitted for review!</p>
            
            <div class="course-details">
              <h3>${digitalAssetTitle}</h3>
              <div class="status-badge">Under Review</div>
            </div>
            
            <p>Our team will review your digital asset content and get back to you within 2-3 business days. You'll receive another notification once the review is complete.</p>
            
            <p>You can check the status of your digital asset at any time in your creator dashboard:</p>
            <a href="${dashboardUrl}" class="button">View in Dashboard</a>
            
            <p>If you have any questions about the review process, please don't hesitate to contact our support team.</p>
            
            <p>Happy teaching!<br>The ${process.env.APP_NAME} Team</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return html;
    }),
    // Send digital asset unpublish email
    sendDigitalAssetUnpublishedNotification: (creatorEmail, digitalAssetTitle) => __awaiter(void 0, void 0, void 0, function* () {
        const logoUrl = process.env.LOGO_URL;
        const dashboardUrl = `${process.env.CLIENT_URL}/creator/assets`;
        const currentYear = new Date().getFullYear();
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .logo { 
            margin-bottom: 20px; 
          }
          .logo img {
            max-height: 60px;
          }
          .content { 
            background-color: #f9f9f9; 
            padding: 30px; 
            border-radius: 8px;
            border: 1px solid #eaeaea;
          }
          h1, h2, h3 {
            color: #2d3748;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #718096; 
          }
          .course-details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #EFF6FF;
            color: #1E40AF;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoUrl}" alt="Company Logo">
            </div>
            <h1>Digital asset published successfully</h1>
          </div>
          
          <div class="content">
            <p>Hello there,</p>
            <p>We're excited to let you know that your digital asset has been unpublished!</p>
            
            <div class="course-details">
              <h3>${digitalAssetTitle}</h3>
              <div class="status-badge">Unpublished</div>
            </div>
            
            <p>You can check the status of your digital asset at any time in your creator dashboard:</p>
            <a href="${dashboardUrl}" class="button">View in Dashboard</a>
            
            <p>If you have any questions about the review process, please don't hesitate to contact our support team.</p>
            
            <p>Happy teaching!<br>The ${process.env.APP_NAME} Team</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return html;
    }),
    // Send physical asset publish request email
    sendPhysicalAssetPublishRequestNotification: (adminEmail, physicalAssetTitle) => __awaiter(void 0, void 0, void 0, function* () {
        const logoUrl = process.env.LOGO_URL;
        const dashboardUrl = `${process.env.CLIENT_URL}/super-admin/physicalAssets`;
        const currentYear = new Date().getFullYear();
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .logo { 
            margin-bottom: 20px; 
          }
          .logo img {
            max-height: 60px;
          }
          .content { 
            background-color: #f9f9f9; 
            padding: 30px; 
            border-radius: 8px;
            border: 1px solid #eaeaea;
          }
          h1, h2, h3 {
            color: #2d3748;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #718096; 
          }
          .course-details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #EFF6FF;
            color: #1E40AF;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoUrl}" alt="Company Logo">
            </div>
            <h1>Physical asset publish request sent successfully</h1>
          </div>
          
          <div class="content">
            <p>Hello there,</p>
            <p>This is to inform you that a creator's physical asset has been successfully submitted for review!</p>
            
            <div class="course-details">
              <h3>${physicalAssetTitle}</h3>
              <div class="status-badge">Under Review</div>
            </div>

             <p>You can view it in your dashboard:</p>
            <a href="${dashboardUrl}" class="button">View in Dashboard</a>
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return html;
    }),
    // Send physical asset publish email
    sendPhysicalAssetPublishedNotification: (creatorEmail, physicalAssetTitle) => __awaiter(void 0, void 0, void 0, function* () {
        const logoUrl = process.env.LOGO_URL;
        const dashboardUrl = `${process.env.CLIENT_URL}/creator/assets`;
        const currentYear = new Date().getFullYear();
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .logo { 
            margin-bottom: 20px; 
          }
          .logo img {
            max-height: 60px;
          }
          .content { 
            background-color: #f9f9f9; 
            padding: 30px; 
            border-radius: 8px;
            border: 1px solid #eaeaea;
          }
          h1, h2, h3 {
            color: #2d3748;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #718096; 
          }
          .course-details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #EFF6FF;
            color: #1E40AF;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoUrl}" alt="Company Logo">
            </div>
            <h1>Physical asset Published Successfully</h1>
          </div>
          
          <div class="content">
            <p>Hello there,</p>
            <p>We're excited to let you know that your physical asset has been successfully submitted for review!</p>
            
            <div class="course-details">
              <h3>${physicalAssetTitle}</h3>
              <div class="status-badge">Under Review</div>
            </div>
            
            <p>Our team will review your physical asset content and get back to you within 2-3 business days. You'll receive another notification once the review is complete.</p>
            
            <p>You can check the status of your physical asset at any time in your creator dashboard:</p>
            <a href="${dashboardUrl}" class="button">View in Dashboard</a>
            
            <p>If you have any questions about the review process, please don't hesitate to contact our support team.</p>
            
            <p>Happy teaching!<br>The ${process.env.APP_NAME} Team</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return html;
    }),
    // Send physical asset unpublish email
    sendPhysicalAssetUnpublishedNotification: (creatorEmail, physicalAssetTitle) => __awaiter(void 0, void 0, void 0, function* () {
        const logoUrl = process.env.LOGO_URL;
        const dashboardUrl = `${process.env.CLIENT_URL}/creator/assets`;
        const currentYear = new Date().getFullYear();
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .logo { 
            margin-bottom: 20px; 
          }
          .logo img {
            max-height: 60px;
          }
          .content { 
            background-color: #f9f9f9; 
            padding: 30px; 
            border-radius: 8px;
            border: 1px solid #eaeaea;
          }
          h1, h2, h3 {
            color: #2d3748;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #718096; 
          }
          .course-details {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #EFF6FF;
            color: #1E40AF;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <img src="${logoUrl}" alt="Company Logo">
            </div>
            <h1>Physical asset published successfully</h1>
          </div>
          
          <div class="content">
            <p>Hello there,</p>
            <p>We're excited to let you know that your physical asset has been unpublished!</p>
            
            <div class="course-details">
              <h3>${physicalAssetTitle}</h3>
              <div class="status-badge">Unpublished</div>
            </div>
            
            <p>You can check the status of your physical asset at any time in your creator dashboard:</p>
            <a href="${dashboardUrl}" class="button">View in Dashboard</a>
            
            <p>If you have any questions about the review process, please don't hesitate to contact our support team.</p>
            
            <p>Happy teaching!<br>The ${process.env.APP_NAME} Team</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        return html;
    }),
};
//# sourceMappingURL=messages.js.map