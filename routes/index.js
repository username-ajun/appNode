
var express = require('express');
var router = express.Router();

//  导入MySql模块
var mysql = require('mysql');
var dbconfig = require('../db/DBConfig');
var newsSql = require('../db/news/newsSql')

//  使用DBConfig.js配置信息创建一个MySql连接池
var pool = mysql.createPool(dbconfig.mysql);

//  响应一个JSON数据
var responseJSON = (res, req) => {
    if (typeof req === undefined) {
        res.json({ code: 400, msg: '操作失败', data: '' })
    } else {
        res.json(req)
    }
}

//  用新闻ID查找某条数据
router.get('/news', (req, res, next) => {
    //  从连接池获取连接
    pool.getConnection((err, connection) => {
        //  获取前台传过来的参数
        var parma = req.query || req.params;
        //  新建连接 查找一条数据
        connection.query(newsSql.select, [parma.id], (err, result) => {
            if (result) {
                result = { code: 200, msg: '操作成功', data: result }
            }
            // 以json形式，把操作结果返回给前台页面  
            responseJSON(res, result);
            // 释放连接 
            connection.release();
        })
    })
});

module.exports = router;
