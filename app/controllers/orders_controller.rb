class OrdersController < ApplicationController
  include ChargesHelper
  skip_before_action :verify_authenticity_token

  before_action :check_user, only: [:index, :show, :edit, :update, :destroy]


  # GET /orders
  # GET /orders.json
  def index
    if user_signed_in?
      @orders = current_user.account.orders
    elsif admin_signed_in?
      @orders=Order.all()
    end
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
    @order=Order.find(params[:id])
  end

  # GET /orders/new
  def new
    @order = Order.new
  end

  # GET /orders/1/edit
  def edit
  end

  # POST /orders
  # POST /orders.json
  def create
    @order = Order.new(order_params)

    respond_to do |format|
      if @order.save
        format.html { redirect_to @order, notice: 'Order was successfully created.' }
        format.json { render :show, status: :created, location: @order }
      else
        format.html { render :new }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /orders/1
  # PATCH/PUT /orders/1.json
  def update
    respond_to do |format|
      if @order.update(order_params)
        format.html { redirect_to @order, notice: 'Order was successfully updated.' }
        format.json { render :show, status: :ok, location: @order }
      else
        format.html { render :edit }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /orders/1
  # DELETE /orders/1.json
  def destroy
    @order.destroy
    respond_to do |format|
      format.html { redirect_to orders_url, notice: 'Order was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def checkout
    @address = Address.new()
    @order=Order.find(current_order)
  end

  def shipping
    @order=current_order
    order = Order.find(current_order)
    if !@order.order_items.any? {|order_item| order_item.product.category_id=="3" }
      rates = session[:rates]
      totalship = 0
      rates.each do |rate|
        totalship+=BigDecimal(rate[4])
      end
      @shipping=totalship
      @total100 = (current_order.total_price * 100) + (BigDecimal(@shipping)*100)
      @total = (current_order.total_price) + (BigDecimal(@shipping))
      order.total_shipping=totalship
    elsif @order.order_items.any? {|order_item| !order_item.delivery && order_item.product.category_id=="3"}
      @shipping=0
      @total100 = (current_order.total_price * 100)+ (BigDecimal(@shipping)*100)
      @total = (current_order.total_price) + (BigDecimal(@shipping))
      order.total_shipping=@shipping
      order.order_items.each do |item|
        item.delivery = false
        item.save
      end
    elsif @order.order_items.any? {|order_item| order_item.delivery && order_item.product.category_id=="3"}
      @shipping=10
      @total100 = (current_order.total_price * 100)+ (BigDecimal(@shipping)*100)
      @total = (current_order.total_price) + (BigDecimal(@shipping))
      order.total_shipping=@shipping
      order.order_items.each do |item|
        item.delivery = true
        item.save
      end
    end
    order.save
  end

  def tracking
    request_string = request.body.read
    parsed_request = JSON.parse(request_string)

    if parsed_request['object'] == 'Event' && parsed_request['description'] == 'tracker.updated'
      event = EasyPost::Event.receive(request_string)
      tracker = event.result

      message = "Hey, this is FunCompany."
      if tracker.status == 'delivered'
        message += "Your package has arrived! "
      else
        message += "There's an update on your package: "
      end

      td = tracker.tracking_details.reverse.find{ |tracking_detail| tracking_detail.status == tracker.status }
      message += "#{tracker.carrier} says: #{td.message} in #{td.tracking_location.city}." if td.present?
      
      order=Order.find(params[:order_id])

      TrackerUpdateJob.set(wait: 20.seconds).perform_later(order.customer_email, message)
      # from = SendGrid::Email.new(email: 'test@fromaddress.com')
      # subject = 'Hello World from the SendGrid Ruby Library!'
      # to = SendGrid::Email.new(email: 'customer@gmail.com')
      # content = SendGrid::Content.new(type: 'text/plain', value: message)
      # mail = SendGrid::Mail.new(from, subject, to, content)
      #
      # output = settings.sendgrid.client.mail._("send").post(request_body: mail.to_json)

      [200, {}, "Email update was sent to the customer!"]
    else
      [200, {}, "Not a Tracker event, so nothing to do here for now..."]
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_order
      # @order = Order.find(params[:id])
    end

    def check_user
      if admin_signed_in?
      else
        set_order
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def order_params
      params.require(:order).permit(:status, :account_id, :total_price)
    end
end
