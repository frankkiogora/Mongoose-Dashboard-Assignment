var express = require('express');
var app = express();


//=========== view engine set up  ==================
var ejs = require('ejs');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// ============ Body-parser middleware =============
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));


//=======   Data base stuff =========================
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cat_db');
mongoose.Promise = global.Promise;

//=========== schema setup  ========================
var CatSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    age: Number,
    size: String
    });
        
    mongoose.model('Cat', CatSchema);
    var Cat = mongoose.model('Cat');

//=======   GET methods =============================

// app.get('/',function(req,res){
//     res.render('index');
// });

 // get all the cat entries and display them
app.get('/', function(req, res) {
	Cat.find({}, function(err, results) {
		if (err){ 
			console.log(err);
		} else {
          
			res.render('index', {cats:results})
		}
	});
});

//Displays a form for making a new cat.
app.get('/new',function(req,res){
    res.render('new');
});

//Displays info about one cat
app.get('/:id',function(req,res){
    Cat.find({_id: req.params.id}, function(err, cat){
        if(err){
            console.log(err);
        }else{
            console.log('cat from display :' ,cat)
            res.render('show', {cat:cat});
        }
     })
 });

//edit cat
 app.get('/:id/edit/', function(req,res){
    Cat.find({_id:req.params.id}, function(err, cat){
       if(err){
           console.log(err);
            }else{
            res.render('edit', {cat:cat});
        }
     });
 });

//=======  POST method =====================================

//action attribute for the form in the above route (GET '/new').
app.post('/', function (req, res){
    var cat = new Cat(req.body);
    cat.save(function(err){
        if(err){
       
            res.render('new', {title: 'You have new errors', errors:cat.errors})
        }

        else {
            res.redirect('/');
        }
    });
});

//Should be the action attribute for the form in the above route (GET '/new').
// updating a cat (update method)
app.post('/cats/:id', function(req, res){
	Cat.update({ _id: req.params.id }, req.body, function(err, cat){
		if (err){
			console.log(err);
		} else {
			res.redirect('/')
		}
	});
});

//delete a cat by id (remove)
app.post('/:id/destroy', function(req, res){
	Cat.remove({ _id: req.params.id }, function(err, result){
		if (err){
			console.log(err);
		} else {
			res.redirect('/')
		}
	});
});

//===  Don't disturb, server listening @ port: 4000 =====

app.listen(4000,function(){
    console.log('<<<<< ++++++  listening in port 4000 +++++>>>')
});




