import express from "express"
const router = express.Router();

router.get('/getApi/users',(req,res)=>{
    res.send('get Api user All');
})
router.post('/create/users',(req,res)=>{
    res.send('Create Api user ');
})
router.put('/update/users',(req,res)=>{
    res.send('Update Api user ');
})
router.delete('/delete/users',(req,res)=>{
    res.send('Delete Api user ');
})

export default router