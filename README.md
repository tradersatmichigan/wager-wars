## Base setup

Do everything in the root directory.

On first pull create a python virtual environment. Before you start working always source this virtual environment.
```bash
python -m venv .venv
source .venv/bin/activate
```

Install all the pip requirements to run the project. Use
```bash
pip install -r requirements.txt
```

## Postgres setup on local machine

If you have not already, install postgres 17
```bash
brew install postgres@17
```

Check you version with
```bash
$ psql --version
psql (PostgreSQL) 17.4 (Homebrew)
```

If you have an an outdated version also installed like v14,
you may have to stop the service, unlink the version, link with v17,
and then restart the service. I will leave this for you to figure out.

Ensure you have created a super user with
```bash
python manage.py createsuperuser
```
I recommend calling it `admin`.

We enter the postgres command line with
```bash
psql -U postgres
```

Run the following commands to correctly setup your local db instance.
The password should match whatever you put into the .pgpass file later on.
I recommend keeping this wagerwars for now. Whatever is in quotes must remain in quotes.
```bash
CREATE DATABASE wager_db;
CREATE USER tam WITH PASSWORD '<password>';
ALTER ROLE tam SET client_encoding TO 'utf8';
ALTER ROLE tam SET default_transaction_isolation TO 'read committed';
ALTER ROLE tam SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE wager_db TO tam;
ALTER DATABASE wager_db OWNER TO tam;
```

Next we need to create the `.pgpass` and `.SECRETS` files to allow Django to access
the db and setup our environment variables. Always run `source .SECRETS` before starting development.
```bash
touch .pgpass
echo "HOST:POST:NAME:USER:<password>" > .pgpass
touch .SECRETS
cat <<EOF > env_vars.sh
export PGNAME=wagerwars_db
export PGPASSWORD=<password>
export PGHOST=localhost
EOF
```

## Run

Now that everything is setup, run the following commands. These commands should always be run if
there are any changes to the models and hence db structure. These commands initialise and update
the database as required with the specification defined in `core/models.py`
```bash
python manage.py makemigrations
python manage.py makemigrations core
python manage.py migrate
python manage.py migrate core
```

Before running the application ensure you have installed the required dependencies and compiled.
```bash
# Only needs to be run when new dependencies are added
bun install
bun run build
```

To run the server on localhost `127.0.0.1`, run
```bash
python manage.py runserver
```
