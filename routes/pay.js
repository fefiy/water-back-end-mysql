const { paymentVerification, callback } = require('../controllers/pay')

const router = require('express').Router()

router.get("/verify", callback)

module.exports = router