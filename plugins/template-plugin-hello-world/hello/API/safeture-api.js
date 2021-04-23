var http = require('http');
var https = require('https');

var fs = require('fs');
const { func } = require('prop-types');
const { start } = require('repl');

http.createServer(function (req, res) {

    var json = "";
    //var length = 0;

    if (req.url === '/') {
        json = GetData();

        sendResponse(res, json);
    } else if (req.url.indexOf("/region/") > -1) {
        //console.log(req.url.split('/')[2]);
        var values = req.url.split('/');
        var value = "";

        if (values.length > 1)
            value = decodeURI(values[2]);


        //console.log(value);
        json = GetDataByRegion(value);

        sendResponse(res, json);

    }
    else if (req.url.indexOf("/regions/") > -1) {
        //console.log(req.url.split('/')[2]);
        var values = req.url.split('/');
        var value = "";

        if (values.length > 1)
            value = decodeURI(values[2]);


        //console.log(value);
        json = GetDataByRegions(value);

        sendResponse(res, json);

    }
    else if (req.url === "/allregions") {
        json = GetRegions();

        sendResponse(res, json);
    } else if (req.url === '/safeture') {
        //GetDataFromAPI();
        getAccessToken()
            .then((data) => {
                //console.log(data)
                var json = JSON.parse(data);


                getApiData(json.data).then((data2) => {
                    //console.log("2nd call");
                    //console.log(data2);
                    //var json = data2.toString('utf8');
                    sendResponse(res, data2);
                });



                //res.end();
                //sendResponse(res, json.data);
            });


    }




    /*
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('transfer-encoding', '');

    res.writeHead(200, {});

    res.write(json)

    res.end();
    */



}).listen(8081);


function sendResponse(res, data) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('transfer-encoding', '');

    res.writeHead(200, {});

    res.write(data)

    res.end();
}

async function getAccessToken() {
    const requestOptions = {
        hostname: 'api.safeture.com',
        port: 443,
        path: '/accesstoken',
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        }
    }

    var body = '{"userid":"travelport.oufb.api","password":"hsTRvbIY63bGFDT63vb","authentication":"BASIC"}';


    // return the response
    return await doRequest(requestOptions, body);
}

async function getApiData(accesstoken) {
    //console.log("getApiData Token:" + accesstoken);

    const requestOptions = {
        hostname: 'api.safeture.com',
        port: 443,
        path: '/risklevelcovid19',
        method: 'GET',

        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accesstoken
        }
    }

    var body = "";


    // return the response
    return await doRequest(requestOptions, body);
}


function doRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                //console.log("response:" + responseBody);
                resolve(responseBody);
            });
        });

        req.on('error', (err) => {
            console.log("Error:" + err)
            reject(err);
        });

        if (data.length > 0)
            req.write(data)

        req.end();
    });
}


/*
function GetDataFromAPI() {
    var token;

    const requestOptions = {
        hostname: 'api.safeture.com',
        port: 443,
        path: '/accesstoken',
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        }
    }

    var body = '{"userid":"travelport.oufb.api","password":"hsTRvbIY63bGFDT63vb","authentication":"BASIC"}';



    const req = https.request(requestOptions, res => {
        //console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            //process.stdout.write(d);
            var json = JSON.parse(d);


            token = json;

            console.log(token);
        })
    })

    req.on('error', error => {
        console.error(error)
    })

    req.write(body)
    req.end()


    console.log("end");
    console.log(token);

    //return token;
}
*/

function GetData() {

    let rawdata = fs.readFileSync('covid19.json');
    let data = JSON.parse(rawdata);

    var json = "";
    //var json = JSON.stringify(data)
    //console.log(json)

    //json = "{ 'test' : '123'}";

    json = rawdata.toString('utf8');



    return json.toString('utf8');
}

function GetRegions() {
    let rawdata = fs.readFileSync('covid19.json');
    let data = JSON.parse(rawdata);


    var regions = data.data.map((data) => ({ 'regionid': data.iso3166_1, 'region': data.regionid }));


    var json = JSON.stringify(regions);

    return json.toString('utf8');;

}

function GetDataByRegions(regionIds) {
    console.log(regionIds);

    let rawdata = fs.readFileSync('covid19.json');
    let data = JSON.parse(rawdata);

    var values = regionIds.split(',');

    var json = "";
    var matches = [];

    for (var i = 0; i < values.length; i++) {
        var match = data.data.myFind({ iso3166_1: values[i] });

        if (match.length > 0) {
            matches.push(match[0]);
        }
    }


    if (matches.length > 1) {
        json = JSON.stringify(matches);
    }
    else
        console.log("not found");

    return json.toString('utf8');
}

function GetDataByRegion(regionId) {
    console.log(regionId);

    let rawdata = fs.readFileSync('covid19.json');
    let data = JSON.parse(rawdata);



    var json = "";


    var match = data.data.myFind({ iso3166_1: regionId });

    if (match.length > 0) {
        json = JSON.stringify(match[0]);
    }
    else
        console.log("not found");

    return json.toString('utf8');
}

Array.prototype.myFind = function (obj) {
    return this.filter(function (item) {
        for (var prop in obj)
            if (!(prop in item) || obj[prop] !== item[prop])
                return false;
        return true;
    });
};
