#!/bin/sh
# ; -*- mode: scheme; geiser-scheme-implementation: guile -*-
exec guile -e main "$0"
!#

(use-modules (srfi srfi-1)
             (srfi srfi-26)
             (ice-9 ftw)
             (ice-9 regex))

(define main
  (λ _
    (define invoke (cut system* <> <...>))
    (define npm/install (cut invoke "npm" "install" <...>))
    (define node (cut invoke "node" <...>))

    (let ((node-mods (filter (cut string-match "^[^\\._]" <>)
                             (scandir "node_modules"))))
      (npm/install "package.json")
      (apply npm/install node-mods)
      (node "initdb.js")
      (node "index.js"))))
