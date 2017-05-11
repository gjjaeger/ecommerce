class CreateAddressTable < ActiveRecord::Migration[5.0]
  def change
    create_table :address_tables do |t|
      t.string :line1
      t.string :city
      t.string :country
      t.string :postal_code

      t.timestamps
    end
  end
end
