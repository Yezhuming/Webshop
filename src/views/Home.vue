<template>
    <div>
        <!-- 搜索框 -->
        <div>
            <el-form :inline="true" :model="form" class="form">
                <el-form-item>
                    <el-input v-model="form.query" placeholder="请输入要搜索的词" class="input"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 轮播图 -->
        <div>
            <el-carousel height="400px" trigger="click" class="carousel" type="card" :interval="5000">
                <el-carousel-item v-for="item in carousels" :key="item.goods_ID">
                    <router-link :to="{name: 'introduce', query: {commodityId: item.goods_ID}}">
                        <img :src="item.goods_Picture">
                    </router-link>
                </el-carousel-item>
            </el-carousel>
        </div>

        <div class="commodities">
            <!-- 商品类型 -->
            <el-row>
                <el-col :span="20" :offset="2" style="margin-bottom: 20px;">
                    <el-divider></el-divider>
                    <div style="margin: 0 20px;">
                        <el-button size="small" v-for="(item, index) in types" :key="index" :type="item.buttonType" @click="typeSelected(index)">
                            {{item.goods_TypeName}}
                        </el-button>
                    </div>
                </el-col>
            </el-row>
            <!-- 该商品类型下的所有商品 -->
            <el-row v-for="(row,index) in commodities" :key="index">
                <el-col :span="20" :offset="2">
                    <el-row :gutter="30">
                        <el-col :span="6" v-for="item in row" :key="item.goods_ID">
                            <router-link :to="{name: 'introduce', query: {commodityId: item.goods_ID}}" class="card">
                                <el-card :body-style="{ padding: '20px' }" shadow="hover">
                                    <img :src="item.goods_Picture">
                                    <div style="padding: 14px;">
                                        <span>{{item.goods_Name}}</span>
                                    </div>
                                    <div style="padding: 0 14px;">
                                        <span class="newPrice">￥{{item.goods_NewPrice}}</span>
                                        <span class="oldPrice">￥{{item.goods_OldPrice}}</span>
                                        <!-- <span class="commentCount">评价 {{item.commentCount}}</span> -->
                                    </div>
                                </el-card>
                            </router-link>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            form: {
                query: ''
            },
            carousels: [
                
            ],

            // 商品数组
            commodities:[
                
            ],

            types: [
                {
                    buttonType: 'primary',
                    goods_TypeName: '全部类型'
                }
            ]
        }
    },
    methods: {
        onSearch() {
            var that = this;
            this.$axios.get('/searchGoods',{
                params: {
                    goods_Name: this.form.query
                }
            })
            .then(function (response) {
                that.commodities = [];
                console.log(response.data);
                let temp = [];
                for (let i = 0; i < response.data.length; i++) {
                    // 4个商品一行
                    if (temp.length == 4) {
                        that.commodities.push(temp);
                        temp = [];
                    }
                    temp.push(response.data[i])
                }
                that.commodities.push(temp);
            })
            .catch(function (error) {
                console.log(error);
            });
        },

        typeSelected(index) {
            var that = this;
            // 点击全部类型
            if(index == 0){
                for (let i = 0; i < this.types.length; i++) {
                    this.types[i].buttonType = 'text';
                }
                this.types[index].buttonType = 'primary';
                this.$axios.get('/showAllGoods')
                .then(function (response) {
                    that.commodities = [];
                    console.log(response.data);
                    let temp = [];
                    for (let i = 0; i < response.data.length; i++) {
                        if (temp.length == 4) {
                            that.commodities.push(temp);
                            temp = [];
                        }
                        temp.push(response.data[i])
                    }
                    that.commodities.push(temp);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            // 点击相应商品类型
            else{
                for (let i = 0; i < this.types.length; i++) {
                    this.types[i].buttonType = 'text';
                }
                this.types[index].buttonType = 'primary';

                this.$axios.get('/showGoods_type',{
                    params: {
                        goods_TypeName: this.types[index].goods_TypeName
                    }
                })
                .then(function (response) {
                    that.commodities = [];
                    console.log(response.data);
                    let temp = [];
                    for (let i = 0; i < response.data.length; i++) {
                        if (temp.length == 4) {
                            that.commodities.push(temp);
                            temp = [];
                        }
                        temp.push(response.data[i])
                    }
                    that.commodities.push(temp);
                })
                .catch(function (error) {
                    console.log(error);
                });
            } 
        }   
    },
    // 获取数据
    created() {
        var that = this;
        // 获取类型信息
        this.$axios.get('/showAllGoods_type')
        .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                response.data[i].buttonType = 'text';
                that.types.push(response.data[i]);
            }
        })
        .catch(function (error) {
            console.log(error);
        });

        // 获取轮播图 商品列表
        this.$axios.get('/showAllGoods')
        .then(function (response) {
            // console.log(response.data);
            // 轮播图
            for (let i = 0; i < 5; i++) {
                if (i == response.data.length) {
                    break;
                }
                that.carousels.push(response.data[i]);
            }
            // 商品列表
            let temp = [];
            for (let i = 0; i < response.data.length; i++) {
                if (temp.length == 4) {
                    that.commodities.push(temp);
                    temp = [];
                }
                temp.push(response.data[i])
            }
            that.commodities.push(temp);
        })
        .catch(function (error) {
            console.log(error);
        });
    },
}
</script>

<style scoped>
.form {
    text-align: center;
}

.input {
    width: 500px;
}

.carousel {
    width: 800px;
    margin: 0 auto;
}

.carousel img {
    width: 400px;
    height: 400px;
    /* 缩放 */
    object-fit: contain;
}

.commodities img {
    display: block;
    margin: 0 auto;
}

.card {
    text-decoration: none;
}

.newPrice {
    color: #F56C6C;
    font-size: 24px;
}

.oldPrice {
    color: #909399;
    text-decoration: line-through;
}

.commentCount {
    float: right;
    margin-top: 10px;
    color: #909399;
    font-size: 13px;
}

.el-button--text {
    color: black;
}
</style>
