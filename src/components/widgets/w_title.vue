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
    color:#222222;
    font-size:44px;
    font-weight: bold;
}
</style>