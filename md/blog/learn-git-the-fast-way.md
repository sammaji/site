---
title: "Learn Git the FAST way."
published_at: 2023-01-06T08:12:40.921Z
tags: ["Git", "learning"]
---

In this blog post, I'll share what is Git? And how to get started with Git.

But first, why even learn git? Well... Let's say you are working on a project which has thousands of lines of code. So you modified 5 different files. However, due to some reasons, you don't want those changes. See the problem? To revert back to some previous version, you need to modify a lot of code.

Luckily, Git helps us do just that. What is Git then? Git is a version control system that helps you track different versions of your code.

### Installation

The installation process is pretty simple. Just run the setup and go with the default settings. However, if you still need help, check this [installation guide](https://arindam1729.hashnode.dev/the-basics-of-git-for-beginnerspart-1#heading-installation-of-git).

### Basics

Before getting started with git, let's understand what a repository is. A git repository is simply a sub-directory (folder) where all the changes are tracked. I may sometimes call a git repository a "repo".

By default, git does not track your changes. To start tracking changes, we need to initialize a repository.

```go
cd D:\learn-git
git init
```

This will initialize the current sub-directory (here `D:\learn-git`) as a repository to track changes.

**Side Note**: If you don't know, the `cd` command is used to change directories. Here, I'm changing my current directory to `D:\learn-git`.

If everything went right, you'll notice a `.git` folder (all dot files are hidden by default in windows or mac, so make sure you unhide them). All tracked changes will be stored here.

### Branch

In Git, a branch is a separate line of development. Say, you and your friend are working on two separate features. Each of you would make a copy of the default branch, called the `main` branch, and then you'll make changes on your respective branches. Any changes you make in your branch would not affect other branches. Once you are done, you can merge your branch with the main branch.

![figure explaining how branches work in git](https://cdn.hashnode.com/res/hashnode/image/upload/v1672986281300/371c49cc-5858-4755-833c-4422ba6d8916.png)

*The above figure shows how branches work in Git. We'll talk about "commits" later on. But for now, think of it as "saved changes".*

To create a branch, we use the command `git branch <branch-name>`.

To switch to a specific branch, use `git checkout <branch-name>`.

Alternatively, you can use `git checkout -b <branch-name>` to create a branch and switch to it.

```go
git branch sam  # creates a branch called 'sam'
git checkout sam  # switches to 'sam'
# alternatively use
git checkout -b sam  # creates and switches to 'sam'
```

**Side Note:** Use `git branch` command to display a list of all the available branches.

Next, we'll add a file. You'll notice that `intro.txt` is not available in the main branch. This is expected as we are currently in the `sam` branch. All changes made in one branch would not be seen in other branches.

### Staging Changes

To make things cleaner, Git does not track all the files in your codebase. It only tracks those files that are added to the "staging area".

Use `git add <filename>` to add files/folders to the staging area. All changes made to the file will be tracked.

```go
git add intro.txt
```

You can use the command `git status` to see the status of each file/folder in your repository (whether they are staged or unstaged). You'll see the untracked (unstaged) files/folders are marked in red whereas the staged ones are marked in green.

In most cases, you would want to stage all the changes. In that case use `git add .` to add every file/folder in your repository to the staging area.

### Commits

Once we have added everything to the staging area, we can now make changes to our codebase. For now, I added my name in `intro.txt`.

```go
# added text "My name is Sam Maji" in intro.txt
git add .
git status
```

If we run git status, we'll see `intro.txt` marked in green. That's because we have some changes that are not "saved".

![git status will show intro.txt as green](https://cdn.hashnode.com/res/hashnode/image/upload/v1672988328475/f1850295-daf4-46b1-b00c-13f7fa9d44a0.png)

We can save these changes or "commit these changes" by using the command `git commit -m "your commit message"`. A commit message is mandatory.

```go
git commit -m "[add] created intro.txt and added my name"
```

Now I'll add the text "I am a Web Developer" in `intro.txt` and make one more commit.

```go
git commit -m "[add] my profession"
```

![git commit](https://cdn.hashnode.com/res/hashnode/image/upload/v1672989223650/266f9eac-8965-4362-ae69-c3aa8544e97a.png)

### Revert Changes

Every commit has a unique commit id. Use `git log` to see your commit history.

**Side Note:** Use `git log --show-linear-break --oneline` to get a formatted version of the commit history with every commit in a single line.

![commit log](https://cdn.hashnode.com/res/hashnode/image/upload/v1672989461908/30535d15-7584-4a28-8398-1bc0e50b9c08.png)

Now, let's say you don't want the recent changes and want to revert back to a previous commit. Use `git revert <commit-id>` to restore your code base to a previous commit.

Let's say we want to go back to the commit "\[add\] created intro.txt and added my name" (with commit-id `0ff950b937ab335bb8ce043a44ebb58640f19b61)` . We can do this simply by using the command `git revert 0ff950b937ab335bb8ce043a44ebb58640f19b61` . Note that this will not clear your commit history to the point of the commit. Instead, it will revert your files to a previous commit and add that as a new commit.

This is all you need to get started with Git. In the next blog post, I'll cover some other concepts of Git and how to use GitHub.
