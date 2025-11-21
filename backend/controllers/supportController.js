const SupportTicket = require("../models/supportTicketModel");
const { sendSupportTicketEmail } = require("../services/supportService");

/**
 * 📩 Submit support ticket
 */
exports.createSupportTicket = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Optional: Get userId if user is logged in
    const userId = req.user ? req.user.id : null;

    const ticket = await SupportTicket.create({
      name,
      email,
      subject,
      message,
      userId
    });

    // Send confirmation email to user
    try {
      await sendSupportTicketEmail(email, ticket._id, subject, message);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    // Notify admin (removed for now - can be added later)

    res.status(201).json({
      message: "Support ticket created successfully",
      ticketId: ticket._id
    });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    res.status(500).json({ message: "Failed to create support ticket", error: error.message });
  }
};

/**
 * 📋 Get all support tickets (Admin only)
 */
exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tickets = await SupportTicket.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ tickets, count: tickets.length });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets", error: error.message });
  }
};

/**
 * 🎫 Get user's own tickets
 */
exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const tickets = await SupportTicket.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ tickets, count: tickets.length });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ message: "Failed to fetch your tickets", error: error.message });
  }
};

/**
 * ✉️ Update ticket status/response (Admin only)
 */
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, adminResponse } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (adminResponse) {
      updateData.adminResponse = adminResponse;
      updateData.respondedAt = new Date();
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Send email to user if admin responded
    if (adminResponse) {
      try {
        await sendEmail({
          to: ticket.email,
          subject: `Response to Your Support Ticket - DivideCross`,
          html: `
            <h2>We've responded to your ticket</h2>
            <p>Hi ${ticket.name},</p>
            <p>Ticket ID: <strong>#${ticket._id}</strong></p>
            <p><strong>Your Query:</strong> ${ticket.subject}</p>
            <br>
            <p><strong>Our Response:</strong></p>
            <p>${adminResponse}</p>
            <br>
            <p>If you have any further questions, feel free to reach out!</p>
            <p>Best regards,<br>DivideCross Support Team</p>
          `
        });
      } catch (emailError) {
        console.error("Failed to send response email:", emailError);
      }
    }

    res.status(200).json({ message: "Ticket updated successfully", ticket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Failed to update ticket", error: error.message });
  }
};
