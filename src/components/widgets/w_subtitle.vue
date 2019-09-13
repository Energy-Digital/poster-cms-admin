<template>
    <div id="w_subtitle">
        <span>{{txt}}</span>
    </div>
</template>

<script>
export default {
    name:"w_subtitle",
    props:{
        txt: String,
    }
}
</script>

<style scoped>

#w_subtitle{
    margin-top:8px;
    margin-bottom:8px;
}
#w_subtitle span{
    color:#000000;
    opacity: 0.3;
    font-size:14px;
    font-weight: normal;
}
</style>