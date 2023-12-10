/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require("bcrypt");

const hashedPassword = (password) => {
  return bcrypt.hashSync(password, 10);
}

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      name: "Admin",
      email: "holytrinitychurchtoronto@gmail.com",
      password: hashedPassword("church123"),
      admin: true
    }
  ]);
};
