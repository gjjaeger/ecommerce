Rails.application.routes.draw do
  root 'products#index'
  devise_for :users
  resources :users do
    resources :order_items
    resources :orders
  end
  resources :order_items
  resources :products
  resource :cart, only: [:show]
  resources :charges
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
