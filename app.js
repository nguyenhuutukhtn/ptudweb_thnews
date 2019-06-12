var express=require('express');
var exphbs=require('express-handlebars');

var app=express();

app.use(express.static('public'));

app.engine('hbs',exphbs({
    defaultLayout:'main_public.hbs',
    layoutsDir:'views/layouts'
}));

app.set('view engine','hbs');


app.use(require('./middlewares/lastestNews.mdw'));

app.use('/',require('./routes/homepage.route'));


app.listen(3000,()=>{
    console.log('server is running at http://localhost:3000');
})