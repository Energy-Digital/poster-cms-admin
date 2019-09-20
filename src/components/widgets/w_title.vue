<template>
    <div id="w_title">
        <span>{{txt}}</span>
    </div>
</template>

<script>
export default {
    name:"w_title",
    props:{
        txt: String,
    }
}
</script>

<style scoped>

#w_title{
    
}
#w_title span{
    color:#303133;
    font-size:24px;
    font-weight: bold;
}
</style>