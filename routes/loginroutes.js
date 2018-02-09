var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'samuel',
  database : 'banco_dados'
});
connection.connect(function(err){
  if(!err) {
    console.log("Conectado com o DataBase");
  } else {
    console.log("Erro na conexao com o DataBase");
  }
});

exports.register = function(req,res){
  var today = new Date();
  var users={
    "name":req.body.first_name,
    "email":req.body.email,
    "password":req.body.password,
  }
  var email= req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
    if (results[0].email == email){
      res.send({
        "code":400,
        "Erro":"Email ja Cadastrado"
    })
  } else {
     connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "Erro":"Erro ao Acessar o DataBase"
        })
      } else {
        console.log('The solution is: ', results);
        res.send({
          "code":200,
          "success":"Usuario Registrado"
        });
      }
    }); 
  }
  });
}

exports.login = function(req,res){
  var email= req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "Erro":"Erro ao acessar o DataBase"
      })
  } else {
    if(results.length >0){
      if(results[0].password == password){
        res.send({
          "code":200,
          "success":"Login Efetuado com Sucesso"
        });
      }
      else {
        res.send({
          "code":204,
          "success":"Email ou Senha Incorretos"
        });
      }
    }
    else {
      res.send({
        "code":204,
        "success":"Email nao Cadastrado"
      });
    }
  }
});
}
