#!/bin/bash
# 需要发布的目录
buildPath="dist"
port=22
server="root@101.43.166.60"
pk="E:/key/shilianrj.private"

# 线上发布路径
path="/data/wwwroot/qiankun"
# 线上的文件夹名
name="dist"

time=$(date "+%Y-%m-%d_%H:%M:%S")
cdir=$PWD

function deploy() {
  fileNewName=$name"-"$time".tar.gz"
  # cp $1 $cdir/$fileNewName
  tar -zcf $cdir/$fileNewName $buildPath
  #echo "zip ~/$fileNewName $buildPath -r"
  #zip ~/$fileNewName $buildPath -r

  execs "mkdir $path"
  execs "mkdir $path/$name"
  execs "tar -zcPf $path/$name.last.tar.gz $path/$name"
  send $cdir/$fileNewName $path
  execs "rm -rf $name"
  execs "tar -zxPf  $path/$fileNewName -C $path/"
  # execs "cp $path/$fileNewName $path/$name.latest.tar.gz"
  echo "finish"
  rm -f $cdir/$fileNewName
}

function rollback() {
  execs "rm -rf $name"
  execs "tar -zxPf  $path/$name.last.tar.gz -C $path/"

  # execs "ls -l $path"

  # read -p "please input the rollback file name:" fileName

  # if [ ! -n "$fileName" ]; then
  #   echo "you have not input flie name!"
  # else
  #   echo "the file name you input is $fileName"
  #   if [ ! ${fileName##*.}="zip" ]; then
  #     echo "the file type is wrong,please input zip file"
  #     fileName=""
  #   fi
  # fi

}

function send() {
  echo "send file $1 to $2"
  scp -P $port -i $pk $1 $server:$2
}
function execs() {
  echo "exec $1"
  ssh -i $pk -p$port $server $1
}

function main() {
  case $1 in
  r)
    rollback
    ;;
  *)
    deploy
    ;;
  esac
}
main $1
exit
