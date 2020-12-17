const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BudgetSchema = new Schema ({
    title: {
        type: String,
        required: [true, 'Name of title is required']
    },
    budget: {
        type: String,
        validate: {
            // /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
            validator: function(v) {
                return /^[1-9]\d*$/.test(v);
            },
            message: props => `${props.value} is not a valid number!`
        },
        required: [true, 'Amount of budget is required']
    },
    month: {
        type: String,
        required: [true, 'Month is required'],
        validate: {
            // /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
            validator: function(v) {
                return ['january', 'february', 'march', 'april', 'may', 'june',
                 'july', 'august', 'september', 'october', 'november', 'december'].includes(v.toLowerCase());
            },
            message: props => `${props.value} is not a valid month!`
        },
    },
    userId: {
        type: String,
        required: [true, 'userId required']
    },
    backgroundColor: {
        type: String,
        validate: {
            // /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
            validator: function(v) {
                return /^#([A-Fa-f0-9]{6})$/.test(v);
            },
            message: props => `${props.value} is not a valid color!`
        },
        required: [true, 'Name of title is required']
    },
});

const Budget = mongoose.model('budget', BudgetSchema);

module.exports = Budget;
