const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../Controller/Usercontroller");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);

module.exports = router;
