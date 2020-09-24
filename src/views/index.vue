<template>
  <div>
      <ul>
          <li v-for="(item,index) in list" :key='index' ref='text'>
              <div :class="defaultArr[index] == 1 && show ? 'active' : '' ">
                <span>{{ item }}</span>
                <!-- <span class="box"></span> -->
              </div>
                <span v-show="defaultArr[index] == 1" style="color: red;" class="btn" @click="active">{{ show ? '展开' : '收起'}}</span>
          </li>
          
      </ul>
  </div>
</template>

<script>
export default {
    data(){
        return {
            list: [
                '9月16日0时至24时，云南省无新增本地确诊病例和无症状感染者，新增境外航空输入确诊病例1例（中国籍、印度尼西亚输入至指定隔离点集中隔离观察印度尼西亚输入至',
                '女，22岁，学生，中国籍。9月12日从雅加达乘机自昆明机场入境，入境时体温正常，海关采样后按闭环管理要求由专车直接转送至指定隔离点集中隔离观察。13日，血清抗体检测结果阳性，即用负压救护车转送至定点医院隔离观察。16日采样复查，血清抗体检测结果阳性，专家根据流行病学史、实验室检测结果及临床表现诊断为新冠肺炎确诊病例（普通型、印度尼西亚输入）'
            ],
            defaultHeight: 65,
            defaultArr: [],
            show: true
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            this.$nextTick(()=>{
                console.log(this.$refs.text,'ref')
                let refInfo = this.$refs.text;
                let defaultArr = [];
                refInfo.forEach((i)=>{
                    if(i.clientHeight > this.defaultHeight){
                        defaultArr.push(1)
                        let span = document.createElement('span')
                        span.className = 'box'
                        i.firstChild.appendChild(span)
                    }else{
                        defaultArr.push(0)
                    }
                })
                this.defaultArr = defaultArr;
                console.log(defaultArr)
            })
        },
        active(){
            this.show = !this.show
        }
    }
}
</script>

<style lang='scss' scoped>
    ul{
        padding: 20px;
        box-sizing: border-box;
        font-size: 15px;
        li{
            position: relative;
        }
        .active{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }
    }
    .btn{
        position: absolute;
        right: 0;
        bottom: 0;
        padding-left: 20px;
        box-sizing: border-box;
        background: #fff;
    }
    .box{
        width: 60px;
        height: 1px;
        display: inline-block;
    }
</style>



