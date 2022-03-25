module.exports = {
    index: (req,res) => {
        res.render('user/index')
    },
    blog: (req,res) => {
        res.render("user/blog")
    },
    about: (req,res) => {
        res.render("user/about")
    },
    contact: (req,res) => {
        res.render("user/contact")
    }
}