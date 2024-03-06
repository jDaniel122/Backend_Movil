//CUSTOMCONTROLLER ES PARA REALIZAR LAS OPERACIONES LOGICAS, COMO SONSULTA ETC

const mysql = require("mysql");
const connection = mysql.createConnection({
    host : "localhost",
    user: "root",
    password : "",
    database: "interactivo" 
})
//usamos este modulos para leer la imagen
 const fs = require('fs')
 const path = require('path')

//validacion de imagen
const imageExtension = [".png",".jpg",".jpeg",".gif",];
function isImag(file){   //devulve la extension      //minuscula
    const validExt = path.extname(file.originalname).toLowerCase();
    return imageExtension.includes(validExt);
}
//Cambiamos el nombre y la extencion de la imagen
 function saveImag(file){
    const newpath = `./src/public/uploads/${file.originalname}`;
    fs.renameSync(file.path, newpath);
    return newpath
 }


//Redireccion de paginas
const controller = {};

            //keys = value
controller.login = (req,res)=>{
    res.render('login')
}
controller.register = (req,res)=>{
    res.render('register')
}
controller.index = (req,res)=>{
    connection.query("SELECT * FROM movil", (err, result)=>{
        if(err){
            console.log('error al intentar acceder a la pagina',err);
        }               //pagina
            res.render('index',{dataPhone: result});
    });
}
controller.description = (req,res)=>{
    const {id} = req.params
    connection.query("SELECT * FROM movil Where phone_id = ?",[id], (err, result)=>{
        if(err){
            console.log('error al intentar acceder a la pagina',err);
        }else{               //pagina
            connection.query('SELECT * FROM comments WHERE phone_id = ? ',[id],(err, comments)=>{
                if(err){
                    return err;
                }else{
                    res.render('description',{dataPhone: result, comment: comments});
                }
            })
            
    }
});
}

//pagina para insertar producto
controller.Pagesinsert= (req,res)=>{
    connection.query("SELECT * FROM movil", (err, result)=>{
        if(err){
            console.log('error al intentar acceder a la pagina',err);
        }               //pagina
            res.render('insertProd',{dataPhone: result});
    });
}


// CRUD  para pagina producto
controller.insert = (req,res)=>{
    //Recordemos que guardar imagenes en bd es de mala practica
    const url = `http://localhost:3000/uploads/${req.file.originalname}`;
    //se inicia la lectura de la imagen
                //usamos la F para guardar la imagen en formato png
    fs.readFile(saveImag(req.file), (err, imgData)=>{
        if(err){
            return err;
        }else{
            //antes validamos que sea un archivo formato IMAGEN
            if(!isImag(req.file)){
                connection.query('SELECT * FROM movil', (err, result)=>{
                res.render('insertProd',{
                alert:true,
                alertTitle: '"Error',
                alertMessage: `No se permite la subido de un archivo diferente a ${imageExtension}`,
                alertIcon:"error",
                showConfirmButton : true,
                timer:false,
                ruta: 'insertProd',
                dataPhone : result
                })
            })
            }else{
    const data = req.body;
    const Pname = data.phoneN;
    const Ptype = data.type;
    const Pdesc= data.des;
    const Pprice = data.price;
    connection.query("INSERT INTO movil SET ?",{name:Pname, type:Ptype, description:Pdesc, img:url, price:Pprice}, (err, result)=>{
        if(err){
            console.log('erro al intentar insertar  a la pagina',err);
        }else{  
            connection.query('SELECT * FROM movil',(err, result)=>{  
                res.render('insertProd',{    
                alert:true,
                alertTitle: '"Registration',
                alertMessage: "Equipo registrado satisfactoriamente!",
                alertIcon:"success",
                showConfirmButton : false,
                timer:1500,
                ruta: 'insertProd',
                dataPhone : result
                })
                console.log('registro satisfactorio')
            })
            }
        })
    }
}
    })
}
controller.delete = (req,res)=>{
    const {id} = req.params;
    connection.query('DELETE FROM movil WHERE phone_id = ?', [id], (err, result)=>{
        if(err){
            return err;
        }else{
            connection.query('DELETE FROM comments WHERE phone_id = ?', [id],(err, result)=>{
                if(err){
                    console.log('su error', err)
                }else{
            
            connection.query('SELECT * FROM movil',(err, result)=>{  //para darle la variable dataPhone y no se presente errores
                res.render('insertProd',{    
                alert:true,
                alertTitle: '"Deletation',
                alertMessage: "Eliminacion exitosa!",
                alertIcon:"success",
                showConfirmButton : false,
                timer:1500,
                ruta: 'insertProd',
                dataPhone : result
                })
                console.log('registro satisfactorio')
            })
            }
            })
            }
        })
}


//COMMENT
controller.comment = (req,res)=>{
    const data = req.body;
    const {id} = req.params;
    connection.query('INSERT INTO comments SET ?',{phone_id:id,comment:data.comment},(err, result)=>{
        if(err){
            return err;
        }else{
            res.redirect('/description/' + id);
            console.log("comentario guardado");
        }
    })
}

module.exports = controller