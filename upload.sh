#!/usr/bin/bash
make
rsync -r -v /Users/smus/Projects/smus.com/deploy/* boris@smus.com:~/public_html/smus.com
