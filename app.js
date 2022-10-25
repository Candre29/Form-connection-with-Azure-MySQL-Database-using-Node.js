//imports
const express = require('express'); // building web application and API
const mysql = require('mysql');
const fs = require('fs');


const port = process.env.PORT || 3000 ;
const app = express(); // this is our app or instance of express


// ----- Static Files
app.use(express.static('public'))// to serve our public folder as a static folder 
app.use('/css', express.static(__dirname+'public/css'))
app.use('/js', express.static(__dirname+'public/js'))
app.use('/img', express.static(__dirname+'public/img'))

//--- Api Midlewares
app.use(express.json()); // this is to accept data in json format
app.use(express.urlencoded()); // to decode the data send thoruh html form 



//------ Set Views
app.set('views','./views')
app.set('view engine', 'ejs')
// shows index.ejs
app.get('',(req, res)=>{
    res.render('index', {text: 'This is ejs'})
})
// shows about.ejs
app.get('/about',(req, res)=>{
    res.render('about', {text: 'About Page'})
})


var mysqlConnection = mysql.createConnection({
    host:'myclients.mysql.database.azure.com',
    user:'andru@myclients',
    password:'Myeasytwo!',
    database: 'helloclient',
    port: 3306,
    ssl:{
        ca:fs.readFileSync('BaltimoreCyberTrustRoot.crt.pem') // ssl authentication enforced 
        }
});
 //connect and check for errors
mysqlConnection.connect((err)=>{
    if(!err) //if there is no error
    console.log('DB coonnect succeded');
    else //if there is an error 
    console.log('Db connection failed \n Error: '+JSON.stringify(err, undefined, 2));
});

// ---- Send information from the form 
app.post('/submit', function(req,res){
    console.log(req.body);

    mysqlConnection.query('INSERT INTO people (name, email) VALUES(?,?);',[req.body.id,req.body.name],
            function(err,results,fields){
                if (err) throw err;
            else {
                console.log('Inserted '+ results.affectedRows+'row(s).');
                res.render('about', {text: 'Thank you'});
                }  
    });

    
    
    mysqlConnection.end(function(err){
        if (err) throw err;
        else console.log('Done.')
    });

});
// To consult the data
app.get('/consult', function(req, res){
    mysqlConnection.query('SELECT * FROM people',
        function(err,results,fields){

            if(err) throw err;
            else console.log('Selected '+ results.lenght + 'row(s)');
            for (i=0; i< results.length; i++) {
                console.log('Row: ' + JSON.stringify(results[i]));
            }
            console.log('Done');
        });

    mysqlConnection.end(
        function (err) {
            if (err) throw err;
            else {console.log('Closing connection');
                  res.render('index', {text: 'This is ejs'});
        }
        });

});






// Listen on port 3000
app.listen(port, ()=> console.info(`listening on port ${port}`));



