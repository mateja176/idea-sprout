export interface Config {
  paypal: {
    client: string;
    secret: string;
    order_api: string;
    oauth_api: string;
    amount: string;
  };
  config: {
    api_key: string;
    auth_domain: string;
    database_url: string;
    project_id: string;
    storage_bucket: string;
    messaging_sender_id: string;
    app_id: string;
    measurement_id: string;
  };
  log_rocket: {
    id: string;
  };
  drift: {
    id: string;
  };
}
