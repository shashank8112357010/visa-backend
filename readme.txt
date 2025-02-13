
server {
  listen 80;
  server_name alankaararts.com www.alankaararts.com;

  # Redirect HTTP to HTTPS (optional if SSL is enabled)
  return 301 https://$host$request_uri;
}



server {
  listen 443 ssl;
  server_name alankaararts.com www.alankaararts.com;

  # SSL Configuration (replace with your certificate paths)
  ssl_certificate /etc/letsencrypt/live/alankaararts.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/alankaararts.com/privkey.pem;

  # Proxy requests to the backend APIs
  location /api/ {
      proxy_pass http://localhost:3000;  # Backend server
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Serve static files for the client-side application
  location / {
      root /var/www/client;  # Path to your built frontend files
      index index.html;
      try_files $uri /index.html;
  }

  # Optional: Error pages
  error_page 404 /404.html;
  location = /404.html {
      root /var/www/client;
  }
}







sudo ln -s /etc/nginx/sites-available/alankaararts.com /etc/nginx/sites-enabled/

sudo certbot --nginx -d alankaararts.com -d www.alankaararts.com
