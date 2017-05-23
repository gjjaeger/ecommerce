class ChangeRequestedDateTimeOrderItems < ActiveRecord::Migration[5.0]
  def change
    remove_column :order_items, :requested_datetime
    add_column :order_items, :requested_date, :date
    add_column :order_items, :requested_time, :time
  end
end
