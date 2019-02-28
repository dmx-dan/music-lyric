import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const Index = (resolve) => {
  import('@/components/index').then((module) => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('@/components/singer').then((module) => {
    resolve(module)
  })
}
const SingerDetail = (resolve) => {
  import('@/components/singer-detail').then((module) => {
    resolve(module)
  })
}
const NotFind = (resolve) => {
  import('@/components/NotFind').then((module) => {
    resolve(module);
  });
};

const Song = (resolve) => {
  import('@/components/song').then((module) => {
    resolve(module);
  });
};


Vue.use(Router)

export default new Router({
  routes: [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/singer',
    name: 'singer',
    component: Singer,
  },
  {
    path: '/singer/:id',
    name: 'SingerDetail',
    component: SingerDetail,
  },
  {
    path: '/song',
    name: 'Song',
    component: Song,
  },
  {
    path: '*',
    name: 'notfind',
    component: NotFind,
  }, ]
})