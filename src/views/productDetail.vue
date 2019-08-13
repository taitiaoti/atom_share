<template>
    <div class="product-detail-wrapper">
        <!-- <div class="p-loading-wrapper">
            <div class="p-loading">
                <van-loading  size='100'/>
            </div>
        </div> -->
        <div class="swipe-area">
            <van-swipe>
                <van-swipe-item v-for="(image, index) in detail.images" :key="index">
                    <img v-lazy="image" width="100%"  @click="swipeImgClick()"/>
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="product-intro">
            <h2 class="product-name">{{detail.productName}}</h2>
            <div class="price-wrapper">
                <div class="price-left">
                    <img class="logo-icon" :src="logoIcon" alt="">
                    <span class="price">￥{{detail.price}}</span>
                </div>
                <div class="price-right">
                    <van-rate v-model.number="detail.comprehensive" :readonly="true"  color="#f67a00" void-color="#d9dcdf" :size="14"/>
                </div>
            </div>
            <div class="jd-price-wrapper">
                <div class="jd-left">
                    <div class="jd-text-price">
                        <span class="jd-price">￥{{detail.jdPrice}}</span>
                    </div>
                    <div class="jump-jd" @click="jumpJdDetail(detail.jdUrl)" v-if="detail.type == '3'">
                        <span class="jump-text">京东链接</span>
                        <img class="arrow-icon" src="../assets/arrow-right-icon.png" alt="">
                    </div>
                </div>
                <span class="jd-right">已售{{detail.spu}}件</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="description-wrapper" ref="descwrapper">
            <div class="title" ref="title">
                <span class="title-text"> {{detail.description ? '图文详情' : '暂无商品详情~'}}</span>
            </div>
            <div class="description clearfix" ref="desc" v-html="detail.description">
            </div>
        </div>
        <div class="jump-download">
            <div class="download-btn" :style="btnbg" @click="jumpDownload(detail.url)">
                <img class="download-icon" src="../assets/download-icon.png" alt="">
                <span class="text">点击下载APP，享受更多福利</span>
            </div>
        </div>
    </div>
</template>
<script>
    import { ImagePreview } from 'vant';
    import { fetchProductDetail } from '@/api/product'
    import { bcdiv } from '@/utils/util'
    export default {
        data() {
            return {
                detail: {},
                btnbg: {
                    backgroundImage: "url(" + require("../assets/btn-bg.png") + ")",
                    backgroundSize: "100% 100%",
                },
                baseUrl:"http://qiniu.edawtech.com/",
                logoIcon: ''
            }
        },
        created(){
            let productNo = this.getQueryString('productNo');
            let appId = this.getQueryString('appId');
            let uid = this.getQueryString('uid');
            // let uid = '921948';
            // let productNo = '201810032037024650';
            // let appId = 'dudu';
            this.filterIcon(appId);
            this.getDetail(productNo,appId,uid);
        },
        methods: {
            async getDetail(productNo, appId, uid){
                let postData = {
                    appId: appId,
                    uid: uid
                }
                const res = await fetchProductDetail(productNo,postData);
                console.log(res)
                if(res.data.data.images[0].indexOf('http') == -1){
                    let tempArr = [];
                    res.data.data.images.forEach(item => {
                        if(item.indexOf('http') == -1){
                            tempArr.push(this.baseUrl + item);
                        }
                    });
                    res.data.data.images = tempArr;
                }
                res.data.data.comprehensive = this.convertNumber(res.data.data.comprehensive)
                this.detail = res.data.data;
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.getHeight();
                    },500)
                });
                // this.$nextTick(() => {
                //     if(this.detail.type == 3){
                //         this.$refs.desc.style.transformOrigin="0px 0px 0px";
                //         let rate = bcdiv((document.body.clientWidth * 0.5), 320, 6)
                //         this.$refs.desc.style.transform="scale("+rate+")"; 
                //         console.log(rate,'rate');
                //         console.log(this.$refs.desc.clientHeight,'this.$refs.desc.clientHeight');
                //         console.log(this.$refs.title.clientHeight,'this.$refs.title.clientHeight');
                //         let descHeight = this.$refs.desc.clientHeight;
                //         let titleHeight = this.$refs.title.clientHeight;
                //         this.$refs.descwrapper.style.height = (descHeight*rate+titleHeight)+'px';
                //     }

                // });
            },
            getHeight(rate){
                this.$nextTick(() => {
                    if(this.detail.type == 3){
                        this.$refs.desc.style.transformOrigin="0px 0px 0px";
                        let rate = bcdiv((document.body.clientWidth * 0.5), 320, 6)
                        this.$refs.desc.style.transform="scale("+rate+")"; 
                        let descHeight = this.$refs.desc.clientHeight;
                        let titleHeight = this.$refs.title.clientHeight;
                        this.$refs.descwrapper.style.height = (descHeight*rate+titleHeight)+'px';
                        console.log(descHeight);
                        if(descHeight <= 500){ //没获取到高度时重新执行
                            setTimeout(() => {
                                this.getHeight();
                            },1000)
                        }
                    }
                });
            },
            swipeImgClick(){
                ImagePreview({
                    images: this.detail.images
                })
            },
            getQueryString(name){
                var reg =new RegExp('(^|&)'+name+'=([^&]*)(&|$)','i');
                var r = window.location.search.substr(1).match(reg);
                if(r !=null){
                    return unescape(r[2]);
                }
                return null;
            },
            convertNumber(val){
                return Number(val)
            },
            filterIcon(val){
                let iconMap = {
                    'jytx': require('../assets/jy-icon.png'),
                    'dudu': require('../assets/logo-icon.png'),
                    'dingdang': require('../assets/dingdang-icon.png')
                }
                this.logoIcon = iconMap[val];
            },
            jumpJdDetail(url){
                window.open(url);
            },
            jumpDownload(url){
                window.open(url);

            }
        }
    }
</script>
<style lang="scss">
    p,h2{
        margin: 0;
    }
    img{
        vertical-align:bottom;
    }
    .van-swipe__indicators{
        bottom: 20px;
        .van-swipe__indicator{
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin: 0 6px;
        }
        .van-swipe__indicator--active{
            background-color: #1086ff;
        }
    }
    .product-detail-wrapper{    
        padding-bottom: 143px;
        .swipe-area{
            background-color: #f3f7fb;
        }
        .product-intro{
            padding: 40px 28px 40px 28px;
            background-color: #fff;
            .product-name{
                font-size: 32px;
                color: #333;
                text-align: left;
                line-height: 50px;
                margin-bottom: 10px;
            }
            .price-wrapper{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .price-left{
                    .logo-icon{
                        width: 76px;
                        height: 32px;
                        vertical-align: baseline;
                    }
                    .price{
                        font-size: 40px;
                        font-weight: bold;
                        color: #f0222f;
                    }
                }
                .price-right{
                    display: flex;
                    align-items: center;
                }
            }
            .jd-price-wrapper{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top:12px;
                .jd-left{
                    display: flex;
                    align-items: center;
                    .jd-text-price{
                        display: inline-block;
                        width: 175px;
                        text-align: right;
                        // .jd-text{
                        //     font-size: 30px;
                        //     color: #82868b;
                        // }
                        .jd-price{
                            font-size: 32px;
                            color: #96989b;
                            text-decoration:line-through;
                        }
                    }
                    .jump-jd{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 26px;
                        border: 1Px solid #c0dfff;
                        background-color: #e8f3ff;
                        margin-left: 26px;
                        padding: 5px 20px;
                        .jump-text{
                            font-size: 22px;
                            color: #1086ff;
                        }
                        .arrow-icon{
                            width: 8px;
                            height: 14px;
                            margin-left: 10px;
                        }
                    }
                }
                .jd-right{
                    font-size: 28px;
                    color: #82868b;
                    margin-bottom: 2px;
                }
            }
        }
        .line{
            width: 100%;
            height: 18px;
            background-color: #f0f3fa;
        }
        .description-wrapper{
            width: 100%;
            height: auto;
            overflow: hidden;
            .title{
                width: 100%;
                height: 78px;
                line-height: 78px;
                background-color: #fff;
                text-align: center;
                .title-text{
                    font-size: 34px;
                    color: #6a6b6d;
                }
            }
            .description{
                // font-size: 24px; 
                // line-height: 2;
                width: 100%;
            }
            .clearfix:after {
                content: '.';
                height: 0;
                display: block;
                clear: both;
            }
        }
        .jump-download{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 142px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            border-top: 1Px solid #e4e6f0;
            z-index: 998;
            .download-btn{
                width: 574px;
                height: 86px;
                display: flex;
                justify-content: center;
                align-items: center;
                .download-icon{
                    width: 40px;
                    height: 34px;
                    margin-right: 20px;
                }
                .text{
                    font-size: 32px;
                    color: #fff;
                }
            }
        }
        .p-loading-wrapper{
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 999;
            background: rgba(0,0,0,.4);
        }
    }
    .van-toast--default{
        width: 300px;
        .van-toast__text{
            font-size: 30px;
        }
    }
    #nprogress .bar{
        height: 6px;
    }
</style>

