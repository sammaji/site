---
title: Hardlink, Symlink and Inodes
description: Overview of how hardlinks, symlinks and inodes work.
keywords: symlink, hardlink, inode, inode table, data block area, superblock
date: 2025-01-01
lastmod: 2025-01-01
---

Unix makes a clear distinction between the contents of a file and the control information about a file.

The control information about a file could be its length, filetype, timestamps, owner uid, group id, and so on. This information node is called inode and it is stored separately from the data block where the contents of a file are stored.

A typical Linux file system, such as ext4, may divide the storage space into several regions:

- A superblock contains critical information about the file system, including the total number of blocks and inodes, block size, and the location of the inode table.

- Inode Table is where the inodes for all files and directories on the file system are stored. Each entry in this table is a single inode, and its position in the table corresponds to its inode number.

- Data Block Area where the actual file contents (data) are stored. An inode contains pointers to these data blocks, which may not be contiguous.

The structure and size of these blocks are generally determined and fixed at the time the file system is created. That means, you can only create a fixed number of files in a file system (don't worry its a lot). You can also specify bytes-to-inode ratio if you need more inodes.

A file system might divide the disk further into block groups to improve performance and reduce fragmentation, but the core idea holds. Each block group will get its own superblock, a copy of the inode table, and data blocks.

You may see how larger systems mirror this design approach. Its very common to separate control information from the data information in applications.

## Hardlink

Hardlinks are nothing but pointers to an inode.

You can create a hardlink like this:

```bash
ln <source> <destination>
```

You can use relative paths without worry as well, since a hardlink points to the underlying inode.

```bash
ln ./file ./path/hardlink
```

If you delete a file that was hardlinked, it does not affect the hardlinked file. The inode will remain as long as there are more than one references to it.

Despite all of these, hardlinks have some limitations:
- You cannot create hardlinks of directories.
- Hardlinks are only valid within the same file system.
## Symlinks

Softlinks or symlinks on the other hand reference the file path.

You can create a symlink like this:

```bash
ln -s path/to/source path/to/destination
```

Symlinks are valid across file systems. You can create symlinks of directories.

Most of the time, symlink is what you would want to use.

However, since symlinks reference file paths, they struggle with relative paths when the path is  defined relative to the symlink's location.

```bash
ln -s ../../.env ./apps/web/.env # fails
```

If you delete the original file, the symlinked file is deleted as well.

If you move the original file, the symlink becomes invalid (kind of like a dangling pointer).
