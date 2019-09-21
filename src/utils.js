var fileTypes = 
    [
        { name: "png", type:"Image" }, { name: "jpg", type:"Image" },
        { name: "jpeg", type:"Image" }, { name: "pdf", type:"PDF Document", icon:"pdf.png" },
        { name: "doc", type:"Word Document", icon:"word.png" }, { name: "docx", type:"Word Document", icon:"word.png" },
        { name: "ppt", type:"PowerPoint Document", icon:"ppt.png" }, { name: "pptx", type:"PowerPoint Document", icon:"ppt.png" },
        { name: "xls", type:"Excel Document", icon:"excel.png" }, { name: "xlsx", type:"Excel Document", icon:"excel.png" },
        { name: "txt", type:"Text File", icon:"txt.png" }, { name: "sketch", type:"Sketch Project", icon:"doc.png" },
        { name: "psd", type:"Adobe Photoshop Project", icon:"psd.png" }, { name: "ai", type:"Adobe Illustrator Project", icon:"ai.png" },
        { name: "md", type:"Readme File", icon:"txt.png" }, { name: "key", type:"Keynote File", icon:"doc.png" },
        { name: "mp3", type:"MP3 Audio", icon:"mp3.png" }, { name: "wav", type:"WAV Audio", icon:"mp3.png" },
        { name: "mov", type:"MOV Video" , icon:"video.png" }, { name: "mp4", type:"MP4 Video", icon:"video.png" },
        { name: "zip", type:"ZIP Compressed", icon:"zip.png" }, { name: "rar", type:"RAR Compressed", icon:"zip.png" }
    ]

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

export function idFileTypeDes (filename) {

    var ft = filename.split('.')
    var str = ft[ft.length - 1]

    for(var i=0;i<fileTypes.length;i++){
        if(str === fileTypes[i].name || str === fileTypes[i].name.toUpperCase()){
            return {type: fileTypes[i].type, icon: fileTypes[i].icon}
        }
    }

}

export function getFileIcon (type) {
    for(var i=0;i<fileTypes.length;i++){
        if(type == fileTypes[i].name){
            return fileTypes[i].icon
        }
    }
}