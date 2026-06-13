<template>
    <div>
      <h2>我是用户界面</h2>
      <p>我是用户界面的内容嘿嘿嘿嘿嘿嘿嘿</p>
      {{userId}}
      {{$route.params.userId}}
    </div>
</template>

<script>
    export default {
        name: "User",
        computed:{
          userId(){
            return this.$route.params.userId;
          }

        }
    }
</script>

<style scoped>

</style>
