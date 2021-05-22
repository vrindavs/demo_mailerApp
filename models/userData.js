var Sequelize = require('sequelize');
var sequelize= require('../database/config');

var user= sequelize.define('userData',{
    userId:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    firstName:Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    Age: Sequelize.INTEGER
});

module.exports=user;