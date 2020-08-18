#!/bin/bash

# usage ./git.sh "commit msg" branch

if [ -z "$1" ]; then
    echo "Please provide commit message."
    exit
fi

# add files, commit and push changes.
git add -A
git commit -m "$1"

# check if branch is provide, if not make push it to default.
if [ -z "$2" ]; then
  git push
else
  git push origin "$2"
fi
