<template>
    <div class="login">
            <el-form size="medium" :inline="true" :label-position="labelPosition" label-width="60px" :model="form">
                <el-form-item label="账号">
                    <el-input v-model="form.user"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="密码">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <br>
                <drag-verify :width="drag.width" 
                    :height="drag.height" 
                    :text="drag.text" 
                    :success-text="drag.successText"
                    :text-size="drag.textSize"
                    class="darg"
                    @passcallback="verified = true">
                </drag-verify>
                <el-form-item class="button">
                    <el-button type="warning" @click="onAdminLogin" size="small" :disabled="!verified">商家登陆</el-button>
                    <el-button type="primary" @click="onRegister" size="small" :disabled="!verified">注册</el-button>
                    <el-button type="primary" @click="onLogin" size="small" :disabled="!verified">登陆</el-button>
                </el-form-item>
            </el-form>
    </div>
</template>

<script>
import dragVerify from 'vue-drag-verify';

export default {
    data() {
        return {
            drag: {
                width: 300,
                height: 48,
                text: "请拖动到右侧进行验证",
                successText: "验证成功",
                textSize: '16px',
            },

            labelPosition: 'left',
            form: {
                user: '',
                password: ''
            },

            verified: false
        }
    },
    components: {
        dragVerify
    },
    methods: {
        onAdminLogin() {
            var that = this;
            this.$axios.post('/managerLogin', {
                mg_UserName: this.form.user,
                mg_Password: this.form.password
            })
            .then(function (response) {
                console.log(response);
                if (response.data.status == 200) {
                    that.$router.push('/admin');
                } else {
                    alert('账号或密码错误！');
                    // 刷新页面
                    window.location.reload(true);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        onLogin() {
            var that = this;
            this.$axios.post('/userLogin', {
                ct_UserName: this.form.user,
                ct_Password: this.form.password
            })
            .then(function (response) {
                if (response.data.status == 200) {
                    let temp = {
                        id: response.data.result[0].ct_UserID,
                        user: that.form.user,
                        password: that.form.password
                    };
                    localStorage.setItem('user', JSON.stringify(temp));
                    that.$router.push('/');
                    // 刷新页面
                    window.location.reload(true);
                } else {
                    alert('账号或密码错误！');
                    // 刷新页面
                    window.location.reload(true);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        onRegister() {
            this.$axios.post('/userRegistry', {
                ct_UserName: this.form.user,
                ct_Password: this.form.password
            })
            .then(function (response) {
                if (response.data.status == 200) {
                    alert('注册成功，请登陆！');
                    // 刷新页面
                    window.location.reload(true);
                } else {
                    alert('账号已存在，请登陆账号或修改账号重新注册！');
                    // 刷新页面
                    window.location.reload(true);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>

<style scoped>
.login {
    width: 400px;
    height: 200px;
    margin: 0 auto;
    margin-top: 80px;
    margin-bottom: 150px;
    text-align: center;
    padding: 40px;

    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 10px;
}

.darg {
    margin: 0 auto;
    margin-bottom: 20px;
}

.button {
    float: right;
    margin-right: 75px !important;
}
</style>
