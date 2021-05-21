var http = require('http');
var https = require('https');

var fs = require('fs');






const { func } = require('prop-types');
const { start } = require('repl');

http.createServer(function (req, res) {

    var json = "";
    //var length = 0;


    if (needCacheRefresh()) {
        UpdateCache();
    }
    else {
        console.log('Cache up-to-date');
    }


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
        GetSafetureData(res);
    } else if (req.url === '/updatecache') {
        UpdateCache();
    } else if (req.url.indexOf('/asa/' > -1)) {

        var values = req.url.split('/');
        var value = "";

        if (values.length > 2)
            value = decodeURI(values[2]);

        json = GetAirlineSafetyData(value);

        sendResponse(res, json);
    }

}).listen(8081);

function needCacheRefresh() {


    if (fs.existsSync('covid19.json')) {
        const stats = fs.statSync('covid19.json');

        const lastUpdated = stats.mtime.getTime();

        const now = new Date().getTime();

        var diff = Math.ceil(now - lastUpdated);

        console.log('Cache Last Updated:' + stats.mtime);

        const hours = Math.floor(diff / (1000 * 3600));

        if (hours > 12)
            return true;
        else
            return false;
    }
    else {
        return true;
    }

}


function UpdateCache() {
    getAccessToken()
        .then((data) => {
            var json = JSON.parse(data);

            getApiData(json.data).then((data2) => {

                fs.writeFileSync('covid19.json', data2);

                console.log('Cache updated');

            }).catch(function (e) {
                console.log('promise rejected 1:' + e);
            });

        }).catch(function () {
            console.log('promise rejected');
        }).catch(function () {
            console.log('promise rejected 2');
        });
}

function GetSafetureData(res) {
    getAccessToken()
        .then((data) => {
            var json = JSON.parse(data);

            getApiData(json.data).then((data2) => {



                fs.writeFileSync('covid19.json', data2);

                sendResponse(res, data2);

            }).catch(function (e) {
                console.log('promise rejected 1:' + e);
            });

        }).catch(function () {
            console.log('promise rejected');
        }).catch(function () {
            console.log('promise rejected 2');
        });
}

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




function GetData() {

    if (fs.existsSync('covid19.json')) {

        let rawdata = fs.readFileSync('covid19.json');
        let data = JSON.parse(rawdata);

        var json = "";
        //var json = JSON.stringify(data)
        //console.log(json)

        //json = "{ 'test' : '123'}";

        json = rawdata.toString('utf8');



        return json.toString('utf8');
    }
    else {
        return "File cache not found, please refresh to force the cache update";
    }
}

function GetRegions() {

    if (fs.existsSync('covid19.json')) {

        let rawdata = fs.readFileSync('covid19.json');
        let raw = JSON.parse(rawdata);

        var data = raw.data;

        //var regions = data.data.map((data) => ({ 'regionid': data.iso3166_1, 'region': data.regionid }));
        var regions = data.data.map((data) => ({ 'regionid': data.iso3166_1, 'region': data.regionid }));


        var json = JSON.stringify(regions);

        return json.toString('utf8');
    }
    else {
        return "File cache not found, please refresh to force the cache update";
    }

}

function GetDataByRegions(regionIds) {


    console.log(regionIds);

    let rawdata = fs.readFileSync('covid19.json');
    let raw = JSON.parse(rawdata);

    var data = raw.data;

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
    if (!fs.existsSync('covid19.json')) {
        UpdateCache();
    }

    console.log(regionId);

    let rawdata = fs.readFileSync('covid19.json');


    let raw = JSON.parse(rawdata);

    var data = raw.data;


    var json = "";


    var match = data.data.myFind({ iso3166_1: regionId });

    if (match.length > 0) {
        json = JSON.stringify(match[0]);
    }
    else
        console.log("not found");

    return json.toString('utf8');
}

function GetAirlineSafetyData(carriers) {


    const path = 'airline-safety-attributes-v2.csv';

    let rawdata = fs.readFileSync(path, 'utf8');



    var values = carriers.split(',');


    var matches = [];
    let dataArray;

    let json = [];



    dataArray = rawdata.split(/\r?\n/);

    for (var i = 1; i < dataArray.length; i++) {
        var d = dataArray[i].split(',');
        var carrierCode = d[1];

        if (values.includes(carrierCode) || carriers.length === 0) {

            json.push({
                'carrierName': d[0],
                'carrierCode': d[1],
                'middleSeat': d[3].toUpperCase() == 'YES' ? true : false,
                'mandatoryMask': d[4].toUpperCase() == 'YES' ? true : false,
                'tempChecks': d[5].toUpperCase() == 'YES' ? true : false,
                'healthCert': d[6].toUpperCase() == 'YES' ? true : false,
                'hepaFilters': d[7].toUpperCase() == 'YES' ? true : false,
                'extraCleaning': d[8].toUpperCase() == 'YES' ? true : false,
                'reducedMeals': d[9].toUpperCase() == 'YES' ? true : false,
                'amenityKit': d[10].toUpperCase() == 'YES' ? true : false,
                'updatedBoarding': d[11].toUpperCase() == 'YES' ? true : false,
                'cabinBagsRestricted': d[12].toUpperCase() == 'YES' ? true : false,

            });
        }



    }







    //console.log('json.:' + JSON.stringify(json));

    return JSON.stringify(json);



}

Array.prototype.myFind = function (obj) {
    return this.filter(function (item) {
        for (var prop in obj)
            if (!(prop in item) || obj[prop] !== item[prop])
                return false;
        return true;
    });
};
