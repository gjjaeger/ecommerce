class CreateAddresses < ActiveRecord::Migration[5.0]
  def change
    create_table :addresses do |t|
      t.string :line1
      t.string :city
      t.string :country
      t.string :postal_code

      t.timestamps
    end
  end
end
