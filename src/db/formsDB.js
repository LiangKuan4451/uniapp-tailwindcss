import { defineStore } from 'pinia';

export const formsDB = defineStore('formsDB', {
    state: () => {
        return {
            formsDB: {
                rules: {
                },
                fundType: [{
                    text: '支出',
                    value: 'expend'
                }, {
                    text: '收入 ',
                    value: 'income',
                }]
            },
        }
    },
    // 也可以这样定义
    // state: () => ({ count: 0 })
    actions: {
    }
});