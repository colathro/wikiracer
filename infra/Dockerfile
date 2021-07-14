FROM mcr.microsoft.com/dotnet/aspnet:5.0

ARG COSMOS_KEY
ARG STORAGE_KEY
ARG ENCRYPTION_KEY
ARG GITHUB_KEY

ENV COSMOS_KEY ${COSMOS_KEY}
ENV STORAGE_KEY ${STORAGE_KEY}
ENV ENCRYPTION_KEY ${ENCRYPTION_KEY}
ENV GITHUB_KEY ${GITHUB_KEY}

RUN apt-get update \
&& apt-get install -y --no-install-recommends openssh-server \
&& echo "root:Docker!" | chpasswd

COPY sshd_config /etc/ssh/

WORKDIR app/

COPY --chown=myuser:myuser out/ .
COPY --chown=myuser:myuser init_container.sh .

EXPOSE 80 443 2222

RUN chmod 755 init_container.sh
ENTRYPOINT ["./init_container.sh"]