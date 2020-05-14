
const utils = require('./utils.js')
const qs = require('qs')
const axios = require('axios')
const EventBus = require('./bus.js')
const COS = require('cos-js-sdk-v5')

export async function cosDelete(tmpKeyApi, bucket, region, name, callback){

    const prefix = "upload/"

    let res = {status: false, data: null, err:null}

    var cos = new COS({
        getAuthorization: (options, callback)=>{
            encGet(tmpKeyApi, { bucket: bucket, region: region}, (data)=>{

                var credentials = data.data && data.data.credentials

                if (!data || !credentials) res.err = 'credentials invalid'

                //alert(JSON.stringify(data))

                callback({
                    TmpSecretId: credentials.tmpSecretId,
                    TmpSecretKey: credentials.tmpSecretKey,
                    XCosSecurityToken: credentials.sessionToken,
                    // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                    StartTime: data.data.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: data.data.expiredTime // 时间戳，单位秒，如：1580000900
                })
            })
        }
    })

    cos.deleteObject({
        Bucket: bucket, /* 必须 */
        Region: region,    /* 必须 */
        Key: prefix + name                            /* 必须 */
    }, function(err, data) {
        if(err){
            res.err = err
        } else {
            res.status = true
            res.data = data
        }

        callback(res)
        //console.log(err || data);
    });
} 

export async function cosUpload(tmpKeyApi, bucket, region, file, name, callback){

    const prefix = "upload/"

    var res = {status: false, data: null, err:null}

    //const cosAuth = await getCOSToken(tmpKeyApi, bucket, region)
    
    var cos = new COS({
        getAuthorization: (options, callback)=>{
            encGet(tmpKeyApi, { bucket: bucket, region: region}, (data)=>{

                var credentials = data.data && data.data.credentials

                if (!data || !credentials) res.err = 'credentials invalid'

                //alert(JSON.stringify(data))

                callback({
                    TmpSecretId: credentials.tmpSecretId,
                    TmpSecretKey: credentials.tmpSecretKey,
                    XCosSecurityToken: credentials.sessionToken,
                    // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                    StartTime: data.data.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: data.data.expiredTime // 时间戳，单位秒，如：1580000900
                })
            })
        }
    })
    

    cos.putObject({
        Bucket: bucket,
        Region: region,
        Key: prefix + name,  
        StorageClass: 'STANDARD',
        Body: file,
        onProgress: function(progressData) {
            EventBus.uploadProgress(progressData)
            //alert(JSON.stringify(progressData));
        }
    }, function(err, data) {
        if(err){
            res.err = err
        } else {
            res.status = true
            res.data = data
        }

        callback(res)
    })
}


// General get data
export function genGet (api, param, callback) {

    param.push({ name: "tss", val: new Date().getTime()})
    console.log(param)
   
    axios.get(contParam(api, param)).then((response) => {
        console.log(contParam(api, param))
        if(typeof(response.data) == "string"){
            callback({status: false, error: response.data})
            return
        } else {
            callback({status: true, data: response.data})
            return
        }
        
    }).catch((err) => {
        
        callback({status: false, error: err})

    })
}

// Encryption get data
export function encGet (api, pd, callback) {

    var postReady = {
        ukey: utils.getCookie('u_key'), 
        uuid: utils.getCookie('u_uuid')
    }

    postReady = Object.assign(postReady, pd)

    var postData = qs.stringify(postReady)

    axios.post(api, postData)
    .then(function (response) {

        if(checkWrongVKey(response.data)){
            EventBus.forceLogout()
            return
        }

        callback({status: true, data: response.data})

    }).catch(function(err){

        callback({status: false, error: err})

    })
    
}

export function genUpdate (api, data, callback) {
    var postReady = {
        ukey: utils.getCookie('u_key'), 
        uuid: utils.getCookie('u_uuid')
    }

    postReady = Object.assign(postReady, data)

    var postData = qs.stringify(postReady)

    axios.post(api, postData)
    .then(function (response) {

        if(checkWrongVKey(response.data)){
            EventBus.forceLogout()
            return
        }

        if(response.data.indexOf("success") != -1){
            callback({status: true, data: response.data})
        } else {
            callback({status: false, data: response.data})
        }

    }).catch(function(err){

        callback({status: false, data: err})

    })
}

export function loginRequest (api, pd, callback) {
    // Initial API Token
    const key = "isjeffcomlogin";
    const key_encode =  window.btoa(key);

    var postReady = { token: key_encode }

    postReady = Object.assign(postReady, pd)

    var postData = qs.stringify(postReady)

    axios.post(api, postData)
    .then(function (response) {

        callback({status: true, data: response.data})

    }).catch(function(err){

        callback({status: false, error: err})

    })
}

export function delFile (api, pd, callback) {
    var postReady = {
        ukey: utils.getCookie('u_key'), 
        uuid: utils.getCookie('u_uuid')
    }

    postReady = Object.assign(postReady, pd)

    var postData = qs.stringify(postReady)

    axios.post(api, postData)
    .then(function (response) {

        var delRes = response.data.split(';')

        // status:
        // 1: file deleted, 2. only delete record, seed remains, 
        // 3. delete record fail, 4.can not delete the file
        var status

        if(delRes[0].indexOf("dbs") != -1){

            status = 1

            if(delRes[1].indexOf('ks')){
                status = 2
            }
        } 
        
        if (delRes[0].indexOf("dbe") != -1){
            status = 3
        }

        if (delRes[1].indexOf("nodel") != -1){
            status = 4
        }

        callback({status: status, data: response.data})

    }).catch(function(err){

        callback({status: false, error: err})

    })
}

export function genUpload (api, file, infos, callback){

    // Construct form data
    let form = new FormData()
    form.append('file', file)
    form.append('name', infos.name)
    form.append('typeDes', infos.type.type)
    form.append('md5', infos.md5)
    form.append('ukey', utils.getCookie('u_key'))
    form.append('uuid', utils.getCookie('u_uuid'))


    axios({
        method: "post",
        url: api,
        data: form,
        timeout: 60 * 4 * 1000,
        headers:{'Content-Type':'multipart/form-data'}
    }).then((response)=>{
        if(response.data.indexOf('success') != -1){
            callback({status: true, data: response.data})
        } else {
            callback({status: false, data: response.data})
        }
    }).catch((err)=>{
        callback({status: false, data: err})
    })
}

export function genPost (api, data, callback) {

    var postData = qs.stringify(data)

    axios.post(api, postData)
    .then(function (response) {

        callback({status: true, data: response.data})

    }).catch(function(err){

        callback({status: false, data: err})

    })
}

export function logVisit (api) {
    
    if(utils.getCookie('isjeffcom')){
        return
    } else {
        /*var tmpUid = parseInt(Math.ceil(Math.random()*1000) * Date.parse( new Date()) / 10000000)
        utils.setCookieExInMin('isjeffcom', tmpUid, 5)*/
    }

    var postData = {
        userAgent: navigator.userAgent,
        userLanguage: navigator.language,
        appName: navigator.appName,
        platform: navigator.platform
    }

    genPost(api, postData, (res)=>{
        if(res.status){
            // do nothing
        }
    })
}

export function logVisitAdm (api) {
    
    if(utils.getCookie('isjeffcom')){
        return
    } else {
        /*var tmpUid = parseInt(Math.ceil(Math.random()*1000) * Date.parse( new Date()) / 10000000)
        utils.setCookieExInMin('isjeffcom', tmpUid, 5)*/
    }

    var postData = {
        userAgent: navigator.userAgent,
        userLanguage: navigator.language,
        appName: navigator.appName,
        platform: navigator.platform
    }

    genUpdate(api, postData, ()=>{
        // do nothing
    })
}



// Construct url with paramaters
function contParam (api, param) {
    
    // Assumble get url paramaters
    if(param.length > 0){
        api = api + "?"
        
        
        for(var i=0;i<param.length;i++){

            if(i == param.length - 1){
                
                api = api + param[i].name + "=" + param[i].val
            } else {
                api = api + param[i].name + "=" + param[i].val + "&"
            } 
        }    
    }

    return api
}

function checkWrongVKey (res) {
    if(typeof(res) !== "object" && res.indexOf("logout") != -1){
        return true
    } else {
        return false
    }
}

