class ChargesController < ApplicationController
  require 'easypost'
  def new
  end

  def create
    EasyPost.api_key = 'Mt1XbfoUewLblQmKAXKbsg'
    # Amount in cents
    customer = Stripe::Customer.create(
      :email => params[:stripeEmail],
      :source  => params[:stripeToken]
    )


    current_order.order_items.each do |item|
      charge = Stripe::Charge.create(
        :customer    => customer.id,
        :amount      => if(item.product.category_id=="1")
                          Size.where({amount: item.size, product_id: item.product.id}).first.price*100*item.quantity
                        else
                          Integer(item.product.price*100*item.quantity)
                        end,
        :description => params[:stripeEmail],
        :currency    => 'usd'
      )

      order = Stripe::Order.create(
        :currency => 'usd',
        :email => params[:stripeEmail],
        :items => [
          {
            :type => 'sku',
            :parent =>  if(item.product.category_id=="1")
                          Size.where({amount: item.size, product_id: item.product.id}).first.sku_id
                        else
                          item.product.sku_id
                        end,
            :quantity => item.quantity,
          }
        ],
        :shipping => {
          :name => params[:stripeShippingName],
          :address => {
            :line1 => params[:stripeShippingAddressLine1],
            :city => params[:stripeShippingAddressCity],
            :state => params[:stripeShippingAddressState],
            :country => params[:stripeShippingAddressCountry],
            :postal_code => params[:stripeShippingAddressZip]
          }
        },
      )
    end

    to_address = EasyPost::Address.create(
      :name => params[:stripeShippingName],
      :street1 => params[:stripeShippingAddressLine1],
      :city => params[:stripeShippingAddressCity],
      :state => params[:stripeShippingAddressState],
      :zip => params[:stripeShippingAddressZip],
      :country => params[:stripeShippingAddressCountry],
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
    current_order.order_items.each do |item|
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

      shipment.buy(
        rate: shipment.lowest_rate()
      )
    end




    # @rates = shipment.['rates']

    @shippingAddress=Address.create(:line1 => params[:stripeShippingAddressLine1], :city => params[:stripeShippingAddressCity],:country => params[:stripeShippingAddressCountry], :postal_code => params[:stripeShippingAddressZip])
    @order = Order.find(current_order)
    @order.status = "created"
    @order.address_id= @shippingAddress.id
    if current_user
      @order.account_id=current_user.account.id
    end
    if current_admin
      @order.account_id=1
    end
    if @order.save
      current_order.order_items.each do |item|
        if item.product.category_id =="2"
          item.product.stock-=item.quantity
          item.product.save
        end
      end
      session[:order_id]=nil
      byebug
      redirect_to products_path
    end
  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to new_charge_path
  end
end
