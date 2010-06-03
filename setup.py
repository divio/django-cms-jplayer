from setuptools import setup, find_packages

version = __import__('jplayer').__version__

setup(
    name = 'django-cms-jplayer',
    version = version,
    description = 'Django-CMS JPlayer Plugin',
    author = 'Jonas Obrist',
    author_email = 'jonas.obrist@divio.ch',
    url = 'http://github.com/ojii/django-cms-jplayer',
    packages = find_packages(),
    package_data={
        'jplayer': [
            'templates/jplayer/*.html',
            'media/jplayer/js/*.js',
        ],
    },
    zip_safe=False,
)