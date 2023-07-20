// ==UserScript==
// @name         计算加权绩点脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  计算加权绩点并显示在页面上的油猴脚本
// @author       Your name
// @match        http://219.216.96.4/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 在表格第一行位置插入两个输入框
    var tableHead = document.querySelector('.gridhead');
    var newRow = tableHead.insertRow(0);
    newRow.innerHTML = '<th colspan="2">绩点计算</th>';

    var creditInput = document.createElement('input');
    creditInput.type = 'text';
    creditInput.placeholder = '新课学分';
    newRow.insertCell().appendChild(creditInput);

    var gradeInput = document.createElement('input');
    gradeInput.type = 'text';
    gradeInput.placeholder = '预估绩点';
    newRow.insertCell().appendChild(gradeInput);

    var calculateButton = document.createElement('button');
    calculateButton.textContent = '计算';
    newRow.insertCell().appendChild(calculateButton);

    var resultCell = newRow.insertCell();
    resultCell.colSpan = 7;

    var editButton = document.createElement('button');
    editButton.textContent = '幻想时间';
    newRow.insertCell().appendChild(editButton);

    var huanxiangbutten = document.createElement('button');
    huanxiangbutten.textContent = '幻想';
    newRow.insertCell().appendChild(huanxiangbutten);

    // 显示绩点
    var trueGPA = calculateWeightedGPA().toFixed(4);

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
            editButton.textContent = '结束幻想，准备战斗'
            // 显示绩点
            resultCell.innerHTML = '当前加权绩点：' + trueGPA;
            var table = document.querySelector('.gridtable');
            var tableBody = table.querySelector('tbody');

            for (var i = 0; i < 10; i++) {
                var row = tableBody.insertRow();
                row.classList.add('griddata-odd');
                for (var j = 0; j < 14; j++) {
                    var cell = row.insertCell();

                    if (j === 3) {
                        cell.textContent = '幻想课程';
                    } else {
                        cell.textContent = '';
                    }
                }
            }
        }
        else {
            document.designMode = 'off'
            editButton.textContent = '进入幻想时间'
            location.reload();
        };
    });

    // 监听幻想按钮的点击事件
    huanxiangbutten.addEventListener('click', function () {
        // 显示绩点
        resultCell.innerHTML = '真实加权绩点：' + trueGPA + '，幻想绩点：' + calculateWeightedGPA().toFixed(4);
    });

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

        // 在表格之前插入筛选器输入框
        var headRow = table.querySelector('thead');
        var filterCell = document.createElement('th');
        filterCell.appendChild(input);
        headRow.insertBefore(filterCell, headRow.firstChild);
    }

    // 调用函数添加筛选器
    addFilter();
})();