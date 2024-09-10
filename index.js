import express from "express"
import userRoiuter from "./src/router/user_router.js"
import customer from "./src/router/customer_router.js"
import cors from "cors"
// import path from "path"
// import bodyParser from "body-parser"

const app = express()
// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cd(null,'/upload');
//     },
//     filename:function(req,file,cb){
//         cb(null,file.originalname);
//     }
// });

// const upload = multer({storage});
const port = 8000;
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({origin:'*'}));
app.use('/api',userRoiuter,customer);
app.use(express.static('images'));


app.listen(port,()=>{
    console.log(`running server http://localhost:${port}`);
})