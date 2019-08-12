<template>
    <div style="margin-bottom: 520px;">
        <div v-for="(item, index) in orders" :key="item.order_ID" class="orderItem">
            <div>
                <router-link :to="{name: 'introduce', query:{commodityId: item.goods_ID}}">
                    <div class="inlineBlock" style="margin-left: 30px;">
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
                    <el-tag type="info" style="width: 130px; text-align: center; color: black;">{{item.goods_Count}}</el-tag>
                </div>
                <div class="inlineBlock" style="margin-right: 100px;">
                    <span style="color: #F56C6C; font-size: 24px;">￥{{(item.goods_NewPrice * item.goods_Count).toFixed(2)}}</span>
                </div>
            </div>
            <div>
                <div class="inlineBlock express">
                    <span>收货人：{{item.ct_Name}}</span>
                    <br>
                    <span>联系方式：{{item.ct_Tel}}</span>
                    <br>
                    <span>收货地址：{{item.ct_Address}}</span>
                </div>
                <div class="inlineBlock" style="vertical-align: bottom;">
                    <el-button type="primary" round @click="comment(index)">评价商品</el-button>
                </div>
                <el-dialog
                title="评论商品"
                :visible.sync="dialogVisible"
                width="30%">
                <el-input
                type="textarea"
                autosize
                placeholder="请输入评论"
                v-model="theComment">
                </el-input>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitComment" size="small">确 定</el-button>
                        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            orders: [
                
            ],
            dialogVisible: false,
            theComment: '',

            // 记录打开了哪个商品的评论
            position: Number
        }
    },
    created() {
        // 获取订单信息
        var that = this;
        var id = JSON.parse(localStorage.getItem('user')).id;
        this.$axios.get('/showOrder', {
            params: {
                ct_UserID: id
            }
        })
        .then(function(response) {
            console.log(response);
            that.orders = response.data;
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    methods: {
        // 打开评论窗口
        comment(index) {
            this.dialogVisible = true;
            this.position = index;
        },
        // 提交商品评论
        submitComment() {
            var that = this;
            that.dialogVisible = false;
            var id = JSON.parse(localStorage.getItem('user')).id;
            this.$axios.get('/inComment', {
                params: {
                    ct_UserID: id,
                    goods_ID: this.orders[this.position].goods_ID,
                    goods_comments: this.theComment,
                    order_ID: this.orders[this.position].order_ID
                }
            })
            .then(function(response) {
                console.log(response);
                that.theComment = '';
                alert('评论商品成功！');
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    }
}
</script>

<style scoped>
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

.express {
    width: 750px;
    line-height: 26px;
    font-size: 14px;
    margin-left: 30px;
    margin-right: 200px;
    margin-top: 20px;
}
</style>
