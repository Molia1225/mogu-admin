export default {
  // 格式化日期
  formatDate: function (date, pattern) {
    if(!date){
      return ''
    }
    if (!pattern) {
      pattern = 'YYYY-MM-DD hh:mm:ss';
    }
    let d = new Date(date),
      str = pattern,
      types = ['YYYY', 'MM', 'DD', 'hh', 'mm', 'ss'],
      dates = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];

    for (let i = 0; i < types.length; i++) {
      str = str.replace(types[i], (dates[i] < 10 ? ('0' + dates[i]) : dates[i]));
    }
    return str;
  },

  refreshVerifyCode (server) {
    return `/${server}/authImage?r=${new Date().getTime()}`
  },
  /*上传cdn的图片地址封装*/
  getCdnImg(result){
      return 'https://r.moguyun.com/'+result;
  }
}
