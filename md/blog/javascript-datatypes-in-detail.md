---
title: "JavaScript Datatypes in Detail"
published_at: 2023-01-08T13:17:59.749Z
tags: ["JavaScript", "Web Development", "beginner"]
---

There are seven different primitive data types in JavaScript: undefined, null, number, bigint, string, boolean and symbol. We'll learn about each of them in detail.

## Number

Number stores numerical values. This is different from some other programming languages, which may have separate data types for integers and floating-point values (decimals).

```javascript
let num = 25.2; // <-- datatype of num is number
```

Internally, numbers are stored as double-precision 64-bit binary (IEEE 754) values. Numbers can store positive numbers between 2^(-1074) and 2^(1024), and negative numbers in the same range

```javascript
Number.MAX_VALUE; // = 1.7976931348623157e+308
Number.MIN_VALUE; // = 5e-324
```

Here, the letter `e` represents “times 10 to the power of”. For example, `5e-324` simply means 5 \* 10^(-324).

$$5\times 10^{-324}$$

Number can safely store Integer values between -2^{53}-1 and +(2^{53}-1).

$$-\left( 2^{53}-1 \right) \ \hspace{2mm} to \hspace{2mm} +(2^{53}-1)$$

There is a method that checks whether an integer is within the safe range or not: `Number.isSafeInteger()`. This method returns a boolean value indicating whether the number is a safe integer or not.

Generally, you won't need to worry about the range of values. Any values that exceed or subceed the range will be converted to `Infinity` or `0`. The `Infinity` property behaves very similarly to infinity in mathematics.

```javascript
// for postitive numbers
value > Number.MAX_VALUE; // -> Infinity
value < Number.MIN_VALUE; // -> +0

// for negative numbers
value > -Number.MAX_VALUE; // -> -Infinity
value > Number.MAX_VALUE; // -> -0
```

In javascript +0 and -0 are treated the same. However, they do behave differently when used in certain operations. When a positive or negative number is divided by +0, the result is always positive infinity (`Infinity`) or negative infinity (`-Infinity`), respectively. This is because +0 is considered to be the equivalent of positive infinity when it comes to division.

On the other hand, when a positive number is divided by -0, the result is always negative infinity, and when a negative number is divided by -0, the result is always positive infinity. This is because -0 is considered to be the equivalent of negative infinity when it comes to division.

```javascript
console.log(42 / +0); // -> +Infinity
console.log(42 / -0); // -> -Infinity
```

`NaN` (Not-a-Number) is returned when the result of an arithmetic operation cannot be expressed as a number. There are several different scenarios in which NaN can be returned in JavaScript. Some examples include:

*   Dividing 0 by 0
    
*   Dividing a non-zero number by 0
    
*   Taking the square root of a negative number
    
*   Converting a value to a number using the `Number()` function when the value is not a valid number
    

`NaN` is the only value in JavaScript that is not equal to itself.

```javascript
let num1 = NaN;
let num2 = NaN;
console.log(num1 === num2); // false
```

I'll cover why that is so when discussing Floating Point Numbers. For now, if you wish check if two whether `NaN` values are equal or not, use `Number.isNaN(value)`. It returns true if the value is `NaN`

```javascript
if (Number.isNaN(num1) && Number.isNaN(num2)) {
  console.log("Both are NaN");
}
```

## BigInts

BigInts are used to store integers of arbitrarily large magnitudes. This allows you to store and manipulate large integers that would not fit within the range of the number data type.

To create BigInts, add the letter "n" at the end of an integer literal or use the `BigInt()` constructor.

```javascript
let big_num1 = 32n;
let big_num2 = new BigInt(32);
```

BigInts are not strictly equal (===) to numbers. Instead, they are loosely equal (==) to numbers if the number value is within the safe range for integers, which is between -(2^{53} - 1) and 2^{53}-1.

```javascript
let num = 57;
let big_num = 57n;

console.log(num === big_num); // false
console.log(num == big_num); // true
```

## String

String is used for storing text-based data of arbitrary length. To get the length of the string, use `string.length` property

```javascript
// "Sam" is a string value
let name = "Sam";
console.log(name.length); // 3
```

Your computer stores characters and symbols as integers. There are several different systems for assigning codes to characters, including ASCII, UTF-8, and UTF-16. However, the one Javascript used is UTF-16 (16-bit Unicode Transformation Format), which is capable of encoding more than 1,000,000 characters.

In the UTF-16 system, the codes for the uppercase letters A-Z are between 65 and 90, and the codes for the lowercase letters a-z are between 97 and 122. UTF-16 system also includes codes for a wide range of other characters and symbols, including punctuation, special characters, whitespace and non-Latin scripts. You can access the code for a particular character in JavaScript using the `charCodeAt(index)` method of the `String` object.

```javascript
let name = "Sam MAJI";

// to get the unicode of a character
name.charCodeAt(1); // unicode of "a" is 97
name.charCodeAt(5); // unicode of "A" is 65
```

A string is a collection of characters and symbols. In other words, a string (in JavaScript) is a collection of unique unsigned 16-bit integer values in a specific order.

String functions are a topic of their own. Here I'll quickly review some of the important string functions.

*   `charAt(index)` returns the character at the `index` position. You can also use square brackets (`string_value[index]`).
    
*   `concat()`: Concatenates (joins) two or more strings together. You can also use the '+' operator
    
*   `indexOf(character)`: Returns the index of the first occurrence of a specified value in a string
    
*   `substring(index1, index2)`: Extracts the characters from a string between two specified indices and returns a new string. Also, note that the substring starts at index1 but end before index2 (at index2-1)
    
*   `toLowerCase()`: Converts a string to lowercase letters
    
*   `toUpperCase()`: Converts a string to uppercase letters
    
*   `trim()`: Removes whitespace from the beginning and end of a string
    

```javascript
let first_name = "   Samyabrata         ";
let last_name = "Maji";

first_name = first_name.trim(); // "Samyabrata"

let full_name = first_name.concat(last_name); // "SamyabrataMaji"

full_name = first_name + " " + last_name; // "Samyabrata Maji"

let short_name = first_name.substring(0, 3) + " " + last_name; // "Sam Maji"

let initials = first_name.charAt(0) + last_name.charAt(0); // "SM"

let initials_lower_case = initials.toLowerCase(); // "sm"
```

## Boolean

The boolean datatype is used to store `true` or `false` value.

A conditional statement is a statement that returns only boolean values. They are used everywhere in javascript from `if..else` statements to `while` loops. Examples of conditionals can be `1>2` or `value >= 25 && name === 'Sam'`.

Internally, booleans are stored as 1-bit binary values.

```javascript
console.log(true + true); // 2
console.log(true + false); // 1
console.log(Boolean(1)); // true
console.log(Boolean(0)); // false
```

Please note that the above example might be slightly misleading because the 0 and 1 used here are of type number which is 64-bit binary and not 1-bit binary.

In the next blog post, I'll cover the remaining datatypes, ie, null, undefined and symbol. I'll also cover Objects.
