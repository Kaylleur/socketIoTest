#!/bin/bash

docker run -d --name kong-database \
	                -p 5432:5432 \          
                -e "POSTGRES_USER=kong" \
			                -e "POSTGRES_DB=kong" \
					                -e "POSTGRES_PASSWORD=kong" \         
		postgres:9.5


	docker run --rm \                   
	    --link kong-database:kong-database \
		        -e "KONG_DATABASE=postgres" \        
	        -e "KONG_PG_HOST=kong-database" \  
		    -e "KONG_CASSANDRA_CONTACT_POINTS=kong-database" \
			    -e "KONG_PG_PASSWORD=kong" \
			    kong kong migrations up

	    docker run -d --name kong \         
	        --link kong-database:kong-database \
			    -e "KONG_DATABASE=postgres" \
			        -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" \
				    -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" \
				        -e "KONG_PROXY_ERROR_LOG=/dev/stderr" \
					    -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" \
					        -e "KONG_ADMIN_LISTEN=0.0.0.0:8001" \
						    -e "KONG_ADMIN_LISTEN_SSL=0.0.0.0:8444" \
						        -p 8000:8000 \
							    -p 8443:8443 \
							        -p 8001:8001 \
								    -p 8444:8444 \
								        -e "KONG_PG_PASSWORD" \
									-e "KONG_PG_PASSWORD=kong" \
									-e "KONG_PG_HOST=kong-database" \
									kong
