# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170628065250) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
  end

  create_table "addresses", force: :cascade do |t|
    t.string   "line1"
    t.string   "city"
    t.string   "country"
    t.string   "zip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "name"
    t.string   "line2"
    t.string   "state"
  end

  create_table "admins", force: :cascade do |t|
    t.string   "email",              default: "", null: false
    t.string   "encrypted_password", default: "", null: false
    t.integer  "sign_in_count",      default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.integer  "failed_attempts",    default: 0
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  create_table "categories", force: :cascade do |t|
    t.string   "name"
    t.text     "desc"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree
  end

  create_table "images", force: :cascade do |t|
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.integer  "product_id"
  end

  create_table "ingredients", force: :cascade do |t|
    t.string  "name"
    t.integer "quantity"
    t.integer "product_id"
  end

  create_table "materials", force: :cascade do |t|
    t.string  "name"
    t.integer "product_id"
  end

  create_table "order_items", force: :cascade do |t|
    t.integer  "quantity"
    t.integer  "product_id"
    t.integer  "order_id"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.integer  "size"
    t.date     "requested_date"
    t.time     "requested_time"
    t.boolean  "delivery",       default: true
    t.string   "shipment_id"
  end

  create_table "orders", force: :cascade do |t|
    t.string   "status"
    t.integer  "account_id"
    t.decimal  "total_price"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.integer  "address_id"
    t.decimal  "total_shipping"
    t.string   "customer_email"
  end

  create_table "product_tags", force: :cascade do |t|
    t.integer "tag_id"
    t.integer "product_id"
  end

  create_table "products", force: :cascade do |t|
    t.decimal  "price"
    t.string   "name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.string   "description"
    t.integer  "weight"
    t.integer  "size"
    t.string   "sku_id"
    t.string   "product_id"
    t.boolean  "featured"
    t.integer  "stock"
    t.integer  "time_needed"
    t.string   "storage_inst"
    t.string   "category_id"
    t.integer  "height"
    t.integer  "length"
    t.integer  "width"
  end

  create_table "shipments", force: :cascade do |t|
    t.string   "recipient"
    t.string   "tracker_code"
    t.string   "carrier"
    t.string   "est_delivery_date"
    t.integer  "order_item_id"
    t.integer  "shipment_id"
    t.string   "public_url"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  create_table "sizes", force: :cascade do |t|
    t.integer "amount"
    t.integer "price"
    t.integer "product_id"
    t.integer "height"
    t.integer "length"
    t.integer "width"
    t.string  "sku_id"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.string   "firstname"
    t.integer  "lastname"
    t.decimal  "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tags", force: :cascade do |t|
    t.string  "name"
    t.integer "category_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

end
