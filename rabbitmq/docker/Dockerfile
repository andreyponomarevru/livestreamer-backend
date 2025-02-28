FROM rabbitmq:4-management-alpine

ADD init.sh /init.sh
RUN chmod 755 /init.sh
EXPOSE 15672

CMD ["/init.sh"]
