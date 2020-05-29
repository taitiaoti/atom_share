function toDecimal2(x,ss) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + ss) {
      s += '0';
    }
    return s;
  }
  
  function bcFixed(num, s) {
    var times = Math.pow(10, s)
    var des = num * times + 0.5
    des = parseInt(des, 10) / times
    return toDecimal2(des,s)+'';
  }

  /**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 *
 * @param num1被除数 | num2除数
 */
export const bcdiv = (num1, num2,s) => {
    var baseNum1 = 0, baseNum2 = 0,ret;
    var baseNum3, baseNum4;
    try {
     baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
     baseNum1 = 0;
    }
    try {
     baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
     baseNum2 = 0;
    }
     baseNum3 = Number(num1.toString().replace(".", ""));
     baseNum4 = Number(num2.toString().replace(".", ""));
     ret=(baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
      return bcFixed(ret,s);
  };