#!/usr/bin/env python

# Scores from
# http://en.wikipedia.org/wiki/List_of_Stanley_Cup_champions#NHL_Champions_.28Since_1927.29
s = """
4-1
4-2
4-0
4-3
4-0
4-0
4-3
4-1
4-2
4-0
4-0
4-3
4-1
4-0
4-1
4-3
4-3
4-1
4-1
4-2
4-1
4-0
4-2
4-2
4-1
4-3
4-3
4-2
4-2
4-0
4-0
4-0
4-3
4-2
4-2
4-2
4-2
4-0
4-0
4-2
4-1
4-2
4-1
4-0
4-0
4-1
4-1
4-1
4-3
4-0
4-2
4-1
4-2
4-0
4-1
4-3
4-0
4-0
4-0
4-0
4-2
4-2
4-3
4-1
4-3
4-3
4-3
4-1
4-2
4-3
4-2
"""

scores = s.split('\n')[1:-1]
from itertools import groupby
breakdown = [(k, len(list(g))) for k, g in groupby(sorted(scores))]
odds = [(count[0], count[1]/float(len(scores))) for count in breakdown]
print odds

# Output:
# [(u'4-0', 0.28169014084507044),
#  (u'4-1', 0.23943661971830985),
#  (u'4-2', 0.2676056338028169),
#  (u'4-3', 0.2112676056338028)]

