<template>
    <div style="margin-bottom: 520px;">
        <div 
        v-for="(item, index) in shopCart" 
        :key="index" class="shopCartItem" 
        :class="{shopCartItemHover: item.checked}" 
        @click="checkedHandle(index)">
            <div class="inlineBlock" style="margin-right: 10px;">
                <input type="checkbox" name="shopCart" :value="index">
            </div>
            <router-link :to="{name: 'introduce', query:{commodityId: item.goods_ID}}">
                <div class="inlineBlock">
                    <img :src="item.goods_Picture">
                </div>
                <div class="inlineBlock itemName">
                    <span>{{item.goods_Name}}</span>
                </div>
            </router-link>
            <div class="inlineBlock" style="vertical-align: top; margin-right: 50px;">
                <span class="oldPrice">￥{{item.goods_OldPrice}}</span>
                <br>
                <span class="newPrice">￥{{item.goods_NewPrice}} </span>
            </div>
            <div class="inlineBlock" style="margin-right: 50px;">
                <el-input-number v-model="item.goods_Count" size="small" :min="0"></el-input-number>
            </div>
            <div class="inlineBlock" style="margin-right: 50px;">
                <span style="color: #F56C6C; font-size: 24px;">￥{{(item.goods_NewPrice * item.goods_Count).toFixed(2)}}</span>
            </div>
            <div class="inlineBlock" style="vertical-align: top;">
                <el-button type="text" @click="moveToCollect(index)">移入收藏夹</el-button>
                <br>
                <el-button type="text" style="color: #F56C6C;" @click="remove(index)">删除</el-button>
            </div>
        </div>
        <div class="bottomPay">
            <div class="inlineBlock" style="height: 60px; margin-right: 800px; font-size:14px; line-height: 60px;">
                <input type="checkbox" name="checkAll" @change="checkAll"> 全选
            </div>
            <div class="inlineBlock" style="height: 60px; line-height: 60px;">
                合计：<span style="color: #f40; font-size: 26px;">￥{{totalPrice}}</span>
            </div>
            <div class="inlineBlock payButton">
                <a href="javascript:void(0);" :class="{activeButton: totalPrice > 0 ? true : false}" @click="pay">
                    <span>结 算</span>
                </a>
            </div>
        </div>
        <el-dialog
        title="支付"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
            <div>
                <div v-for="(item, index) in checkedShopcart" :key="index" class="payItem">
                    <span>商品：{{item.goods_Name}}</span>
                    <br>
                    <span>数量：{{item.goods_Count}}</span>
                    <br>
                    <span>价格：<span style="color: #f40;">￥{{(item.goods_NewPrice * item.goods_Count).toFixed(2)}}</span></span>
                </div>
                <div style="float: right;">
                    <span style="font-size: 24px;">合计：<span style="color: #f40;">￥{{totalPrice}}</span></span>
                </div>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="payConfirm" size="small">确认支付</el-button>
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    data() {
        return {
            shopCart: [
                
            ],

            checkedAll: false ,
            dialogVisible: false
        }
    },
    methods: {
        // 是否选中该商品
        checkedHandle(index) {
            this.shopCart[index].checked = !this.shopCart[index].checked;
            document.getElementsByName('shopCart')[index].checked = this.shopCart[index].checked;
        },
        // 移入收藏夹
        moveToCollect(index) {
            var id = JSON.parse(localStorage.getItem('user')).id;
            this.$axios.get('/inCustomer_favorites', {
                params: {
                    ct_UserID: id,
                    goods_ID: this.shopCart[index].goods_ID
                }
            })
            .then(function(response) {
                console.log(response);
                alert('商品已移入收藏夹！');
            })
            .catch(function(error) {
                console.log(error);
            });
        },
        // 从购物车中删除该商品
        remove(index) {
            var id = JSON.parse(localStorage.getItem('user')).id;
            this.$axios.get('/delShopping_cart', {
                params: {
                    ct_UserID: id,
                    goods_ID: this.shopCart[index].goods_ID
                }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });

            this.shopCart.splice(index, 1);
        },
        // 全选
        checkAll() {
            this.checkedAll = !this.checkedAll;
            var temp = document.getElementsByName('shopCart');
            if (this.checkedAll) {
                // 商品是否选中 激活边框
                for (let i = 0; i < this.shopCart.length; i++) {
                    this.shopCart[i].checked = true;
                }
                // checkbox是否选中
                for (let i = 0; i < temp.length; i++) {
                    temp[i].checked = true;
                }
            } else {
                for (let i = 0; i < this.shopCart.length; i++) {
                    this.shopCart[i].checked = false;
                }
                for (let i = 0; i < temp.length; i++) {
                    temp[i].checked = false;
                }
            }
        },
        // 点击结算按钮，弹出对话框
        pay() {
            this.dialogVisible = true;
        },
        // 确认支付提示框
        payConfirm() {
            this.dialogVisible = false;
            var id = JSON.parse(localStorage.getItem('user')).id;
            for (let i = 0; i < this.checkedShopcart.length; i++) {
                this.$axios.get('/inOrder', {
                    params: {
                        ct_UserID: id,
                        goods_ID: this.checkedShopcart[i].goods_ID,
                        goods_Count: this.checkedShopcart[i].goods_Count
                    }
                })
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
            }
            alert('支付成功！');
            // 刷新页面
            window.location.reload(true);
        }
    },
    computed: {
        // 计算勾选的商品总价格
        totalPrice() {
            var result = 0;
            for (var i = 0; i < this.shopCart.length; i++) {
                if (this.shopCart[i].checked) {
                    result += this.shopCart[i].goods_NewPrice * this.shopCart[i].goods_Count;
                }
            }
            return result.toFixed(2);
        },
        // 返回选中的商品数组
        checkedShopcart() {
            var result = [];
            for (let i = 0; i < this.shopCart.length; i++) {
                if (this.shopCart[i].checked) {
                    result.push(this.shopCart[i]);
                }
            }
            return result;
        }
    },
    created() {
        // 获取购物车信息
        var id = JSON.parse(localStorage.getItem('user')).id;
        var that = this;
        this.$axios.get('/showShopping_cart', {
            params: {
                ct_UserID: id
            }
        })
        .then(function(response) {
            for (let i = 0; i < response.data.length; i++) {
                response.data[i].checked = false;
            }
            that.shopCart = response.data;
            console.log(that.shopCart);
        })
        .catch(function(error) {
            console.log(error);
        });
    },
}
</script>

<style scoped>
.payItem {
    width: 360px;
    margin: 0 auto;
    border: 1px solid #909399;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 20px;
}
.payItem:hover {
    border: solid 2px #F56C6C;
}

.shopCartItem {
    width: 1140px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin: 0 auto;
    margin-bottom: 30px;
}

.shopCartItemHover{
    border: solid 2px #F56C6C;
    border-radius: 4px;
}

.shopCartItem img {
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
    font-size: 13px;
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

.bottomPay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-left: 20px;
    width: 1160px;
    height: 60px;
    margin: 0 auto;
    background-color: #e5e5e5;
    z-index: 10000;
}

.payButton {
    float: right;
    width: 120px;
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
}

.payButton a {
    display: inline-block;
    width: 120px;
    height: 60px;
    text-decoration: none;
    background: #B0B0B0;
    color: #fff;
    cursor: not-allowed;
}

.activeButton {
    background-color: #f40 !important;
    color: white !important;
    cursor: pointer !important;
}

</style>
