var user= require('../../models/userData')

const inserUser = async function inserUserData(params){
    console.log("params: service:..",params)
    let data= user.create(params);
    return new Promise((resolve, reject)=>{
        return(data)? resolve(data):reject(false);
    });
}

const loggerData= async function loggerData(params){
    let data= logger.create(params);
    return new Promise((resolve, reject)=>{
        return(data)? resolve(data):reject(false);
    });
}
module.exports={
    inserUser,
    loggerData
}