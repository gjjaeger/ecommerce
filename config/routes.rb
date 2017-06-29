Rails.application.routes.draw do
  resources :categories do
    resources :tags
  end
  devise_for :admins
  root 'products#index'
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
  resources :addresses do
  end
  resources :products do
    get "delete"
    get "delivery"
  end
  resources :images
  resource :cart, only: [:show]
  resources :charges, only: [:new, :create]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
