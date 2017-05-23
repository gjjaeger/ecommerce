class AddressesController < ApplicationController
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
      :country => IsoCountryCodes.search_by_name((params[:address][:country]).downcase)[0].alpha2,
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

    session[:rates]=[]
    customs_items = []
    current_order.order_items.each do |item|
      if (item.product.category_id!="3")
        customs_item = EasyPost::CustomsItem.create(
          :description => item.product.name,
          :quantity => item.quantity,
          :value => if(item.product.category_id=="1")
                      Size.where({amount: item.size, product_id: item.product.id}).first.price*item.quantity
                    else
                      Integer(item.product.price*item.quantity)
                    end,
          :weight => if(item.product.category_id=="1")
                      (BigDecimal(item.size*item.quantity)/28.3495).to_f
                    else
                      (BigDecimal(item.product.weight*item.quantity)/28.3495).to_f
                    end,
          :origin_country => 'us',
          :hs_tariff_number => 610910
        )
        customs_items.push(customs_item)
        parcel = EasyPost::Parcel.create(
          :width => if(item.product.category_id=="1")
                      (BigDecimal(Size.where({amount: item.size, product_id: item.product.id}).first.width)/2.54).to_f
                    else
                      (BigDecimal(item.product.width)/2.54).to_f
                    end,
          :length => if(item.product.category_id=="1")
                      (BigDecimal(Size.where({amount: item.size, product_id: item.product.id}).first.length)/2.54).to_f
                    else
                      (BigDecimal(item.product.length)/2.54).to_f
                    end,
          :height => if(item.product.category_id=="1")
                      (BigDecimal(Size.where({amount: item.size, product_id: item.product.id}).first.height*item.quantity)/2.54).to_f
                    else
                      (BigDecimal(item.product.height*item.quantity)/2.54).to_f
                    end,
          :weight => if(item.product.category_id=="1")
                      (BigDecimal(item.size*item.quantity)/28.3495).to_f
                    else
                      (BigDecimal(item.product.weight*item.quantity)/28.3495).to_f
                    end
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
          :customs_items => customs_item
        )
        shipment = EasyPost::Shipment.create(
          :to_address => to_address,
          :from_address => from_address,
          :parcel => parcel,
          :customs_info => customs_info
        )
        @rate = shipment.lowest_rate()
        session[:rates].push([@rate["carrier"],@rate["id"],@rate["delivery_days"],@rate["delivery_date"],@rate["rate"],@rate["shipment_id"]])
      end
    end
    if @address.save
      order=Order.find(current_order)
      order.address_id=@address.id
      order.save
      redirect_to order_shipping_path(current_order)
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
