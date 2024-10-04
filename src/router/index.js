import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/mini",
    name: "mini",
    component: () =>
      import(
        /* webpackChunkName: "GeneratedView" */ "../views/GeneratedView.vue"
      ),
  },
  {
    path: "/urlcounter",
    name: "urlcounter",
    component: () =>
      import(
        /* webpackChunkName: "UrlCounterView" */ "../views/UrlCounterView.vue"
      ),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "LoginView" */ "../views/LoginView.vue"),
  },
  {
    path: "/redirect",
    name: "RedirectionView",
    component: () =>
      import(
        /* webpackChunkName: "RedirectionView" */ "../views/RedirectionView.vue"
      ),
  },
  {
    path: "/dashboard",
    name: "UserDashboard",
    component: () =>
      import(
        /* webpackChunkName: "UserDashboard" */ "../views/UserDashboard.vue"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
