let path=require('path');
const express=require('express');

const publicPath=path.join(__dirname,'../public');
let app=express();
var port=process.env.PORT||3000;
app.use(express.static(publicPath));
app.get('/',(req,res)=>{
  res.send('hello');
})
app.listen(port,()=>{
  console.log('Hey! we are active on Port 3000');
})
