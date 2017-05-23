class AddRequestedDateTimeOrderItems < ActiveRecord::Migration[5.0]
  def change
    add_column :order_items, :requested_datetime, :datetime
  end
end
