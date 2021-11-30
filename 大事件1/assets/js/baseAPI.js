// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  // options.url = 'http://ajax.frontend.itheima.net' + options.url
  options.url = 'http://www.liulongbin.top:3007' + options.url

  // 统一为有权限的接口（url里面有my的），设置 headers 请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 全局统一挂载 complete 回调函数
  /**
   * 实现手动输入index不登录进不去界面的功能：
   * ajax请求不论成功还是失败都会执行.complete()函数
   * 如果直接输入index是会进入页面的，就会发送ajax请求，但是请求头没带token
   * 所以一定会请求失败，这时执行complete函数，里面判断一下，如果
   * status===1，就是请求失败的，强制清空token，然后跳转到登录界面。
   * 
   *  
   */
  options.complete = function(res) {
    // console.log('执行了 complete 回调：')
    // console.log(res)
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1. 强制清空 token
      localStorage.removeItem('token')
      // 2. 强制跳转到登录页面
      location.href = '/Users/zhangyong/Desktop/11_qianduan_fight/html5/day15前后端交互/大事件/大事件1/login.html'
    }
  }
})
