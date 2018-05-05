Dependencies
============
- [Node.js](https://nodejs.org/en/).
- [MongoDB](https://www.mongodb.com/)
- [Python 3](https://docs.python.org/3/) (please installed as `python`)

Setup Instruction
=================
0. Run `npm install` to install all necessary node modules.

1. Run `pip install --user pymongo splinter`
   or `pip3 install --user pymongo splinter`
   to install all necessary python libraries.

Alternative Setup Instruction
=============================
Simply run:

    $ python setup.py

Instruction to Run
==================
0. Run `node initdb.js` to reset the data in the DB.

1. Run `node index.js` to start the node server.

Alternative Instruction to Run
==============================
Simply run:

    $ python bootstrap.py

How to Run Test
===============
Simply run:

    $ python py/test.py

Copyright
=========
See license header of each individual file.
