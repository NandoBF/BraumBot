
module.exports = (sequelize, DataTypes) => {

    return sequelize.define('currency_shop', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        item_id: {
            type: DataTypes.INTEGER,
            unique: true,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
    }, {
        timestamps: false,
    });
};
