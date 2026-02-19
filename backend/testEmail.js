require('dotenv').config();
const { sendAppointmentConfirmation } = require('./emailService');

console.log('🔍 Testing Email Configuration...\n');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***configured***' : '❌ MISSING');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('\n📧 Sending test email...\n');

sendAppointmentConfirmation({
  patientName: '',
  patientEmail: process.env.EMAIL_USER, // Send to yourself
  patientNumber: '',
  patientGender: '',
  appointmentTime: new Date(),
  preferredMode: ''
})
.then(result => {
  console.log('\n✅ Result:', result);
  if (result.success) {
    console.log('\n🎉 SUCCESS! Check your inbox:', process.env.EMAIL_USER);
  } else {
    console.log('\n❌ FAILED:', result.error);
  }
  process.exit(result.success ? 0 : 1);
})
.catch(error => {
  console.error('\n❌ ERROR:', error.message);
  process.exit(1);
});
