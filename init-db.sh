#!/bin/bash
set -e

psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'db_dev'" | grep -q 1 | psql -U postgres -c "CREATE DATABASE db_dev"
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'db_prod'" | grep -q 1 | psql -U postgres -c "CREATE DATABASE db_prod"
