<template>
  <div class="gift_good_box">
      <div class="swipe-area">
        <van-swipe :autoplay='autoplay' class="gift_vant_swiper">
            <van-swipe-item v-for="(video, index) in detail.videos" :key="index">
                <video v-if="video" :poster="baseUrl + video + '?vframe/jpg/offset/0'" controls width="100%" class="productImage" x5-playsinline="" playsinline="" webkit-playsinline='' style="background: #000;">
                    <source :src='baseUrl + video' type="video/mp4">
                </video>
            </van-swipe-item>
            <van-swipe-item v-for="(image, index) in detail.images" :key="index + 1">
                <img v-lazy="image" width="100%" class="productImage" @click="swipeImgClick()" v-if="image"/>
            </van-swipe-item>
        </van-swipe>
    </div>
    <div class="gift_name">{{ detail.productName }}</div>
    <ul class="gift_ul van-hairline--bottom van-hairline--top">
        <li>
            <van-icon name="passed" color="#f0222f" size='20'/>
            <span class="li_text">正品保障</span>
        </li>
        <li>
            <van-icon name="passed" color="#f0222f" size='20'/>
            <span class="li_text">全国配送</span>
        </li>
        <li>
            <van-icon name="passed" color="#f0222f" size='20'/>
            <span class="li_text">七天退换</span>
        </li>
    </ul>
    <div class="gift_product_detail">详情介绍</div>
    <div class="description clearfix" ref="desc" v-html="detail.description"></div>
    <div @click="popupShow = true" class="propertyView">我要领取</div>
    <van-popup v-model="popupShow" position="bottom" :style="{ height: '50%' }" class="popup">
        <div class="ul_box">
            <div v-for="(item,index) in property" :key="index">
                <div class="propertyName">{{ item.propertyName }}</div>
                <ul>
                    <li v-for="val in item.propertyValues" :key="val.propertyValueId">
                        <span class="valueName" :class="val.selected ? 'property-sel' : 'property-no'" @click="selectProperty(item.propertyNameId, val.propertyValueId)">{{ val.propertyValueName }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="propertyAffirm" @click="affirm">确定</div>
    </van-popup>
  </div>
</template>

<script>
import { getQueryString } from '@/utils/util'
import { fetchProductDetail,productProperty,productPay } from '@/api/product'
export default {
    data(){
        return {
            productNo: '',
            baseUrl:"http://qiniu.edawtech.com/",
            detail: '',             //商品信息
            autoplay: 0,
            property: [],           //规格
            popupShow: false,
            tempArr: [],        //选中的规格
            templObj: '',       //规格id
            desc: '',
            screeHeight: 0
        }
    },
    created(){
        // http://192.168.0.35:8080/?appId=dudu&productNo=201908061842023089#/
        let productNo = getQueryString('productNo');
        // let productNo = '201908061842023089'
        this.productNo = productNo;
        let screeHeight = document.documentElement.clientHeight || document.body.clientHeight;;     // 屏幕高
        this.screeHeight = screeHeight;
        this.getProductInfo();
        this.getProductProperty();
    },
    updated(){
        this.setHeight();
    },
    methods: {
        async setHeight(){
            let descHtml = this.$refs.desc.children;
            // console.log(descHtml)
            for(var i=0; i<descHtml.length; i++){
                if(descHtml[i].className == 'ql-video'){
                    let source = document.createElement("source");
                    source.src = descHtml[i].src;
                    source.type = "video/mp4";
                    descHtml[i].appendChild(source);
                    descHtml[i].controls = true;
                    descHtml[i].playsInline = true;
                    descHtml[i].poster = descHtml[i].src + '?vframe/jpg/offset/0';
                    let img = new Image()
                    img.src = descHtml[i].poster
                    let vm = this;
                    let videoHeight;
                    var promise = new Promise((reslove)=>{
                        img.onload = function(){
                            if(img.height > vm.screeHeight){
                                videoHeight = img.height / 3 + 'px';
                            }else{
                                videoHeight = img.height / 2 + 'px';
                            }
                            reslove();
                        }
                    })
                    await promise;
                    descHtml[i].style.height = videoHeight;
                    descHtml[i].style.width = '100%';
                }
            }
        },
        async getProductInfo(){
            const res = await fetchProductDetail(this.productNo);
            let productDetail = res.data.data;
            if(productDetail.images[0] && productDetail.images[0].indexOf('http') == -1){
                let tempArr = [];
                productDetail.images.forEach(item => {
                    if(item.indexOf('http') == -1){
                        tempArr.push(this.baseUrl + item);
                    }
                });
                productDetail.images = tempArr;
            }
            if(productDetail.videos && productDetail.videos.length > 0){
                this.autoplay = 0
            }else{
                this.autoplay = 3000
            }
            productDetail.comprehensive = this.convertNumber(productDetail.comprehensive)
            let description = this.iframe(productDetail.description);
            productDetail.description = description;
            this.detail = productDetail;
            console.log(this.detail,'商品详情')
        },
        // 获取规格
        async getProductProperty(){
            let postData = {
                appId: 'dudu'
            }
            let res = await productProperty(this.productNo, postData);
            this.property = res.data.data.property;
            console.log(this.property,'规格')
        },
        // 截取视频代码
        iframe(html){
            let description = html.replace(/iframe/g,'video');
            return description;
        },
        // 转为数字
        convertNumber(val){
            return Number(val)
        },
        // 选择规格
        selectProperty(propertyNameId, propertyValueId) {
            this.property.forEach((item, index) => {
                if (propertyNameId == item.propertyNameId) {
                    item.propertyValues.forEach((item02, index02) => {
                        if (propertyValueId == item02.propertyValueId) {
                            item02.selected = !item02.selected;
                        } else {
                            item02.selected = false;
                        }
                    });
                }
            });
            //深入响应式原理
            this.property = Object.assign([], this.property, []);
            console.log(this.property);
            this.handleProperty(this.property);
        },
        // 选中规格
        handleProperty(propertyList){
            let templArr = [];
            let templObj = {};
            let descArr = '';
            propertyList.forEach((item, index) => {
                item.propertyValues.forEach((item02, index02) => {
                    if (item02.selected) {
                        templArr.push({
                            propertyNameId: item.propertyNameId,
                            propertyValueId: item02.propertyValueId
                        });
                        descArr += item02.propertyValueName + " ";
                    }
                });
            });
            templArr.forEach((i)=>{
                templObj[i.propertyNameId] = i.propertyValueId;
            })
            this.tempArr = templArr;
            this.templObj = templObj;
            this.desc = descArr;
        },
        // 确定
        affirm(){
            if(this.tempArr.length == this.property.length){
                let payObj = {
                    appId: 'dudu',
                    uid: '922789',
                    deliveryId: '',
                    openId: 'oVA5b5HoyJl1C-J-k97qKFzXNP0g',
                    orderType: '1',
                    payChannel: "wxsmallpay",
                    products: [
                        {
                            productNum: 1,
                            productDesc: this.desc,
                            deliveryType: 'express',
                            productNo: this.productNo,
                            property: JSON.stringify(this.templObj)
                        }
                    ],
                }
                let productInfo = {
                    image: this.detail.picture,
                    productName: this.detail.productName
                }
                window.localStorage.setItem('payObj',JSON.stringify(payObj));
                window.localStorage.setItem('productInfo',JSON.stringify(productInfo));
                this.$router.push({ name: 'order'})
            }else{
                this.$toast('请选择完整规格!');
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    .gift_good_box{
        padding-bottom: 50px;
        box-sizing: border-box;
    }
    .gift_name{
        padding: 15px;
        font-size: 16px;
        font-weight: bold;
        color: #333;
    }
    img{
        display: block;
    }
    .gift_ul{
        display: flex;
        justify-content: space-between;
        padding: 15px;
        li{
            display: flex;
            align-items: center;
            .li_text{
                color: #333;
                margin-left: 10px;
                font-size: 12px;
            }
        }
    }
    .gift_product_detail{
        padding: 20px 15px;
        font-size: 16px;
        color: #333;
        font-weight: bold;
    }
    .propertyView{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 60px;
        background: #f0222f;
        font-size: 18px;
        color: #fff;
        letter-spacing: 2px;
        text-align: center;
        line-height: 60px;
    }
    .popup{
        padding: 15px;
        box-sizing: border-box;
        .propertyName{
            font-size: 16px;
            color: #333;
            font-weight: bold;
            padding: 15px 0;
            box-sizing: border-box;
        }
        ul{
            display: flex;
            flex-wrap: wrap;
            padding: 15px 0;
            box-sizing: border-box;
            li{
                width: 33.3%;
                font-size: 16px;
                height: 50px;
                .property-sel{
                    border: 1px solid #f0222f;
                    color: #f0222f;
                }
                .property-no{
                    border: 1px solid #999;
                }
                .valueName{
                    display: inline-block;
                    padding: 10px;
                    box-sizing: border-box;
                    border-radius: 50px;
                    min-width: 100px;
                    text-align: center;
                }
            }
        }
        .ul_box{
            height: 90%;
            overflow-y: scroll;
            &::-webkit-scrollbar{
                background-color:transparent;
            }
        }
        .propertyAffirm{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 50px;
            color: #fff;
            font-size: 18px;
            text-align: center;
            line-height: 50px;
            background: #f0222f;
        }
        .clearfix{
            padding-bottom: 50px;
            box-sizing: border-box;
        }
    }
</style>