const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send appointment confirmation email
const sendAppointmentConfirmation = async (appointmentData) => {
  try {
    const transporter = createTransporter();

    const { patientName, patientEmail, patientNumber, appointmentTime, preferredMode } = appointmentData;

    const formattedDate = new Date(appointmentTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mailOptions = {
      from: `"Health Plus" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: 'Appointment Confirmation - Health Plus',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #1E8FFD;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
                  .appointment-details {
                    background-color: #f0f8ff;
                    padding: 20px;
                    border-radius: 5px;
                    margin: 20px 0;
                  }
                  .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #666;
                    font-size: 12px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Appointment Confirmed</h1>
                  </div>
                  <div class="content">
                    <p>Dear ${patientName},</p>
                    <p>Your appointment has been successfully scheduled.</p>
                    <div class="appointment-details">
                      <h3>Appointment Details:</h3>
                      <p><strong>Date & Time:</strong> ${formattedDate}</p>
                      <p><strong>Mode:</strong> ${preferredMode}</p>
                      <p><strong>Contact:</strong> ${patientNumber}</p>
                    </div>
                    <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
                    <p>Thank you for choosing Health Plus!</p>
                  </div>
                  <div class="footer">
                    <p>This is an automated message, please do not reply.</p>
                  </div>
                </div>
                          </body>
                          </html>
                        `
                };
            
                await transporter.sendMail(mailOptions);
                return { success: true };
              } catch (error) {
                console.error('Error sending appointment confirmation email:', error);
                throw error;
              }
            };
            
            module.exports = {
              sendAppointmentConfirmation
            };