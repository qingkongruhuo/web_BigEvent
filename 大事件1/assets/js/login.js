$(function() {
  // 点击“去注册账号”的链接，登录界面消失，注册界面显示
  $('#link_reg').on('click', function() {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击“去登录”的链接，注册界面消失，登录界面显示
  $('#link_login').on('click', function() {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 从 layui 中获取 form 对象，和jquery类似，只要导入了layui.js，就能用layui这个对象获取元素。
  var form = layui.form
  var layer = layui.layer
  // 通过 form.verify() 函数自定义校验规则，layui提供的。
  form.verify({
    // 自定义了一个叫做 pwd 校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function(value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function(e) {
    // 1. 阻止默认的提交行为
    e.preventDefault()
    // 2. 发起Ajax的POST请求
    var data = {
      //获取表单用户输入的值。
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    }
    $.post('/api/reguser', data, function(res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      // layui提供的layer弹出消息
      layer.msg('注册成功，请登录！')
      // 模拟人的点击行为，即转到登录界面。
      $('#link_login').click()
    })
  })

  // 监听登录表单的提交事件，监听submit事件，用onclick事件完全可以
  $('#form_login').submit(function(e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中，因为api接口文档告诉我们要用这个作为身份认证信息
        // 身份认证信息放在请求行里（后面说）
//localStorage 和 sessionStorage 属性允许在浏览器中存储 key/value 对的数据。
//localStorage 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去删除。
//localStorage 属性是只读的。
// 提示: 如果你只想将数据保存在当前会话中，可以使用 sessionStorage 属性， 该数据对象临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。
        localStorage.setItem('token', res.token)
        // 跳转到后台主页,Location 对象包含有关当前 URL 的信息。通过location对象设置链接跳转页面 
        location.href = './index.html'
      }
    })
  })
})
