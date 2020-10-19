
let commomForm = [
    {
        label:'奖品名称',
        key: 'prizeName',
        type: 'input',
        maxlength: 10,
        placeholder:'请输入体验金名称',
        value:'',
        require: true,
        regExp: null,
        regTip: '',
    },
    {
        label:'中奖概率(%)',
        key: 'prizeProbability',
        type: 'input',
        placeholder:'请输入中奖概率（单位%）',
        value:'',
        require: true,
        regExp: { reg: '^[0-9]{1,}[.]{0,1}[0-9]{0,}$', max: 100},
        regTip: '中奖概率必须是小于等于100的正数',
    },
]
let shangjiaStatus = {
    label:'状态',
    key: 'shangjiaStatus',
    value: 1,
    type: 'select',
    require: true,
    options:[
        {
            value: 0,
            label: "下架"
        },
        {
            value: 1,
            label: "上架"
        }
    ],
}
let firstLuckDraw = {
    label:'首次必中',
    key: 'firstLuckDraw',
    value: 0,
    type: 'select',
    require: true,
    options:[
        {
            value: 0,
            label: "否"
        },
        {
            value: 1,
            label: "是"
        }
    ],
}
let priceWorch = {
    label:'奖品价值',
    key: 'prizeValue',
    type: 'input',
    maxlength: 10,
    placeholder: '请输入非负数字',
    value:'',
    require: true,
    regExp: '^[0-9]{1,}[.]{0,1}[0-9]{0,}$',
    regTip: '奖品价值必须是非负数字',
}
let prizeNum = {
    label:'可用库存',
    key: 'prizeNum',
    type: 'input',
    maxlength: 10,
    placeholder:'请输入正整数',
    value:'',
    require: true,
    regExp: '^[1-9]\\d{0,}$',
    regTip: '请输入正整数的可用库存',
}
export default {
    voucher:[
        ...commomForm,
        {
            label:'每单数量',
            key: 'prizeGiveNum',
            type: 'input',
            maxlength: 10,
            placeholder:'请输入非负数字',
            value:'',
            require: true,
            regExp: '^[0-9]{1,}[.]{0,1}[0-9]{0,}$',
            regTip: '每单数量必须是非负数字',
        },
        prizeNum,
        priceWorch,
        shangjiaStatus
    ],
    redpacket:[
        ...commomForm,
        {
            label:'体验金预算',
            key: 'prizeMoney',
            type: 'input',
            maxlength: 10,
            placeholder:'请输入正数',
            value:'',
            require: true,
            regExp: '^[1-9]{1,}[.]{0,1}[0-9]{0,}$',
            regTip: '预算必须是正数',
        },
        {
            label:'是否随机',
            key: 'prizeValueRand',
            value: 'prizeValueRand:::0',
            type: 'select',
            require: true,
            isRelate: true,
            options:[
                {
                    value: 'prizeValueRand:::0',
                    label: "否",
                    relateList:{
                        prizeValue: { label: '体验金金额' },
                        prizeMinValue: { show: false },
                    }
                },
                {
                    value: 'prizeValueRand:::1',
                    label: "是",
                    relateList:{
                        prizeValue: { label: '体验金最大金额' },
                        prizeMinValue: { show: true },
                    }
                }
            ],
        },
        {
            label:'体验金金额',
            key: 'prizeValue',
            type: 'input',
            maxlength: 10,
            placeholder: '请输入非负数字',
            value:'',
            regExp: '^[0-9]{1,}[.]{0,1}[0-9]{0,}$',
            regTip: '体验金金额必须是非负数字',
            require: true,
        },
        {
            label:'体验金最小金额',
            key: 'prizeMinValue',
            type: 'input',
            maxlength: 10,
            placeholder: '请输入非负数字',
            show: false,
            regExp: '^[0-9]{1,}[.]{0,1}[0-9]{0,}$',
            regTip: '体验金最小金额必须是非负数字',
            value:'',
            require: true,
        },
        shangjiaStatus
    ],
    gold_ingot:[
        ...commomForm,
        prizeNum,
        {
            label:'是否随机',
            key: 'prizeValueRand',
            value: 'prizeValueRand:::0',
            type: 'select',
            require: true,
            isRelate: true,
            options:[
                {
                    value: 'prizeValueRand:::0',
                    label: "否",
                    relateList:{
                        prizeValue: { label: '元宝金额' },
                        prizeMinValue: { show: false },
                    }
                },
                {
                    value: 'prizeValueRand:::1',
                    label: "是",
                    relateList:{
                        prizeValue: { label: '元宝最大金额' },
                        prizeMinValue: { show: true },
                    }
                }
            ],
        },
        {
            label:'元宝最大金额',
            key: 'prizeValue',
            type: 'input',
            maxlength: 10,
            placeholder: '请输入正整数',
            regExp: '^[1-9]\\d{0,}$',
            regTip: '请输入正整数的元宝金额',
            value:'',
            require: true,
        },
        {
            label:'元宝最小金额',
            key: 'prizeMinValue',
            type: 'input',
            maxlength: 10,
            placeholder: '请输入正整数',
            show: false,
            regExp: '^\\d+$',
            regTip: '请输入整数的元宝最小金额',
            value:'',
            require: true,
        },
        shangjiaStatus
    ],
    silver_draft:[
        ...commomForm,
        {
            label:'体验金预算',
            key: 'prizeMoney',
            type: 'input',
            maxlength: 10,
            placeholder:'请输入正整数',
            value:'',
            require: true,
            regExp: '^[1-9]\\d{0,}$',
            regTip: '请输入正整数的体验金预算',
        },
        {
            label:'是否随机',
            key: 'prizeValueRand',
            value: 'prizeValueRand:::0',
            type: 'select',
            require: true,
            isRelate: true,
            options:[
                {
                    value: 'prizeValueRand:::0',
                    label: "否",
                    relateList:{
                        prizeValue: { label: '体验金金额' },
                        prizeMinValue: { show: false },
                    }
                },
                {
                    value: 'prizeValueRand:::1',
                    label: "是",
                    relateList:{
                        prizeValue: { label: '体验金最大金额' },
                        prizeMinValue: { show: true },
                    }
                }
            ],
        },
        {
            label:'体验金金额',
            key: 'prizeValue',
            type: 'input',
            maxlength: 10,
            placeholder: '请输入体验金金额',
            value:'',
            require: true,
            regExp: '^[1-9]\\d{0,}$',
            regTip: '请输入正整数的体验金金额',
        },
        {
            label:'体验金最小金额',
            key: 'prizeMinValue',
            type: 'input',
            maxlength: 10,
            placeholder: '请输入体验金最小金额',
            regExp: '^\\d+$',
            regTip: '请输入整数的体验金最小金额',
            show: false,
            value:'',
            require: true,
        },
        shangjiaStatus,
    ]
}