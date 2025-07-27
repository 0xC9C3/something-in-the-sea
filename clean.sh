#!/usr/bin/env bash

# delete all files in ./static/_swf which contain "<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">"
find ./static/_swf -type f -exec grep -l '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">' {} \; | while read -r file; do
    echo "Deleting $file"
    rm "$file"
done