/**
 * Created by Administrator on 2020/8/26 0026.
 */
const router = require('express').Router();
const db = require("./sqlHelper");
router.get("/",(req,res)=>{
    res.redirect("/index.html")
});
router.get("/index.html",async (req,res)=>{
    let bannerList = await getBanner();
    let newList = await getNewList();
    if(req.session.user){
        res.render("index",{user:req.session.user,
            headImage:req.session.info.HeadImage,
            lunbo:bannerList,
            newList:newList
        })
    }else{

        res.render("index",{user:req.session.user,lunbo:bannerList,newList:newList})
    }
});
function getBanner(){
    return new Promise((resolve,reject)=>{
        let sql = "select *from banner where keyName= 'lun'";
        db.query(sql,[],(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })
}
function getNewList(){
    return new Promise((resolve,reject)=>{
        let sql2 = `SELECT product.*,productrule.Id AS rid FROM product JOIN productrule ON product.Id = productrule.productId
WHERE isNew = 1 AND isDefault = 1`;
        db.query(sql2,[],(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })
}
router.get("/user.html",(req,res)=>{
    let sql = "select * from user";
    db.query(sql,[], function (err,data) {
        res.render("user",{userList:data})
    })

});
router.get("/productDetail.html",(req,res)=>{
    let rid = req.query.id;
    console.log(rid);
    let sql = `select *,r.id as rid from product as p join productrule as r
        on p.Id = r.productId where r.Id =?`;
    db.query(sql,[rid],function(err,data){
        console.log(data);
        res.render("productDetail",{info:data[0],user:req.session.user,
            headImage:req.session.info.HeadImage
        })
    });
});
router.get("/cart.html",(req,res)=>{
    if(req.session.user){
        let userId = req.session.info.id;
        let sql = `SELECT s.id as sid,p.feng,p.title,r.price,s.num,
r.Id AS rid FROM shopcard s JOIN productrule r ON
s.RuleId=r.Id JOIN product p ON r.productId=p.Id where s.userId =?`;
        db.query(sql,[userId],(err,data)=>{
            res.render("cart",{user:req.session.user,
                headImage:req.session.headImage,
                productList:data
            });
        });

    }else{
        res.redirect("/cart.html");
    }

});
module.exports = router;