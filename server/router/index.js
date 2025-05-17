const Router = require('express').Router
const router = new Router()
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')
const adminMiddleware = require('../middlewares/admin-middleware')
const UserController = require('../controllers/user-controller')
const ProductController = require('../controllers/product-controller')
const multer  = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg'
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
        cb(null, uniqueName)
    }
})

const upload = multer({ storage })

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 16}),
    UserController.registration
)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)

router.get('/product', ProductController.getAll)
router.get('/product/:id', ProductController.getById)
router.post('/product', adminMiddleware, upload.any(), ProductController.create)
router.put('/product/:id', adminMiddleware, ProductController.update)
router.delete('/product/:id', adminMiddleware, ProductController.delete)
router.post('/product/:id/review', authMiddleware, ProductController.addReview)

module.exports = router