import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class EmailSenderService {
  constructor(private configService: ConfigService) {
    // Set the SendGrid API key
    sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendEmail(to: string, subject: string, token: string) {
    const msg = {
      to, // recipient's email address
      from: 'renatodsantosjr9@gmail.com', // verified sender email in SendGrid
      subject,
      html: `
        <html>
            <head>
                <style>
                .big {
                    font-size: 24px;
                    font-weight: bold;
                }
                #body {
                    font-size: 14px;
                    border: 1px solid black;
                    padding: 10px;
                    bg-color: white;
                    border-radius: 10px;
                }
                </style>
            </head>
            <body>
                <div id='body'>
                    <h1>Type Racing Game</h1>
                    <p>Hi ${to},</p>
                    <p>Here is your token:</p>
                    <strong>
                        <p class="big">${token}</p>
                    </strong>
                </div>
            </body>
        </html>
      `,
    };

    try {
      const response = await sgMail.send(msg);
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}
