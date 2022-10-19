<div align="center">
  <a href="https://github.com/Brbcode/JS-Exercise-Manager">
    <img src="https://i.pinimg.com/originals/89/fc/41/89fc410fee3089f8fb57ebffa1c0e0c8.jpg" alt="Logo">
  </a>
</div>

# JS-Exercise-Manager
This web application allow manage javascript exercises dynamically with Live Server
## How to use
- Add or create your js file inside "exercise/js/" folder.
- In your js file define all classes, function and variables that you need.
- In your js file register the exercise. (Callback is called when your exercise is selected and the user click on "run" button) 
```js
ExerciseManager.register(<ID>,<title>,<description>,<callback>);
```
## Register callback tricks
The register's callback has as parameter a <em>Exercise<em> object, this object allow:
- Create html wrapper
  - Load html file
    - Edit or read from loaded html node.
- Load css file
- Create css rule

See <a href="https://github.com/Brbcode/JS-Exercise-Manager/blob/master/exercises/js/test.js" target="_blank">example</a>.
