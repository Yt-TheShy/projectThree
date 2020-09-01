/**
 * Created by Administrator on 2020/8/25 0025.
 */
const router = require("express").Router();
const db = require("./sqlHelper");
router.post("/userLogin",(req,res)=>{
    let user = req.body.user;
    let pwd = req.body.pwd;
    console.log(user);
    console.log(pwd);
    let sql = "select * from user where userName = ? and pwd = ?";
    db.query(sql,[user,pwd],function(err,data){
        if(err){
            res.send({code:500,message:"数据库出错，请联系管理员",data:data});
        }else{
            if(data.length>0){
                req.session.user = user;
                req.session.headImage = data[0].HeadImage;
                req.session.info = data[0];
                res.send({code:200,message:"登陆成功"})
            }else{
                res.send({code:201,message:"用户名或密码错误"})
            }
        }
    })

});
router.post("/userReg",(req,res)=> {
    let email = req.body.Email;
    let user = req.body.user;
    let pwd = req.body.zhucePwd;
    let sql = "insert into user(email,userName,pwd) values (?,?,?)";
    db.query(sql, [email, user, pwd], function (err, data) {
        if (err) {
            res.send("数据库出错，请联系管理员")
        } else {
            if (data.affectedRows > 0) {
                res.send('注册成功')
            } else {
                res.send('<script>alert(\'注册失败\');location.href="zc.html"</script>')
            }
        }
    })
});

module.exports = router;
