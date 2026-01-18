const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.get("/", validateToken, getContacts);

router.post("/", validateToken, createContact);

router.get("/:id", validateToken, getContact);

router.put("/:id", validateToken, updateContact);

router.delete("/:id", validateToken, deleteContact);

module.exports = router;
