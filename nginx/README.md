**Nginx should be installed directly on Docker Host, not containerized.**

* This file is meant as a reference only, don't use it "as is" without editing. In production env, put the file in `/etc/nginx/conf.d/` and edit as required.

* This files requires the `key_zone` prop in `proxy_cache_path` directive in the main Nginx config file (`/etc/nginx/conf.d/nginx.conf`) to be set to `MY_CACHE` value. For example (you can copy-paste this line to `nginx.conf`): 
  ```
  # cache responses from proxied servers i.e. from node.js/express.js server
  proxy_cache_path /var/www/cache levels=1:2 keys_zone=MY_CACHE:10m max_size=10g inactive=60m; 
  ```
