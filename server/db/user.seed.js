require('./index')
const mongoose = require('mongoose')
const UserModel = require('../models/User.model')

//Dummy users
UserModel.create([
  {name: 'Manish', email: 'm@ironhack.com', passwordHash: '12345'},
  {name: 'Test', email: 't@ironhack.com',passwordHash: '12345'},
  {name: 'Jorge', email: 'jorge@ironhack.com',passwordHash: '12345'},
  {name: 'Ariel', email: 'riel@ironhack.com',passwordHash: '12345'},
  {name: 'Gonzalo', email: 'onzalo@ironhack.com',passwordHash: '12345'},
  {name: 'Luis', email: 'uis@ironhack.com',passwordHash: '12345'},
  {name: 'Alvaro', email: 'lvaro@ironhack.com',passwordHash: '12345'},
  {name: 'Helena',email: 'elena@ironhack.com', passwordHash: '12345'}
])
  .then(() => {
    console.log('Users seeded successfully')
    mongoose.connection.close()
  })
  .catch((err) => {
    console.log('Seeding failed ', err)
  })