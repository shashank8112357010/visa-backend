const Help = require("../models/helpModel");
const nodemailer = require("nodemailer");
require("dotenv").config()

// Create a help ticket
exports.createHelpTicket = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const helpTicket = new Help({ name, email, phone, message });
        await helpTicket.save();
        res.status(201).json({ message: "Help ticket created successfully", helpTicket });
    } catch (error) {
        res.status(500).json({ message: "Error creating help ticket", error });
    }
};

// Get all tickets (admin view)
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Help.find();
        if(!tickets) res.status(204).json({error : false  , success : true  , data : [] , message : "No content"})
        res.status(200).json({error : false  , success : true  , data : tickets , message : "Fetched Successfully"});
    } catch (error) {
        res.status(500).json({ message: "Error fetching tickets", error });
    }
};

// Get a specific ticket by ID (user view)
exports.getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Help.findById(id);
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        res.status(200).json({error : false  , success : true  , data : ticket, message : "Fetched Successfully"});
    } catch (error) {
        res.status(500).json({ message: "Error fetching ticket", error });
    }
};

// Update a ticket's status to resolved (admin)
exports.resolveTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Help.findById(id);
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        ticket.status = "resolved";
        await ticket.save();

        // Send notification email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL, // Replace with your email
                pass: process.env.EMAIL_PASSWORD, // Replace with your email password or app-specific password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: ticket.email,
            subject: "Your Help Ticket has been Resolved",
            text: `Hello ${ticket.name},\n\nYour help ticket with the message: "${ticket.message}" has been resolved.\n\nThank you!`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Ticket resolved and email sent", ticket });
    } catch (error) {
        res.status(500).json({ message: "Error resolving ticket", error });
    }
};

// Delete a ticket (admin)
exports.deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Help.findByIdAndDelete(id);
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });
        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting ticket", error });
    }
};
