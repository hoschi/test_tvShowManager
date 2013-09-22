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
*   `bower install`
*   clone [mongo adapter](https://github.com/hoschi/sails-mongo) into a directory
    *   change into this directory
    *   `git checkout 0.8.4`
    *   `npm link`
*   change back to project directory
*   `npm link sails-mongo-hoschi`

## dev

*   `grunt watch`
*   `grunt nodemon:dev`

## production

*   checkout stable branch `git checkout stable`
*   add `config/local.js` like this

    module.exports.port = 3003;
    module.exports.environment = 'production';

*   compile scss files with `grunt compass`
*   run app with `forever start app.js`
