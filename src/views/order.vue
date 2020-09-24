<template>
  <div class="order">
      <div class="addressBox" @click="addressView">
          <div class="add" v-show="address">
              <van-icon name="add-o" size='20' color='#333'/>
              <span class="addText">添加收货地址</span>
          </div>
          <div v-show="!address" class="addressInfo">
              <van-icon name="location" size='20' color='#333'/>
              <ul>
                  <li class="name">
                      <span class="name_name">{{ addressInfo ? addressInfo.name : '' }}</span>
                      <span>{{ addressInfo ? addressInfo.phone : '' }}</span>
                  </li>
                  <li class="name_address">{{ addressInfo ? addressInfo.province + addressInfo.city + addressInfo.area + addressInfo.address : '' }}</li>
              </ul>
          </div>
      </div>
      <div class="zhanwei"></div>
      <div class="productInfo">
          <img v-lazy="baseUrl + productInfo.image" class="productImage" />
          <span>{{ productInfo.productName }}</span>
      </div>
      <div class="passwordInput">
          <span>领取码：</span>
          <input type="number" v-model="password" placeholder="请输入领取码"/>
      </div>
      <div class="affirmBox">
          <div class="affirmBtn" @click="affirm">确定提交</div>
      </div>
  </div>
</template>

<script>
import { addressPage,productPay } from '@/api/product';
export default {
    data(){
        return {
            payObj: null,
            productInfo: null,
            baseUrl:"http://qiniu.edawtech.com/",
            address: true,
            password: '',
            addressInfo: null
        }
    },
    created(){
        this.payObj = JSON.parse(window.localStorage.getItem('payObj'));
        this.productInfo = JSON.parse(window.localStorage.getItem('productInfo'));
        let addressInfo = JSON.parse(window.localStorage.getItem('addressInfo'));
        if(addressInfo){
            this.address = false;
            this.addressInfo = addressInfo;
            this.getAddressPage()
        }else{
            this.address = true;
        }
    },
    methods: {
        async getAddressPage(){
            let res = await addressPage();
            let pages = res.data.data.records;
            pages.forEach((i)=>{
                if(i.isDefault == 1){
                    this.payObj.deliveryId = i.id;
                    return;
                }
            })
        },
        addressView(){
            this.$router.push({path: '/address'})
        },
        // 提交
        affirm(){
            if(this.address){
                this.$toast('请填写收货信息');
                return
            }else if(!this.password){
                this.$toast('请填写领取码!');
                return
            }
            // 验证卡密
            this.passwordCode();
        },
        // 验证卡密
        async passwordCode(){
            this.payObj.products[0].productDesc += "==>" + this.password;
            // console.log(this.payObj,'=====',this.password)
            let res = await productPay(this.payObj);
            if(res.data.code == 0){
                this.$toast('提交成功，请等待客服人员审核!')
            }else{
                this.$toast(res.msg)
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    .addressBox{
        height: 100px;
        display: flex;
        align-items: center;
        padding: 15px;
        box-sizing: border-box;
        .add{
            display: inline-block;
            display: flex;
            align-items: center;
            .addText{
                margin-left: 10px;
            }
        }
        .addressInfo{
            display: flex;
            align-items: center;
            ul{
                margin-left: 15px;
                font-size: 15px;
                .name{
                    color: #333;
                    margin-bottom: 10px;
                    .name_name{
                        margin-right: 10px;
                    }
                }
                .name_address{
                    color: #666;
                }
            }
        }
    }
    .productInfo{
        display: flex;
        align-items: center;
        padding: 15px;
        box-sizing: border-box;
        font-size: 15px;
        color: #333;
        font-weight: bold;
        .productImage{
            width: 100px;
            height: 100px;
            margin-right: 10px;
        }
    }
    .zhanwei{
        height: 15px;
        background: #f4f4f4;
    }
    .passwordInput{
        padding: 15px;
        box-sizing: border-box;
        color: #666;
        font-size: 15px;
        background: #f4f4f4;
        input{
            height: 30px;
            width: 70%;
            padding-left: 10px;
            box-sizing: border-box;
            border: none;
            border-radius: 10px;
        }
    }
    .affirmBox{
        display: flex;
        justify-content: center;
        align-items: center;
        .affirmBtn{
            width: 320px;
            height: 40px;
            background: #f0222f;
            color: #fff;
            font-size: 15px;
            text-align: center;
            line-height: 40px;
            border-radius: 50px;
            margin-top: 100px;
        }
    }
</style>