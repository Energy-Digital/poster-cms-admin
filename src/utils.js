export function limitLength (mode, str, num) {
    if(mode == ">") {
        if(str.length > num){
            return true
        }
    }

    if(mode == "<") {
        if(str.length < num){
            return true
        }
    }

    return false
}

export function isEmpty (str) {
    if(!str || str.length < 1 || str == "" || str == null || typeof str == undefined || str =="undefined"){
      return true
    }

    return false
}

export function getCookie (cname) {
    var name = cname + "="
    var ca = document.cookie.split(';')
    for(var i=0; i<ca.length; i++){
        var c = ca[i].trim()
        if (c.indexOf(name)==0) return c.substring(name.length,c.length)
    }
    return ""
}