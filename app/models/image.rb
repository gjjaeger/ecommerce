class Image < ApplicationRecord
  has_attached_file :photo,
    :path => ":rails_root/public/images/:id/:filename",
    :url  => "/images/:id/:filename"
  belongs_to :product
  validates_attachment_content_type :photo, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]
end
