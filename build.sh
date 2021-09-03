#!/bin/bash
set -e

function clean
{
    # 部署用的全套代码以及node层的依赖
    echo "Clean up..."
    rm -rf output

    # 探针编译代码
    rm -rf packages/boomerang/build

    # 控制台编译代码
    rm -rf packages/pconsole/dist/build

    echo "Clean up successfully!"
}

function output
{
    echo "Create output directory."
    mkdir -p output

    # 复制探针编译代码至控制台代码
    echo "Combine compiled files."
    cp -r packages/boomerang/build/* packages/pconsole/dist/build/assets/js/boomerang
    cp -r packages/pconsole/dist/build/assets/js/boomerang/plugins/* packages/pconsole/dist/build/assets/js/boomerang

    # 复制bin至output
    echo "Copy bin to output folder."
    cp -r bin output

    # 复制控制台编译代码(不包含node_modules)、bin至output
    echo "Copy files to output."
    cp -r packages/pconsole/dist/build/* output
    cp -r packages/pconsole/package* output

    # 安装依赖
    echo "Downloading server node_modules."
    yarn --cwd output --production

    # 执行权限
    echo "Set priority to bin."
    chmod +x output/bin/control
}

function build
{
    # 安装依赖
    echo "Start to build pconsole."
    cd packages/pconsole/
    npm install
    npm run build

    echo "Start to build boomerang."
    cd ..
    cd boomerang/
    npm install
    npm run build
}

function main
{
    clean
    build $@
    output $@
}

main $@
