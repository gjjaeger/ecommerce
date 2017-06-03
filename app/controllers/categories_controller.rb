class CategoriesController < ApplicationController
  before_action :set_category, only: [:show, :edit, :update, :destroy]

  # GET /categories
  # GET /categories.json
  def index
    @categories = Category.all
  end

  # GET /categories/1
  # GET /categories/1.json
  def show
    @order_item=current_order.order_items.new
    @categories=Category.all
    @category=Category.find(params[:id])
    @tags=@category.tags.select("name").group(:name)


    if params[:id] == '2'
      tagss=[]
      @products1 = []
      if params[:tags]
        if params[:tags] == "0"
        else
          params[:tags].each do |tag|
            tag_object = Tag.find_by({name: tag})
            products = tag_object.products
            products.each do |product|
              @products1.push(product)
            end
          end
        end
      else
        @products1=@category.products.where("(stock > ?)", 0)
      end
      @products2=Product.where("(price >= ? AND price <= ? AND category_id = ? AND stock > ?)", params[:low] ? params[:low] : 0, params[:high] ? params[:high] : 400, @category.id.to_s, 0)
      @products=@products1 & @products2
    elsif params[:id] == '3'
      @products=Product.where("(price >= ? AND price <= ? AND category_id = ?)", params[:low] ? params[:low] : 0, params[:high] ? params[:high] : 100, @category.id.to_s)
    else
      sizes=Size.where("(price >= ? AND price <= ?)", params[:low] ? params[:low] : 0, params[:high] ? params[:high] : 50)
      @products = []
      sizes.each do |size|
        product=Product.find_by({id: size.product_id})
        @products.push(product)
      end
      @products = @products.uniq
    end
  end

  # GET /categories/new
  def new
    @category = Category.new
  end

  # GET /categories/1/edit
  def edit
  end

  # POST /categories
  # POST /categories.json
  def create
    @category = Category.new(category_params)
    respond_to do |format|
      if @category.save
        format.html { redirect_to @category, notice: 'Category was successfully created.' }
        format.json { render :show, status: :created, location: @category }
      else
        format.html { render :new }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /categories/1
  # PATCH/PUT /categories/1.json
  def update
    respond_to do |format|
      if @category.update(category_params)
        format.html { redirect_to @category, notice: 'Category was successfully updated.' }
        format.json { render :show, status: :ok, location: @category }
      else
        format.html { render :edit }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /categories/1
  # DELETE /categories/1.json
  def destroy
    @category.destroy
    respond_to do |format|
      format.html { redirect_to categories_url, notice: 'Category was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_category
      @category = Category.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def category_params
      params.require(:category).permit(:name, :desc)
    end
end
