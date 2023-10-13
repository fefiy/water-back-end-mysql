const {register, login, getAllusersinfo, accessToken, temp , registeruser, registeradmin, sendEmail, logout} = require('../controllers/auth')
const router = require('express').Router()


router.post('/register', register)
router.post('/login', login)    
router.post('/logout', logout)
router.get('/autenticate', accessToken)


module.exports = router 
