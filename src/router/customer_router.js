import functionController from "../controller/controller.js"
import router from "./user_router.js"

import multer  from "multer"
import path from "path"
const storage = multer.diskStorage({
   destination:'images/',
   filename:(req,file,cb)=>{
        console.log(file)
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
   }
        
})

const upload = multer({
    storage:storage,
    limits:{
        fileSize : 1024*1024*3
    }
})



router.get('/controller/users',functionController.getApi) 
router.get('/controller/admin/:id',functionController.getAdmin) 

router.post('/controller/register',upload.single('image'),functionController.register)
router.post('/controller/login',functionController.login)
// router.post('/upload',upload.single('file'),functionController.uploadImage)
router.get('/controller/proetcted/verify',functionController.verifyJwt)
router.post('/controller/add-hotel',upload.single('image'),functionController.add_hotel)
router.get('/controller/views-hotel',functionController.views_hotel)
router.get('/controller/views-hotel/:id',functionController.getParamsViewHotel)
router.get('/controller/search-product',functionController.search)

router.put('/controller/update-hotel/:id',upload.single("image"),functionController.update_hotel)
router.delete('/controller/delete-hotel/:id',functionController.delete_hotel)
// About Banner Home 
router.post('/controller/banner-home',upload.single("image"),functionController.banner_home)
router.delete('/controller/delete-banner-home/:id',functionController.delete_banner_home)
router.get('/controller/get-banner',functionController.getBannerHome)
//About Views Hotel Add 
router.post('/controller/add-views-hotel', upload.single("image"),functionController.AddveiwsHotel)
//getFeedback
router.get('/controller/get-feedback',functionController.getFeedback)
router.post('/controller/add-feedback',functionController.feedback)
// contact Us User

router.get('/controller/get-contact',functionController.contact_us)
router.post('/controller/add-contact',upload.single("image") ,functionController.contact_us_add)









export default router