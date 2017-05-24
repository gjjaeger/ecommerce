class CreateShipments < ActiveRecord::Migration[5.0]
  def change
    create_table :shipments do |t|
      t.string :recipient
      t.string :tracker_code
      t.string :carrier
      t.string :est_delivery_date
      t.integer :order_item_id
      t.integer :shipment_id
      t.string :public_url

      t.timestamps
    end
  end
end
