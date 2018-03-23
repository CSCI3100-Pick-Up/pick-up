from os import listdir
from re import match
from shutil import which
from subprocess import call

def npm_install(*args):
    return call([which("npm"), "install"] + list(args))

def node(*args):
    return call([which("node")] + list(args))

node_modules = list(filter(lambda str: match(r"^[^\\._]", str),
                           listdir("node_modules"))) + ["bcryptjs"]

npm_install()
npm_install(*node_modules)
node("initdb.js")
node("index.js")
