class AddLine2Addresses < ActiveRecord::Migration[5.0]
  def change
    add_column :addresses, :line2, :string
    rename_column :addresses, :postal_code, :zip
    add_column :addresses, :state, :string
  end
end
