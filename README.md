# mentorUI

#functions

This folder is the start file for firebase deploy, with index.js as the start page with all the server code init. 
Views, subfolder of functions has the screens.
package.json having all the dependencies.

#public

Has all the public files including images, scripts, styles for our screens.

**npm install**

**npm i -g firebase-tools**

**firebase init hosting**
**
firebase init functions**

comment below line in index.js file after coping app.js code in index.js in function folder.

**//=============================================================================================================================================================================
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
**
app.listen(port, function() {
  console.log("Server started on port 5000");
});****

and add below line in index.js.

**exports.app = functions.https.onRequest(app);**


in firebase.json file, replace the content with 
    {
      "hosting": {
        "public": "public",
        "rewrites": [{
          "source": "**",
          "function": "app"
        }],
        "ignore": [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ]
      }
    }

go to mentorUI project and replace view in functions and index.js

cd functions

C:\Users\ashishpanery\IdeaProjects\mentorUI\functions>npm install


to get the public folder, in it we have all our public files like styles, scripts etc.

#firebae init funcitons
to create functions folder, comes with default index.js.
we need add our screens in views [if we are using node js]



in mentorUI project.

npm install

#firebase serve
to check if our fucntionality is working

#firebase deploy
to deploy our application
