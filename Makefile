export PYTHONPATH:=.:$(PYTHONPATH)
export DJANGO_SETTINGS_MODULE:=src.settings

install:
	pip install -r requirements.txt

create_database:
	./manage.py syncdb --noinput
	./manage.py migrate --noinput
	find src/apps -name '*.json' -exec ./manage.py loaddata {} \;

create_admin:
	echo "from users.models import User; User.objects.create_superuser('admin@site.com', 'pass')" | python manage.py shell

test:
	nose -v

coverage:
	coverage erase
	coverage run manage.py test  -v 2 src
	coverage html

clean:
	find . -name '*.pyc' -delete
	find . -name __pycache__ -delete
	rm -rf .coverage dist docs/_build htmlcov MANIFEST
	find . -name '*.sqlite3' -delete

run:
	./manage.py runserver

collect:
	./manage.py collectstatic

shell:
	./manage.py shell


