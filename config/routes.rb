Rails.application.routes.draw do
  root 'products#index'
  resources :categories 
  devise_for :admins

  devise_for :users
  resources :users do
    resources :order_items
    resources :orders
  end
  resources :subscriptions, only: [:new, :create]
  get 'thanks', to: 'charges#thanks', as: 'thanks'
  resources :orders do
    get "checkout"
    get "shipping"
    post "tracking"
  end
  resources :order_items
  resources :addresses
  resources :products do
    get "delete"
    get "delivery"
  end
  resources :images
  resource :cart, only: [:show]
  resources :charges, only: [:new, :create]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
