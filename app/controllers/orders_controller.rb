class OrdersController < ApplicationController
  include ChargesHelper

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
    if !@order.order_items.any? {|order_item| !order_item.delivery }
      rates = session[:rates]
      totalship = 0
      rates.each do |rate|
        totalship+=BigDecimal(rate[4])
      end
      @shipping=totalship
      @total100 = (current_order.total_price * 100) + (BigDecimal(@shipping)*100)
      @total = (current_order.total_price) + (BigDecimal(@shipping))
      order = Order.find(current_order)
      order.total_shipping=totalship
      order.save
    else
      @shipping=0
      @total100 = (current_order.total_price * 100)
      @total = (current_order.total_price)
    end
    render partial: '/orders/shipping', locals:{shipping: @shipping, total: @total}
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
