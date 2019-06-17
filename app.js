var express=require('express');
var exphbs=require('express-handlebars');
var hbs_sections=require('express-handlebars-sections');
const Handlebars = require('handlebars');
const HandlebarsIntl = require('handlebars-intl');

var app=express();

app.use(express.static('public'));

Handlebars.registerHelper('customNumberFormat', function(value){

    var context = {
        value: value
    };
  
    var intlData = {
        locales: ['en-US'],
    };
  
    // use the formatNumber helper from handlebars-intl
    var template = Handlebars.compile('{{formatNumber value}} is the final result!');
  
    var compiled = template(context, {
      data: {intl: intlData}
    });
  
    return compiled
  });

app.engine('hbs',exphbs({
    defaultLayout:'main_public.hbs',
    layoutsDir:'views/layouts',
    helpers:{
        section:hbs_sections()
    }
}));



app.set('view engine','hbs');

app.use('/',require('./routes/homepage.route'));
app.use('/article',require('./routes/article.route'));
app.use('/writer',require('./routes/writer/dashboard.route'));

app.use((req,res,next)=>{
    res.render('404',{layout:false});
})

app.use((error,req,res,next)=>{
    res.render('500',{layout:false});
})

Handlebars.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});

app.listen(3000,()=>{
    console.log('server is running at http://localhost:3000');
})