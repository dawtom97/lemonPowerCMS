const express = require('express');
const { register, login, dashboard, createUser, retrieveUser, logout, isAuthenticated, isUserCheck, isAlreadyAuth, tasksPanel, categories, categoriesCreate, categoriesCreatePost, categoriesEdit, categoriesPostEdit, categoriesDelete } = require('../controllers/adminController');
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

router.get('/admin/tasks', tasksPanel)


// categories routes
router.get('/admin/categories', isAuthenticated, categories)
router.get('/admin/categories/create',isAuthenticated, categoriesCreate)
router.post('/admin/categories/create',isAuthenticated, categoriesCreatePost)
router.get('/admin/categories/:id/edit',isAuthenticated, categoriesEdit)
router.post('/admin/categories/:id/edit', isAuthenticated, categoriesPostEdit)
router.get('/admin/categories/:id/delete', isAuthenticated, categoriesDelete)


module.exports = router;