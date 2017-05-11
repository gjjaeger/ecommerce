class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_one :account

  after_create :set_account

  def set_account
    user_id = User.last.id
    account = Account.create(user_id: user_id)
  end
end
