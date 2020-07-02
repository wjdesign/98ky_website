#!/bin/bash
rsync -avl --delete /web/layout/98ky_website0/ /web/layout/98ky_website/ --exclude=.svn --exclude=_notes --exclude=.git --exclude=git_rsync.sh