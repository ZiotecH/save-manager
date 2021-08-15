const { Console, time } = require('console');
const http = require('http');
const fs = require('fs');
const readline = require('readline');
const { ifError } = require('assert');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    if(input == '.exit'){
        process.exit()
    }else if(input == '.dump'){
        console.log(timeStamp()+" [INFO] dumping stored data:\n"+POSTData);
    }else{
        console.log(timeStamp()+" [HELP]");
        console.log("Type .dump to dump stored data.");
        console.log("Type .exit to exit the application.");
    }
});

var web_server_port = 33333
var host_address = 'localhost'
var POSTData = '';
console.log("localhost:"+web_server_port)

function addZero(obj){
    if(parseInt(obj) < 10){f_obj = "0"+obj.toString();return f_obj;}
    else{return obj};
  }
  

function timeStamp(method){
    if(method == null){
      method = 0;
    }
    var ct = new Date;
    var fts_time;
    var fts_date;
    var fts_full;
    //switch Start
    //switch End
    fts_date = "["+ct.getFullYear().toString()+"-"+addZero(ct.getMonth()+1).toString()+"-"+addZero(ct.getDate()).toString()+"]"
    fts_time = "["+addZero(ct.getHours()).toString()+":"+addZero(ct.getMinutes()).toString()+":"+addZero(ct.getSeconds()).toString()+"]";
    fts_full = fts_date + " " + fts_time;
    switch(method){
      case (0):
        return fts_full;
        break;
      case (1):
        return fts_date;
        break;
      case (2):
        return fts_time;
        break;
      default:
        return fts_full;
        break;
    }
}

function postData(){
    console.log(timeStamp()+" POSTData: ["+POSTData+"]");
    setTimeout(postData,5000);
}

//postData()

http.createServer(function (request, response){
    if(request.method == 'POST'){
        let body = '';
        let target = request.url.replace("/","");
        request.on('data', chunk => {
            body += chunk.toString()
            POSTData = body;
        });
        request.on('end', () => {
            if(request.connection.remoteAddress.match(/::1/) == false){
                console.log("["+request.connection.remoteAddress+"] sent data to ["+target+"] by the ["+request.method+"] method.")
            }
            var timeObj = new Date;
            var year = timeObj.getFullYear();
            if(year < 10){year = "0"+year;}else{year = year.toString()}
            var month = timeObj.getMonth();
            if(month < 10){month = "0"+month;}else{month = month.toString()}
            var date = timeObj.getDate();
            if(date < 10){date = "0"+date;}else{date = date.toString()}
            var hour = timeObj.getHours();
            if(hour < 10){hour = "0"+hour;}else{hour = hour.toString()}
            var minute = timeObj.getMinutes();
            if(minute < 10){minute = "0"+minute;}else{minute = minute.toString()}
            var second = timeObj.getSeconds();
            if(second < 10){second = "0"+second;}else{second = second.toString()}
            
            timeString = year+"-"+month+"-"+date+"_"+hour+"-"+minute+"-"+second
            fileString = "PLATBURK_ziotech";
            if(!(fs.existsSync("./"+target))){
                fs.mkdirSync("./"+target);
            }
            if((fs.existsSync("./"+target+"/"+fileString+"_47.txt"))){
                //console.log("["+timeStamp()+"] [INFO] backup: Removing "+"./"+target+"/"+fileString+"_47.txt");
                fs.unlinkSync("./"+target+"/"+fileString+"_47.txt")
            }
            for(i=46;i>=0;i--){
                y = (i+1);
                x = (i);
                if(y < 10){y = "0"+y}
                if(x < 10){x = "0"+x}
                //console.log("x: "+x+" y: "+y);
                if( (fs.existsSync("./"+target+"/"+fileString+"_"+(x)+".txt") ) ){
                    fs.renameSync("./"+target+"/"+fileString+"_"+(x)+".txt", "./"+target+"/"+fileString+"_"+(y)+".txt");
                }
            }
            console.log(timeStamp()+" [INFO] backup: saving data to ./"+target+"/"+fileString+"_00.txt");
            fs.writeFileSync("./"+target+"/"+fileString+"_00.txt",POSTData);
            response.end(timeStamp()+" Saving to: ./"+target+"/"+fileString+"_00.txt")
        });
    }
    else if(request.method == 'GET'){
        console.log("["+request.connection.remoteAddress+"] requested ["+request.url+"] by the ["+request.method+"] method.")
        response.end(null);
    }
}).listen((web_server_port));