#!/bin/bash
echo "start node"
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64/

git fetch origin master
git reset --hard FETCH_HEAD
git clean -df

cd front
node -v
npm -v
npm install
npm run build
if [ $? != 0 ]; then #【終了コード】0：成功、1：失敗
    $CODEBUILD_BUILD_SUCCEEDING = 0 #【ビルドステータス】0：失敗、1：成功
    echo "front build error"
    exit 1
fi
cd ..

echo "copy assets"
pwd
mkdir src/main/resources/static
cp -r front/public/dl/* src/main/resources/static/
ls src/main/resources/static/

echo "start maven"
echo $JAVA_HOME
mvn clean package

if [ $? != 0 ]; then #【終了コード】0：成功、1：失敗
    $CODEBUILD_BUILD_SUCCEEDING = 0 #【ビルドステータス】0：失敗、1：成功
    echo "back build error"
    exit 1
fi
mvn install
if [ $? != 0 ]; then #【終了コード】0：成功、1：失敗
    $CODEBUILD_BUILD_SUCCEEDING = 0 #【ビルドステータス】0：失敗、1：成功
    echo "back build error"
    exit 1
fi
cp ./target/jisedigi-back-0.1.jar ./
cp -r ./target/lib ./lib
echo Build completed on `date`
