const router = require('express').Router()
const {softDeleteRecord, getAllusersinfo, singleUser, getUserUpdatedata, updateUser} = require("../controllers/user")

router.get("/users", getAllusersinfo)
router.post("/users/:id", softDeleteRecord)
router.get("/users/:id", singleUser)
router.get("/update/:id", getUserUpdatedata)
router.post("/updateuser", updateUser)

module.exports = router