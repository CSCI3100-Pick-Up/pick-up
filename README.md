Setup Instruction
=================
0. You need to install the necessary modules first by typing `npm install`
in the folder containing tihs file.

1. You must have started mongodb first before running node.

2. Run `node initdb.js` to reset the data in the DB.

3. Run `node index.js` to start the server.

Alternative Setup Instruction
=============================
Alternatively, if you are running any unix-like system with a POSIX-compliant
`/bin/sh`, you can install [GNU Guile 2.2](https://www.gnu.org/software/guile/)
and simply run

    ./bootstrap.scm

to have everything set up for you.
