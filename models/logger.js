var Sequelize= require('sequelize');
var sequelize=require('../database/config');

var logger= sequelize.define('logger',{
    loggerId:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    Name: Sequelize.STRING,
    email:Sequelize.STRING,
    response: Sequelize.STRING,
    Date:Sequelize.DATE
})

module.exports=logger;