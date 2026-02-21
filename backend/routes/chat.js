const express = require("express");
const router = express.Router();

// Simple chatbot logic
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false,
        reply: "Message is required" 
      });
    }

    const lowerMessage = message.toLowerCase().trim();
    let reply = "I'm here to help! Can you please provide more details?";

    // Appointment related queries
    if (lowerMessage.includes("appointment") || lowerMessage.includes("book")) {
      reply = "You can book an appointment by clicking the 'Book Appointment' button at the top of the page. Our doctors are available 24/7!";
    }
    // Doctor related queries
    else if (lowerMessage.includes("doctor") || lowerMessage.includes("specialist")) {
      reply = "We have 50+ expert doctors available across various specializations. Visit our Doctors section to see all available specialists.";
    }
    // Emergency related queries
    else if (lowerMessage.includes("emergency") || lowerMessage.includes("urgent")) {
      reply = "For medical emergencies, please call emergency services immediately at 911 or your local emergency number. Our platform is for non-emergency consultations.";
    }
    // Services related queries
    else if (lowerMessage.includes("service") || lowerMessage.includes("what do you offer")) {
      reply = "We offer Emergency Care, Heart Disease consultation, Dental Care, Prescription services, and Doctor insights. Check our Services section for more details.";
    }
    // Hours/availability queries
    else if (lowerMessage.includes("hour") || lowerMessage.includes("available") || lowerMessage.includes("when")) {
      reply = "Our doctors are available 24/7 for online consultations. You can book appointments at any time that suits you.";
    }
    // Cost/price related queries
    else if (lowerMessage.includes("cost") || lowerMessage.includes("price") || lowerMessage.includes("fee")) {
      reply = "Consultation fees vary by doctor and specialty. Please book an appointment to see specific pricing. We accept various payment methods.";
    }
    // Contact related queries
    else if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("email")) {
      reply = "You can reach us at:\n📧 Email: support@healthplus.com or appointment@healthplus.com\n📞 Phone: +022 5454 5252 or +022 2326 6232";
    }
    // Video/voice call queries
    else if (lowerMessage.includes("video") || lowerMessage.includes("voice") || lowerMessage.includes("call")) {
      reply = "Yes! We offer both video and voice call consultations. You can choose your preferred mode when booking an appointment.";
    }
    // Greeting responses
    else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      reply = "Hello! 👋 Welcome to Health Plus. How can I assist you today?";
    }
    // Thank you responses
    else if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      reply = "You're welcome! Feel free to ask if you have any more questions. Have a healthy day! 😊";
    }
    // Help queries
    else if (lowerMessage.includes("help")) {
      reply = "I can help you with:\n• Booking appointments\n• Information about our doctors\n• Available services\n• Contact information\n• Operating hours\n\nWhat would you like to know?";
    }

    res.json({ 
      success: true,
      reply: reply,
      timestamp: new Date()
    });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ 
      success: false,
      reply: "Sorry, I encountered an error. Please try again." 
    });
  }
});

module.exports = router;
