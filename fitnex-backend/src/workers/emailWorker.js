const redis = require('redis');
const { Payment, Membership, User } = require('../models');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');

class EmailWorker {
  constructor() {
    this.redisClient = null;
    this.isRunning = false;
  }

  async start() {
    try {
      this.redisClient = redis.createClient({
        url: config.redis.url,
        socket: {
          tls: config.redis.tls
        }
      });

      await this.redisClient.connect();
      await this.redisClient.subscribe('payments:processed');

      console.log('Email Worker started and subscribed to payments:processed channel');

      this.redisClient.on('message', async (channel, message) => {
        if (channel === 'payments:processed') {
          await this.handlePaymentProcessed(message);
        }
      });

      this.isRunning = true;
    } catch (error) {
      console.error('Error starting Email Worker:', error);
      throw error;
    }
  }

  async handlePaymentProcessed(message) {
    try {
      const payload = JSON.parse(message);
      console.log('Processing payment:', payload.paymentId);

      const payment = await Payment.findOne({
        where: { payment_id: payload.paymentId },
        include: [
          {
            model: Membership,
            include: [{ model: User }]
          }
        ]
      });

      if (!payment) {
        console.error('Payment not found:', payload.paymentId);
        return;
      }

      const member = payment.Membership.User;
      const pdfPath = await this.generateReceiptPDF(payment, member);

      await this.sendEmailWithReceipt(member.email, pdfPath, payment);

      console.log(`Receipt sent to ${member.email} for payment ${payload.paymentId}`);
    } catch (error) {
      console.error('Error handling payment processed:', error);
    }
  }

  async generateReceiptPDF(payment, member) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(PDFDocument.Helvetica);

    page.drawText('FitneX Payment Receipt', {
      x: 50,
      y: height - 50,
      size: 24,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(`Member: ${member.full_name}`, {
      x: 50,
      y: height - 100,
      size: 14,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(`Email: ${member.email}`, {
      x: 50,
      y: height - 130,
      size: 14,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(`Amount: $${payment.amount}`, {
      x: 50,
      y: height - 160,
      size: 18,
      font,
      color: rgb(0, 0.5, 0)
    });

    page.drawText(`Payment Method: ${payment.payment_method}`, {
      x: 50,
      y: height - 190,
      size: 14,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(`Date: ${payment.created_at.toLocaleString()}`, {
      x: 50,
      y: height - 220,
      size: 14,
      font,
      color: rgb(0, 0, 0)
    });

    page.drawText(`Payment ID: ${payment.payment_id}`, {
      x: 50,
      y: height - 250,
      size: 12,
      font,
      color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await pdfDoc.save();

    const tempDir = config.pdf.tempDir;
    await fs.mkdir(tempDir, { recursive: true });

    const filename = `receipt_${payment.payment_id}.pdf`;
    const filepath = path.join(tempDir, filename);

    await fs.writeFile(filepath, pdfBytes);

    return filepath;
  }

  async sendEmailWithReceipt(email, pdfPath, payment) {
    console.log(`Sending email to ${email} with receipt at ${pdfPath}`);

    // TODO: Integrate with actual email service (SendGrid, Mailgun, etc.)
    // This is a placeholder for the email sending logic
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(config.email.apiKey);
    
    const attachment = await fs.readFile(pdfPath);
    
    const msg = {
      to: email,
      from: config.email.from,
      subject: 'Your FitneX Payment Receipt',
      text: `Thank you for your payment of $${payment.amount}.`,
      attachments: [
        {
          content: attachment.toString('base64'),
          filename: `receipt_${payment.payment_id}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    await sgMail.send(msg);
    */

    console.log('Email sending logic to be implemented with actual email service');
  }

  async stop() {
    if (this.redisClient) {
      await this.redisClient.unsubscribe('payments:processed');
      await this.redisClient.quit();
    }
    this.isRunning = false;
    console.log('Email Worker stopped');
  }
}

if (require.main === module) {
  const worker = new EmailWorker();
  worker.start().catch(console.error);

  process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...');
    await worker.stop();
    process.exit(0);
  });
}

module.exports = EmailWorker;
