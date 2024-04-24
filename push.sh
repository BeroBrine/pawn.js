echo -n "enter the commit message "
read commit

git add *
git commit -m "$commit"

git push -u origin main
