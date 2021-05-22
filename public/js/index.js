function submit(){
    var fname= document.getElementById("fname").value
    var lname=document.getElementById("lname").value
    var emailId=document.getElementById("emailId").value
    var age =document.getElementById("ageId").value
    var data={
        firstName:fname,
        lastName: lname,
        email: emailId,
        Age: age
    }
    $.ajax({
        type:"POST",
        contentType:"application/json",
        url:'api/getUserDetails',
        data:JSON.stringify(data),
        dataType:"json",
        success:function(response){
            if(response.status==true){
                sendMail(data);
            }else{
                console.log("error")
            }
        },
        error:function(e){
            console.log("error:",e)
        }
    });
}

function sendMail(data){
    $.ajax({
        type:"POST",
        contentType:"application/json",
        url:'api/sendEmail',
        data:JSON.stringify(data),
        dataType:"json",
        success:function(response){
            if(response.status==true){
                console.log("success mail")
                //sendMail(data);
            }else{
                console.log("error")
            }
        },
        error:function(e){
            console.log("error:",e)
        }
    });
}