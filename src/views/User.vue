<template>
    <div class="item">
        <h3 style="width: 500px; text-align: center; margin-bottom: 30px;">个人信息</h3>
        <el-form label-width="100px" label-position="left">
            <el-form-item label="昵称：">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="收获地址：">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="修改密码：">
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item style="text-align: right;">
                <el-button type="primary" @click="onSave">保存</el-button>
                <el-button type="danger" @click="onExit">退出登陆</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                name: '',
                phone: '',
                address: '',
                password: ''
            }
        }
    },
    methods: {
        // 保存用户信息
        onSave() {
            let id = JSON.parse(localStorage.getItem('user')).id;
            this.$axios.get('/modCustomer_info', {
                params: {
                    ct_UserID: id,
                    ct_Name: this.form.name,
                    ct_Tel: this.form.phone,
                    ct_Address: this.form.address
                }
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

            if (this.form.password != '') {
                this.$axios.post('/modct_Password', {
                    ct_UserID: id,
                    ct_Password: this.form.password
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }

            alert('保存成功！');
            this.form.password = '';
        },
        // 退出登录
        onExit() {
            localStorage.removeItem('user');
            // 跳转到首页
            this.$router.push('/');
            // 刷新页面
            window.location.reload(true);
        }
    },
    created() {
        // 获取用户信息
        var that = this;
        var id = JSON.parse(localStorage.getItem('user')).id;
        this.$axios.get('/showCustomer_info', {
            params: {
                ct_UserID: id
            }
        })
        .then(function (response) {
            that.form.name = response.data[0].ct_Name;
            that.form.phone = response.data[0].ct_Tel;
            that.form.address = response.data[0].ct_Address;
        })
        .catch(function (error) {
            console.log(error);
        });
    },
}
</script>

<style scoped>
.item {
    width: 500px;
    background-color: white;
    padding: 10px 200px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin: 0 auto;
    margin-bottom: 50px;
    margin-top: 50px;
}
</style>
