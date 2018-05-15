# monad (洋葱)

IO等的 `of` 方法不是用来避免使用 `new` 关键字的，而是用来把值放到默认 *最小化上下文*(default minimal context) 中的