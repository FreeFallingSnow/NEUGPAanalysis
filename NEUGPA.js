// ==UserScript==
// @name         东北大学绩点小助手
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  计算加权绩点并显示在页面上的油猴脚本
// @author       FFSNOW
// @match        http://219.216.96.4/*
// @match        https://webvpn.neu.edu.cn/*
// @match        https://portal.neu.edu.cn/*
// @match        https://eone.neu.edu.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮
    let button = document.createElement('button');
    button.innerHTML = '绩点助手';
    // 设置按钮样式
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = 'rgba(16, 55, 112, 0.7)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.width = '55px'; // 按钮宽度与高度相等
    button.style.height = '55px'; // 按钮宽度与高度相等
    button.style.padding = '12px';
    button.style.fontSize = '10px';
    button.style.cursor = 'move';
    button.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
    // 按钮拖动函数
    function dragElement(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 按钮点击事件处理函数
    function buttonClickHandler() {
        let domain = window.location.hostname;
        if (domain === 'webvpn.neu.edu.cn') {
            window.open('https://webvpn.neu.edu.cn/http/62304135386136393339346365373340e2b0fd71d8941093ab4e2527/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR');
        } else {
            window.open('http://219.216.96.4/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR');
        }
    }

    // 右键菜单事件处理函数
    function buttonContextMenuHandler(event) {
        event.preventDefault();
        button.remove();
        floatingWindow.style.display = 'none';
    }

    // 创建悬浮窗
    let floatingWindow = document.createElement('div');
    floatingWindow.innerHTML = '点击进入，右键关闭，本插件作用为绩点计算，你可以输入新的一门课的学分和绩点预测绩点变化，你也可以进入绩点模拟功能随意修改绩点，进一步分析';
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.backgroundColor = 'white';
    floatingWindow.style.color = 'black';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.border = '1px solid black';
    floatingWindow.style.borderRadius = '5px';
    floatingWindow.style.bottom = '20px';
    floatingWindow.style.right = '80px';
    floatingWindow.style.display = 'none';
    // 将悬浮窗添加到页面上
    document.body.appendChild(floatingWindow);

    // 在按钮上绑定鼠标移入事件，显示悬浮窗口
    button.addEventListener('mouseover', function () {
        floatingWindow.style.display = 'block';
    });

    // 在按钮上绑定鼠标移出事件，隐藏悬浮窗口
    button.addEventListener('mouseout', function () {
        floatingWindow.style.display = 'none';
    });

    // 将按钮添加到页面上
    document.body.appendChild(button);

    // 将按钮设为可拖动
    dragElement(button);

    // 绑定按钮点击事件
    button.addEventListener('click', buttonClickHandler);

    // 绑定右键菜单事件
    button.addEventListener('contextmenu', buttonContextMenuHandler);




    //初始化筛选器
    function addFilter() {
        // 获取表格
        var table = document.querySelector('.gridtable');
        if (!table) {
            return;
        }

        // 创建筛选器输入框
        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '筛选学年学期';
        input.style.backgroundColor = 'white'; // 背景颜色
        input.style.border = '1px solid lightgray'; // 边框样式
        input.style.padding = '10px'; // 内边距
        input.addEventListener('input', function () {
            var filterValue = input.value.toLowerCase();
            var rows = table.querySelectorAll('tbody tr');

            // 遍历表格中的每一行，根据输入框的值进行筛选
            rows.forEach(function (row) {
                var cell = row.querySelector('td:first-child');
                var value = cell.textContent.toLowerCase();

                // 根据筛选值隐藏或显示行
                if (value.indexOf(filterValue) === -1) {
                    row.style.display = 'none';
                } else {
                    row.style.display = '';
                }
            });
        });
        return input;
    }

    // 插入筛选器输入框
    var tableHead = document.querySelector('.gridhead');
    var newRow = tableHead.insertRow(0);
    newRow.insertCell().appendChild(addFilter());
    //新科目绩点影响
    var creditInput = document.createElement('input');
    creditInput.type = 'text';
    creditInput.placeholder = '新课学分';
    creditInput.style.backgroundColor = 'white'; // 背景颜色
    creditInput.style.border = '1px solid lightgray'; // 边框样式
    creditInput.style.padding = '10px'; // 内边距
    newRow.insertCell().appendChild(creditInput);

    var gradeInput = document.createElement('input');
    gradeInput.type = 'text';
    gradeInput.placeholder = '预估绩点';
    gradeInput.style.backgroundColor = 'white';
    gradeInput.style.border = '1px solid lightgray';
    gradeInput.style.padding = '10px';
    newRow.insertCell().appendChild(gradeInput);

    var calculateButton = document.createElement('button');
    calculateButton.textContent = '筛选/预测计算';
    calculateButton.style.backgroundColor = 'white'; // 背景颜色
    calculateButton.style.color = 'black'; // 文字颜色
    calculateButton.style.width = '100%'; // 宽度设置为全宽
    calculateButton.style.padding = '10px'; // 内边距
    calculateButton.style.border = 'none'; // 去除边框
    calculateButton.style.cursor = 'pointer'; // 鼠标指针样式
    // 添加悬停样式
    calculateButton.addEventListener('mouseenter', function () {
        calculateButton.style.backgroundColor = 'lightgray';
    });

    calculateButton.addEventListener('mouseleave', function () {
        calculateButton.style.backgroundColor = 'white';
    });
    newRow.insertCell().appendChild(calculateButton);

    var resultCell = newRow.insertCell();
    resultCell.colSpan = 8;

    var editButton = document.createElement('button');
    editButton.textContent = '绩点模拟';
    editButton.style.backgroundColor = 'white'; // 背景颜色
    editButton.style.color = 'black'; // 文字颜色
    editButton.style.width = '100%'; // 宽度设置为全宽
    editButton.style.padding = '10px'; // 内边距
    editButton.style.border = 'none'; // 去除边框
    editButton.style.cursor = 'pointer'; // 鼠标指针样式
    // 添加悬停样式
    editButton.addEventListener('mouseenter', function () {
        editButton.style.backgroundColor = 'lightgray';
    });

    editButton.addEventListener('mouseleave', function () {
        editButton.style.backgroundColor = 'white';
    });
    newRow.insertCell().appendChild(editButton);

    var huanxiangbutten = document.createElement('button');
    huanxiangbutten.textContent = '绩点模拟计算';
    huanxiangbutten.style.backgroundColor = 'white'; // 背景颜色
    huanxiangbutten.style.color = 'black'; // 文字颜色
    huanxiangbutten.style.width = '100%'; // 宽度设置为全宽
    huanxiangbutten.style.padding = '10px'; // 内边距
    huanxiangbutten.style.border = 'none'; // 去除边框
    huanxiangbutten.style.cursor = 'pointer'; // 鼠标指针样式
    // 添加悬停样式
    huanxiangbutten.addEventListener('mouseenter', function () {
        huanxiangbutten.style.backgroundColor = 'lightgray';
    });

    huanxiangbutten.addEventListener('mouseleave', function () {
        huanxiangbutten.style.backgroundColor = 'white';
    });
    newRow.insertCell().appendChild(huanxiangbutten);


    // 显示绩点
    var oldGPA = GM_getValue('GPA');
    //alert(oldGPA);
    var trueGPA = calculateWeightedGPA().toFixed(4);
    // 判断绩点是否发生变化
    if (oldGPA !== trueGPA) {
        alert('你的绩点从' + oldGPA +'变为了' + trueGPA);
    }
    GM_setValue('GPA', trueGPA);

    // 计算加权绩点的函数
    function calculateWeightedGPA(credit_index = 6, grade_index = 12) {
        var table = document.querySelector('.gridtable');
        var tableBody = table.querySelector('tbody');
        var rows = tableBody.getElementsByTagName('tr');
        var totalCredit = 0;
        var totalGrade = 0;

        // 获取表头单元格
        var tableHead = document.querySelector('.gridhead tr').nextElementSibling;
        var cells = tableHead.querySelectorAll('th');

        // 遍历表头中的每个单元格，查找"绩点"和"学分"所在的列数
        cells.forEach(function (cell, index) {
            var cellText = cell.textContent.trim();

            if (cellText === "绩点") {
                grade_index = index;
            }

            if (cellText === "学分") {
                credit_index = index;
            }
        });

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var credit = parseFloat(row.cells[credit_index].textContent);
            var grade = parseFloat(row.cells[grade_index].textContent);

            if (isNaN(credit) || isNaN(grade)) {
                continue; // 跳过数据不是数字的行
            }

            if (row.style.display === 'none') {
                continue; // 跳过被隐藏的行
            }

            totalCredit += credit;
            totalGrade += credit * grade;
        }

        var inputCredit = parseFloat(creditInput.value);
        var inputGrade = parseFloat(gradeInput.value);
        var newTotalCredit = totalCredit + inputCredit;
        var newTotalGrade = totalGrade + inputCredit * inputGrade;
        var newGPA = newTotalGrade / newTotalCredit;
        var currentGPA = totalGrade / totalCredit;
        var gradeChange = newGPA - currentGPA;
        // 显示加权绩点
        resultCell.innerHTML = '当前加权绩点：' + currentGPA.toFixed(4) +
            '， 加上这门课绩点：' + newGPA.toFixed(4) +
            '， 绩点变化：' + gradeChange.toFixed(4);
        if (isNaN(newGPA) || isNaN(gradeChange)) {
            resultCell.innerHTML = '当前加权绩点：' + currentGPA.toFixed(4) +
                '， 当前总学分：' + totalCredit.toFixed(1)
        }
        return currentGPA;
    }

    // 监听计算按钮的点击事件
    calculateButton.addEventListener('click', function () {
        calculateWeightedGPA();
    });

    editButton.addEventListener('click', function () {
        if (document.designMode == 'off') {
            document.designMode = 'on'
            editButton.textContent = '结束幻想'
            // 显示绩点
            resultCell.innerHTML = '当前加权绩点：' + trueGPA;
            var table = document.querySelector('.gridtable');
            var tableBody = table.querySelector('tbody');

            // 获取表头单元格
            var tableHead = document.querySelector('.gridhead tr').nextElementSibling;
            var cells = tableHead.querySelectorAll('th');

            // 查找"考试情况"所在的列数
            var last_index = -1;
            cells.forEach(function (cell, index) {
                var cellText = cell.textContent.trim();
                if (cellText === "考试情况") {
                    last_index = index;
                }
            });

            // 插入行
            for (var i = 0; i < 15; i++) {
                var row = tableBody.insertRow();
                row.classList.add('griddata-odd');
                for (var j = 0; j < last_index + 1; j++) {
                    var celll = row.insertCell();
                    if (j === 3) {
                        celll.textContent = '幻想课程';
                    } else {
                        celll.textContent = ' ';
                    }
                }
            }
        }
        else {
            document.designMode = 'off'
            editButton.textContent = '模拟计算'
            location.reload();
        };
    });

    // 监听幻想按钮的点击事件
    huanxiangbutten.addEventListener('click', function () {
        // 显示绩点
        var dreamGPA = calculateWeightedGPA();
        resultCell.innerHTML = '真实加权绩点：' + trueGPA + '，幻想绩点：' + dreamGPA.toFixed(4) + '，想象力：' + (dreamGPA - trueGPA).toFixed(4);
    });


})();