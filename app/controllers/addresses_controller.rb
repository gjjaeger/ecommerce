class AddressesController < ApplicationController
  include ChargesHelper
  include AddressesHelper
  require 'easypost'

  def create
    @address = Address.new(address_params)
    EasyPost.api_key = 'Mt1XbfoUewLblQmKAXKbsg'
    to_address = EasyPost::Address.create(
      :name => params[:address][:name],
      # :verify_strict => ["delivery"],
      :street1 => params[:address][:line1],
      :street2 => params[:address][:line2],
      :city => params[:address][:city],
      :state => params[:address][:state],
      :zip => params[:address][:zip],
      :country => params[:address][:country],
    )

    from_address = EasyPost::Address.create(
      :company => 'Gabriel Jaeger',
      :street1 => '118 2nd Street',
      :street2 => '4th Floor',
      :city => 'San Francisco',
      :state => 'CA',
      :zip => '94105',
      :phone => '415-456-7890'
    )

    customs_items = []
    parcels=[]
    current_order.order_items.each do |item|
      if (item.product.category_id!="3")
        customs_item = EasyPost::CustomsItem.create(
          :description => item.product.name,
          :quantity => item.quantity,
          :value => if(item.product.category_id=="1")
                      retrieve_size_price(item.size, item.product_id)*item.quantity
                    else
                      Integer(item.product.price*item.quantity)
                    end,
          :weight => if(item.product.category_id=="1")
                      weight_in_ounces(item.size,item.quantity)
                    else
                      weight_in_ounces(item.product.weight,item.quantity)
                    end,
          :origin_country => 'us',
          :hs_tariff_number => 610910
        )
        customs_items.push(customs_item)
      end
    end
    parcel = EasyPost::Parcel.create(
      :width =>cm_to_inches(current_order.order_items.max_by{|h| h.product[:width]}.product.width),
      :length =>cm_to_inches(current_order.order_items.max_by{|h| h.product[:length]}.product.length),
      :height =>cm_to_inches(current_order.order_items.sum{|h| h.product[:height]}),
      :weight =>g_to_ounces(current_order.order_items.sum{|h| h.product[:weight]})
    )
    customs_info = EasyPost::CustomsInfo.create(
      :integrated_form_type => 'form_2976',
      :customs_certify => true,
      :customs_signer => 'Gabriele Jaeger',
      :contents_type => 'merchandise',
      :contents_explanation => '', # only required when contents_type => 'other'
      :eel_pfc => 'NOEEI 30.37(a)',
      :non_delivery_option => 'return',
      :restriction_type => 'none',
      :restriction_comments => '',
      :customs_items => customs_items
    )
    shipment = EasyPost::Shipment.create(
      :to_address => to_address,
      :from_address => from_address,
      :parcel => parcel,
      :customs_info => customs_info
    )
    @rates = shipment.rates
    order = Order.find(current_order)
    order.shipment_id=shipment.id
    order.save!

    # if !current_order.order_items.any? {|order_item| order_item.product.category_id=="3"}
    #   order = EasyPost::Order.create(
    #     to_address: to_address,
    #     from_address: from_address,
    #     shipments: parcels
    #   )
    #
    # end
    if @address.save
      order=Order.find(current_order)
      order.address_id=@address.id
      order.save
      # redirect_to order_shipping_path(current_order)
    end
  end

  def new
    @address = Address.new()
  end

  private
  def address_params
    params.require(:address).permit(:name, :line1, :line2, :city, :country, :zip, :state)
  end
end
