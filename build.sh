#!/bin/bash
set -e

function clean
{
    # 部署用的全套代码以及node层的依赖
    echo "Clean up..."
    rm -rf output

    # 探针编译代码
    rm -rf packages/boomerang/node_modules
    rm -rf packages/boomerang/build

    # 控制台编译代码
    rm -rf packages/pconsole/node_modules
    rm -rf packages/pconsole/dist/build

    echo "Clean up successfully!"
}

function output
{
    echo "Create output directory."
    mkdir -p output

    to_folder='packages/pconsole/dist/build/assets/js/boomerang'
    # 复制探针编译代码至控制台代码
    echo "Combine compiled files."
    if [ ! -d ${to_folder} ];then
        echo "Folder not exists create new one."
        mkdir ${to_folder}
    else
        echo "Folder exists skip this step."
    fi
    cp -r packages/boomerang/build/* ${to_folder}
    cp -r packages/pconsole/dist/build/assets/js/boomerang/plugins/* ${to_folder}

    # 复制bin至output
    echo "Copy bin to output folder."
    cp -r bin output

    # 复制控制台编译代码(不包含node_modules)、bin至output
    echo "Copy files to output."
    cp -r packages/pconsole/dist/build/* output
    rm output/config.js
    cp -r packages/pconsole/package* output
    cp -r packages/pconsole/pm2.config.json output

    # 安装依赖
    echo "Downloading server node_modules."
    cd output
    npm install

    # 执行权限
    echo "Set priority to bin."
    chmod +x bin/control
}

function build
{
    # 安装依赖
    echo "Start to build pconsole."
    cd packages/pconsole/
    # mv ./src/config_prd.js ./src/config.js
    mv ./src/view/template_${1}.html ./src/view/template.html
    npm install
    npm run build

    echo "Start to build boomerang."
    cd ..
    cd boomerang/
    npm install
    npm run build
    cd ../../
}

function main
{
    clean
    build $@
    output $@
}

main $@
