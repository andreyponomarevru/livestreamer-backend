FROM rabbitmq:4-management-alpine

ADD init.sh /init.sh
RUN chmod 755 /init.sh
EXPOSE 5672

CMD ["/init.sh"]
