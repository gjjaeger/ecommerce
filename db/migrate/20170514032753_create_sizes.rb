class CreateSizes < ActiveRecord::Migration[5.0]
  def change
    create_table :sizes do |t|
      t.integer :amount
      t.integer :price
      t.integer :product_id
    end
  end
end
