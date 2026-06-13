//配置路由相关信息
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/home"
// import about from "../components/about"
// import User from "../components/User"

//路由懒加载：就是延时加载，当需要用到这个东西的时候再去加载
const about = () => import("../components/about");
const User = () => import("../components/User");
const homeNews = () => import("../components/homeNews");
const homeMessage = ()=> import("../components/homeMessage");
const Profile = () => import("../components/Profile");
//1、通过Vue.use（插件）安装插件
Vue.use(VueRouter);
//2、创建VueRouter对象
const routes = [
  {
    path:"",
    redirect:"/home"   //重定向
  },
  {
    path:"/home",
    component:Home,
    meta:{
      title:"首页"
    },
    children:[
      {
        path:"",
        redirect:"news"
      },
      {
        path:"news",
        component:homeNews
      },{
        path:"message",
        component:homeMessage
      }
    ]
  },
  {
    path:"/about",
    component:about,
    meta:{
      title:"关于"
    }
  },{
    path:"/user/:userId",   //动态路由
    component:User,
    meta:{
      title:"用户"
    }
  },{
    path:"/profile",
    component:Profile,
    //全局修改浏览器界面title
    meta:{
      title:"档案"
    }
  }
];

const router = new VueRouter({
  //配置路由和组件之间的应用关系
  routes,
  mode:"history",    //将url的#模式改为history模式
  linkActiveClass:"active" //修改router-link-active类为active类
})
//全局修改浏览器界面title
//beforeEach:前置守卫，在组件跳转之前执行
router.beforeEach((to,from,next)=>{
  document.title = to.matched[0].meta.title;
  next();
})
//afterEach：后置钩子，在组件跳转之后执行
router.afterEach((to,from) =>{
})
//3、将router对象传入到vue实例
export default router;




