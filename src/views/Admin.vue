<template>
    <div style="margin-bottom: 320px;">
        <div>
            <div v-for="(item, index) in commodities" :key="item.goods_ID" class="commodityItem">
                <div>
                    <div class="inlineBlock" style="margin-left: 30px;">
                        <img :src="item.goods_Picture">
                    </div>
                    <div class="inlineBlock itemName">
                        <div>
                            商品名称：{{item.goods_Name}}
                        </div>
                        <div>
                            原价：{{item.goods_OldPrice}}
                        </div>
                        <div>
                            优惠价：{{item.goods_NewPrice}}
                        </div>
                        <div>
                            <span style="width: 60px;">商品类型：</span>{{item.goods_TypeName}}
                        </div>
                    </div>
                </div>
                <div>
                    <div class="inlineBlock info">
                        <span class="inlineBlock" style="width: 70px;">商品介绍：</span>
                        <p style="text-indent: 2em; margin: 0;">{{item.goods_Info}}</p>
                    </div>
                    <div class="inlineBlock" style="vertical-align: bottom;">
                        <el-button type="danger" round @click="remove(index)">下架商品</el-button>
                    </div>
                </div>
            </div>
            <div class="addButton">
                <el-button type="primary" round @click="dialogVisible = true;">上架商品</el-button>
            </div>
            <el-dialog
            title="上架商品"
            :visible.sync="dialogVisible"
            width="30%">

                <el-form label-width="100px" label-position="left">
                    <el-form-item label="商品名称：">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品类型：">
                        <el-input v-model="form.type"></el-input>
                    </el-form-item>
                    <el-form-item label="商品原价：">
                        <el-input v-model="form.oldPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="商品优惠价：">
                        <el-input v-model="form.newPrice"></el-input>
                    </el-form-item>
                    <el-form-item label="商品介绍：">
                        <el-input type="textarea" v-model="form.introduce" autosize></el-input>
                    </el-form-item>

                    <el-form-item label="商品图片：">
                        <img :src="form.img" width="150px" height="150px">
                        <input type="file" id="file" @change="uploadImg">
                    </el-form-item>
                </el-form>

                <div slot="footer" style="margin-top: -40px;">
                    <el-button type="primary" @click="add" size="small">确 定</el-button>
                    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            dialogVisible: false,

            form: {
                name: '',
                type: '',
                oldPrice: '',
                newPrice: '',
                introduce: '',
                img: ''
            },

            commodities: [
                
            ]
        }
    },
    methods: {
        // 下架商品
        remove(index) {
            var that = this;
            let id = this.commodities[index].goods_ID;
            this.$axios.get('/outGoods', {
                params: {
                    goods_ID: id
                }
            })
            .then(function (response) {
                var temp = that.commodities[index];
                that.commodities.splice(index, 1);
                alert('下架商品【' + temp.goods_Name + '】成功！');
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        // 上架商品
        add() {
            var that = this;
            this.$axios.post('/inGoods', {
                goods_Name: this.form.name,
                goods_TypeName: this.form.type,
                goods_Info: this.form.introduce,
                goods_OldPrice: this.form.oldPrice,
                goods_NewPrice: this.form.newPrice,
                goods_Picture: this.form.img
            })
            .then(function (response) {
                alert('上架商品成功！');
                console.log(response);
                that.$axios.get('/showAllGoods')
                .then(function (response) {
                    console.log(response.data);
                    that.commodities = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
                that.form.name = '';
                that.form.type = '';
                that.form.introduce = '';
                that.form.oldPrice = '';
                that.form.newPrice = '';
                that.form.img = '';
                document.getElementById('file').value = '';
            })
            .catch(function (error) {
                console.log(error);
            });
            this.dialogVisible = false;
        },
        // 上传图片
        uploadImg(e) {
            var that = this;
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = function() {
                that.form.img = this.result;
            }
        }
    },
    created() {
        // 获取所有已上架的商品信息
        var that = this;
        this.$axios.get('/showAllGoods')
        .then(function (response) {
            console.log(response.data);
            that.commodities = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    },
}
</script>

<style scoped>
.adminHeader {
    width: 1400px;
    height: 60px;
    position: fixed;
    top: 0;
    background-color: #545c64;
    padding: 0 60px !important;
    margin-left: -20px;
}

.item {
    float: right !important;
}

.commodityItem {
    width: 1140px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin: 0 auto;
    margin-bottom: 30px;
}

.commodityItem:hover{
    border: solid 2px #F56C6C;
    border-radius: 4px;
}

.commodityItem img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    vertical-align: top;
}

.inlineBlock {
    display: inline-block;
}

.itemName {
    width: 200px;
    font-size: 14px;
    margin-left: 20px;
    margin-right: 200px;
    vertical-align: text-top;
    line-height: 2em;
}

.info {
    width: 750px;
    line-height: 26px;
    font-size: 14px;
    margin-left: 30px;
    margin-right: 200px;
    margin-top: 20px;
}

.addButton {
    position: fixed;
    top: 80px;
    left: 40px;
}
</style>
