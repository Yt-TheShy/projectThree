/**
 * Created by SYT on 2016-07-31.
 */
var Box=document.getElementById("Box");
var loginBox=document.getElementById("loginBox");
var zhuceBox=document.getElementById("zhuceBox");
function login(){
    Box.style.visibility="visible";
    loginBox.style.visibility="visible";
    console.log("456")
}
function switchLogin(){
    Box.style.visibility="visible";
    zhuceBox.style.visibility="hidden";
    loginBox.style.visibility="visible"
}
function switchZhuce(){
    Box.style.visibility="visible";
    loginBox.style.visibility="hidden";
    zhuceBox.style.visibility="visible"
}
function zhuce(){
    Box.style.visibility="visible";
    zhuceBox.style.visibility="visible"
}
function close1(){
    console.log("123");
    Box.style.visibility="hidden";
    loginBox.style.visibility="hidden";
    zhuceBox.style.visibility="hidden"
}
$(function(){
    var layer = layui.layer;
    $("#loginBtn").click(function(){
        let user = $("#loginUser").val();
        let pwd = $("#loginPwd").val();
        if(user.trim().length==0){
            layer.alert('用户名不能为空');
        }else if(pwd.trim().length==0){
            layer.alert('密码不能为空');
        }else{
            //loading进行显示
            var index =myloading();
            //发送请求服务器
            $.ajax({
                type: "POST",
                url: "/userLogin",
                data: "user="+user+"&pwd="+pwd,
                success: function(data){
                    layer.close(index);
                    layer.alert(data.message);
                    if(data.code==200){
                        //close1();
                        location.reload();
                    }
                }
            });
        }
    });
    $("#zhuceBtn").click(function(){
        var obj={"Email":"邮箱","zhuceUser":"用户名","zhucePwd":"密码",
            "resPwd":"确认密码"};
        var flag = true;
        for(var key in obj){
            console.log(key);
            if($("#"+key).val().trim().length==0){
                flag = false;
                layer.alert(obj[key]+'不能为空');
                break;
            }
        }
        if(flag){
            var index =myloading();
            //发起注册操作
            $.ajax({
                type:"post",
                url:"/userReg",
                data:$("#frmReg").serialize(),
                success:function(data){
                    layer.close(index);
                    layer.alert(data);
                }
            })
        }
    });
    /*$("#regBtn").click(function(){
     var obj={""}
     })
     */
});

function myloading(){
    return layer.load(2, {
        shade: [0.5, '#000'],
        content: '',
        success: function (layero) {
            layero.find('.layui-layer-content').css({
                'paddingTop': '40px',
                'textAlign': 'center',
                'backgroundPositionX': 'center',
                'color': '#fff',
                'fontSize': '16px',
                'fontWeight': '700',
                'letterSpacing': '2px'
            });
        }
    });
}