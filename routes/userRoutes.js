const express = require('express');
const  router = express.Router();
const UserController = require('../controllers/userController.js');
const checkUserAuth = require('../middleware/auth-middleware.js');
// routlevel middleware - to protect route
router.use('/changepassword',checkUserAuth)
router.use('/loggeduser',checkUserAuth)



// public routes

router.post('/register',UserController.userRegistration)
router.post('/login',UserController.userLogin)
router.post('/resetpasswordemail',UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token',UserController.userPasswordReset)





// protected routes

router.post('/changepassword',UserController.changeUserPassword)
router.get('/loggeduser',UserController.Loggeduser)




module.exports = router
