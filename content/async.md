# Async

There’s a special syntax to work with promises in a more comfortable fashion, called “async/await”. It’s surprisingly easy to understand and use.

Async functions
Let’s start with the async keyword. It can be placed before a function, like this:

```
async function f() {
  return 1;
}
```

The word “async” before a function means one simple thing: a function always returns a promise. Other values are wrapped in a resolved promise automatically.

For instance, this function returns a resolved promise with the result of 1; let’s test it: