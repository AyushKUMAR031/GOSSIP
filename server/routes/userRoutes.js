const { register, login, setAvatar, getAllUsers } = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id",setAvatar);
router.get("/allusers/:id", getAllUsers); //requesting data not posting data
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;