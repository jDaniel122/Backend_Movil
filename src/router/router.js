//RUTAS ES DONDE SERA DIRIGIDO POR LA URL, POR ELLO ES IMPORTANTAE EL USO DE '/'

const express = require("express");
const router = express.Router();
const CustomerController = require('../controller/CustomController')
const multer = require('multer');
//con esta linea creamo la carpeta donde se almacenaran las img
const upload = multer({ dest: './src/public/uploads/', limits: {fileSize:2000000}});


// pages
            //URL
router.get('/login', CustomerController.login);
router.get('/',CustomerController.index);
router.get('/register', CustomerController.register);
router.get('/description/:id', CustomerController.description);

//paginas para insertar
router.get('/insertProd', CustomerController.Pagesinsert);

//CRUD producto
router.post('/InsertPhone',  upload.single("img"),CustomerController.insert);
router.get('/deleteprod/:id', CustomerController.delete);


//COMMENT
router.post('/comment/:id', CustomerController.comment);



module.exports =  router;

//http://localhost:3000/src/public/uploads/