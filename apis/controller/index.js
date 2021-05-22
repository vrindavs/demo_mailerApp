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
        console.log("req controller:",req.body)
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
        console.log("body:",body)
        let result = [];
        let callback = await postMail(body)
         result.push(callback)
        console.log("..callback result ....",callback)
        
        //console.log("logger:",logger)
        res.send({status: true, data: result})
    } catch(er){
        console.log("...............",er)
    }
}
const postMail= async function postMail(reqBody){
    try{
        console.log("reqBody....:",reqBody)
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
                  console.log("mailOptions if..:",mailOptions)
                fs.writeFile(pathResolve.resolve(__dirname, `${fileLocation}/${fileName}`), output, function (err) {
                    if (err) {
                        console.error('Error at file creation', err);
                        throw err;
                    } else {
                        
                          let mailStatus = commonMailer.email(mailOptions, true); 
                          if (mailStatus.status){
                            console.log(mailStatus.response)
                            resolve(mailStatus);
                            // next mail or end
                            // success
                          }else{
                            console.log(mailStatus.response)
                            resolve(mailStatus);
                            // failure
                          }
                    }
                })
            } else {
                console.log("fileLocation:",fileLocation)
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
                  console.log("else:",mailOptions)
                let mailStatus =  commonMailer.email(mailOptions, true); // for receipt@mbme.ae mail pass true.
                if (mailStatus.status){
                  console.log(mailStatus.response)
                  let data={
                    Name:reqBody.firstName,
                    email:reqBody.email,
                    Date: new Date(),
                    response:mailStatus.response
                }
                console.log("data in logger:",data)
                loggerData(data)
                  resolve(mailStatus);
                  // success
                }else{
                  console.log(mailStatus.response)
                  let data={
                    Name:reqBody.firstName,
                    email:reqBody.email,
                    Date: new Date(),
                    response:mailStatus.response
                }
                console.log("data in logger:",data)
                loggerData(data)
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