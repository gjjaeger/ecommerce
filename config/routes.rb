Rails.application.routes.draw do
  resources :categories
  devise_for :admins
  root 'products#index'
  devise_for :users
  resources :users do
    resources :order_items
    resources :orders
  end
  resources :order_items
  resources :products do
    get "delete"
  end
  resource :cart, only: [:show]
  resources :charges, only: [:new, :create]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
