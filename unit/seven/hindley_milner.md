# Hindley-Milner 类型签名

## 类型签名
`类型签名算是一种表达式，表达出这个函数做了什么，接收那种类型的参数，返回什么类型的数据`

**能暴露函数的行为和目的**

    //  capitalize :: String -> String
    var capitalize = function(s){
      return toUpperCase(head(s)) + toLowerCase(tail(s));
    }

    capitalize("smurf");
    //=> "Smurf"

在 Hindley-Milner 系统中，函数都写成类似 a -> b 这个样子，其中 a 和b 是任意类型的变量。因此，capitalize 函数的类型签名可以理解为“一个接受 String 返回 String 的函数”。换句话说，它接受一个 String 类型作为输入，并返回一个 String 类型的输出。

    //  strLength :: String -> Number
    var strLength = function(s){
      return s.length;
    }

strLength 和 capitalize 类似：接受一个 String 然后返回一个 Number。

    //  match :: Regex -> String -> [String]
    var match = curry(function(reg, s){
    return s.match(reg);
    });

它接受一个 Regex 和一个 String，返回一个 [String]

match 新分组例子：

    //  match :: Regex -> (String -> [String])
    var match = curry(function(reg, s){
      return s.match(reg);
    });

可以看出 match 这个函数接受一个 Regex 作为参数，返回一个从 String 到 [String] 的函数。因为 curry，造成的结果就是这样：给 match 函数一个 Regex，得到一个新函数，能够处理其 String 参数

    //  match :: Regex -> (String -> [String])

    //  onHoliday :: String -> [String]
    var onHoliday = match(/holiday/ig);

每传一个参数，就会弹出类型签名最前面的那个类型。所以 onHoliday 就是已经有了 Regex 参数的 match。

    //  replace :: Regex -> (String -> (String -> String))
    var replace = curry(function(reg, sub, s){
      return s.replace(reg, sub);
    });
    
但是在这段代码中，就像你看到的那样，为 replace 加上这么多括号未免有些多余。所以这里的括号是完全可以省略的，如果我们愿意，可以一次性把所有的参数都传进来；所以，一种更简单的思路是：replace 接受三个参数，分别是 Regex、String 和另一个 String，返回的还是一个 String。


    //  id :: a -> a
    var id = function(x){ return x; }

    //  map :: (a -> b) -> [a] -> [b]
    var map = curry(function(f, xs){
      return xs.map(f);
    });

给定一个从 a 到 b 的函数和一个 a 类型的数组作为参数，它就能返回一个 b 类型的数组

