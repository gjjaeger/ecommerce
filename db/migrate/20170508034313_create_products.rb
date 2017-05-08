class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.decimal :price
      t.string :name

      t.timestamps
    end
  end
end
