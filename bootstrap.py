from shutil import which
from subprocess import call

def node(*args):
    return call([which('node')] + list(args))

node('initdb.js')
node('index.js')
