#!/usr/bin/env python

import os, re
SCORE_REGEX = re.compile('.*RD([0-9])-score([0-9]+)\s*=[ \']*([0-4])')

def parse(raw_season):
  """Get all game scores and put them in an array"""
  # Rounds looks like the following:
  # {ROUND#: {TEAM#: WINS}}
  rounds = {}
  for line in raw_season.readlines():
    match = SCORE_REGEX.match(line)
    if match:
      # Parse the line itself to get the game number and score
      rd, team, wins = [int(val) for val in match.groups()]
      if not rounds.has_key(rd):
        rounds[rd] = {}
      rounds[rd][team] = wins

  # Once we have extracted all round#, team# and wins info
  # Pair teams together to get score info
  scores = []
  for r in rounds.values():
    # Get all team numbers from here
    # r is like {1: 2, 2: 4, 3: 4, 4: 0}
    keys = r.keys();
    keys.sort();
    # Ensure that keys are all present for sanity
    assert keys == range(1, len(keys) + 1)
    # Get even keys and match them with odd keys
    # Sanity check to make sure that the score makes sense
    new_scores = [sorted([r[k], r[k+1]]) for k in r.keys()[::2] 
        if r[k] == 4 or r[k+1] == 4]
    scores += new_scores
  return scores


if __name__ == '__main__':
  scores = []
  # Parse a bunch of downloaded wikipedia pages
  for dirname, dirnames, filenames in os.walk('raw'):
    for filename in filenames:
      path = os.path.join(dirname, filename)
      scores += parse(open(path, 'r'))

  print len(scores)
  # Analyze the scores array
  from itertools import groupby
  breakdown = [(k, len(list(g))) for k, g in groupby(sorted(scores))]
  odds = [(count[0], count[1]/float(len(scores))) for count in breakdown]
  print odds
