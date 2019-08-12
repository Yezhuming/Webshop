<template>
    <div style="margin-bottom: 520px;">
        <div v-for="(item, index) in collects" :key="index" class="collectItem">
            <router-link :to="{name: 'introduce', query:{commodityId: item.goods_ID}}">
                <div class="inlineBlock" style="margin-left: 30px;">
                    <img :src="item.goods_Picture">
                </div>
                <div class="inlineBlock itemName">
                    <span>{{item.goods_Name}}</span>
                </div>
            </router-link>
            <div class="inlineBlock" style="vertical-align: middle; margin-right: 50px;">
                <span class="oldPrice">￥{{item.goods_OldPrice}}</span>
            </div>
            <div class="inlineBlock" style="vertical-align: middle; margin-right: 200px;">
                <span style="color: #F56C6C; font-size: 24px;">￥{{(item.goods_NewPrice)}}</span>
            </div>
            <div class="inlineBlock" style="vertical-align: top;">
                <el-button type="text" style="color: #F56C6C;" @click="remove(index)">取消收藏</el-button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            collects: []
        }
    },
    created() {
        // 获取数据
        var id = JSON.parse(localStorage.getItem('user')).id;
        var that = this;
        this.$axios.get('/showCustomer_favorites', {
            params: {
                ct_UserID: id
            }
        })
        .then(function(response) {
            console.log(response);
            that.collects = response.data;
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    methods: {
        // 从收藏夹删除商品
        remove(index) {
            var id = JSON.parse(localStorage.getItem('user')).id;
            this.$axios.get('/delCustomer_favorites', {
                params: {
                    ct_UserID: id,
                    goods_ID: this.collects[index].goods_ID
                }
            })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });

            this.collects.splice(index, 1);
        },
    }
}
</script>

<style scoped>
.collectItem {
    width: 1140px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin: 0 auto;
    margin-bottom: 30px;
}

.collectItem:hover{
    border: solid 2px #F56C6C;
    border-radius: 4px;
}

.collectItem img {
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

</style>
