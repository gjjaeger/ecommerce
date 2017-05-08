# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
product_list = [
  [ 50, "Tylenol" ],
  [ 100, "Aspirin" ],
  [ 20, "Coke" ],
  [ 20, "Lays Potato Chips" ],
  [ 25, "Snickers" ],
  [ 200, "Microwavable Meal" ]
]
product_list.each do |price, name|
  Product.create(price: price, name: name)
end
