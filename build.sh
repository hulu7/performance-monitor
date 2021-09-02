#!/bin/bash
set -e

function clean
{
    # 部署用的全套代码以及node层的依赖
    echo "--------------------------------------------"
    echo "                  Clean up...               "
    echo "--------------------------------------------"
    rm -rf output

    # 探针编译代码
    rm -rf packages/boomerang/build

    # 控制台编译代码
    rm -rf packages/pconsole/dist/build

    echo "--------------------------------------------"
    echo "            Clean up successfully!          "
    echo "--------------------------------------------"
}

function output
{
    echo "--------------------------------------------"
    echo "            Create output directory.        "
    echo "--------------------------------------------"
    mkdir -p output

    # 复制探针编译代码至控制台代码
    echo "--------------------------------------------"
    echo "             Combine compiled files.        "
    echo "--------------------------------------------"
    cp -r packages/boomerang/build/* packages/pconsole/dist/build/assets/js/boomerang
    cp -r packages/pconsole/dist/build/assets/js/boomerang/plugins/* packages/pconsole/dist/build/assets/js/boomerang

    # 复制bin至output
    echo "--------------------------------------------"
    echo "          Copy bin to output folder.        "
    echo "--------------------------------------------"
    cp -r bin output

    # 复制控制台编译代码(不包含node_modules)、bin至output
    echo "--------------------------------------------"
    echo "              Copy files to output.         "
    echo "--------------------------------------------"
    cp -r packages/pconsole/dist/build/* output
    cp -r packages/pconsole/package* output

    # 安装依赖
    echo "--------------------------------------------"
    echo "        Downloading server node_modules.    "
    echo "--------------------------------------------"
    yarn --cwd output --production

    # 执行权限
    echo "--------------------------------------------"
    echo "               Set priority to bin.         "
    echo "--------------------------------------------"
    chmod +x output/bin/control
}

function build
{
    # 安装依赖
    echo "--------------------------------------------"
    echo "               Start to build.              "
    echo "--------------------------------------------"
    npm install
    npm run reinstall
    npm run build
}

function main
{
    clean
    build $@
    output $@
}

main $@
