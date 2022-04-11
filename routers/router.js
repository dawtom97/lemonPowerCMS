const express = require("express");
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
const {
  settingsPanel,
  settingsPost,
} = require("../controllers/settings/settingsController");
const {
  blogPanel,
  blogCreate,
  blogCreatePost,
  blogDelete,
  blogEditCover,
  blogEditCoverPost,
  blogEdit,
  blogEditPost,
} = require("../controllers/blog/blogController");
const {
  servicesPanel,
  servicesCreateCategory,
  servicesCreateCategoryPost,
  servicesCreate,
  servicesCreatePost,
  servicesDelete,
  servicesEdit,
  servicesEditPost,
} = require("../controllers/services/servicesController");
const {
  posts,
  postsCreate,
  postsCreatePost,
  postsEdit,
  postsEditPost,
  postsEditCover,
  postsEditCoverPost,
  postsDelete,
} = require("../controllers/posts/postsController");

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
  getBreadcrumbs,
} = require("../controllers/user/userController");

const {
  categories,
  categoriesCreate,
  categoriesCreatePost,
  categoriesEdit,
  categoriesPostEdit,
  categoriesDelete,
} = require("../controllers/category/categoryController");

const {
  aboutPanel,
  aboutPanelPost,
} = require("../controllers/about/aboutController");
const {
  index,
  blog,
  about,
  contact,
  getContact,
  blogDetails,
} = require("../controllers/userController");
const { messagesPanel, messagesShow, messagesShowSend, messagesDelete } = require("../controllers/messages/messagesController");
const { slidesPanel, slidesCreate, slidesCreatePost, slidesDelete, slideEditPhoto, slidesEditPhoto, slidesEditPhotoPost, slideEdit, slideEditPost } = require("../controllers/slider/sliderController");

//User controller router

router.get("/", index);
router.get("/blog/:category/:page/:size", blog);
router.get("/blog/:category/:id", blogDetails)
router.get("/about", about);

router.get("/contact", getContact);
router.post("/contact", contact);

// admin controller router

router.get("/admin", isAuthenticated,getBreadcrumbs, dashboard);

router.get("/admin/register", isUserCheck, register);
router.post("/admin/register", isUserCheck, createUser);

router.get("/admin/login", isAlreadyAuth, login);
router.post("/admin/login", retrieveUser);

router.post("/admin/logout", logout);

// categories routes
router.get("/admin/categories", isAuthenticated,getBreadcrumbs, categories);
router.get("/admin/categories/create", isAuthenticated,getBreadcrumbs, categoriesCreate);
router.post("/admin/categories/create", isAuthenticated, categoriesCreatePost);
router.get("/admin/categories/:id/edit", isAuthenticated,getBreadcrumbs, categoriesEdit);
router.post("/admin/categories/:id/edit", isAuthenticated, categoriesPostEdit);
router.get("/admin/categories/:id/delete", isAuthenticated, categoriesDelete);

// posts routes
router.get("/admin/posts", isAuthenticated,getBreadcrumbs, posts);
router.get("/admin/posts/create", isAuthenticated,getBreadcrumbs, postsCreate);
router.post(
  "/admin/posts/create",
  isAuthenticated,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images", maxCount: 12 },
  ]),
  postsCreatePost
);

router.get("/admin/posts/:id/edit", isAuthenticated,getBreadcrumbs, postsEdit);
router.post("/admin/posts/:id/edit", isAuthenticated, postsEditPost);

router.get("/admin/posts/:id/edit-cover", isAuthenticated,getBreadcrumbs, postsEditCover);
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
router.get("/admin/about", isAuthenticated,getBreadcrumbs, aboutPanel);
router.post("/admin/about", isAuthenticated, aboutPanelPost);

router.get("/admin/services", isAuthenticated,getBreadcrumbs, servicesPanel);
router.get(
  "/admin/services/create/category",
  isAuthenticated,
  getBreadcrumbs,
  servicesCreateCategory
);
router.post(
  "/admin/services/create/category",
  isAuthenticated,
  servicesCreateCategoryPost
);
router.get("/admin/services/create", isAuthenticated,getBreadcrumbs, servicesCreate);
router.post("/admin/services/create", isAuthenticated, servicesCreatePost);
router.get("/admin/services/:id/delete", isAuthenticated, servicesDelete);
router.get("/admin/services/:id/edit", isAuthenticated,getBreadcrumbs, servicesEdit);
router.post("/admin/services/:id/edit", isAuthenticated, servicesEditPost);

router.get("/admin/blog", isAuthenticated,getBreadcrumbs, blogPanel);
router.get("/admin/blog/create", isAuthenticated,getBreadcrumbs, blogCreate);
router.post(
  "/admin/blog/create",
  isAuthenticated,
  upload.single("cover"),
  blogCreatePost
);

router.get("/admin/blog/:id/delete", isAuthenticated, blogDelete);

router.get("/admin/blog/:id/blog-edit-cover", isAuthenticated,getBreadcrumbs, blogEditCover);
router.post(
  "/admin/blog/:id/blog-edit-cover",
  isAuthenticated,
  upload.single("cover"),
  blogEditCoverPost
);

router.get("/admin/blog/:id/edit", isAuthenticated,getBreadcrumbs, blogEdit);
router.post("/admin/blog/:id/edit", isAuthenticated, blogEditPost);

// settings routes
router.get("/admin/settings", isAuthenticated,getBreadcrumbs, settingsPanel);
router.post(
  "/admin/settings",
  isAuthenticated,
  upload.single("logo"),
  settingsPost
);

// messages router 
router.get("/admin/messages", isAuthenticated,getBreadcrumbs, messagesPanel);
router.get("/admin/messages/:id/show",isAuthenticated,getBreadcrumbs,messagesShow);
router.post("/admin/messages/:id/send",isAuthenticated,getBreadcrumbs,messagesShowSend)
router.get("/admin/messages/:id/delete", isAuthenticated,getBreadcrumbs,messagesDelete)


//slides router
router.get("/admin/slides", isAuthenticated, getBreadcrumbs, slidesPanel);
router.get("/admin/slides/create", isAuthenticated, getBreadcrumbs, slidesCreate);
router.post("/admin/slides/create", isAuthenticated,upload.single("photo"),getBreadcrumbs, slidesCreatePost)
router.get("/admin/slides/:id/delete",isAuthenticated,getBreadcrumbs, slidesDelete)
router.get("/admin/slides/:id/slide-edit-photo", isAuthenticated,getBreadcrumbs, slidesEditPhoto);
router.post("/admin/slides/:id/slide-edit-photo",
  isAuthenticated,
  getBreadcrumbs,
  upload.single("photo"),
  slidesEditPhotoPost
);
router.get("/admin/slides/:id/edit",isAuthenticated,getBreadcrumbs, slideEdit);
router.post("/admin/slides/:id/edit",isAuthenticated,getBreadcrumbs,slideEditPost)

module.exports = router;
