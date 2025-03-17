---
title: Samscript
date: 2024-08-03
---

# Samscript

A dynamically-typed programming language I made to learn how interpreters work.

## Installation & Setup

First you need to clone this project and install the dependencies.

```
git clone https://github.com/sammaji/samscript-ts
cd samscript-ts
pnpm install
```

Then you need to build the project. Make sure you have Java (JDK 17+) installed.
```
pnpm ast
pnpm build
```

To run Samscript code, just use the following command:
```
pnpm start          # starts a REPL
pnpm start [file]   # runs the code in the file

# Some examples are provided in "example" folder
# You can try running those
pnpm start example/hello_world.sm
```

## Documentation

Here's a run through of the entire syntax. The language grammar is provided at `grammar/samscript.gram`.

```
## print statement
print "hello world"
```

### Variable declaration and Assignment

You can declare a variable using the `var` keyword.
```
var a = 10;
```

You cannot redeclare a same variable in the same scope.
```
var a = 10;
var a = 20;  // error
{
    var a = 20; // no-errors
}
```

You can re-assign values to pre-declared variables. Samscript is dynamically typed, you can reassign different data types.
```
var a;
a = 20;
```

### Data-types

There are 4 primitive data types:
1. number
2. boolean (`true` or `false`)
3. string
4. nil
   
### Arithmetic and logical operations

All major arithmetic operations like additon, substraction, division and multiplication is supported. All major logical operations like greater than, less than, equality comparison is supported. There precedence follows the same order as in C.

```
print (10 + 2) / 6 > 4;
```

### Conditional statements

Samscript supports `if-else` statements.

```
var x = 10;
var y = 2;

// only if block
if (x > 2) print x;

// if-else blocks
if (y > 10) {
    print "Greater than 10";
}
else if (y > 5) {
    print "Less than but greater than 5";
}
else {
    print "Less than 5";
}
```

### Loops

Samscript supports both `for` and `while` loop.

```
// for loop
for (var i=0; i<5; i = i+1) {
    print i;
}

// while loop
var a = 5;
while (a > 0) {
    print a;
    a = a-1;
}
```

Thank you for reading ❣️
