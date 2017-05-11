class ReaddColumnToImages < ActiveRecord::Migration[5.0]
  def change
    add_column :images, :product_id, :integer
  end
end
