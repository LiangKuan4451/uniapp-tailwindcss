import { defineStore } from 'pinia';

export const cashBookDB = defineStore('cashBookDB', {
    state: () => {
        return {
            cashBookDB: {
                toYear: new Date().getFullYear(),
                toMonth: new Date().getMonth() + 1,
                toDay: new Date().getDay(),
                year: [
                    {
                        date: 2023, month: [
                            {
                                date: 9, day: [{
                                    date: 30, info: [{ type: 'expend', typeName: '餐饮', amount: 21.80, remark: '肯德基', detailTime: '6:56' }],
                                },
                                {
                                    date: 29, info: [{ type: 'expend', typeName: '餐饮', amount: 13, remark: '肯德基', detailTime: '22:40' }, { type: 'income', typeName: '收转账', amount: 300, remark: '转账-来自XX', detailTime: '16:13' }, { type: 'expend', typeName: '购物', amount: 6, remark: '扫二维码付款-给XX', detailTime: '11:22' }],
                                }]


                            }
                        ]
                    },
                    {
                        date: 2024, month: [
                            {
                                date: 1, day: [{
                                    date: 8, info: [{ type: 'expend', typeName: '其它', amount: 540, remark: '零钱提现-到XXXX', detailTime: '19:28' }, { type: 'income', typeName: '收转账', amount: 340, remark: '转账-来自XX', detailTime: '19:24' }],
                                }],

                            }]
                    }
                ]
            }

        };
    },
    // 也可以这样定义
    // state: () => ({ count: 0 })
    actions: {
        pushDate(Qyear, Qmonth, Qday, Qtype, QtypeName, Qamount, Qremark, QdetailTime) {
            let yearFound = this.cashBookDB.year.find(y => y.date === Qyear);
            if (!yearFound) {
                // 如果没有找到年份，创建新年份
                yearFound = { date: Qyear, month: [] };
                this.cashBookDB.year.push(yearFound);
            }

            let monthFound = yearFound.month.find(m => m.date === Qmonth);
            if (!monthFound) {
                // 如果没有找到月份，创建新月份
                monthFound = { date: Qmonth, day: [] };
                yearFound.month.push(monthFound);
            }

            let dayFound = monthFound.day.find(d => d.date === Qday);
            if (!dayFound) {
                // 如果没有找到日期，创建新日期
                dayFound = { date: Qday, info: [] };
                monthFound.day.push(dayFound);
            }

            // 添加记录到 info 数组
            dayFound.info.push({
                type: Qtype,
                typeName: QtypeName,
                amount: Qamount,
                remark: Qremark,
                detailTime: QdetailTime
            });
            console.log(this.pushDate);
        },
        replaceData(newData) {
            this.cashBookDB = newData;
        },

        sortData() {
            this.cashBookDB.year.forEach(() => {
                this.cashBookDB.year.sort((a, b) => b.date - a.date); // 按年份降序排序
                this.cashBookDB.year.forEach(year => {
                    year.month.sort((a, b) => b.date - a.date); // 按月份降序排序
                    year.month.forEach(month => {
                        month.day.sort((a, b) => b.date - a.date); // 按日降序排序
                    });
                });
            });
        },

        saveData() {
            uni.setStorage({
                key: 'cashBookDB',
                data: this.cashBookDB,
                success: function (e) {

                },
                fail: function (e) {

                }
            });
            this.cashBookDB = this.cashBookDB;
        },

        calculateTotalIncome() {
            let totalIncome;

            this.cashBookDB.year.forEach(year => {
                if (year.date == this.cashBookDB.toYear) {
                    year.month.forEach(month => {
                        if (month.date == this.cashBookDB.toMonth) {
                            month.day.forEach(day => {
                                day.info.forEach(info => {
                                    if (info.type == "income") {
                                        totalIncome += info.amount;
                                    }
                                })
                            });
                        }
                    });
                }
            })

            return totalIncome;
        },
        calculateTotalExpenditure() {
            let totalExpenditure;
            this.cashBookDB.year.forEach(year => {
                if (year.date == this.cashBookDB.toYear) {
                    year.month.forEach(month => {
                        if (month.date == this.cashBookDB.toMonth) {
                            month.day.forEach(day => {
                                day.info.forEach(info => {
                                    if (info.type == "expend") {
                                        totalExpenditure += info.amount;
                                    }
                                })
                            });
                        }
                    });
                }
            })
            return totalExpenditure;
        }
    },
});