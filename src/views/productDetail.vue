<template>
    <div class="product-detail-wrapper">
        <!-- <div class="p-loading-wrapper">
            <div class="p-loading">
                <van-loading  size='100'/>
            </div>
        </div> -->
        <div class="swipe-area van-hairline--bottom">
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
            <div class="van-hairline--bottom" v-if="detail.isRefueling == 'n'"></div>
        </div>
        <!-- 加油商品 -->
        <div v-if="detail.isRefueling == 'y'" class="refueLing">嘟嘟加油</div>
        <!-- 普通商品 -->
        <div class="product-intro" v-else>
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
                        <span class="jd-logo">嘟嘟价:</span>
                        <span class="jd-price">￥ {{detail.jdPrice}}</span>
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
            <div :class="detail.isRefueling == 'n' ? 'download-btn' : 'download-btn gasBg' " :style="detail.isRefueling == 'n' ? btnbg : ''" @click="jumpDownload(detail.url)">
                <img class="download-icon" src="../assets/download-icon.png" alt="">
                <span class="text">{{ detail.isRefueling == 'n' ? '点击下载APP，享受更多福利' : '点击下载APP，享受加油优惠' }}</span>
            </div> 
        </div>
    
    </div>

</template>
<script>
    import { ImagePreview } from 'vant';
    import { fetchProductDetail,updateImg } from '@/api/product'
    import { bcdiv,getQueryString } from '@/utils/util'
    export default {
        data() {
            return {
                detail: {},
                btnbg: {
                    backgroundImage: "url(" + require("../assets/btn-bg.png") + ")",
                    backgroundSize: "100% 100%",
                },
                baseUrl:"http://qiniu.edawtech.com/",
                downloadBtn: 'download-btn',
                logoIcon: require('../assets/vip.png'),
                imgsrcsrc: '',
                autoplay: 0,
                screeHeight: 0
            }
        },
        // http://192.168.0.35:8080/?uid=922789&appId=dudu&productNo=202005081025501898#/
        created(){
            let productNo = getQueryString('productNo');
            let appId = getQueryString('appId');
            let uid = getQueryString('uid');
            // let productNo = '201810032037024650';
            let screeHeight = document.documentElement.clientHeight || document.body.clientHeight;;     // 屏幕高
            this.screeHeight = screeHeight;
            // let uid = '922789';
            // let productNo = '202003302142238411';
            // let appId = 'dudu';
            // this.filterIcon(appId);
            this.getDetail(productNo,appId,uid);
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
            async getDetail(productNo, appId, uid){
                let postData = {
                    appId: appId,
                    uid: uid
                }
                const res = await fetchProductDetail(productNo,postData);
                console.log(res.data.data)
                let productDetail = res.data.data;
                if(res.data.data.images[0] && res.data.data.images[0].indexOf('http') == -1){
                    let tempArr = [];
                    res.data.data.images.forEach(item => {
                        if(item.indexOf('http') == -1){
                            tempArr.push(this.baseUrl + item);
                        }
                    });
                    res.data.data.images = tempArr;
                }
                if(productDetail.videos && productDetail.videos.length > 0){
                    this.autoplay = 0
                }else{
                    this.autoplay = 3000
                }
                res.data.data.comprehensive = this.convertNumber(res.data.data.comprehensive)
                let description = this.iframe(res.data.data.description);
                res.data.data.description = description;
                document.title = res.data.data.isRefueling == 'y' ? '嘟嘟加油' : '商品详情';
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
                    // if(this.detail.type == 3){
                    //     this.$refs.desc.style.transformOrigin="0px 0px 0px";
                    //     let rate = bcdiv((document.body.clientWidth * 0.5), 320, 6)
                    //     this.$refs.desc.style.transform="scale("+rate+")"; 
                    //     let descHeight = this.$refs.desc.clientHeight;
                    //     let titleHeight = this.$refs.title.clientHeight;
                    //     this.$refs.descwrapper.style.height = (descHeight*rate+titleHeight)+'px';
                    //     console.log(descHeight,'ds');
                    //     if(descHeight <= 500){ //没获取到高度时重新执行
                    //         setTimeout(() => {
                    //             this.getHeight();
                    //         },1000)
                    //     }
                    // }
                });
            },

            iframe(html){
                let description = html.replace(/iframe/g,'video');
                return description;
            },

            swipeImgClick(){
                ImagePreview({
                    images: this.detail.images
                })
            },
            convertNumber(val){
                return Number(val)
            },
            // filterIcon(val){
            //     let iconMap = {
            //         'jytx': require('../assets/jy-icon.png'),
            //         'dudu': require('../assets/logo-icon.png'),
            //         'dingdang': require('../assets/dingdang-icon.png')
            //     }
            //     // this.logoIcon = iconMap[val];
            // },
            jumpJdDetail(url){
                window.open(url);
            },
            jumpDownload(url){
                window.open(url);

            }
        }
    }
</script>
<style lang="scss" scoped>
    .productImage{
        // height: 600px;
    }
    p,h2{
        margin: 0;
    }
    img{
        vertical-align:middle;
    }
    .van-swipe__indicators{
        bottom: 10px;
        .van-swipe__indicator{
            width: 6px;
            height: 6x;
            border-radius: 50%;
            margin: 0 3px;
        }
        .van-swipe__indicator--active{
            background-color: #1086ff;
        }
    }
    .product-detail-wrapper{    
        padding-bottom: 71px;
        .swipe-area{
            background-color: #f3f7fb;
        }
        .product-intro{
            padding: 20px 14px 20px 14px;
            background-color: #fff;
            .product-name{
                font-size: 16px;
                color: #333;
                text-align: left;
                line-height: 25px;
                margin-bottom: 10px;
            }
            .price-wrapper{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .price-left{
                    display: flex;
                    align-items: center;
                    .logo-icon{
                        width: 43px;
                        height: 16px;
                        margin-right: 5px;
                        vertical-align: baseline;
                    }
                    .price{
                        font-size: 20px;
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
                margin-top:6px;
                .jd-left{
                    display: flex;
                    align-items: center;
                    .jd-text-price{
                        display: inline-block;
                        // width: 175px;
                        // text-align: right;
                        // .jd-text{
                        //     font-size: 30px;
                        //     color: #82868b;
                        // }
                        .jd-logo{
                            display: inline-block;
                            width: 48px;
                            // height: 16px;
                            font-size: 14px;
                            color:#82868b;
                        }
                        .jd-price{
                            font-size: 16px;
                            color: #96989b;
                            // text-decoration:line-through;
                        }
                    }
                    .jump-jd{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 13px;
                        border: 1Px solid #c0dfff;
                        background-color: #e8f3ff;
                        margin-left: 13px;
                        padding: 5px 10px;
                        .jump-text{
                            font-size: 12px;
                            color: #1086ff;
                        }
                        .arrow-icon{
                            width: 4px;
                            height: 7px;
                            margin-left: 5px;
                        }
                    }
                }
                .jd-right{
                    font-size: 14px;
                    color: #82868b;
                    margin-bottom: 2px;
                }
            }
        }
        .line{
            width: 100%;
            height: 9px;
            background-color: #f0f3fa;
        }
        .description-wrapper{
            width: 100%;
            height: auto;
            overflow: hidden;
            .title{
                width: 100%;
                height: 39px;
                line-height: 39px;
                background-color: #fff;
                text-align: center;
                .title-text{
                    font-size: 17px;
                    color: #6a6b6d;
                }
            }
            .description{
                // font-size: 24px; 
                // line-height: 2;
                width: 100%;
                .ssd-module-mobile-wrap{
                    width: 100%;
                }
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
            height: 71px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            border-top: 1Px solid #e4e6f0;
            z-index: 998;
            .gasBg{
                background: linear-gradient(270deg,rgba(241,106,3,1) 0%,rgba(246,190,7,1) 100%);
                border-radius:50px;
            }
            .download-btn{
                width: 287px;
                height: 43px;
                display: flex;
                justify-content: center;
                align-items: center;
                .download-icon{
                    width: 20px;
                    height: 17px;
                    margin-right: 10px;
                }
                .text{
                    font-size: 16px;
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
        width: 150px;
        .van-toast__text{
            font-size: 15px;
        }
    }
    #nprogress .bar{
        height: 3px;
    }
    .ql-video{
        // height: 800px;
    }
    .refueLing{
        width: 100%;
        height: 49px;
        line-height: 49px;
        background: #fff;
        color: #222;
        font-size: 16px;
        padding: 0 15px;
        box-sizing: border-box;
        border-radius: 0 0 10px 10px;
        text-align: left;
    }
</style>

