This is my testbed/playground project for angularjs and sails.js. It isn't secured in any way.
DONT USE TRY THIS AT HOME.

# Screenshots

## Main Area
![Image](/screenshots/main_1.png?raw=true)
![Image](/screenshots/main_2.png?raw=true)

## Admin Area
![Image](/screenshots/admin_1.png?raw=true)

# Install

*   `npm install`
*   clone [mongo adapter](https://github.com/hoschi/sails-mongo) into a directory
    *   change into this directory
    *   `git checkout 0.8.4`
    *   `npm link`
*   change back to project directory
*   `npm link sails-mongo-hoschi`

Now you can start the app with `sails lift`.
