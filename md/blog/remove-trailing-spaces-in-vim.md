---
title: "Remove trailing spaces in vim."
published_at: 2025-10-21T20:28:57.727Z
tags: ["vim", "neovim"]
---

Here's how to remove trailing spaces.

```vim
:%s/\s\+$//e
```

You can automatically remove trailing spaces every time you save a file by adding an `autocmd` to your vim config.

```vim
autocmd BufWritePre * :%s/\s\+$//e
```

This sets up an automatic command to run before writing any file (`BufWritePre` event triggers before a file is written, `*` matches filenames). You can also trigger it for selected files since many formats like markdown require you to have trailing spaces. (I generally don't work with markdown in vim, so I don't mind).

```vim
autocmd BufWritePre *.ts :%s/\s\+$//e
```

This runs only for typescript files.

## Warning trailing spaces.

If you not using the automatic trailing space removal, you can create a function to detect trailing spaces in a file and issue warnings.

```vim
function! StatuslineTrailingSpaceWarning()
    if !exists('b:statusline_trailing_space_warning')
	    if !&modifiable
            let b:statusline_trailing_space_warning = ''
            return b:statusline_trailing_space_warning
        endif

        let l:line_num = search('\s\+$', 'nw')
        if l:line_num != 0
            let b:statusline_trailing_space_warning = ' [' . l:line_num . ']' . 'trailing space'
        else
            let b:statusline_trailing_space_warning = ''
        endif
    endif
    return b:statusline_trailing_space_warning
endfunction

set statusline+=%{StatuslineTrailingSpaceWarning()}
```
