class TagsController < ApplicationController
  def show
    @order_item=current_order.order_items.new
    @category=Category.find(params[:category_id])
    @tags=@category.tags
    tag=@category.tags.find(params[:id])
    @items=tag.products
    @categories=Category.all
  end
end
