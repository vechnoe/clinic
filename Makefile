export PYTHONPATH:=.:$(PYTHONPATH)
export DJANGO_SETTINGS_MODULE:=src.settings

create_database:
	./manage.py syncdb --noinput
	./manage.py migrate --noinput
	find src/apps -name '*.json' -exec ./manage.py loaddata {} \;

create_admin:
	echo "from users.models import User; User.objects.create_superuser('admin@site.com', '12345')" | python manage.py shell

test:
	nosetests -v

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

install:
	( \
	virtualenv env --no-site-packages; \
	source env/virtualenv/bin/activate; \
	pip install -r requirements.txt; \
	make create_database; \
	make create_admin; \
	make run; \
	)


