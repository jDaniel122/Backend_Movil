//ARCHIVO DONDE SE OPERA TODO
// 1 - importamos lo necesario 
const Express = require("express");
const path = require("path");
const mysql = require("mysql");
const morgan = require("morgan");



// 2 - Creamos app 
const app = Express();

// 3 - middlewares
app.use(morgan('dev'));


// 4 - archivos estaticos
app.use(Express.static(path.join(__dirname, 'public')));


// 5 - motor de plantilla
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// 6 - bd
const connection = mysql.createConnection({
    host : "localhost",
    user: "root",
    password : "",
    database: "interactivo" 
})


// 7 - importamos rutas
const importRouter = require('./router/router')
//permite entender los datos enviados por el formulario
app.use(Express.json());
app.use(Express.urlencoded({extended:true}));
app.use('/', importRouter);


// 8 import contrasena encriptada
//const bcrypt = require("bcrypt");

// 8.1 - register
app.post('/register', (req, res) =>{
    const datos = req.body;
    const users = datos.user;
    const name = datos.name;
    const mail = datos.mail;
    const rol = datos.rol;
    var pass =  datos.password;
    connection.query('SELECT * FROM users WHERE userName = ? OR email = ?',[users, mail] ,(err,result)=>{
        if(err){
            throw err;
        }else{
            if(result.length > 0 ){
                                                //variable =>  extraible de la consulta
                const UserNameExis = result.some(row => row.userName === users);  
                const MailExis = result.some(row => row.email === mail);
                if(UserNameExis && MailExis){
                    res.render('register',{
                        alert:true,
                        alertTitle: '"Error',
                        alertMessage: "Usuario y correo YA regsitrado!",
                        alertIcon:"error",
                        showConfirmButton : true,
                        timer:false,
                        ruta: 'register'
                    })
                }else if(UserNameExis){
                    res.render('register',{
                        alert:true,
                        alertTitle: '"Error',
                        alertMessage: "Usuario YA regsitrado!",
                        alertIcon:"error",
                        showConfirmButton : true,
                        timer:false,
                        ruta: 'register'
                    })
                }else if(MailExis){
                    res.render('register',{
                        alert:true,
                        alertTitle: '"Error',
                        alertMessage: "Correo YA regsitrado!",
                        alertIcon:"error",
                        showConfirmButton : true,
                        timer:false,
                        ruta: 'register'
                    })
                }
            }else{
               // bcrypt.hash(pass, 12).then( hash=>{ mas adelante realizamos la encriptacion
                //pass =  hash;

                connection.query("INSERT INTO users SET ?", {userName:users, name:name, email:mail, rol:rol, password:pass}, async(err, results) =>{
                    if(err){
                        return err;
                    }else{
                    //req.session.name = result[0].name
                        res.render('register',{
                            alert:true,
                            alertTitle: '"registration',
                            alertMessage: "Registro satisfactorio!",
                            alertIcon:"success",
                            showConfirmButton : false,
                            timer:1500,
                            ruta: 'login'
                        })
                    }
                    });
                //})
            }
        }
    })
})


// 9 - login EN DESARROLLO
app.post('/login', (req, res) =>{
    const data = req.body;
    console.log(data);
            connection.query( 'SELECT * FROM users WHERE userName = ?', [data.user], (err, result) => {
                    if (result.length > 0) {
                        if(data.password === result[0].password){
                            if(result[0].rol === 1){ //vendedor
                                connection.query('SELECT * FROM movil',(err,result)=>{
                                    res.render('insertProd',{dataPhone : result})
                                })
                            }else{ //Cliente
                                connection.query('SELECT * FROM movil',(err,result)=>{
                                    res.render('index',{dataPhone : result})
                                })
                        }
                        }else{
                            res.render('login',{
                                alert:true,
                                alertTitle: '"Error',
                                alertMessage: "Contrasena incorrecta!",
                                alertIcon:"error",
                                showConfirmButton : true,
                                timer:false,
                                ruta: 'login'
                            })
                        }
                        //var passBd =  result[0].password;
                        //const valid =  bcrypt.compare(pass, passBd);
                    }else{
                        res.render('register',{
                            alert:true,
                            alertTitle: '"Error',
                            alertMessage: "Usuario NO encontrado, registrese!",
                            alertIcon:"error",
                            showConfirmButton : true,
                            timer:false,
                            ruta: 'register'
                        })
                    }
                });  
        });      




app.listen(3000);
console.log('server open in port : ', 3000)