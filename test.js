function oneUnit(){
  let add = function(x,y){return x + y};  
  let multiply = function(x,y){return x * y}; 
  // 结合律 (assosiative)
  // add(add(x,y),z) == add(x,add(y,z));
  
  // 交换律 (commutative)
  // add(x,y) == add(y,x)
  
  // 同一律 (identity)
  // add(x,0) == x;
  
  // 分配率
  // multiply(x,add(y,z)) = add(multiply(x,y),multiply(x,z))
}

function twoUnit(){
// 例子
  // 这行 
  return ajaxCall(function(json){
    return callback(json)
  })
  
  // 等价于这行
  return ajaxCall(callback)
  
  // 那么
 var getServerStuff = function(callback){
   return ajaxCall(callback);
 }
  
  // 就等于
  var getServerStuff = ajaxCall; // 没有括号 

// 控制器例子
  var BlogController = (function() {
    var index = function(posts) {  // 首页控制
      return Views.index(posts);
    };

    var show = function(post) {   // 页面显示控制
      return Views.show(post);
    };

    var create = function(attrs) {  // 数据创建
      return Db.create(attrs);
    };

    var update = function(post, attrs) {  // 数据更新
      return Db.update(post, attrs);
    };

    var destroy = function(post) {  // 数据 
      return Db.destroy(post);
    };

    return {index: index, show: show, create: create, update: update, destroy: destroy};
  })();
  
  // 修改后
  var BlogController = {index: Views.index, show: Views.show, create: Db.create, update: Db.update, destroy: Db.destroy};
}
function tressUnit(){
  // 纯函数是相同的输出永远会得到相同的输出，而且没有任何可观察的副作用
  
// 追求纯的理由
   // 可缓存性
    //简单实现
      var memoize= function(f){
        var cache = {};
        
        return function(){
          var arg_str = JSON.stringify(arguments);
          cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
          return cache[arg_str];
        }
      }
    // 可以通过延迟执行的方式把不纯的函数转换为纯函数
    var pureHttpCall = memoize(function(url, params){
      return function() { return $.getJSON(url, params); }
    });
  // 可移植性 / 自文档化
    // 纯函数的依赖很明确，因此更易于观察和理解
      // 不纯的
      var signUp = function(attrs) {
      var user = saveUser(attrs);
      welcomeUser(user);
      };

      var saveUser = function(attrs) {
        var user = Db.save(attrs);
        //...
      };

      var welcomeUser = function(user) {
        //Email(user, ...);
        //...
      };

      // 纯的
      var signUp = function(Db, Email, attrs) {
      return function() {
        var user = saveUser(Db, attrs);
        welcomeUser(Email, user);
      };
      };

      var saveUser = function(Db, attrs) {
      //  ...
      };

      var welcomeUser = function(Email, user) {
      //  ...
      };
  // 可测试性
    // 
  // 合理性
    // 引用透明性
      // 如果一段代码可以替换成它执行所得的结果，而且是在不改变整个程序行为的前提下替换的，那么我们就说这段代码是引用透明的
  // 并行代码
    // 可以并行运行任意纯函数。因为纯函数根本不需要访问共享的内存，而且根据其定义，纯函数也不会因副作用而进入竞争态（race condition）
}

function fourUnit(){
// 柯里化(curry)
  // 传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数 
  // 
  // 例子
    var add = function(x) {
      return function(y) {
        return x + y;
      };
    };

    var increment = add(1);
    var addTen = add(10);

    increment(2);
    // 3

    addTen(2);
    // 12
  // 创建 curry 函数例子 
  var curry = require('lodash').curry;
  
  
}