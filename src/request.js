
var utils = require('./utils.js')
var qs = require('qs')
var axios = require('axios')

export function odGet (api) {
    
    axios.get(api).then((response) => {
        return response
    })

}

export function encGet (api, pd) {

    var postReady = {
        ukey: utils.getCookie('u_key'), 
        uuid: utils.getCookie('u_uuid')
    }

    postReady = Object.assign(postReady, pd)

    var postData = qs.stringify(postReady)

    axios.post(api, postData)
    .then(function (response) {
        alert(response.data)
        if(response.data.indexOf("success") != -1){
            

            return {res: true, data: response.data}

        } else {

            return {res: false, data: response.data}
        }
    }).catch(function(err){

        return {res: false, data: err}

    })
    
}