const express = require('express');
const path = require('path')
const app = express();
const multer = require('multer');
const uuid = require('uuid/v4');

//settings
app.set('port',3000)
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')

//middlewares
const storage = multer.diskStorage({
    destination: path.join(__dirname,'./public/uploads'),
    filename:(req, file, cb) =>{
        cb(null, uuid() + path.extname(file.originalname)
        .toLocaleLowerCase());
    }
});

app.use(multer({
    storage,
    dest: path.join(__dirname,'public/uploads'),
    limits: {fileSize:100000000},
    fileFilter:(req, file, cb) =>{
        const filetype = /jpeg|jpg|png|gif/;
        const mimetype = filetype.test(file.mimetype);
        const extname = filetype.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true)
        }else{
            cb("error: Archivo debe ser una imagen")
        }
    }
}).single('image'));

//routes
require('./routes/routes_image')(app);

//statick files
app.use(express.static(path.join(__dirname,'public'))) 

//start server
app.listen(app.get('port'),()=>{
    console.log(`server on port ${app.get('port')}`)
})