const express = require('express');
const { register, login, dashboard, createUser, retrieveUser, logout, isAuthenticated, isUserCheck, isAlreadyAuth } = require('../controllers/adminController');
const { index, blog, about, contact } = require('../controllers/userController');
const router = express.Router();


//User controller router
router.get('/', index);
router.get('/blog', blog);
router.get('/about', about);
router.get('/contact', contact);

// admin controller router
router.get('/admin', isAuthenticated ,dashboard)

router.get('/admin/register', isUserCheck ,register);
router.post('/admin/register',isUserCheck, createUser)

router.get('/admin/login', isAlreadyAuth ,login);
router.post('/admin/login', retrieveUser);

router.post('/admin/logout', logout);



module.exports = router;