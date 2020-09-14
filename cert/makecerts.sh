#!/bin/sh

# https://stackoverflow.com/a/60516812
######################
# Become a Certificate Authority
######################

NAME=$(hostname)

echo "Clean up"
rm *.key *.pem *.srl *.crt *.csr *.ext

echo "Generate private key"
openssl genrsa -des3 -out myCA.key 2048
echo "================================================================================"
echo "\n"

echo "Generate root certificate"
echo "\n"
openssl req -x509 -new -nodes -key myCA.key -sha256 -days 825 -out myCA.pem
echo "================================================================================"
echo "\n"

echo "Create CA-signed certs"
echo "Generate private key for $NAME"
echo "\n"
[[ -e vhoarder.key ]] || openssl genrsa -out vhoarder.key 2048
echo "================================================================================"
echo "\n"

echo "Create certificate-signing request"
echo "\n"
[[ -e $NAME.csr ]] || openssl req -new -key vhoarder.key -out $NAME.csr
echo "================================================================================"
echo "\n"

echo "Create a config file for the extensions"
echo "\n"
>vhoarder.ext cat <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $NAME
DNS.2 = $NAME.local
EOF
echo "================================================================================"
echo "\n"

echo "Create the signed certificate"
echo "\n"
openssl x509 -req -in $NAME.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
-out vhoarder.crt -days 1825 -sha256 -extfile vhoarder.ext
