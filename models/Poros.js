
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('poros', {
        owner: DataTypes.STRING,
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        model:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        head:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        body:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        face:{
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        hunger: {
            type: DataTypes.INTEGER,
            defaultValue: 100,
        },

    }, {
        timestamps: false,
    });
};
