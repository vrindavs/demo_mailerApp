const{
    inserUser,
    loggerData
}=require('../services/index')
const csv = require('csv-stringify');
const pathResolve = require('path');
const fs = require('fs');
const router = require('..');
const commonMailer=require('./mailer')


const getUser= async function getUser(req, res, next){
    try{
        let body = req.body;
        let result= await inserUser(body)
        if(result){
            let data={
                status: true,
                data: result
            }
            res.status(200);
            res.json(data);
        }else{
            let data={
                status: false,
                data:"Failed"
            }
            res.status(200);
            res.json(data);
        }
    }catch(e){
        let err= new Error(e);
        err.status=500;
        next(err);
    }
}

const scheduleMail= async function scheduleMail(req, res, next){
    try{
        let body = req.body
        let result = [];
        let callback = await postMail(body)
         result.push(callback)
        let datas={
            Name:body.firstName,
            email:body.email,
            Date: new Date(),
            response:callback.response
        }
        loggerData(datas)
        res.send({status: true, data: result, error:null})
    } catch(er){
        res.send({status: false, data:null,error:er })
    }
}
const postMail= async function postMail(reqBody){
    try{
        let to = reqBody.email;//"vrindavs28@gmail.com"
        let subject = 'Test mail'
        let body = 'Hi '+reqBody.firstName;

        var fileName = 'sample.csv';
        let fileLocation = pathResolve.resolve(__dirname, `../exports`);
        if (!fs.existsSync(fileLocation)) {
            fs.mkdirSync(fileLocation);
        }
        let contents = [{username: reqBody.firstName, email: reqBody.email}]
        let fileFieldNames =  ['username',
            'email'
        ];
        let data = [] // result for csv
        contents.forEach(element => {
            data.push([element.username, element.email]);
        });
        return new Promise((resolve) => {
        csv(data, {
            header: true,
            columns: fileFieldNames
        }, (err, output) => {
            if (err) throw err;
            if (!fs.existsSync(pathResolve.resolve(__dirname, `${fileLocation}/${fileName}`))) {
                // for file does not exist
                const mailOptions = {
                    to: to,
                    subject: subject,
                    html: body,
                    attachments: [
                        {
                          filename: fileName,
                          path: "C:/Accubits/apis/exports/sample.csv",
                          content: csv,
                        }
                    ]
                  };
                fs.writeFile(pathResolve.resolve(__dirname, `${fileLocation}/${fileName}`), output, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        
                          let mailStatus = commonMailer.email(mailOptions, true); 
                          if (mailStatus.status){
                            resolve(mailStatus);
                            // next mail or end
                            // success
                          }else{
                            resolve(mailStatus);
                            // failure
                          }
                    }
                })
            } else {
                const mailOptions = {
                    to: to,
                    subject: subject,
                    html: body,
                    attachments: [
                        {
                          filename: fileName,
                          path: "C:/Accubits/apis/exports/sample.csv",
                          content: csv,
                        }
                      ]
                  };
                let mailStatus =  commonMailer.email(mailOptions, true); // for receipt@mbme.ae mail pass true.
                if (mailStatus.status){
                  console.log(mailStatus.response)
                  
                  resolve(mailStatus);
                  // success
                }else{                  
                  resolve(mailStatus);
                  // failure
                }
            }
        });
    })

    }catch(e){
        console.log(e);
    }
}

module.exports={
    getUser,
    postMail,
    scheduleMail
}