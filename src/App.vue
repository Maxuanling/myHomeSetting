<template>
  <div id="app">
    <!--    replace属性不会留下history记录，当指定replace属性时，浏览器的返回键不能返回上一个界面-->
<!--    replace属性其实是应用了history.replaceState({},"","")-->
    <router-link to="/home" replace>首页设置自定义</router-link>
    <router-link to="/about" replace>首页</router-link>
<!--    router-link标签默认会渲染为a标签，而tag属性能指定渲染成什么标签-->
    <router-link to="/about" tag="button">关于</router-link>
    <button @click="homeClick">去首页</button>

<!--当传递数据较多时，使用query来传递，因为可以传递对象-->
    <router-link :to="'/User/' + userId">用户</router-link>
    <router-link :to="{path:'/profile',query:{name:'小小',age:19,height:1.99}}">档案</router-link>
    <button @click="profileClick">陪我去档案库</button>
<!--    将route-view放在keep-alive中时，组件切换时就不会被反复销毁；若需要反复创造销毁某个组件，则添加个exclude属性，属性值写要销毁的组件名称-->
    <keep-alive exclude="Profile,User">
      <router-view></router-view>
    </keep-alive>

  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      userId:"张三",
      pId:"我我我"
    }
  },
  methods:{
    homeClick(){
      this.$router.push("/home");   //this.$router.replace("/home")
    },
    profileClick(){
      this.$router.push({
        path:"/profile",
        query:{
          name:"啦啦",
          age:29,
          height:33
        }
      })
    }
  }
}
</script>
<style>
/* 当点击router-link标签时该元素会被添加router-link-active类,若想修改该类名，可在router文件夹下的index文件中修改 -->*/
  .router-link-active{
    color:red;
  }
</style>

