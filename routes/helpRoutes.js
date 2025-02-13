const express = require("express");
const router = express.Router();
const helpController = require("../controllers/helpController");
const { verifyAccessToken, isAdmin } = require("../middlewares/authMiddleware");

// User routes
router.post("/", helpController.createHelpTicket);

router.get("/:id", helpController.getTicketById);

// Admin routes
router.get("/admin/help", verifyAccessToken, isAdmin,   helpController.getAllTickets);
router.put("/admin/help/:id/resolve", verifyAccessToken, isAdmin,  helpController.resolveTicket);
router.delete("/admin/help/:id",  verifyAccessToken, isAdmin, helpController.deleteTicket);



module.exports = router;
