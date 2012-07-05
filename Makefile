generate:
	python2.7 ../hyde/hyde.py -g -s .

continuous:
	../hyde/hyde.py -g -k

server: generate
	../hyde/hyde.py -w -s .
