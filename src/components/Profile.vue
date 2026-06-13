<template>
    <div>
      <h2>我是profile组件</h2>
      <p>我是组件内容哦嘿呀哦嘿呀</p>
      <p>{{$route.query}}</p>
    </div>
</template>

<script>
    export default {
        name: "Profile"
    }
</script>

<style scoped>

</style>
