#!/bin/bash

# Check if git user.name is set
GIT_USER_NAME=$(git config user.name)

if [ -z "$GIT_USER_NAME" ]; then
  echo "Error: git user.name is not set."
  echo "Please run: git config user.name 'Your Name'"
  exit 1
else
  echo "Success: git user.name is set to '$GIT_USER_NAME'"
  exit 0
fi
