var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname,'dist')));

// post 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*',function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
    });

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'webshop'
});

//连接数据库
connection.connect();

//用户注册
app.post('/userRegistry',function(req,res){
    var addSql = 'INSERT INTO customer_registry(ct_UserID,ct_UserName,ct_Password) VALUES(0,?,?)';
    var addSqlParams = [req.body.ct_UserName,req.body.ct_Password];
    connection.query(addSql,addSqlParams,function(err,result){
        if(err){
            console.log('已存在相同用户名：',err.message);
            var response = {
                status: 403
            };
            res.end(JSON.stringify(response));
        } else {
            console.log('用户注册账户成功');
            var response = {
                status: 200
            };
            res.end(JSON.stringify(response));
        }
        //添加用户ID到个人信息表
        var selSql = 'SELECT * FROM customer_registry WHERE ct_UserName = ?';
        var selSqlParams = [req.body.ct_UserName];
        connection.query(selSql,selSqlParams,function(err,result){
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            console.log('查询用户ID成功');

            var addSql = 'INSERT INTO customer_info(ct_UserID) VALUES(?)';
            var addSqlParams = [result[0].ct_UserID];
            connection.query(addSql,addSqlParams,function(err,result){
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                    return;
                }
                console.log('添加用户ID成功');
            });
        });
    });
});

//用户登录认证
app.post('/userLogin',function(req,res){
    var selSql = 'SELECT * FROM customer_registry WHERE ct_UserName = ? AND ct_Password = ?';
    var selSqlParams = [req.body.ct_UserName,req.body.ct_Password];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        if(result.length == 1){
            console.log('登录认证成功');
            var response = {
                status: 200,
                result: result
            };
            res.end(JSON.stringify(response));
        }else {
            console.log('账号或密码错误');
            var response = {
                status: 403
            };
            res.end(JSON.stringify(response));
        }
    });
});

//显示个人信息
app.get('/showCustomer_info',function(req,res){
    var selSql = 'SELECT * FROM customer_info WHERE ct_UserID = ?';
    var selSqlParams = [req.query.ct_UserID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('查询个人信息成功');
        res.send(JSON.stringify(result));
    });
});

//用户完善个人信息
app.get('/modCustomer_info',function(req,res){
    //把个人信息存到相应ID
    var addSql = 'UPDATE customer_info SET ct_Name = ?, ct_Tel = ?, ct_Address = ? WHERE ct_UserID = ?';
    var addSqlParams = [req.query.ct_Name,req.query.ct_Tel,req.query.ct_Address,req.query.ct_UserID];
    connection.query(addSql,addSqlParams,function(err,result){
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
        }
        console.log('修改个人信息成功');
        var response = {
            status: 200
        };
        res.end(JSON.stringify(response));
    });
});

//修改账户密码
app.post('/modct_Password',function(req,res){
    var modSql = 'UPDATE customer_registry SET ct_Password = ? WHERE ct_UserID = ?';
    var modSqlParams = [req.body.ct_Password,req.body.ct_UserID];
    connection.query(modSql,modSqlParams,function(err,result){
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            return;
        }
        var response = {
            status: 200
        };
        res.end(JSON.stringify(response));
        console.log('修改密码成功');
    });
});

//管理员登录
app.post('/managerLogin',function(req,res){
    var selSql = 'SELECT * FROM manager WHERE mg_UserName = ? AND mg_Password = ?';
    var selSqlParams = [req.body.mg_UserName,req.body.mg_Password];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        if(result.length == 1){
            console.log('登录认证成功');
            var response = {
                status: 200
            };
            res.end(JSON.stringify(response));
        }else {
            console.log('账号或密码错误');
            var response = {
                status: 403
            };
            res.end(JSON.stringify(response));
        }
    });
});

//商品上架
app.post('/inGoods',function(req,res){
    var addSql = 'INSERT INTO goods(goods_ID,goods_Name,goods_TypeName,goods_Info,goods_OldPrice,goods_NewPrice,goods_Picture) VALUES(0,?,?,?,?,?,?)';
    var addSqlParams = [req.body.goods_Name,req.body.goods_TypeName,req.body.goods_Info,req.body.goods_OldPrice,req.body.goods_NewPrice,req.body.goods_Picture];
    connection.query(addSql,addSqlParams,function(err,result){
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
        }
        var response = {
            status: 200
        };
        res.end(JSON.stringify(response));
        console.log('成功添加商品');

        var addSql = 'INSERT INTO goods_type(goods_TypeName) VALUES(?)';
        var addSqlParams = [req.body.goods_TypeName];
        connection.query(addSql,addSqlParams,function(err,result){
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            console.log('成功添加商品类型');
        });
    });
});

//商品下架
app.get('/outGoods',function(req,res){
    var delSql = 'DELETE FROM goods WHERE goods_ID = ?'
    var delSqlParams = [req.query.goods_ID];
    connection.query(delSql,delSqlParams,function(err,result){
        if(err){
            console.log('删除货物失败：',err.message);
            return;
        }        
        console.log('删除货物成功');
        var response = {
            status: 200
        };
        res.end(JSON.stringify(response));
    });
});

//显示商品
app.get('/showGoods',function(req,res){
    var selSql = 'SELECT * FROM goods WHERE goods.goods_ID = ?';
    var selSqlParams = [req.query.goods_ID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('商品查询成功');
        //把查询结果返回给前端
        res.send(JSON.stringify(result));
    });
});

//显示商品评论
app.get('/showComment',function(req,res){
    var selSql = 'SELECT * FROM goods_comment WHERE goods_ID = ?';
    var selSqlParams = [req.query.goods_ID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('商品评论查询成功');
        res.send(JSON.stringify(result));
    });
});

//显示所有商品
app.get('/showAllGoods',function(req,res){
    var selSql = 'SELECT * FROM goods';
    connection.query(selSql,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('所有商品查询成功');
        res.send(JSON.stringify(result));
    });
});

//显示所有商品类型名
app.get('/showAllGoods_type',function(req,res){
    var selSql = 'SELECT * FROM goods_type';
    connection.query(selSql,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('查询所有商品类型名成功');
        res.send(JSON.stringify(result));
    });
});

//显示指定分类下的所有商品
app.get('/showGoods_type',function(req,res){
    var selSql = 'SELECT * FROM goods WHERE goods_TypeName = ?';
    var selSqlParams = [req.query.goods_TypeName];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('查询指定商品类型名下所有商品成功');
        res.send(JSON.stringify(result));
    });
});

//搜索商品
app.get('/searchGoods',function(req,res){
    var selSql = 'SELECT * FROM goods WHERE goods_Name = ?';
    var selSqlParams = [req.query.goods_Name];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('商品搜索成功');
        res.send(JSON.stringify(result));
    });
});

//商品移入收藏夹
app.get('/inCustomer_favorites',function(req,res){
    var selSql = 'SELECT * FROM goods WHERE goods_ID = ?';
    var selSqlParams = [req.query.goods_ID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('商品查询成功');

        var addSql = 'INSERT INTO customer_favorites(ct_UserID,goods_Name,goods_OldPrice,goods_NewPrice,goods_Picture,goods_ID) VALUES(?,?,?,?,?,?)';
        var addSqlParams = [req.query.ct_UserID,result[0].goods_Name,result[0].goods_OldPrice,result[0].goods_NewPrice,result[0].goods_Picture,req.query.goods_ID];
        connection.query(addSql,addSqlParams,function(err,result){
            if(err){
                console.log('商品添加收藏夹失败：',err.message);
                return;
            }
            console.log('商品添加收藏夹成功');
            var response = {
                status: 200
            };
            res.end(JSON.stringify(response));
        });
    });
});

//删除收藏夹商品
app.get('/delCustomer_favorites',function(req,res){
    var delSql = 'DELETE FROM customer_favorites WHERE ct_UserID = ? AND goods_ID = ?';
    var delSqlParams = [req.query.ct_UserID,req.query.goods_ID];
    connection.query(delSql,delSqlParams,function(err,result){
        if(err){
            console.log('删除收藏夹商品失败：',err.message);
            return;
        } 
        console.log('删除收藏夹商品成功');
        var response = {
            status: 200
        };
        res.end(JSON.stringify(response));
    });
});

//删除购物车商品
app.get('/delShopping_cart',function(req,res){
    var delSql = 'DELETE FROM shopping_cart WHERE ct_UserID = ? AND goods_ID = ?';
    var delSqlParams = [req.query.ct_UserID,req.query.goods_ID];
    connection.query(delSql,delSqlParams,function(err,result){
        if(err){
            console.log('删除购物车商品失败：',err.message);
            return;
        } 
        console.log('删除购物车商品成功');
        var response = {
            status: 200
        };
        res.end(JSON.stringify(response));
    });
});

//显示收藏夹商品
app.get('/showCustomer_favorites',function(req,res){
    var selSql = 'SELECT * FROM customer_favorites WHERE ct_UserID = ?';
    var selSqlParams = [req.query.ct_UserID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('收藏夹商品查询成功');
        //把查询结果返回给前端
        res.send(JSON.stringify(result));
    });
});

//商品添加购物车
app.get('/inShopping_cart',function(req,res){
    var selSql = 'SELECT * FROM goods WHERE goods_ID = ?';
    var selSqlParams = [req.query.goods_ID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('商品查询成功');
        
        //把选中的商品信息插进购物车表
        var addSql = 'INSERT INTO shopping_cart(ct_UserID,goods_ID,goods_Name,goods_OldPrice,goods_NewPrice,goods_Count,goods_Picture) VALUES(?,?,?,?,?,?,?)';
        var addSqlParams = [req.query.ct_UserID,req.query.goods_ID,result[0].goods_Name,result[0].goods_OldPrice,result[0].goods_NewPrice,req.query.goods_Count,result[0].goods_Picture];
        connection.query(addSql,addSqlParams,function(err,result){
            if(err){
                console.log('商品添加购物车失败：',err.message);
                return;
            }
            console.log('商品添加购物车成功');
            var response = {
                status: 200
            };
            res.end(JSON.stringify(response));
        });
    });
});

//显示购物车商品
app.get('/showShopping_cart',function(req,res){
    var selSql = 'SELECT * FROM shopping_cart WHERE ct_UserID = ?';
    var selSqlParams = [req.query.ct_UserID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('购物车商品查询成功');
        //把查询结果返回给前端
        res.send(JSON.stringify(result));
    });
});

//购物车提交订单
app.get('/inOrder',function(req,res){
    var selSql = 'SELECT * FROM customer_info,shopping_cart WHERE customer_info.ct_UserID = shopping_cart.ct_UserID AND customer_info.ct_UserID = ? and shopping_cart.goods_ID = ?';
    var selSqlParams = [req.query.ct_UserID, req.query.goods_ID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('购物车商品查询成功');

        //把选中商品信息插进订单表
        var addSql = 'INSERT INTO orders(order_ID, ct_UserID, ct_Name, ct_Tel, ct_Address, goods_ID, goods_Name, goods_OldPrice, goods_NewPrice, goods_Count, goods_Picture) VALUES(0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        var addSqlParams = [req.query.ct_UserID, result[0].ct_Name, result[0].ct_Tel, result[0].ct_Address, req.query.goods_ID, result[0].goods_Name, result[0].goods_OldPrice, result[0].goods_NewPrice, req.query.goods_Count, result[0].goods_Picture];
        connection.query(addSql,addSqlParams,function(err,result){
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            console.log('购物车商品提交订单成功');

            //删除购物车中已经结算的商品
            var delSql = 'DELETE FROM shopping_cart WHERE ct_UserID = ? AND goods_ID = ?';
            var delSqlParams = [req.query.ct_UserID,req.query.goods_ID];
            connection.query(delSql,delSqlParams,function(err,result){
                if(err){
                    console.log('[DELETE ERROR] - ',err.message);
                    return;
                }
                console.log('购物车商品删除成功');
                var response = {
                    status: 200
                };
                res.end(JSON.stringify(response));
            });
        });
    });
});

//显示订单信息
app.get('/showOrder',function(req,res){
    var selSql = 'SELECT * FROM orders WHERE ct_UserID = ?';
    var selSqlParams = [req.query.ct_UserID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('订单查询成功');
        //把查询结果返回给前端
        res.send(JSON.stringify(result));
    });
});

//后台显示所有订单
app.get('/showAllOrder',function(req,res){
    var selSql = 'SELECT * FROM orders';
    connection.query(selSql,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('订单查询成功');
        res.send(JSON.stringify(result));
    });
});

//用户添加评论
app.get('/inComment',function(req,res){
    var selSql = 'SELECT * FROM customer_info WHERE ct_UserID = ?';
    var selSqlParams = [req.query.ct_UserID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('用户昵称查询成功');

        //把用户评论插到商品评论表中
        var addSql = 'INSERT INTO goods_comment(ct_UserID,ct_Name,goods_ID,goods_comments,order_ID) VALUES(?,?,?,?,?)';
        var addSqlParams = [req.query.ct_UserID,result[0].ct_Name,req.query.goods_ID,req.query.goods_comments,req.query.order_ID];
        connection.query(addSql,addSqlParams,function(err,result){
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            console.log('商品评论添加成功');
            var response = {
                status: 200
            };
            res.end(JSON.stringify(response));
        });
    });
});

//后台订单显示商品评论
app.get('/showOrderComment',function(req,res){
    var selSql = 'SELECT * FROM goods_comment WHERE order_ID = ?';
    var selSqlParams = [req.query.order_ID];
    connection.query(selSql,selSqlParams,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        console.log('订单评论查询成功');
        res.send(JSON.stringify(result));
    });
});

//服务器监听
var server = app.listen(8081,'localhost', function () {
 
    var host = server.address().address
    var port = server.address().port
   
    console.log("监听8081端口中，访问地址为 http://%s:%s", host, port)
});