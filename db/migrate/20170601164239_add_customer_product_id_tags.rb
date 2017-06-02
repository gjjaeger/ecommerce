class AddCustomerProductIdTags < ActiveRecord::Migration[5.0]
  def change
    add_column :tags, :product_id, :integer
  end
end
