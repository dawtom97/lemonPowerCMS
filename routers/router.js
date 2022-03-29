const express = require("express");
const {
  register,
  login,
  dashboard,
  createUser,
  retrieveUser,
  logout,
  isAuthenticated,
  isUserCheck,
  isAlreadyAuth,
  categories,
  categoriesCreate,
  categoriesCreatePost,
  categoriesEdit,
  categoriesPostEdit,
  categoriesDelete,
  posts,
  postsCreate,
  postsCreatePost,
  postsEdit,
  postsEditPost,
  postsEditCover,
  postsEditCoverPost,
  postsDelete,
  aboutPanel,
  aboutPanelPost,
  servicesPanel,
  servicesCreateCategory,
  servicesCreateCategoryPost,
  servicesCreate,
  servicesCreatePost,
  servicesDelete,
  blogPanel,
  blogCreate,
  blogCreatePost,
  blogDelete,
  blogEditCover,
  blogEditCoverPost,
  blogEdit,
  blogEditPost,
  servicesEdit,
  servicesEditPost,
} = require("../controllers/adminController");
const {
  index,
  blog,
  about,
  contact,
} = require("../controllers/userController");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/my-uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const {settingsPanel, settingsPost} = require('../controllers/settings/settingsController')

//User controller router

router.get("/", index);
router.get("/blog", blog);
router.get("/about", about);
router.get("/contact", contact);

// admin controller router

router.get("/admin", isAuthenticated, dashboard);

router.get("/admin/register", isUserCheck, register);
router.post("/admin/register", isUserCheck, createUser);

router.get("/admin/login", isAlreadyAuth, login);
router.post("/admin/login", retrieveUser);

router.post("/admin/logout", logout);

// categories routes
router.get("/admin/categories", isAuthenticated, categories);
router.get("/admin/categories/create", isAuthenticated, categoriesCreate);
router.post("/admin/categories/create", isAuthenticated, categoriesCreatePost);
router.get("/admin/categories/:id/edit", isAuthenticated, categoriesEdit);
router.post("/admin/categories/:id/edit", isAuthenticated, categoriesPostEdit);
router.get("/admin/categories/:id/delete", isAuthenticated, categoriesDelete);

// posts routes
router.get("/admin/posts", isAuthenticated, posts);
router.get("/admin/posts/create", isAuthenticated, postsCreate);
router.post(
  "/admin/posts/create",
  isAuthenticated,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images", maxCount: 12 },
  ]),
  postsCreatePost
);

router.get("/admin/posts/:id/edit", isAuthenticated, postsEdit);
router.post("/admin/posts/:id/edit", isAuthenticated, postsEditPost);

router.get("/admin/posts/:id/edit-cover", isAuthenticated, postsEditCover);
router.post(
  "/admin/posts/:id/edit-cover",
  isAuthenticated,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images", maxCount: 12 },
  ]),
  postsEditCoverPost
);

router.get("/admin/posts/:id/delete", isAuthenticated, postsDelete);

// ADMIN PAGES
router.get("/admin/about", isAuthenticated, aboutPanel);
router.post("/admin/about", isAuthenticated, aboutPanelPost);

router.get("/admin/services", isAuthenticated, servicesPanel);
router.get("/admin/services/create/category", isAuthenticated, servicesCreateCategory)
router.post("/admin/services/create/category", isAuthenticated, servicesCreateCategoryPost)
router.get("/admin/services/create", isAuthenticated, servicesCreate)
router.post("/admin/services/create", isAuthenticated, servicesCreatePost)
router.get("/admin/services/:id/delete", isAuthenticated, servicesDelete)
router.get("/admin/services/:id/edit", isAuthenticated, servicesEdit)
router.post("/admin/services/:id/edit", isAuthenticated, servicesEditPost)


router.get('/admin/blog', isAuthenticated, blogPanel)
router.get("/admin/blog/create", isAuthenticated, blogCreate)
router.post("/admin/blog/create", isAuthenticated, upload.single('cover') ,blogCreatePost)

router.get("/admin/blog/:id/delete", isAuthenticated, blogDelete);

router.get("/admin/blog/:id/blog-edit-cover", isAuthenticated, blogEditCover);
router.post("/admin/blog/:id/blog-edit-cover", isAuthenticated, upload.single("cover"), blogEditCoverPost)

router.get("/admin/blog/:id/edit", isAuthenticated, blogEdit)
router.post("/admin/blog/:id/edit", isAuthenticated, blogEditPost)


// settings routes
router.get("/admin/settings", isAuthenticated, settingsPanel)
router.post("/admin/settings", isAuthenticated, upload.single('logo') ,settingsPost)

module.exports = router;
