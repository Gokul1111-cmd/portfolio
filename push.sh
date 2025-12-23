read -p "Enter the commit message: " commit_message

git add .
git commit -m "$commit_message"
git push origin main
echo "Changes pushed to remote repository with message: $commit_message"