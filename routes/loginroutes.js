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
        "failed":"emal alredy register"
    })
  } else {
     connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      } else {
        console.log('The solution is: ', results);
        res.send({
          "code":200,
          "success":"user registered sucessfully"
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
        "failed":"error ocurred"
      })
  } else {
    if(results.length >0){
      if(results[0].password == password){
        res.send({
          "code":200,
          "success":"login sucessfull"
        });
      }
      else {
        res.send({
          "code":204,
          "success":"Email and password does not match"
        });
      }
    }
    else {
      res.send({
        "code":204,
        "success":"Email does not exits"
      });
    }
  }
});
}
