<template>
    <div class="container">
        <el-menu mode="horizontal" router>
            <el-menu-item v-for="menu in menuList" :index="menu.path">
                {{ menu.name }}
            </el-menu-item>
        </el-menu>

        <!-- 二级路由菜单 -->
        <div class="view">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import menus from '@/route/menus';

const menuList = computed(() => {
    if (menus) {
        return menus.map(item => {
            return {
                path: item.path,
                name: item.meta.name,
            };
        });
    } else {
        return [];
    }
});
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .view {
        flex: 1;
    }
}
</style>
