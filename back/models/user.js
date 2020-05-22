module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        UserId: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        snsId: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        paranoid: true,
    });

    User.associate = (db) => {
        db.User.hasMany(db.Post, { as: 'Posts' });
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
    }

    return User;
}