/**
 * Created by Administrator on 2020/8/25 0025.
 */
//引用模块
const myexpress = require("express");
const favicon = require("serve-favicon");
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const userRouter = require('./router/userRouter');
const viewRouter = require('./router/viewRouter');
const productRouter = require('./router/productRouter');
const ejs = require('ejs');
const app = myexpress();
//配置
app.use(logger('dev'));
//bodyparser 的配置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());//定义cookie解析器
app.use(session({
    secret:'1234',
    name:'testapp',
    cookie: {maxAge: 800000 }
    //rolling:true,
    //resave:true
}));
app.set('views',__dirname+'/view');//设置试图目录
app.engine("html",ejs.__express);//设置后缀名
app.set('view engine','html');//启动试图引擎
app.use(viewRouter);
app.use(userRouter);
app.use(productRouter);
app.use("/index.html",(req,res)=>{
    if(req.session.user){
        res.render("index",{user:req.session.user,headImage:req.session.info.HeadImage})
    }else{
        res.render("index",{user:req.session.user})
    }

});
app.use(myexpress.static(__dirname+'/public',{index:'index.html'}));
app.use(favicon(__dirname+'/public/favicon.ico'));

app.listen(8585);
console.log('服务启动');