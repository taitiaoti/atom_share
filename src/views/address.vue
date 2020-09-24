<template>
  <div>
        <van-cell-group>
            <van-field v-model="name" label="收货人" placeholder="请输入收货人"/>
        </van-cell-group>
        <van-cell-group>
            <van-field v-model="phone" label="联系电话" placeholder="请输入联系电话"/>
        </van-cell-group>
        <van-cell-group>
            <van-field v-model="province" label="省" placeholder="请输入省"/>
        </van-cell-group>
        <van-cell-group>
            <van-field v-model="city" label="市" placeholder="请输入市"/>
        </van-cell-group>
        <van-cell-group>
            <van-field v-model="area" label="区(县)" placeholder="请输入区(县)"/>
        </van-cell-group>
        <van-cell-group>
            <van-field v-model="address" label="详细地址" placeholder="请输入详细地址"/>
        </van-cell-group>
        <div class="footer">
            <div class="footerAffirm" @click="affirm">确定</div>
        </div>
  </div>
</template>

<script>
import { setAddress } from '@/api/product';
export default {
    data(){
        return {
            name: '',
            phone: '',
            province: '',
            city: '',
            area: '',
            address: ''
        }
    },
    methods: {
        async affirm(){
            let name = this.name,
                phone = this.phone,
                province = this.province,
                city = this.city,
                area = this.area,
                address = this.address;
            if(name && phone && province && city && area && address){
                let postData = {
                    appId: 'dudu',
                    uid: '922789',
                    name,
                    phone,
                    province,
                    city,
                    area,
                    address,
                    isDefault: 1
                }
                window.localStorage.setItem('addressInfo',JSON.stringify(postData));
                let res = await setAddress(postData);
                if(res.code == 0){
                    this.$router.go(-1)
                }else{
                    this.$toast(res.msg)
                }
            }else{
                this.$toast('请完善信息!')
            }
        }
    }
}
</script>

<style lang='scss'>
    .van-cell{
        height: 50px;
        font-size: 16px;
        .van-cell__title{
            // min-width: 20%;
            display: flex;
            justify-content: flex-end;
            // align-items: center;
            // margin-right: 20px;
        }
        .van-cell__value{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .footer{
        display: flex;
        justify-content: center;
        margin-top: 50px;
        .footerAffirm{
            width: 320px;
            height: 50px;
            border-radius: 50px;
            background: #f0222f;
            text-align: center;
            line-height: 50px;
            color: #fff;
        }
    }
</style>