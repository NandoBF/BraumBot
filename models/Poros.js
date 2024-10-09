
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
        health_points: {
            type: DataTypes.INTEGER,
            defaultValue:100,
            allowNull: false,
        },
        attack:{
            type: DataTypes.INTEGER,
            defaultValue: 10,
        },
        point_bonus:{
            type: DataTypes.FLOAT,
            defaultValue: 1.00,
            allowNull: false,
        },

    }, {
        timestamps: false,
    });
};
