import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
	dialect: 'mysql',
	host: 'localhost', // placeholder
	port: 3306,
	username: 'root',
	password: 'kai-route66',
	database: 'apollo-api'
})

export { sequelize };
