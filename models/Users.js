
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        riotId:{
            type: DataTypes.STRING,
            defaultValue: '',
        },
        puuid: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        lastmatch:{
            type: DataTypes.STRING,
            defaultValue: '',
        },

    }, {
        timestamps: false,
    });

};
