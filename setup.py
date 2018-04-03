from shutil import which
from subprocess import call

def npm_install(*args):
    return call([which('npm'), "install"] + list(args))

def pip_install(*args):
    return call([which('pip'), "install", "--user"] + list(args))

npm_install()
pip_install("pymongo")
