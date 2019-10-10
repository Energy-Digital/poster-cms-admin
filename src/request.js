
var utils = require('./utils.js')
var qs = require('qs')
var axios = require('axios')
var EventBus = require('./bus.js')


// General get data
export function genGet (api, param, callback) {
    axios.get(contParam(api, param)).then((response) => {

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

    genUpdate(api, postData, (res)=>{
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

