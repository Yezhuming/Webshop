<template>
    <div>
        <el-container>
            <el-header class="header">
                <Header :isAdmin="isAdmin"/>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
            <el-footer class="footer">
                <Footer />
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import Header from './components/Header';
import Footer from './components/Footer';

export default {
    data() {
        return {

        }
    },
    components: {
        Header,
        Footer
    },
    watch: {
        $route() {
            
        }
    },
    computed: {
        isAdmin: function(){
            // 判断是否管理员页面
            if(this.$route.path == '/admin' || this.$route.path == '/adminOrder'){
                return true
            }else{
                return false
            }
        }
    }
    
}
</script>

<style>
body {
    margin: 0;
    background-color: #f5f5f5;
}

.header {
    background-color: #545c64;
    padding: 0 60px !important;
}

.footer {
    background-color: #545c64;
    height: 100px !important;
}

</style>
