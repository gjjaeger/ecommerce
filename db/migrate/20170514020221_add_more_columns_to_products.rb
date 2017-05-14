class AddMoreColumnsToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :featured, :boolean
    add_column :products, :stock, :Integer
    add_column :products, :time_needed, :Integer
    add_column :products, :storage_inst, :string
  end
end
