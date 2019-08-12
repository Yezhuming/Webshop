<template>
    <div style="margin-bottom: 320px;">
        <div>
            <div v-for="item in orders" :key="item.order_ID" class="orderItem">
                <div>
                    <div class="inlineBlock" style="margin-left: 30px;">
                        <img :src="item.goods_Picture">
                    </div>
                    <div class="inlineBlock itemName">
                        <span>商品名称：{{item.goods_Name}}</span>
                    </div>
                    <div class="inlineBlock" style="vertical-align: top; margin-right: 50px;">
                        <span class="oldPrice">￥{{item.goods_OldPrice}}</span>
                        <br>
                        <span class="newPrice">￥{{item.goods_NewPrice}} </span>
                    </div>
                    <div class="inlineBlock" style="margin-right: 50px;">
                        <el-tag type="info" style="width: 130px; text-align: center; color: black;">{{item.goods_Count}}</el-tag>
                    </div>
                    <div class="inlineBlock" style="vertical-align: top;">
                        <span style="color: #F56C6C; font-size: 24px;">￥{{(item.goods_NewPrice * item.goods_Count).toFixed(2)}}</span>
                    </div>
                </div>
                <div>
                    <div class="express">
                        <span>收货人：{{item.ct_Name}}</span>
                        <br>
                        <span>联系方式：{{item.ct_Tel}}</span>
                        <br>
                        <span>收货地址：{{item.ct_Address}}</span>
                        <br>
                        <span>买家评论：<span class="comment">{{item.comment}}</span></span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

export default {
    data() {
        return {
            // 保存商品评论
            temp: [],

            orders: [
                
            ]
        }
    },
    methods: {
        
    },
    created() {
        // 获取订单信息
        var that = this;
        this.$axios.get('/showAllOrder')
        .then(function(response) {
            console.log(response);
            for (let i = 0; i < response.data.length; i++) {
                response.data[i].comment = '暂未评论';
            }
            that.orders = response.data;
            for (let i = 0; i < that.orders.length; i++) {
                // 根据获取的订单ID去后台获取对应的评论
                that.$axios.get('/showOrderComment',{
                    params: {
                        order_ID: that.orders[i].order_ID
                    }
                })
                .then(function(resp) {
                    // 如果有评论则覆盖之前设置的“暂未评论”
                    if(resp.data.length != 0){
                        that.orders[i].comment = resp.data[0].goods_comments
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });       
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    }
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

.orderItem {
    width: 1140px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin: 0 auto;
    margin-bottom: 30px;
}

.orderItem:hover{
    border: solid 2px #F56C6C;
    border-radius: 4px;
}

.orderItem img {
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
}

.newPrice {
    font-size: 22px;
}

.oldPrice {
    color: #909399;
    text-decoration: line-through;
}

.express {
    width: 750px;
    line-height: 26px;
    font-size: 14px;
    margin-left: 30px;
    margin-right: 200px;
    margin-top: 20px;
}

.comment {
    width: 650px;
    vertical-align: text-top;
    font: 16px tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;
    color: #3F3F3F;
}
</style>
