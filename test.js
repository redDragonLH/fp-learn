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
  
}