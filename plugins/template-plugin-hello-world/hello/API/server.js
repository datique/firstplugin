var http = require('http');
var fs = require('fs');

const express = require('express');
const app = express();

const PORT = 8081

Array.prototype.myFind = function (obj) {
    return this.filter(function (item) {
        for (var prop in obj)
            if (!(prop in item) || obj[prop] !== item[prop])
                return false;
        return true;
    });
};


app.get('/', (request, response) => {
    let rawdata = fs.readFileSync('covid-19.json');
    let data = JSON.parse(rawdata);

    var json = JSON.stringify(data)
    //console.log(json)

    //json = "{ 'test' : '123'}";

    json = rawdata.toString('utf8');

    var length = json.length;

    //console.log(length);
    /*
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', 'GET, POST');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('transfer-encoding', '');
    */

    response.writeHead(200,
        {
            'Content-Length': length,
            'Access-Control-Allow-Origin': 'https://smartpoint-dev3.tvlport.com',
            'Access-Control-Request-Method': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Content-Type': 'application/json'
        });

    response.write(json)


    response.end();
});

app.get('/region/:regionId', (request, response) => {
    //response.send(request.params);

    let rawdata = fs.readFileSync('covid-19.json');
    let data = JSON.parse(rawdata);

    //var json = JSON.stringify(data)
    //console.log(json)

    var json;


    var match = data.data.myFind({ regionid: 'Andorra' });

    if (match.length > 0) {

        json = JSON.stringify(match[0]);

        console.log(json);
    }
    else
        console.log("not found");

    //var json = rawdata.toString('utf8');



    var length = json.length;

    //console.log(length);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', 'GET, POST');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('transfer-encoding', '');

    response.writeHead(200, { 'Content-Length': length });

    response.write(json)


    response.end();

});

app.listen(PORT, () => {
    console.log('Server running at: http://localhost:' + PORT);
});
