import db from "../db/db_config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

// import multer from "multer";
// import path from "path";

// import express from"express"
// const app = express()

const getApi = (req,res) =>{
    db.query("SELECT * FROM `tbl_user` ORDER BY id LIMIT 6",(error,rows)=>{
        if(error){
            res.json({
                data : error,
                message : 'Get API Not Success'
            })
        }else{
            res.json({  
                data : rows,
                message : 'Get API Successfuly'
            })
        }
    });
    
}


const getAdmin = (req,res) =>{
    // console.log(req.params.id)
    db.query("SELECT * FROM `tbl_user` ORDER BY id LIMIT 1",[req.params.id],(error,rows)=>{
        if(error){
            res.json({
                data : error,
                message : 'Get Admin Not Success'

            })
        }else{
            res.json({  
                data : rows,    
                message : 'Get Admin Successfuly'
            })
        }
    })
}

const register = async (req,res) =>{
    const { username, email, password,profile} = req.body;
    console.log(password);
    try {
        
      const saltRounds = await bcrypt.genSalt(10); // Adjust salt rounds as needed
      console.log(saltRounds);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log(hashedPassword);
  
      // Create user object
     
      const user = {
        username,
        email,
        password: hashedPassword,
        profile:req.file.filename
      };
      

        try{
            var sqlReguster = 'INSERT INTO `tbl_user`(`username`, `email`, `password`, `profile`) VALUES (?,?,?,?)';
            db.query(sqlReguster,[user.username,user.email,user.password,user.profile],(error,rows)=>{
                if(error){
                    res.json({
                        error : true,
                        message : 'insert Not Success',
                    })
                }else{
                    res.json({
                        data : rows,
                        message : 'Success',
                    })
                  
                }
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error insert data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during registration' });
    }
}
const login = (req,res) =>{
    const {username,password} = req.body;
    if(username == null || username == ""){
        res.json({
            error : true,
            message : 'Please file in username!'
        })
        return
    }else if(password == null || password == ""){
        res.json({
            error : true,
            message : 'Please fill in password!'
        })
        return
    }
    try{
        
        db.query('SELECT * FROM `tbl_user` WHERE username = ?',[username],(err,rows)=>{
                if(err){
                    res.json({
                        err : true,
                        message : 'Error Please Check Code!'
                    })
                }else{
                   if(rows.length == 0){
                       res.json({
                           err : true,
                           message : 'User dose exit . please Register!'
                       })
                   }else{
                       var data = rows[0];
                       var passwordInDb = data.password;
                       var isCorrectPassword =  bcrypt.compareSync(password,passwordInDb);
                       if(isCorrectPassword){
                        var token = jwt.sign({profile: rows},'H588JT-65^538*AK99')
                           res.json({
                                message : 'Login Success',
                                profile : data,
                                token : token
                           })
                       }else{
                          res.json({
                              message :' Incorrect password'
                          })
                       }
                   }
                }
            })
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error data login...!' });
    }
}


const verifyJwt = (req,res) =>{
    const authHeaders = req.headers.authorization;
    if(!authHeaders ){
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const token = authHeaders.split(" ")[1];    
    jwt.verify(token ,'H588JT-65^538*AK99',(error,decoded)=>{
        const id = decoded.profile.id;
        if(error){
            return res.status(401).json({message :'Forbidden (invalid token)' })
        }
        if(decoded){
            return res.json({id : id, message : 'verify successfuly'});
        }
        
        
    })
}


const add_hotel = async(req,res)=>{
    const {title,description} = req.body;
   const data ={
        title,
        thumbnail: req.file.filename,
        description,
   }
   try{
    const sqlAddHotel = 'INSERT INTO `tbl_category`(`title`, `thumbnail`, `description`) VALUES (?,?,?)';
    db.query(sqlAddHotel,[data.title,data.thumbnail,data.description],(error,rows)=>{
         if(error){
             res.json({
                 error : true,
                 message : 'add hotel not Success'
             })
         }else{
             res.json({
                 data : rows,
                 message : 'Add Hotel Success'
             })
         }
    })
   }catch(err){
       console.log('Data not work'+err);
   }
}

const views_hotel = (req,res) =>{
    db.query("SELECT * FROM `tbl_category` ORDER BY id DESC",(error,rows)=>{
        if(error){
            res.json({
                data : error,
                message : 'Get Views Hotel Not Success'
            })
        }else{
            res.json({  
                data : rows,
                message : 'Get Views Hotel Successfuly'
            })
        }
    });
    
}

// Get Params Hotel 

const getParamsViewHotel = (req,res) =>{
    const id = req.params.id
    // console.log(id)
    // res.send("helllo")
    db.query("SELECT * FROM `tbl_category` WHERE id = ?",[id],(error,rows)=>{
        if(error){
            res.json({
                data : error,
                message : 'Get Views Hotel Not Success'
            })
        }else{
            res.json({  
                data : rows,
                message : 'Get Views Hotel Successfuly'
            })
        }
    });
}
// search product hotel
const search = (req,res)=>{
    const searchTerm = req.query.q;
   
  const query = `SELECT * FROM tbl_category WHERE title LIKE ? OR description LIKE ?`;
 
  db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.json(results);
    }
  });
}
const update_hotel = (req,res) =>{
   
    // const {body,params:{id}} = req;
    const {title,description} = req.body;
    const data ={
        title,
        thumbnail : req.file.filename,
        description
    }
    const {id} = req.params;
    try{
        var sqlUpdate = "UPDATE `tbl_category` SET `title`=?,`thumbnail`=?,`description`= ? WHERE id = ?";
        db.query(sqlUpdate,[data.title,data.thumbnail,data.description,id],(error,rows)=>{
            if(error){
                res.json({
                    error :true,
                    message : 'Update hotel Not Success'
                })
            }else{
                res.json({
                    data : rows,
                    message : "Update hotel Success"
                })
            }
        })
    }catch(err){
        console.log('Data Error ...'+err);
    }
}

const delete_hotel = (req,res) =>{
   
    const {id} = req.params;
    const sqlDelete_hotel ="DELETE FROM `tbl_category` WHERE id = ?";
    db.query(sqlDelete_hotel,[id],(error,rows)=>{
        if(error){
            res.json({
                error : true,
            })
        }else{
            res.json({message: 'Delete Hotel Success'})
        }
    })
}

// about banner
const banner_home = (req,res)=>{
    const {title,description} = req.body;
    const data ={
        title,
        banner : req.file.filename,
        description
    }
    var sqlBanner = "INSERT INTO `tbl_banner_home`(`title`, `thumbnail`, `description`) VALUES (?,?,?)";
    db.query(sqlBanner,[data.title,data.banner,data.description],(error,rows)=>{
        if(error){
            res.json({
                error : true,
                message : "Banner Insert Not Success"
            })
        }else{
            res.json({
                data : rows,
                message : "Banner Insert Success"
            })

        }
    })
}

const getBannerHome = (req,res) =>{
    db.query("SELECT * FROM `tbl_banner_home` ORDER BY id DESC LIMIT 1",(err,rows)=>{
        res.json({
            data: rows,
            message : "Get Banner Home Success"
        })
    })
}

const AddveiwsHotel = (req,res) =>{
    const {title,description} = req.body;
    const data ={
        title,
        thumbnail : req.file.filename,
        description
    }
    var sqlBanner = "INSERT INTO `tbl_view_hotel`(`title`, `thumbnail`, `description`) VALUES (?,?,?)";
    db.query(sqlBanner,[data.title,data.thumbnail,data.description],(error,rows)=>{
        if(error){
            res.json({
                error : true,
                message : "Add View Hotel Insert Not Success"
            })
        }else{
            res.json({
                data : rows,
                message : "Add View Hotel Insert Success"
            })

        }
    })
}

// about Delete Banner Home Hotel

const delete_banner_home = (req,res) =>{
//    const id = req.params.id
   console.log(id)
    db.query("DELETE FROM `tbl_banner_home` WHERE id = ?",[id],(err,result)=>{
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error deleting data' });
          } else {
            res.json({ message: 'Data deleted successfully', affectedRows: result.affectedRows });
          }
    })
}
// getFeedback
const getFeedback = (req,res) =>{
    db.query("SELECT * FROM tbl_feedback ORDER BY id DESC",(err,rows)=>{
        if(err){
            res.json({
                error : true,
                message : "Get Not Success"
            })
        }else{
            res.json({
                data : rows,
                message : "Get Data Success"
            })

        }
    })
}


// feedback User
const feedback = (req,res) =>{
    const {username,email,address,description} = req.body;
    const body ={
        username,
        email,
        address,
        description
    }
    try{
        var sqlInsertFeedback = "INSERT INTO `tbl_feedback`( `username`, `email`, `address`, `description`) VALUES (?,?,?,?)";
    db.query(sqlInsertFeedback,[body.username,body.email,body.address,body.description],(err,rows)=>{
        if(err){
            res.json({
                err : true,
                message : 'Insert Feedback Not Success',
            })
        }else{
            res.json({
                data : rows,
                message : 'Insert Feedback Successfuly',
            })
        }
    })
    }catch(err){
        console.log('Error Data');
    }
}


// Follow Us or Contact Us

const contact_us = (req,res) =>{
    db.query("SELECT * FROM `tbl_follow_us` ORDER BY id DESC LIMIT 5",(err,rows)=>{
        if(err){
            res.json({
                err : true,
                message : "get Contact Not Success"
            })
        }else{
            res.json({
                data : rows,
                message : "Get Contact Success"
            })
        }
    })
}

const contact_us_add = (req,res) =>{
    const {label,url} = req.body;
    const data ={
        label,
        url, 
        thumbnail : req.file.filename
    }
    var sqlContactAdd = "INSERT INTO `tbl_follow_us` (`label`, `url`, `thumbnail`) VALUES (?,?,?)";
    db.query(sqlContactAdd,[data.label,data.url,data.thumbnail],(err,rows)=>{
        if(err){
            res.json({
                err : true,
                message : 'Conact Add Not Success'
            })
        }else{
            res.json({
                data : rows,
                message : 'Insert Contact Us Successfuly',
            })
        }
    })
}



export default {
    getApi,
    getAdmin,
    login,
    register,
    verifyJwt,
    add_hotel,
    views_hotel,
    getParamsViewHotel,
    search,
    update_hotel,
    delete_hotel,
    banner_home,
    getBannerHome,
    AddveiwsHotel,
    delete_banner_home,
    getFeedback,
    feedback,
    contact_us_add,
    contact_us,
}