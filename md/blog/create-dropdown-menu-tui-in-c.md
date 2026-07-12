---
title: "Create dropdown menu (tui) in c"
published_at: 2025-03-10T05:18:49.542Z
tags: ["TUI", "C", "cli"]
---

In this article, I’ll show how to create a simple dropdown menu using C, with the ability to navigate through options using the arrow keys and select one using the Enter key. Here’s how it would look.

![Dropdown preview](https://cdn.hashnode.com/res/hashnode/image/upload/v1741582496632/a7eeca4d-2fd8-4b29-93d1-fd3cf44c69a1.png)

# Disable terminal modes

First, we need to disable canonical mode and terminal echo.

In canonical mode, input is processed when line by line (when enter key is pressed). For our application, we want to read key press when it happens.

The echo mode, prints out everything that is typed. Again, not really useful - we don’t want to log every key press.

```c
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <termios.h>
#include <unistd.h>

void init_terminal() {
  struct termios term;
  tcgetattr(STDIN_FILENO, &term);
  term.c_lflag &= ~(ICANON | ECHO); // Disable canonical mode and echo
  tcsetattr(STDIN_FILENO, TCSANOW, &term);
}

void reset_terminal() {
  struct termios term;
  tcgetattr(STDIN_FILENO, &term);
  term.c_lflag |= (ICANON | ECHO);
  tcsetattr(STDIN_FILENO, TCSANOW, &term);
}
```

The `init_terminal` function disables canonical mode and terminal echo. `reset_terminal` re-enables it.

Here, `c_lflag` is an unsigned int, where each bit indicates some property. `ICANON` and `ECHO` are unsigned int as well. If our, `c_lflag` is `1011`, it indicates that canonical mode is turned on, since the bit that indicates canonical mode (2nd last bit) is `1`. `ICANON` is `0010`. When we do a bit-wise `and` operation, we flip only the bit indicating canonical mode and keep all the others as it is. (Checkout more about [bit masks](https://debajyatidey.hashnode.dev/deep-dive-into-bitwise-optimization#heading-common-operations)).

`1011 & ~0010` → `1011 & 1101` → `1001`

In our case, we are flipping bits for canonical mode and echo mode.

# ANSI and Key Codes

We define some ANSI escape codes and some key codes.

Here, `HIGHLIGHT` escape code will flip the colors of the background and text, useful of highlighting an item.

```c
#define CLEAR_SCREEN "\033[2J\033[H"
#define CURSOR_UP "\033[A"
#define CURSOR_DOWN "\033[B"
#define CLEAR_LINE "\033[K"
#define HIGHLIGHT "\033[7m" // Reverse video (highlight)
#define RESET "\033[0m"     // Reset attributes
```

# Struct definition

Let us also create a struct to store all the data in the dropdown menu. The `create_dropdown` method can be used to initialize the struct.

```c
typedef struct {
    char **options;
    int num_options;
    int selected;
    char *title;
} Dropdown;

Dropdown *create_dropdown(char *title, char **options, int num_options) {
    Dropdown *dropdown = (Dropdown *) malloc(sizeof(Dropdown));
    if (!dropdown) {
        return NULL;
    }

    dropdown->options = options;
    dropdown->num_options = num_options;
    dropdown->selected = 0;
    dropdown->title = title;
    return dropdown;
}

void free_dropdown(Dropdown *dropdown) {
    free(dropdown);
}
```

# Printing dropdown

The code is pretty straightforward. We run over the options and print them one by one. We highlight the selected option.

```c
void display_dropdown(Dropdown *dropdown) {
    printf(CLEAR_SCREEN);
    printf("%s\n\n", dropdown -> title);

    for (int i = 0; i < dropdown -> num_options; i++) {
        if (i == dropdown -> selected) {
            printf("%s> %s%s\n", HIGHLIGHT, dropdown -> options[i], RESET);
        } else {
            printf("  %s\n", dropdown -> options[i]);
        }
    }
}
```

# Input handling

The `read_key` function defined below reads a single character and returns it.

```c
int read_key() {
    char c;
    if (read(STDIN_FILENO, &c, 1) == 1) {
        return c;
    }
    return 0;
}
```

When we press arrow keys, three characters are pushed to the input buffer:

- `'\033'` (start of escape sequence)
- `'['`
- `'A'`, `'B'`, `'C'` or `'D'` (up, down, right, left)

So if we get `\033[A`, it indicates up arrow key press.

Let us define these character codes as macros:

```c

#define KEY_UP 65
#define KEY_DOWN 66
#define KEY_ENTER 10
#define KEY_ESC 27
#define KEY_Q 113
```

The `run_dropdown` method will read characters and re-renders the dropdown menu accordingly.

```c
void handle_arrow_key(Dropdown *dropdown) {
    switch (read_key()) {
    case KEY_UP: // ascii code for A
        if (dropdown->selected > 0) {
            dropdown->selected--;
            display_dropdown(dropdown);
        }
        break;

    case KEY_DOWN: // ascii code for B
        if (dropdown->selected < dropdown->num_options - 1) {
            dropdown->selected++;
            display_dropdown(dropdown);
        }
        break;
    }
}

int run_dropdown(Dropdown *dropdown) {
    init_terminal();
    bool is_running = true;
    display_dropdown(dropdown);

    while (is_running) {
        int key = read_key();

        switch (key) {
        case KEY_ESC: // Check if this is an escape sequence for arrow keys
            if (read_key() == '[') {
                handle_arrow_key(dropdown);
            } else {
                // Plain ESC key was pressed - cancel selection
                dropdown->selected = -1;
                is_running = false;
            }
            break;

        case KEY_ENTER:
            // Confirm selection
            is_running = false;
            break;

        case KEY_Q:
            // Cancel selection
            dropdown->selected = -1;
            is_running = false;
            break;
        }
    }

    reset_terminal();
    return dropdown->selected;
}
```

That’s it.

Now, you can use it to create a dropdown.

```c
int main() {
    char title[] = "Select an option:";
    char *options[] = {
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4",
        "Option 5"
    };
    int num_options = sizeof(options) / sizeof(options[0]);
    Dropdown *dropdown = create_dropdown(title, options, num_options);

    int selected = run_dropdown(dropdown);

    // Clear screen and show result
    printf(CLEAR_SCREEN);
    if (selected >= 0) printf("You selected: %s\n", options[selected]);
    else printf("Selection cancelled\n");

    free_dropdown(dropdown);
    return 0;
}
```

Here’s link to the [full source code](https://gist.github.com/sammaji/0e55dbc63d44145ad6fbf28ca4cf1b16).

Now that you've implemented a basic dropdown, you can build more complex tui elements. You could handle signals (like `SIGINT` or `SIGTERM`), add mouse support, focus groups, etc.
