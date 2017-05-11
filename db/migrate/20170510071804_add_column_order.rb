class AddColumnOrder < ActiveRecord::Migration[5.0]
  def change
    add_column :orders, :address_id, :integer
  end
end
