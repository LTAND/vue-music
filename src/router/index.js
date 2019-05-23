import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Singer from 'components/singer/singer'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Rank from 'components/rank/rank'
// import Search from 'components/search/search'
// import UserCenter from "components/user-center/user-center"
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'

Vue.use(Router)

/* 路由懒加载 */
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((recommend) => {
    resolve(recommend)
  })
}

const Singer = (resolve) => {
  import('components/singer/singer').then((singer) => {
    resolve(singer)
  })
}

const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('components/rank/rank').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import("components/user-center/user-center").then((module) => {
    resolve(module)
  })
}

const Disc = (resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module)
  })
}

const TopList = (resolve) => {
  import('components/top-list/top-list').then((module) => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      name: 'recommend',
      path: '/recommend',
      component: Recommend,
      children: [
        {
          name: "disc",
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      name: 'singer',
      path: '/singer',
      component: Singer,
      children: [
        {
          name: 'singerdetail',
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      name: 'rank',
      path: '/rank',
      component: Rank,
      children: [
        {
          name: 'rankdetail',
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      name: 'search',
      path: '/search',
      component: Search,
      children: [
        {
          name: 'singerdetail',
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      name: "user",
      path: "/user",
      component: UserCenter
    }
  ]
})
