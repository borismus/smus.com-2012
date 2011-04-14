generate:
	../hyde/hyde.py -g -s .

server: generate
	../hyde/hyde.py -w -s .
