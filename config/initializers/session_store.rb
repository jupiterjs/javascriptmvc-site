# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_javascriptmvc_site_session',
  :secret      => '9a764211f92f804b1a053401f3c638677093255d7c409a092ef92ac45962be9e5ca3ac9a352104dafa5f4eefd68bbe09699675c930a9cfcb15db2cd2a7ba491d'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
