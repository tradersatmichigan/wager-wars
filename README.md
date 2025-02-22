## Setup

### Python environment

All of the above commands should be executed in the root directory, unless
otherwise stated.

First, create and source a python virtual environment using

```bash
python -m venv .venv
source .venv/bin/activate
```

Then, install pip requirements using

```bash
pip install -r requirements.txt
```

### Postgres for local testing

First, if you don't already have it, install postgres 17.

```bash
brew install postgres@17
brew link postgres@17 # if you have multiple installations
```

Now, you should see something similar when you run

```bash
$ psql --version
psql (PostgreSQL) 17.0 (Homebrew)
```

Run the following to enter the postgres command line:

```bash
psql -U postgres
```

Then, once in the postgres command line
(you should see @postgres=# before your cursor) execute the following commands.
Note: replace password with the actual password, this should match whatever your
`.pgpass` file says later on.

```sql
CREATE DATABASE wager_db;
CREATE USER boss WITH PASSWORD '<password>';
ALTER ROLE boss SET client_encoding TO 'utf8';
ALTER ROLE boss SET default_transaction_isolation TO 'read committed';
ALTER ROLE boss SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE wager_db TO boss;
```

Now that you've created the database table, create a file called `.pgpass` within
`backend/`, and write the following to the file. Again, replace <password> with
the actual password.

```
HOST:PORT:NAME:USER:<password>
```

Now that you've completed these steps, you should be able to run

```bash
python manage.py makemigrations
python manage.py makemigrations core
python manage.py migrate
python manage.py migrate core
```

Which will initialize your database.
