class ImagesController < ApplicationController
  def destroy
    @image=Image.find(params[:id])
    @image.destroy
    respond_to do |format|
      format.html { redirect_to products_url}
      format.json { head :no_content }
    end
  end
end
