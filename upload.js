// const  client  = require('scp2');
// console.log('正在上传到测试环境...')
// client.scp('dist', 'root:Mogu20190328tt@120.76.25.189:3721:/opt/www/kline-glory/manager-gold/', function (err) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log('文件上传完毕!\n')
//     }
// })

const fs = require('fs')
const path = require('path')
const compressing = require('compressing');
const  client  = require('scp2');
// 删除dist文件夹中的zip
function deleteFile(delPath, direct) {
  delPath = direct ? delPath : path.join(__dirname, delPath)
  try {
      /**
       * @des 判断文件或文件夹是否存在
       */
      if (fs.existsSync(delPath)) {
          fs.unlinkSync(delPath);
      } else {
          console.log('inexistence path：', delPath);
      }
  } catch (error) {
      console.log('del error', error);
  }
}


// 压缩dist
function compressingFile (){
  compressing.zip.compressDir('dist', 'dist.zip')
  .then(() => {
    console.log('压缩成功');
    copyFile('dist.zip', 'dist/dist.zip');
  })
  .catch(err => {
    console.error(err);
  });
}



// 复制dist.zip到dist文件夹
function copyFile(copiedPath, resultPath) {
    copiedPath = path.join(__dirname, copiedPath)
    resultPath = path.join(__dirname, resultPath)
    fs.copyFile(copiedPath,resultPath,function(err){
      if(err) {
        console.log('复制失败')
      }
      else {
        deleteFile('dist.zip');
        console.log('压缩及复制完成');
        uploadFile();
      }
    })
}

// 上传到服务器
function uploadFile(){
  console.log('正在上传到测试环境...')
  client.scp('dist', 'root:Mogu20190328tt@120.76.25.189:3721:/opt/www/kline-glory/manager-gold/', function (err) {
      if (err) {
        console.log(err)
      } else {
        deleteFile('dist/dist.zip');
        console.log('文件上传完毕!\n')
      }
  })
}

if(process.argv.length>2){
  deleteFile('dist/dist.zip');
  compressingFile();
} else {
  uploadFile()
}