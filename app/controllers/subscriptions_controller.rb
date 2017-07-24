class SubscriptionsController < ApplicationController
  def new
    @subscription=Subscription.new()
  end

  def create
    @subscription = Subscription.new(subscription_params)
    respond_to do |format|
      if @subscription.save
        format.html { redirect_to products_path, notice: 'You successfully subscribed' }
        format.json { render :show, status: :created, location: @subscription }
      else
        format.html { render :new }
        format.json { render json: @subscription.errors, status: :unprocessable_entity }
      end
    end
  end
  private
  def subscription_params
    params.require(:subscription).permit(:firstname, :lastname, :email)
  end
end
