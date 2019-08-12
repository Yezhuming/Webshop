<template>
    <div>
        <div class="commodityBox">
            <div class="inlineBlock" >
                <img :src="commodity.goods_Picture">
            </div>
            <div class="inlineBlock" style="width: 480px;">
                <div>
                    <p>{{commodity.goods_Name}}</p>
                </div>
                <div style="margin-top: 40px;">
                    <span class="oldPrice"><span class="inlineBlock font" style="width: 80px;">原价</span>{{commodity.goods_OldPrice}}</span>
                    <br>
                    <span class="newPrice"><span class="inlineBlock" style="width: 80px; margin-top: 10px;">优惠价</span>{{commodity.goods_NewPrice}}</span>
                </div>
                <div style="margin-top: 80px;">
                    <span class="inlineBlock font" style="width: 80px;">数量</span>
                    <el-input-number v-model="commodity.count" size="small" :min="1"></el-input-number>
                </div>
                <div class="addButton">
                    <a href="javascript:void(0);" @click="addToShopcart">
                        <span><i class="el-icon-shopping-cart-2"></i> 加入购物车</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="commentBox">
            <div class="commentCount font">
                累计评论 <b>{{comments.length}}</b>
            </div>
            <el-divider></el-divider>
            <div v-for="(item, index) in comments" :key="index">
                <div>
                    <span class="font" style="font-size: 18px; color: #3F3F3F;">{{item.ct_Name}}：</span>
                </div>
                <div>
                    <p class="font" style="text-indent: 2em; font-size: 16px; color: #3F3F3F;">{{item.goods_comments}}</p>
                </div>
                <el-divider></el-divider>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            commodity: {
                
            },
            comments: [
                
            ]
        }
    }, 
    methods: {
        // 加入购物车
        addToShopcart() {
            var id = JSON.parse(localStorage.getItem('user')).id;
            this.$axios.get('/inShopping_cart', {
                params: {
                    goods_ID: this.$route.query.commodityId,
                    goods_Count: this.commodity.count,
                    ct_UserID: id
                }
            })
            .then(function (response) {
                console.log(response);
                alert('加入购物车成功！');
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },
    created() {
        var that = this;
        // 获取商品信息
        this.$axios.get('/showGoods', {
            params: {
                goods_ID: this.$route.query.commodityId
            }
        })
        .then(function (response) {
            response.data[0].count = 1;
            that.commodity = response.data[0];
        })
        .catch(function (error) {
            console.log(error);
        });

        // 获取商品评论
        this.$axios.get('/showComment', {
            params: {
                goods_ID: this.$route.query.commodityId
            }
        })
        .then(function (response) {
            that.comments = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
    },
}
</script>

<style scoped>
.inlineBlock {
    display: inline-block;
}

.commodityBox {
    width: 800px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin: 0 auto;
    margin-bottom: 20px;
}

.commodityBox img {
    width: 300px;
    height: 300px;
    object-fit: contain;
    vertical-align: text-bottom;
    margin-right: 20px;
}

.commodityBox p {
    font: 12px/1.5 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;
    font-size: 17px;
    font-weight: 700;
    line-height: 21px;
    color: #3C3C3C;
    margin-top: 0;
}

.newPrice {
    font-size: 22px;
    color: #f40;
}

.oldPrice {
    text-decoration: line-through;
}

.addButton {
    width: 180px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
    margin-left: 250px;
    margin-top: 30px;
}

.addButton a {
    display: inline-block;
    width: 180px;
    height: 40px;
    text-decoration: none;
    background-color: #f40;
    color: white;
    cursor: pointer;
}

.font {
    color: #6C6C6C;
    font: 14px/1.5 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;
}

.commentBox {
    width: 800px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin: 0 auto;
    padding-top: 10px;
}

.commentCount {
    height: 40px;
    line-height: 40px;
    color: #f40;
    font-size: 16px;
    margin-bottom: -20px;
}
</style>
