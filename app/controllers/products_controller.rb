class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show]
  require "stripe"

  # GET /products
  # GET /products.json
  def index
    @products = Product.all
    @order_item = current_order.order_items.new
    @order_items = current_order.order_items
  end

  # GET /products/1
  # GET /products/1.json
  def show
  end

  # GET /products/new
  def new
    @product = Product.new
  end

  # GET /products/1/edit
  def edit
  end

  # POST /products
  # POST /products.json
  def create
    @product = Product.new(product_params)

    Stripe.api_key = "sk_test_dcJW97Ip8Tjmj2e3Vjtiu6Tq"
    product = Stripe::Product.create(
      :name => product_params[:name],
      :description => product_params[:description],
      :attributes => ['size', 'weight']
    )

    sku = Stripe::SKU.create(
      :product => product.id,
      :attributes => {
        'size' => product_params[:size],
        'weight' => product_params[:weight]
      },
      :price => (Integer(product_params[:price])*100),
      :currency => 'usd',
      :inventory => {
        'type' => 'finite',
        'quantity' => 1
      }
    )

    respond_to do |format|
      if @product.save

        if params[:images]
          params[:images].each { |image|
            @product.images.create(:photo=> image, :product_id => @product.id)
          }
        end
        @product.sku_id = sku.id
        @product.product_id = product.id
        @product.save
        format.html { redirect_to @product, notice: 'Product was successfully created.' }
        format.json { render :show, status: :created, location: @product }
      else
        format.html { render :new }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /products/1
  # PATCH/PUT /products/1.json
  def update
    respond_to do |format|
      if @product.update(product_params)
        format.html { redirect_to @product, notice: 'Product was successfully updated.' }
        format.json { render :show, status: :ok, location: @product }
      else
        format.html { render :edit }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/1
  # DELETE /products/1.json
  def destroy
    @product.destroy
    respond_to do |format|
      format.html { redirect_to products_url, notice: 'Product was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def product_params
      params.require(:product).permit(:price, :name, :size, :weight, :description,:params, images_attributes: [:photo, :product_id])
    end
end
