<template>
  <div class="sidebar"
       :style="{top:top}">
    <el-menu class="sidebar-el-menu"
             :default-active="onRoutes"
             :collapse="collapse"
             background-color="#324157"
             text-color="#bfcbd9"
             active-text-color="#20a0ff"
             unique-opened
             router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index"
                      :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs"
                          :index="subItem.index"
                          :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs"
                              :key="i"
                              :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else
                            :index="subItem.index"
                            :key="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index"
                        :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus'
export default {
  data() {
    return {
      collapse: false,
      top: self === top ? '70px' : '0px',
      items: [
        {
          icon: 'el-icon-s-home',
          index: 'ActConfig',
          title: '宁波银行体验金',
        },
        {
          icon: 'el-icon-upload',
          index: 'StockList',
          title: '行情源配置',
        },
        {
          icon: 'el-icon-share',
          index: 'ShareList',
          title: '分享配置',
        },
        {
          icon: 'el-icon-star-off',
          index: 'InfoConfig',
          title: '资讯配置',
        },
        {
          icon: 'el-icon-tickets',
          index: 'StockBaseList',
          title: '权益基金行情配置',
        },
        {
          icon: 'el-icon-tickets',
          index: 'FundProductList',
          title: '基金广告位',
        },
      ],
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '')
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', (msg) => {
      this.collapse = msg
    })
  },
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 210px;
}
.sidebar > ul {
  height: 100%;
}
</style>
