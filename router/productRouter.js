/**
 * Created by Administrator on 2020/8/29 0029.
 */
const router = require("express").Router();
const db = require("./sqlHelper");
router.post("/shopcart",(req,res)=>{
    var rid = req.body.rid;
    if(req.session.user){
        let userId = req.session.info.id;
        //进行判断
        let sql2="select * from ShopCard where UserId=? and ruleId=?";
        db.query(sql2,[userId,rid],(err2,data2)=>{
            if(err2){
                //console.log(err2);
            }else{
                if(data2.length>0){
                    //
                    let sql = "update ShopCard set num=num+1 where UserId=? and RuleId=?"
                    db.query(sql,[userId,rid],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send({code:500,message:"数据库出错，请联系管理员"})
                        }else{
                            if(data.affectedRows>0){
                                res.send({code:200,message:"加入购物车成功"})
                            }else{
                                res.send({code:202,message:"加入购物车失败"})
                            }
                        }
                    })
                }else{
                    let sql = "insert into ShopCard(userId,RuleId) values (?,?)";
                    db.query(sql,[userId,rid],(err,data)=>{
                       // console.log(data);
                        if(err){
                            console.log(err);
                            res.send({code:500,message:"数据库出错，请联系管理员"})
                        }else{
                            if(data.affectedRows>0){
                                res.send({code:200,message:"加入购物车成功"})
                            }else{
                                res.send({code:202,message:"加入购物车失败"})
                            }
                        }
                    })
                }

            }

        });

    }else{
        res.send({code:201,message:"请先登录"})
    }
});
router.post("/buildOrder",(req,res)=>{
    let sidstr = req.body.sidstr;
    let total = req.body.total;
   console.log(req.body.sidstr);
    /*
    * 购物车，生成订单
    *1.生成订单
    * 订单两个表（订单表，订单详情表）
    *2.删除购物车
    * */

    if(req.session.user){
        let userid = req.session.info.id;
        //生成订单表
        let sql = "INSERT INTO `ORDER` (userid,total) VALUES (?,?)";
        db.query(sql,[userid,parseFloat(total)],(err,data)=>{
        if(err){
            console.log(err);
            res.send({code:500,message:"服务器出错"})
        }else{
            //console.log(data);
            if(data.affectedRows>0){
                //进行下一步操作
                let orderId = data.insertId;
                let sql2 = `INSERT INTO orderdetail(orderId,ruleId,num,price)
                    SELECT ${orderId},s.RuleId,s.num,r.price
                   FROM shopcard s JOIN productrule r
                   ON s.RuleId = r.Id
                   WHERE s.id IN (${sidstr})`;
                    db.query(sql2,[],(err2,data2)=>{
                        if(err2){
                            console.log(err2);
                            res.send({code:500,message:"服务器错误"})
                        }else{
                            let sql3=`delete from shopcard where id in (${sidstr})`;
                            db.query(sql3,[],(err3,data3)=>{
                                if(err3){
                                    console.log(err3);
                                    res.send({code:500,message:"服务器错误"})
                                }else{
                                    res.send({code:200,message:"订单生成成功,跳转到订单详情页"})
                                }

                            })
                        }
                    })
            }else{
                res.send({code:202,message:"插入失败"})
            }
        }
        });
    }else{
        res.send({code:201,message:"请先登录"});
    }
});
module.exports = router;